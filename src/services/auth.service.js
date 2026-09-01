const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const registerUser = async ({ fullName, email, password, university }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('الإيميل ده مسجل قبل كده');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ fullName, email, password, university });
  const token = generateToken(user);

  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('بيانات الدخول غلط');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('بيانات الدخول غلط');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('الحساب ده متوقف، تواصل مع الدعم');
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(user);
  return { user, token };
};

module.exports = { registerUser, loginUser, generateToken };
