const Payment = require('../models/Payment');
const Project = require('../models/Project');

const PLATFORM_FEE_PERCENT = 0.1; // 10% عمولة المنصة - قابلة للتعديل

// إنشاء عملية دفع وتجميد الفلوس في الـ Escrow
// MVP: لو PAYMENT_MODE=mock بيشتغل من غير أي API خارجي حقيقي
const createEscrowPayment = async ({ projectId, clientId, amount }) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error('المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }

  const platformFee = +(amount * PLATFORM_FEE_PERCENT).toFixed(2);

  const payment = await Payment.create({
    project: projectId,
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

module.exports = {
  createEscrowPayment,
  releaseEscrowPayment,
  refundPayment,
  getPaymentsByProject,
};
