const squadService = require('../services/squad.service');
const { matchTeamMembers } = require('../ai/simpleModels');
const User = require('../models/User');

const createSquad = async (req, res) => {
  try {
    const squad = await squadService.createSquad(req.user.id, req.body);
    res.status(201).json({ success: true, data: squad });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSquads = async (req, res) => {
  try {
    const squads = await squadService.getSquads();
    res.status(200).json({ success: true, data: squads });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSquadById = async (req, res) => {
  try {
    const squad = await squadService.getSquadById(req.params.id);
    res.status(200).json({ success: true, data: squad });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const joinSquad = async (req, res) => {
  try {
    const squad = await squadService.joinSquad(req.params.id, req.user.id, req.body.role);
    res.status(200).json({ success: true, data: squad });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const leaveSquad = async (req, res) => {
  try {
    const squad = await squadService.leaveSquad(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: squad });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const disbandSquad = async (req, res) => {
  try {
    const squad = await squadService.disbandSquad(req.params.id);
    res.status(200).json({ success: true, data: squad });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// AI Team Matching - اقتراح أعضاء مناسبين لفريق بناءً على المهارات المطلوبة
const suggestTeamMembers = async (req, res) => {
  try {
    const { requiredSkills } = req.body;
    const candidates = await User.find({ role: 'student' }).select('fullName email skills');
    const matched = matchTeamMembers(candidates, requiredSkills || []);
    res.status(200).json({ success: true, data: matched });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSquad,
  getSquads,
  getSquadById,
  joinSquad,
  leaveSquad,
  disbandSquad,
  suggestTeamMembers,
};
