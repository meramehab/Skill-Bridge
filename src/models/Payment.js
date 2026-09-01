const mongoose = require('mongoose');

// نظام ضمان مالي آمن (Escrow) - فلوس العميل بتتجمد لحد ما يوافق على التسليم
const paymentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 }, // عمولة المنصة من كل صفقة

    // MVP: mock إلى أن يتم ربط Paymob فعليًا
    provider: { type: String, default: 'paymob' },
    providerTransactionId: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'held_in_escrow', 'released', 'refunded', 'failed'],
      default: 'pending',
    },

    heldAt: { type: Date, default: null },
    releasedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
