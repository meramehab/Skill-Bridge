const express = require('express');
const router = express.Router();
const {
  createEscrowPayment,
  releaseEscrowPayment,
  refundPayment,
  getPaymentsByProject,
  createPaymobPayment,
  paymobWebhook,
  createVodafoneCashPayment,
  getPendingVodafoneCashPayments,
  confirmVodafoneCashPayment,
  rejectVodafoneCashPayment,
} = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/escrow', protect, authorize('client', 'admin'), createEscrowPayment);
router.put('/:id/release', protect, authorize('client', 'admin'), releaseEscrowPayment);
router.put('/:id/refund', protect, authorize('admin'), refundPayment);
router.get('/project/:projectId', protect, getPaymentsByProject);

// Paymob - دفع حقيقي (بيسمح للطالب كمان عشان يدفع تمن كورس)
router.post('/paymob/create', protect, authorize('client', 'admin', 'student'), createPaymobPayment);
// الـ webhook ده Paymob هو اللي بينادي عليه من سيرفره، مفيش JWT هنا (بيتحقق بالـ HMAC بدل كده)
router.post('/paymob/webhook', paymobWebhook);

// فودافون كاش - تحويل يدوي + تأكيد من الإدارة
router.post('/vodafone-cash/create', protect, authorize('client', 'admin', 'student'), createVodafoneCashPayment);
router.get('/vodafone-cash/pending', protect, authorize('admin'), getPendingVodafoneCashPayments);
router.put('/vodafone-cash/:id/confirm', protect, authorize('admin'), confirmVodafoneCashPayment);
router.put('/vodafone-cash/:id/reject', protect, authorize('admin'), rejectVodafoneCashPayment);

module.exports = router;
