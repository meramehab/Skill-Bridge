const projectService = require('../services/project.service');
const { matchJobsForStudent } = require('../ai/simpleModels');

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.query);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const assignProject = async (req, res) => {
  try {
    const project = await projectService.assignProject(req.params.id, req.body);
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف المشروع' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// AI Job Matching - ترشيح مشاريع مناسبة للطالب الحالي بناءً على مهاراته
const getMatchedProjects = async (req, res) => {
  try {
    const { skills } = req.body; // مهارات الطالب
    const projects = await projectService.getProjects({ status: 'open' });
    const matched = matchJobsForStudent(skills || [], projects);
    res.status(200).json({ success: true, data: matched });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  assignProject,
  deleteProject,
  getMatchedProjects,
};
