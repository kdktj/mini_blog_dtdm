const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getUserById,
  updateProfile,
  changePassword,
} = require('../controllers/userController');

const router = express.Router();

/**
 * User routes
 */

// Get user by ID (public)
router.get('/:userId', getUserById);

// Update user profile (requires auth, owner only)
router.put('/:userId', verifyToken, updateProfile);

// Change password (requires auth, owner only)
router.put('/:userId/password', verifyToken, changePassword);

module.exports = router;
