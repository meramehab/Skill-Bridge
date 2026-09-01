const User = require('../models/User');

const getAllUsers = async (filter = {}) => {
  return User.find(filter).select('-password');
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    const error = new Error('المستخدم مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUser = async (id, updates) => {
  // منع تعديل حقول حساسة مباشرة من هنا
  delete updates.password;
  delete updates.role;

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    const error = new Error('المستخدم مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!user) {
    const error = new Error('المستخدم مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new Error('المستخدم مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, updateUserRole, deleteUser };
