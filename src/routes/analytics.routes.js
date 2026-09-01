const express = require('express');
const router = express.Router();
const { getOverview, getTopSkills, getUserGrowth } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/overview', protect, authorize('admin'), getOverview);
router.get('/top-skills', protect, authorize('admin'), getTopSkills);
router.get('/user-growth', protect, authorize('admin'), getUserGrowth);

module.exports = router;
