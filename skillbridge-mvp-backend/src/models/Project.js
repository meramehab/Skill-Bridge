const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budget: { type: Number, required: true },

    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // ممكن يتربط بفريق (Squad) بدل فرد واحد
    assignedSquad: { type: mongoose.Schema.Types.ObjectId, ref: 'Squad', default: null },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'submitted', 'completed', 'disputed', 'cancelled'],
      default: 'open',
    },

    deadline: { type: Date },

    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
