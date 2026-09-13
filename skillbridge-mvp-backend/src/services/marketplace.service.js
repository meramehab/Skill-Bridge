const Project = require('../models/Project');

// طبقة مخصصة لسوق المشاريع - بحث وفلترة متقدمة شوية عن project.service الأساسية
const searchMarketplace = async ({ keyword, skill, minBudget, maxBudget, status }) => {
  const query = {};

  if (status) query.status = status;
  else query.status = 'open'; // افتراضيًا نعرض المشاريع المتاحة بس

  if (skill) query.skillsRequired = skill;

  if (minBudget || maxBudget) {
    query.budget = {};
    if (minBudget) query.budget.$gte = Number(minBudget);
    if (maxBudget) query.budget.$lte = Number(maxBudget);
  }

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  return Project.find(query).populate('client', 'fullName email').sort({ createdAt: -1 });
};

const addMarketplaceListing = async (clientId, data) => {
  return Project.create({ ...data, client: clientId });
};

const updateMarketplaceListing = async (id, updates) => {
  const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!project) {
    const error = new Error('الخدمة/المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const removeMarketplaceListing = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    const error = new Error('الخدمة/المشروع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

module.exports = {
  searchMarketplace,
  addMarketplaceListing,
  updateMarketplaceListing,
  removeMarketplaceListing,
};
