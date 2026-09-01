const mongoose = require('mongoose');

// الفرق الطلابية (Squads) - لتقسيم المشاريع الكبيرة
const squadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' }, // مثلاً: backend, frontend, designer
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    skills: [{ type: String }], // مهارات الفريق مجمّعة

    reputationScore: { type: Number, default: 0 }, // نظام السمعة

    status: {
      type: String,
      enum: ['active', 'disbanded'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Squad', squadSchema);
