const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Course = require('../models/Course');
const crypto = require('crypto');

const PLATFORM_FEE_PERCENT = 0.1; // 10% عمولة المنصة - قابلة للتعديل
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com';

// الدفع ممكن يكون لمشروع أو لكورس - الدالة دي بتحدد نوع العنصر وترجع بياناته
const resolveItem = async ({ projectId, courseId }) => {
  if (projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('المشروع مش موجود');
      error.statusCode = 404;
      throw error;
    }
    return { title: project.title, project: project._id, course: null };
  }

  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('الكورس مش موجود');
      error.statusCode = 404;
      throw error;
    }
    return { title: course.title, project: null, course: course._id };
  }

  const error = new Error('لازم تحددي مشروع أو كورس للدفع');
  error.statusCode = 400;
  throw error;
};

// إنشاء عملية دفع وتجميد الفلوس في الـ Escrow
// MVP: لو PAYMENT_MODE=mock بيشتغل من غير أي API خارجي حقيقي
const createEscrowPayment = async ({ projectId, courseId, clientId, amount }) => {
  const item = await resolveItem({ projectId, courseId });
  const platformFee = +(amount * PLATFORM_FEE_PERCENT).toFixed(2);

  const payment = await Payment.create({
    project: item.project,
    course: item.course,
    itemTitle: item.title,
    client: clientId,
    amount,
    platformFee,
    provider: 'paymob',
    providerTransactionId:
      process.env.PAYMENT_MODE === 'mock' ? `MOCK-${Date.now()}` : null,
    status: 'held_in_escrow',
    heldAt: new Date(),
  });

  return payment;
};

// إفراج الفلوس للطالب بعد موافقة العميل على التسليم
const releaseEscrowPayment = async (paymentId, studentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error('عملية الدفع مش موجودة');
    error.statusCode = 404;
    throw error;
  }
  if (payment.status !== 'held_in_escrow') {
    const error = new Error('الفلوس دي مش في حالة تجميد قابلة للإفراج');
    error.statusCode = 400;
    throw error;
  }

  payment.student = studentId;
  payment.status = 'released';
  payment.releasedAt = new Date();
  await payment.save();

  return payment;
};

const refundPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error('عملية الدفع مش موجودة');
    error.statusCode = 404;
    throw error;
  }

  payment.status = 'refunded';
  await payment.save();
  return payment;
};

const getPaymentsByProject = async (projectId) => {
  return Payment.find({ project: projectId });
};

const getPaymentById = async (paymentId) => {
  return Payment.findById(paymentId);
};

// إنشاء عملية دفع حقيقية بـ Paymob (Intention API) - بيتطلب PAYMOB_SECRET_KEY, PAYMOB_INTEGRATION_ID في .env
// المرجع الرسمي: https://developers.paymob.com/paymob-docs/developers/intention-apis/create-intention
const createPaymobPaymentIntention = async ({ projectId, courseId, clientId, amount, billingData }) => {
  const item = await resolveItem({ projectId, courseId });

  if (!process.env.PAYMOB_SECRET_KEY || !process.env.PAYMOB_INTEGRATION_ID) {
    const error = new Error('إعدادات Paymob مش متظبطة في .env (PAYMOB_SECRET_KEY / PAYMOB_INTEGRATION_ID)');
    error.statusCode = 500;
    throw error;
  }

  const platformFee = +(amount * PLATFORM_FEE_PERCENT).toFixed(2);

  // بننشئ سجل الدفع عندنا الأول (status: pending) عشان نستخدم الـ id بتاعه كـ special_reference
  // ده أهم حاجة تربط بين الدفعة عندنا وبين الـ webhook اللي هيرجع من Paymob بعدين
  const payment = await Payment.create({
    project: item.project,
    course: item.course,
    itemTitle: item.title,
    client: clientId,
    amount,
    platformFee,
    provider: 'paymob',
    status: 'pending',
  });

  const amountCents = Math.round(amount * 100);

  const response = await fetch(`${PAYMOB_BASE_URL}/v1/intention/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: 'EGP',
      payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
      items: [
        {
          name: item.title,
          amount: amountCents,
          quantity: 1,
        },
      ],
      billing_data: billingData,
      special_reference: payment._id.toString(),
      notification_url: process.env.PAYMOB_WEBHOOK_URL || undefined,
      redirection_url: process.env.PAYMOB_REDIRECT_URL || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.client_secret) {
    payment.status = 'failed';
    await payment.save();
    const error = new Error(data.message || 'فشل إنشاء عملية الدفع مع Paymob');
    error.statusCode = 502;
    throw error;
  }

  payment.providerTransactionId = String(data.id || data.intention_order_id || '');
  await payment.save();

  return {
    paymentId: payment._id,
    clientSecret: data.client_secret,
    publicKey: process.env.PAYMOB_PUBLIC_KEY,
    checkoutUrl: process.env.PAYMOB_CHECKOUT_URL || 'https://accept.paymob.com/unifiedcheckout/',
  };
};

// التحقق من توقيع الـ HMAC اللي Paymob بيبعته مع كل webhook (عشان نتأكد إن الطلب فعلاً من Paymob)
// ترتيب الحقول موثّق رسميًا وثابت (20 حقل، من غير أي فاصل بينهم)، اتأكدنا منه من توثيق Paymob الرسمي
const HMAC_FIELDS = [
  'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
  'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
  'is_standalone_payment', 'is_voided', 'order.id', 'owner', 'pending',
  'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success',
];

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
};

const verifyPaymobHmac = (transactionObj, receivedHmac) => {
  if (!process.env.PAYMOB_HMAC_SECRET || !receivedHmac) return false;

  const message = HMAC_FIELDS.map((field) => {
    const value = getNestedValue(transactionObj, field);
    return value === undefined || value === null ? '' : String(value);
  }).join('');

  const computedHmac = crypto
    .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
    .update(message)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(computedHmac), Buffer.from(receivedHmac));
  } catch {
    return false; // لو الأطوال مختلفة، timingSafeEqual بترمي خطأ بدل ما ترجع false
  }
};

// بيتنادى من الـ webhook بعد التأكد من الـ HMAC - بيحدّث حالة الدفعة عندنا بناءً على نتيجة Paymob
const handlePaymobWebhook = async (transactionObj) => {
  const specialReference = transactionObj.special_reference || transactionObj?.order?.merchant_order_id;
  if (!specialReference) return null;

  const payment = await Payment.findById(specialReference);
  if (!payment) return null;

  if (transactionObj.success === true && transactionObj.pending === false) {
    payment.status = 'held_in_escrow';
    payment.heldAt = new Date();
    payment.providerTransactionId = String(transactionObj.id);
  } else if (transactionObj.pending !== true) {
    payment.status = 'failed';
  }

  await payment.save();
  return payment;
};

// ---------- فودافون كاش (تحويل يدوي + تأكيد من الإدارة) ----------
// مفيش API رسمي لفودافون كاش لرقم شخصي، فالنظام هنا "شبه يدوي وشغال فعليًا":
// الطالب بيبعت طلب دفع، الطلب بيتسجل pending، والإدارة بتأكده يدويًا بعد ما تتأكد إن الفلوس وصلت فعليًا
const createVodafoneCashRequest = async ({ projectId, courseId, clientId, amount, senderPhone, transactionRef }) => {
  const item = await resolveItem({ projectId, courseId });
  const platformFee = +(amount * PLATFORM_FEE_PERCENT).toFixed(2);

  const payment = await Payment.create({
    project: item.project,
    course: item.course,
    itemTitle: item.title,
    client: clientId,
    amount,
    platformFee,
    provider: 'vodafone_cash',
    providerTransactionId: transactionRef || senderPhone,
    status: 'pending',
  });

  return payment;
};

const getPendingVodafoneCashPayments = async () => {
  return Payment.find({ provider: 'vodafone_cash', status: 'pending' })
    .populate('client', 'fullName email')
    .populate('project', 'title budget')
    .populate('course', 'title')
    .sort({ createdAt: -1 });
};

// الإدارة بتأكد إن الفلوس وصلت فعليًا على رقم فودافون كاش، وبعدها الدفعة بتتحط في الضمان المالي
const confirmVodafoneCashPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error('طلب الدفع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  if (payment.provider !== 'vodafone_cash') {
    const error = new Error('الطلب ده مش دفعة فودافون كاش');
    error.statusCode = 400;
    throw error;
  }

  payment.status = 'held_in_escrow';
  payment.heldAt = new Date();
  await payment.save();
  return payment;
};

const rejectVodafoneCashPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error('طلب الدفع مش موجود');
    error.statusCode = 404;
    throw error;
  }

  payment.status = 'failed';
  await payment.save();
  return payment;
};

module.exports = {
  createEscrowPayment,
  releaseEscrowPayment,
  refundPayment,
  getPaymentsByProject,
  getPaymentById,
  createPaymobPaymentIntention,
  verifyPaymobHmac,
  handlePaymobWebhook,
  createVodafoneCashRequest,
  getPendingVodafoneCashPayments,
  confirmVodafoneCashPayment,
  rejectVodafoneCashPayment,
};
