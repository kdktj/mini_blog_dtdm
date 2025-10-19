const express = require('express');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
} = require('../controllers/postController');
const commentsRouter = require('./comments');
const likesRouter = require('./likes');

const router = express.Router();

/**
 * Post routes
 */

// Get all posts (public, optional auth for like status)
router.get('/', optionalAuth, getAllPosts);

// Create new post (requires auth)
router.post('/', verifyToken, createPost);

// Get posts by user (public) - must be before /:id to avoid conflict
router.get('/user/:userId', getPostsByUser);

// Get single post by ID (optional auth)
router.get('/:id', optionalAuth, getPostById);

// Update post (requires auth, owner only)
router.put('/:id', verifyToken, updatePost);

// Delete post (requires auth, owner only)
router.delete('/:id', verifyToken, deletePost);

// Mount comments router at /posts/:id/comments
router.use('/:id/comments', commentsRouter);

// Mount likes router at /posts/:id/like(s)
router.use('/:id/like', likesRouter);
router.use('/:id/likes', likesRouter);

module.exports = router;
