import api from './api';

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

export default { createPaymobPayment, redirectToPaymobCheckout, createVodafoneCashPayment };
