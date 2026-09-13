const mongoose = require('mongoose');

// منشورات المجتمع التقني - بتغطي Posts والأسئلة والإجابات مع تعليقات وإعجابات
const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isAcceptedAnswer: { type: Boolean, default: false }, // للأسئلة: تحديد الإجابة المقبولة
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: { type: String, enum: ['post', 'question'], default: 'post' },

    title: { type: String, default: '' }, // مطلوب أساسًا للأسئلة
    content: { type: String, required: true },
    tags: [{ type: String }],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],

    isResolved: { type: Boolean, default: false }, // للأسئلة بعد قبول إجابة
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
