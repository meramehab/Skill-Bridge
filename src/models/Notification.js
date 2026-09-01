const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: ['info', 'project', 'payment', 'dispute', 'squad', 'system'],
      default: 'info',
    },

    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null }, // ID المشروع/النزاع.. إلخ

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
