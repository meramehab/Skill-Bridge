const analyticsService = require('../services/analytics.service');
const universityService = require('../services/university.service');
const disputeService = require('../services/dispute.service');
const User = require('../models/User');

// ملخص شامل للوحة تحكم الإدارة - بيجمع الإحصائيات + الطلبات المعلّقة في نداء واحد
const getDashboardSummary = async (req, res) => {
  try {
    const [overview, pendingVerifications, openDisputes] = await Promise.all([
      analyticsService.getPlatformOverview(),
      universityService.getPendingVerifications(),
      disputeService.getDisputes({ status: 'open' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview,
        pendingVerificationsCount: pendingVerifications.length,
        openDisputesCount: openDisputes.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// تفعيل/تعطيل حساب مستخدم (بدل الحذف النهائي)
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم مش موجود' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, data: { id: user._id, isActive: user.isActive } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardSummary, toggleUserActive };
