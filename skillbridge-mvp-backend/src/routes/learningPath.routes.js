const express = require('express');
const router = express.Router();
const {
  getMyLearningPath,
  addModules,
  updateModuleStatus,
} = require('../controllers/learningPath.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyLearningPath);
router.post('/modules', protect, addModules);
router.put('/modules/:moduleId', protect, updateModuleStatus);

module.exports = router;
