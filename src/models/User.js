const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },

    // Member1: Roles
    role: {
      type: String,
      enum: ['student', 'client', 'admin'],
      default: 'student',
    },

    university: { type: String, default: null },
    universityEmail: { type: String, default: null },

    // متعلق بمرحلة "التحقق من الهوية الطلابية"
    isUniversityVerified: { type: Boolean, default: false },

    skills: [{ type: String }],
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },

    // مؤشر الجاهزية المهنية (Career Readiness Score) - AI Member1
    careerReadinessScore: { type: Number, default: 0 },

    // نسبة إتمام مسار التعلم (لازمة عشان شرط الدخول لسوق العمل الحر)
    learningPathProgress: { type: Number, default: 0 }, // 0 - 100

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// تشفير الباسورد قبل الحفظ
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
