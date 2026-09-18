import api from './api';

// الدفع المباشر (Sandbox أو البطاقات أو فودافون كاش)
const checkout = async ({ courseId, projectId, amount, paymentMethod = 'sandbox', sandboxAutoSucceed = true }) => {
  const { data } = await api.post('/payments/checkout', {
    courseId,
    projectId,
    amount,
    paymentMethod,
    sandboxAutoSucceed,
  });
  return data;
};

// التحقق من حالة الدفع
const verifyPayment = async ({ transactionId, paymentId, status = 'completed' }) => {
  const { data } = await api.post('/payments/verify', {
    transactionId,
    paymentId,
    status,
  });
  return data;
};

const createPaymobPayment = async ({ projectId, courseId, amount, phone }) => {
  const { data } = await api.post('/payments/paymob/create', { projectId, courseId, amount, phone });
  return data.data; // { paymentId, clientSecret, publicKey, checkoutUrl }
};

const redirectToPaymobCheckout = ({ checkoutUrl, publicKey, clientSecret }) => {
  window.location.href = `${checkoutUrl}?publicKey=${publicKey}&clientSecret=${clientSecret}`;
};

const createVodafoneCashPayment = async ({ projectId, courseId, amount, senderPhone, transactionRef }) => {
  const { data } = await api.post('/payments/vodafone-cash/create', {
    projectId, courseId, amount, senderPhone, transactionRef,
  });
  return data.data;
};

export default {
  checkout,
  verifyPayment,
  createPaymobPayment,
  redirectToPaymobCheckout,
  createVodafoneCashPayment,
};

