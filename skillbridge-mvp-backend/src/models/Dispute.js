const mongoose = require('mongoose');

// نظام النزاع والتحكيم
const disputeSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    reason: { type: String, required: true },
    evidenceUrls: [{ type: String }],

    // AI-Jury (لاحقًا) - هنا بنسيب مكان لتخزين نتيجة أي تحليل آلي مستقبلي
    aiRiskAssessment: {
      riskLevel: { type: String, enum: ['low', 'medium', 'high', null], default: null },
      notes: { type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved_client', 'resolved_student', 'closed'],
      default: 'open',
    },

    resolution: { type: String, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);
