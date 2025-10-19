const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

/**
 * Comment routes - nested under posts
 * Used as: /api/posts/:postId/comments
 */

// Get all comments for a post (public)
router.get('/', getComments);

// Create new comment (requires auth)
router.post('/', verifyToken, createComment);

// Update comment (requires auth, author only)
router.put('/:commentId', verifyToken, updateComment);

// Delete comment (requires auth, author only)
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;
