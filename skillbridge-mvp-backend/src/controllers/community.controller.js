const communityService = require('../services/community.service');

const createPost = async (req, res) => {
  try {
    const post = await communityService.createPost(req.user.id, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await communityService.getPosts(req.query);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await communityService.getPostById(req.params.id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await communityService.toggleLike(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await communityService.addComment(req.params.id, req.user.id, content);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const acceptAnswer = async (req, res) => {
  try {
    const post = await communityService.acceptAnswer(req.params.id, req.params.commentId);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await communityService.deletePost(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف المنشور' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { createPost, getPosts, getPostById, toggleLike, addComment, acceptAnswer, deletePost };
