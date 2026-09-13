const mongoose = require('mongoose');

// مسار تعلم منظم للطالب - وحدات (modules) لكل مهارة مع نسبة تقدم
const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    resourceSuggestion: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const learningPathSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    modules: [moduleSchema],

    // تُحسب تلقائيًا من نسبة الوحدات المكتملة
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPath', learningPathSchema);
