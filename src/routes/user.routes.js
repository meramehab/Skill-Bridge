const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getMe,
  updateUser,
  updateUserRole,
  deleteUser,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
