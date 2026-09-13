const learningPathService = require('../services/learningPath.service');

const getMyLearningPath = async (req, res) => {
  try {
    const path = await learningPathService.getOrCreateLearningPath(req.user.id);
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addModules = async (req, res) => {
  try {
    const { modules } = req.body; // [{ title, resourceSuggestion }]
    const path = await learningPathService.addModules(req.user.id, modules || []);
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateModuleStatus = async (req, res) => {
  try {
    const { completed } = req.body;
    const path = await learningPathService.updateModuleStatus(req.user.id, req.params.moduleId, completed);
    res.status(200).json({ success: true, data: path });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyLearningPath, addModules, updateModuleStatus };
