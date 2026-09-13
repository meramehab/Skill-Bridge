const Project = require('../models/Project');

const createProject = async (clientId, data) => {
  return Project.create({ ...data, client: clientId });
};

const getProjects = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.skill) query.skillsRequired = filters.skill;

  return Project.find(query)
    .populate('client', 'fullName email')
    .populate('assignedTo', 'fullName email')
    .sort({ createdAt: -1 });
};

const getProjectById = async (id) => {
  const project = await Project.findById(id)
    .populate('client', 'fullName email')
    .populate('assignedTo', 'fullName email')
    .populate('assignedSquad');

  if (!project) {
    const error = new Error('المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const updateProject = async (id, updates) => {
  const project = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    const error = new Error('المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const assignProject = async (id, { assignedTo, assignedSquad }) => {
  const project = await Project.findByIdAndUpdate(
    id,
    { assignedTo, assignedSquad, status: 'in_progress' },
    { new: true }
  );
  if (!project) {
    const error = new Error('المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    const error = new Error('المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  assignProject,
  deleteProject,
};
