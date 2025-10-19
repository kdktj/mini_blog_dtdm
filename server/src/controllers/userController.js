const { User, Post } = require('../models');
const { Op } = require('sequelize');

/**
 * Get user by ID with basic info
 * GET /api/users/:userId
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password_hash'],
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} does not exist`,
      });
    }

    // Get post count for this user
    const postCount = await Post.count({
      where: { user_id: userId, status: 'published' },
    });

    // Get recent posts (last 5 published)
    const recentPosts = await Post.findAll({
      where: { user_id: userId, status: 'published' },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'excerpt', 'created_at', 'views_count'],
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        post_count: postCount,
        recent_posts: recentPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
};

/**
 * Update user profile (own profile only)
 * PUT /api/users/:userId
 * Requires: Authorization Bearer token (owner only)
 */
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, bio, avatar_url } = req.body;

    // Check if requesting user is updating their own profile
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} does not exist`,
      });
    }

    // Update allowed fields
    if (full_name !== undefined) user.full_name = full_name;
    if (bio !== undefined) user.bio = bio;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
};

/**
 * Change password
 * PUT /api/users/:userId/password
 * Requires: Authorization Bearer token (owner only)
 */
const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { current_password, new_password, confirm_password } = req.body;

    // Check if requesting user is changing their own password
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only change your own password',
      });
    }

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide current password and new password',
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'New passwords do not match',
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password must be at least 8 characters',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} does not exist`,
      });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'The current password you provided is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(new_password, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      error: 'Failed to change password',
      message: error.message,
    });
  }
};

module.exports = {
  getUserById,
  updateProfile,
  changePassword,
};
