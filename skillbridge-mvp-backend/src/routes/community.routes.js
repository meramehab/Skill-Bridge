const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  addComment,
  acceptAnswer,
  deletePost,
} = require('../controllers/community.controller');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.get('/:id', getPostById);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.put('/:id/comments/:commentId/accept', protect, acceptAnswer);
router.delete('/:id', protect, deletePost);

module.exports = router;
