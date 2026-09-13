const express = require('express');
const router = express.Router();
const {
  createDispute,
  getDisputes,
  getDisputeById,
  resolveDispute,
} = require('../controllers/dispute.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createDispute);
router.get('/', protect, authorize('admin'), getDisputes);
router.get('/:id', protect, getDisputeById);
router.put('/:id/resolve', protect, authorize('admin'), resolveDispute);

module.exports = router;
