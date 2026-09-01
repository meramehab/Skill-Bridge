const mongoose = require('mongoose');

// جلسة الشات بوت - كل الداتا محفوظة عندنا في الداتا بيز (مفيش إرسال لسيرفرات خارجية)
const chatbotSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true },

    messages: [
      {
        role: { type: String, enum: ['user', 'bot'], required: true },
        content: { type: String, required: true },
        intent: { type: String, default: null },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    context: { type: mongoose.Schema.Types.Mixed, default: {} },

    // بيانات تدريب/تحسين ردود البوت مستقبلًا (In-House Training)
    trainingData: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        intent: { type: String, default: 'unknown' },
        category: { type: String, default: 'general' },
        usedCount: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chatbot', chatbotSchema);
