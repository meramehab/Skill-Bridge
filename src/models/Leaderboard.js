const mongoose = require('mongoose');

// نظام الليدربورد ونقاط الخبرة (Gamification)
const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    experiencePoints: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    badges: [{ type: String }], // مثل: 'fast_delivery', 'top_rated'

    // نظام السمعة: بناءً على الالتزام بالمواعيد ورضا العملاء
    reputationScore: { type: Number, default: 0 },

    rankTitle: { type: String, default: 'Newcomer' }, // Newcomer, Rising Talent, Pro, Expert
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
