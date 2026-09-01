const Post = require('../models/Post');

const createPost = async (authorId, { type, title, content, tags }) => {
  return Post.create({ author: authorId, type: type || 'post', title, content, tags });
};

const getPosts = async (filters = {}) => {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.tag) query.tags = filters.tag;

  return Post.find(query).populate('author', 'fullName').sort({ createdAt: -1 });
};

const getPostById = async (id) => {
  const post = await Post.findById(id)
    .populate('author', 'fullName')
    .populate('comments.author', 'fullName');
  if (!post) {
    const error = new Error('المنشور مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return post;
};

const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('المنشور مش موجود');
    error.statusCode = 404;
    throw error;
  }

  const alreadyLiked = post.likes.some((id) => id.toString() === userId);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  return post;
};

const addComment = async (postId, authorId, content) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('المنشور مش موجود');
    error.statusCode = 404;
    throw error;
  }

  post.comments.push({ author: authorId, content });
  await post.save();
  return post;
};

// تحديد إجابة مقبولة (للأسئلة) - بيقفل السؤال ويعتبره Resolved
const acceptAnswer = async (postId, commentId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error('السؤال مش موجود');
    error.statusCode = 404;
    throw error;
  }

  post.comments.forEach((c) => {
    c.isAcceptedAnswer = c._id.toString() === commentId;
  });
  post.isResolved = true;
  await post.save();
  return post;
};

const deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    const error = new Error('المنشور مش موجود');
    error.statusCode = 404;
    throw error;
  }
  return post;
};

module.exports = { createPost, getPosts, getPostById, toggleLike, addComment, acceptAnswer, deletePost };
