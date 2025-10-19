const { Post, User, Comment, Like, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new post
 * POST /api/posts
 */
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, status } = req.body;
    const user_id = req.user.id;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and content are required',
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title must be less than 255 characters',
      });
    }

    // Auto-generate excerpt if not provided
    const postExcerpt = excerpt || content.substring(0, 500);

    // Create post
    const post = await Post.create({
      user_id,
      title,
      content,
      excerpt: postExcerpt,
      featured_image: featured_image || null,
      status: status || 'draft',
      published_at: status === 'published' ? new Date() : null,
    });

    // Fetch post with user info
    const postWithUser = await Post.findByPk(post.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'full_name', 'avatar_url'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postWithUser,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      error: 'Failed to create post',
      message: error.message,
    });
  }
};

/**
 * Get all posts with pagination
 * GET /api/posts?page=1&limit=10&status=published&sort=latest
 */
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published', sort = 'latest', search = '' } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    // Determine order
    let order = [['created_at', 'DESC']];
    if (sort === 'popular') {
      order = [['views_count', 'DESC']];
    } else if (sort === 'oldest') {
      order = [['created_at', 'ASC']];
    }

    // Fetch posts with count
    const { count, rows } = await Post.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'full_name', 'avatar_url'],
        },
      ],
      order,
      limit: limitNum,
      offset,
      distinct: true,
    });

    // Fetch likes and comments count for each post
    const postsWithCounts = await Promise.all(
      rows.map(async (post) => {
        const likeCount = await Like.count({ where: { post_id: post.id } });
        const commentCount = await Comment.count({ where: { post_id: post.id } });

        return {
          ...post.toJSON(),
          like_count: likeCount,
          comment_count: commentCount,
        };
      })
    );

    res.json({
      success: true,
      data: postsWithCounts,
      pagination: {
        total: count,
        pages: Math.ceil(count / limitNum),
        current_page: pageNum,
        limit: limitNum,
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
 * Get single post by ID
 * GET /api/posts/:id
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch post
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'full_name', 'avatar_url', 'bio'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    // Increment views count
    await post.increment('views_count');

    // Get like and comment counts
    const likeCount = await Like.count({ where: { post_id: id } });
    const commentCount = await Comment.count({ where: { post_id: id } });

    // Check if current user liked this post
    let userLiked = false;
    if (req.user) {
      const userLike = await Like.findOne({
        where: { post_id: id, user_id: req.user.id },
      });
      userLiked = !!userLike;
    }

    res.json({
      success: true,
      data: {
        ...post.toJSON(),
        like_count: likeCount,
        comment_count: commentCount,
        user_liked: userLiked,
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      message: error.message,
    });
  }
};

/**
 * Update post
 * PUT /api/posts/:id
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image, status } = req.body;
    const user_id = req.user.id;

    // Find post
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    // Check ownership
    if (post.user_id !== user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own posts',
      });
    }

    // Validation
    if (title && title.length > 255) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title must be less than 255 characters',
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (featured_image !== undefined) post.featured_image = featured_image;
    if (status) {
      post.status = status;
      if (status === 'published' && !post.published_at) {
        post.published_at = new Date();
      }
    }

    await post.save();

    // Fetch updated post with user info
    const updatedPost = await Post.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'full_name', 'avatar_url'],
      }],
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
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
 * Delete post
 * DELETE /api/posts/:id
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Find post
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    // Check ownership
    if (post.user_id !== user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own posts',
      });
    }

    // Delete cascaded data (handled by Sequelize associations)
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
 * Get posts by user
 * GET /api/users/:userId/posts
 */
const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'published' } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${userId} does not exist`,
      });
    }

    // Build where clause
    const where = { user_id: userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    // Fetch posts
    const { count, rows } = await Post.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / limitNum),
        current_page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      error: 'Failed to fetch user posts',
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
};
