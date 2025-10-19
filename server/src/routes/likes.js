const express = require('express');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const {
  toggleLike,
  getLikes,
  checkLikeStatus,
} = require('../controllers/likeController');

const router = express.Router({ mergeParams: true });

/**
 * Like routes - nested under posts
 * Used as: /api/posts/:id/like and /api/posts/:id/likes
 */

// Toggle like on a post (requires auth)
router.post('/', verifyToken, toggleLike);

// Check like status for current user (optional auth)
router.get('/status', optionalAuth, checkLikeStatus);

// Get all likes for a post (public)
router.get('/', getLikes);

module.exports = router;
