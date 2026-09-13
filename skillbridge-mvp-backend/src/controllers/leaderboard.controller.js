const Leaderboard = require('../models/Leaderboard');

// مفيش service منفصل للـ Leaderboard - المنطق بسيط فبيتعمل هنا مباشرة

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate('user', 'fullName email university')
      .sort({ experiencePoints: -1 })
      .limit(50);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserRank = async (req, res) => {
  try {
    const entry = await Leaderboard.findOne({ user: req.params.userId }).populate(
      'user',
      'fullName email'
    );
    if (!entry) {
      return res.status(404).json({ success: false, message: 'المستخدم مش موجود في الليدربورد' });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// بتتنادى بعد ما الطالب يخلص مشروع - بتحدث نقاطه وتحدد رتبته
const addExperience = async (req, res) => {
  try {
    const { userId, points, badge, reputationDelta } = req.body;

    let entry = await Leaderboard.findOne({ user: userId });
    if (!entry) {
      entry = new Leaderboard({ user: userId });
    }

    entry.experiencePoints += points || 0;
    entry.completedProjects += 1;
    if (badge && !entry.badges.includes(badge)) entry.badges.push(badge);
    entry.reputationScore += reputationDelta || 0;

    // تحديد الرتبة بناءً على نقاط الخبرة
    if (entry.experiencePoints >= 1000) entry.rankTitle = 'Expert';
    else if (entry.experiencePoints >= 500) entry.rankTitle = 'Pro';
    else if (entry.experiencePoints >= 100) entry.rankTitle = 'Rising Talent';
    else entry.rankTitle = 'Newcomer';

    await entry.save();
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeaderboard, getUserRank, addExperience };
