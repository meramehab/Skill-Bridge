const express = require('express');
const router = express.Router();
const {
  createEscrowPayment,
  releaseEscrowPayment,
  refundPayment,
  getPaymentsByProject,
} = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/escrow', protect, authorize('client', 'admin'), createEscrowPayment);
router.put('/:id/release', protect, authorize('client', 'admin'), releaseEscrowPayment);
router.put('/:id/refund', protect, authorize('admin'), refundPayment);
router.get('/project/:projectId', protect, getPaymentsByProject);

module.exports = router;
