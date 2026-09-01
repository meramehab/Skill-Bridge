const User = require('../models/User');
const Project = require('../models/Project');
const Leaderboard = require('../models/Leaderboard');
const Notification = require('../models/Notification');
const learningPathService = require('../services/learningPath.service');

// نقطة واحدة تجمع كل حاجة الطالب محتاج يشوفها في لوحة تحكمه
const getMyDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, myProjects, learningPath, leaderboardEntry, unreadNotifications] = await Promise.all([
      User.findById(userId).select('-password'),
      Project.find({ assignedTo: userId }).select('title status budget deadline'),
      learningPathService.getOrCreateLearningPath(userId),
      Leaderboard.findOne({ user: userId }),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم مش موجود' });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          fullName: user.fullName,
          careerReadinessScore: user.careerReadinessScore,
          learningPathProgress: user.learningPathProgress,
          isUniversityVerified: user.isUniversityVerified,
          skills: user.skills,
        },
        projects: myProjects,
        learningPath,
        leaderboard: leaderboardEntry || null,
        unreadNotificationsCount: unreadNotifications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyDashboard };
