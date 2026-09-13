const mongoose = require('mongoose');

// محاولة طالب في اختبار كورس معيّن
const examAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    answers: [{ type: Number }], // فهرس الإجابة اللي اختارها الطالب لكل سؤال
    score: { type: Number, required: true }, // نسبة مئوية 0-100
    passed: { type: Boolean, required: true },

    // علشان نمنع الطالب يفتح الامتحان تاني أو يخرج ويرجع، بنسجل وقت البداية
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamAttempt', examAttemptSchema);
