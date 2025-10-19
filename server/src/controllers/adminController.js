const { User, Post, Comment, Like } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = search
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { full_name: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['password_hash'],
      },
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
};

/**
 * GET /api/admin/users/:id
 * Get single user (admin only)
 */
const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password_hash'],
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'status', 'created_at'],
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} does not exist`,
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user detail:', error);
    res.status(500).json({
      error: 'Failed to fetch user detail',
      message: error.message,
    });
  }
};

/**
 * PUT /api/admin/users/:id
 * Update user role or ban status (admin only)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_banned } = req.body;

    // Validate input
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either "user" or "admin"',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} does not exist`,
      });
    }

    // Prevent admin from removing their own admin role
    if (role === 'user' && user.id === req.user.id && user.role === 'admin') {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot remove your own admin role',
      });
    }

    // Update fields
    if (role !== undefined) user.role = role;
    if (is_banned !== undefined) user.is_banned = is_banned;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_banned: user.is_banned,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message,
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete user (admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} does not exist`,
      });
    }

    // Delete all user's posts and related comments/likes first
    const userPosts = await Post.findAll({
      where: { user_id: id },
    });

    for (const post of userPosts) {
      await Comment.destroy({ where: { post_id: post.id } });
      await Like.destroy({ where: { post_id: post.id } });
      await post.destroy();
    }

    // Delete user
    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message,
    });
  }
};

/**
 * GET /api/admin/posts
 * Get all posts (admin only)
 */
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (status && ['draft', 'published'].includes(status)) {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'full_name'],
        },
      ],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: error.message,
    });
  }
};

/**
 * GET /api/admin/posts/:id
 * Get single post detail (admin only)
 */
const getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'full_name', 'email'],
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'created_at'],
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
            },
          ],
          limit: 10,
          order: [['created_at', 'DESC']],
        },
        {
          model: Like,
          attributes: ['user_id', 'created_at'],
          limit: 10,
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post detail:', error);
    res.status(500).json({
      error: 'Failed to fetch post detail',
      message: error.message,
    });
  }
};

/**
 * PUT /api/admin/posts/:id
 * Update post (admin only)
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, featured_image } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be either "draft" or "published"',
      });
    }

    // Update allowed fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (featured_image !== undefined) post.featured_image = featured_image;
    if (status !== undefined) post.status = status;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      error: 'Failed to update post',
      message: error.message,
    });
  }
};

/**
 * DELETE /api/admin/posts/:id
 * Delete post (admin only)
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    // Delete all comments and likes for this post
    await Comment.destroy({ where: { post_id: id } });
    await Like.destroy({ where: { post_id: id } });
    await post.destroy();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      message: error.message,
    });
  }
};

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    const bannedUsers = await User.count({ where: { is_banned: true } });
    const totalPosts = await Post.count();
    const publishedPosts = await Post.count({ where: { status: 'published' } });
    const draftPosts = await Post.count({ where: { status: 'draft' } });
    const totalComments = await Comment.count();
    const totalLikes = await Like.count();

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          banned: bannedUsers,
        },
        posts: {
          total: totalPosts,
          published: publishedPosts,
          draft: draftPosts,
        },
        comments: totalComments,
        likes: totalLikes,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message,
    });
  }
};

module.exports = {
  // Users
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  // Posts
  getAllPosts,
  getPostDetail,
  updatePost,
  deletePost,
  // Stats
  getStats,
};
