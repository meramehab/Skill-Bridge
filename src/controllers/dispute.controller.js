const disputeService = require('../services/dispute.service');

const createDispute = async (req, res) => {
  try {
    const dispute = await disputeService.createDispute(req.user.id, req.body);
    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getDisputes = async (req, res) => {
  try {
    const disputes = await disputeService.getDisputes(req.query);
    res.status(200).json({ success: true, data: disputes });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getDisputeById = async (req, res) => {
  try {
    const dispute = await disputeService.getDisputeById(req.params.id);
    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const resolveDispute = async (req, res) => {
  try {
    const dispute = await disputeService.resolveDispute(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { createDispute, getDisputes, getDisputeById, resolveDispute };
