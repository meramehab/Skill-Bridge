const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  assignProject,
  deleteProject,
  getMatchedProjects,
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('client', 'admin'), createProject);
router.get('/', getProjects);
router.post('/matched', protect, getMatchedProjects); // AI Job Matching
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.put('/:id/assign', protect, authorize('client', 'admin'), assignProject);
router.delete('/:id', protect, authorize('client', 'admin'), deleteProject);

module.exports = router;
