const analyticsService = require('../services/analytics.service');

const getOverview = async (req, res) => {
  try {
    const overview = await analyticsService.getPlatformOverview();
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topSkills = await analyticsService.getTopSkillsInDemand(limit);
    res.status(200).json({ success: true, data: topSkills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserGrowth = async (req, res) => {
  try {
    const report = await analyticsService.getUserGrowthReport();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOverview, getTopSkills, getUserGrowth };
