const Dispute = require('../models/Dispute');
const { assessDisputeRisk } = require('../ai/simpleModels');

const createDispute = async (raisedById, { projectId, against, reason, evidenceUrls }) => {
  // Risk Detection (AI) - تحليل مبدئي بسيط لمستوى خطورة النزاع بناءً على النص
  const aiRiskAssessment = assessDisputeRisk(reason);

  return Dispute.create({
    project: projectId,
    raisedBy: raisedById,
    against,
    reason,
    evidenceUrls: evidenceUrls || [],
    aiRiskAssessment,
  });
};

const getDisputes = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;

  return Dispute.find(query)
    .populate('project', 'title')
    .populate('raisedBy', 'fullName email')
    .populate('against', 'fullName email')
    .sort({ createdAt: -1 });
};

const getDisputeById = async (id) => {
  const dispute = await Dispute.findById(id)
    .populate('project')
    .populate('raisedBy', 'fullName email')
    .populate('against', 'fullName email');
  if (!dispute) {
    const error = new Error('النزاع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return dispute;
};

const resolveDispute = async (id, resolverId, { status, resolution }) => {
  const dispute = await Dispute.findByIdAndUpdate(
    id,
    { status, resolution, resolvedBy: resolverId, resolvedAt: new Date() },
    { new: true }
  );
  if (!dispute) {
    const error = new Error('النزاع مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return dispute;
};

module.exports = { createDispute, getDisputes, getDisputeById, resolveDispute };
