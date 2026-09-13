const User = require('../models/User');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const Dispute = require('../models/Dispute');

// إحصائيات ولوحة تحكم الإدارة - كلها queries تجميعية بسيطة على الداتا الموجودة (مفيش AI هنا)
const getPlatformOverview = async () => {
  const [totalUsers, totalStudents, totalClients, totalProjects, openProjects, completedProjects] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'client' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'open' }),
      Project.countDocuments({ status: 'completed' }),
    ]);

  const revenueAgg = await Payment.aggregate([
    { $match: { status: 'released' } },
    { $group: { _id: null, totalPlatformFees: { $sum: '$platformFee' }, totalVolume: { $sum: '$amount' } } },
  ]);

  const openDisputes = await Dispute.countDocuments({ status: { $in: ['open', 'under_review'] } });

  return {
    users: { total: totalUsers, students: totalStudents, clients: totalClients },
    projects: { total: totalProjects, open: openProjects, completed: completedProjects },
    revenue: {
      totalPlatformFees: revenueAgg[0]?.totalPlatformFees || 0,
      totalVolume: revenueAgg[0]?.totalVolume || 0,
    },
    disputes: { open: openDisputes },
  };
};

// أكتر المهارات طلبًا في المشاريع - مفيدة للتقارير وللـ Market Predictor كمان
const getTopSkillsInDemand = async (limit = 10) => {
  const results = await Project.aggregate([
    { $unwind: '$skillsRequired' },
    { $group: { _id: '$skillsRequired', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return results.map((r) => ({ skill: r._id, demandCount: r.count }));
};

// نمو المستخدمين شهريًا (تقرير بسيط)
const getUserGrowthReport = async () => {
  const results = await User.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return results.map((r) => ({ year: r._id.year, month: r._id.month, newUsers: r.count }));
};

module.exports = { getPlatformOverview, getTopSkillsInDemand, getUserGrowthReport };
