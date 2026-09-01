const mongoose = require('mongoose');

// المرحلة الأولى: التحقق من الهوية الطلابية (كارنيه جامعي أو إيميل جامعي)
const universityVerificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    method: {
      type: String,
      enum: ['university_email', 'student_card'],
      required: true,
    },

    universityEmail: { type: String, default: null },
    studentCardImageUrl: { type: String, default: null },

    universityName: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UniversityVerification', universityVerificationSchema);
