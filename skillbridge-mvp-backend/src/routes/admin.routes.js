const express = require('express');
const router = express.Router();
const { getDashboardSummary, toggleUserActive } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardSummary);
router.put('/users/:id/toggle-active', protect, authorize('admin'), toggleUserActive);

module.exports = router;
