const express = require('express');
const router = express.Router();
const { getMyDashboard } = require('../controllers/studentDashboard.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyDashboard);

module.exports = router;
