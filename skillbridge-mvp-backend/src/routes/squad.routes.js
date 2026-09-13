const express = require('express');
const router = express.Router();
const {
  createSquad,
  getSquads,
  getSquadById,
  joinSquad,
  leaveSquad,
  disbandSquad,
  suggestTeamMembers,
} = require('../controllers/squad.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createSquad);
router.get('/', getSquads);
router.post('/suggest-members', protect, suggestTeamMembers); // AI Team Matching
router.get('/:id', getSquadById);
router.put('/:id/join', protect, joinSquad);
router.put('/:id/leave', protect, leaveSquad);
router.put('/:id/disband', protect, disbandSquad);

module.exports = router;
