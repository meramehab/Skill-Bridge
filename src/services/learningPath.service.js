const LearningPath = require('../models/LearningPath');
const User = require('../models/User');

const recalculateProgress = (modules) => {
  if (!modules.length) return 0;
  const completedCount = modules.filter((m) => m.completed).length;
  return Math.round((completedCount / modules.length) * 100);
};

// إنشاء/جلب مسار تعلم الطالب - لو مش موجود بيتعمل فاضي
const getOrCreateLearningPath = async (userId) => {
  let path = await LearningPath.findOne({ user: userId });
  if (!path) {
    path = await LearningPath.create({ user: userId, modules: [] });
  }
  return path;
};

// إضافة وحدات جديدة (مثلاً بعد تحليل الـ CV واقتراح مسار تعلم)
const addModules = async (userId, newModules) => {
  const path = await getOrCreateLearningPath(userId);
  path.modules.push(...newModules);
  path.progressPercent = recalculateProgress(path.modules);
  await path.save();
  return path;
};

// تحديث حالة وحدة معينة (مكتملة / مش مكتملة)
const updateModuleStatus = async (userId, moduleId, completed) => {
  const path = await LearningPath.findOne({ user: userId });
  if (!path) {
    const error = new Error('مسار التعلم مش موجود');
    error.statusCode = 404;
    throw error;
  }

  const module_ = path.modules.id(moduleId);
  if (!module_) {
    const error = new Error('الوحدة مش موجودة');
    error.statusCode = 404;
    throw error;
  }

  module_.completed = completed;
  path.progressPercent = recalculateProgress(path.modules);
  await path.save();

  // نحدث نسبة التقدم في بروفايل المستخدم كمان (مستخدمة في StudentDashboard)
  await User.findByIdAndUpdate(userId, { learningPathProgress: path.progressPercent });

  return path;
};

module.exports = { getOrCreateLearningPath, addModules, updateModuleStatus };
