const express = require('express');
const router = express.Router();
const {
  submitVerification,
  reviewVerification,
  getPendingVerifications,
} = require('../controllers/university.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/verify', protect, submitVerification);
router.get('/pending', protect, authorize('admin'), getPendingVerifications);
router.put('/:id/review', protect, authorize('admin'), reviewVerification);

module.exports = router;
