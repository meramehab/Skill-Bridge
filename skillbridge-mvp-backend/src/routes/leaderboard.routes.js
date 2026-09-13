const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getUserRank,
  addExperience,
} = require('../controllers/leaderboard.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getLeaderboard);
router.get('/:userId', getUserRank);
router.post('/add-experience', protect, authorize('admin'), addExperience);

module.exports = router;
