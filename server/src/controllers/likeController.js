const { Like, Post, User } = require('../models');

/**
 * Toggle like on a post (like/unlike)
 * POST /api/posts/:id/like
 */
const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const user_id = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    // Check if user already liked this post
    const existingLike = await Like.findOne({
      where: {
        user_id,
        post_id: postId,
      },
    });

    let liked = false;

    if (existingLike) {
      // Unlike: delete the like
      await existingLike.destroy();
      liked = false;
    } else {
      // Like: create new like
      await Like.create({
        user_id,
        post_id: postId,
      });
      liked = true;
    }

    // Get updated like count
    const likeCount = await Like.count({
      where: { post_id: postId },
    });

    res.status(200).json({
      success: true,
      message: liked ? 'Post liked' : 'Post unliked',
      data: {
        liked,
        like_count: likeCount,
      },
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      error: 'Failed to toggle like',
      message: error.message,
    });
  }
};

/**
 * Get all likes for a post
 * GET /api/posts/:id/likes?page=1&limit=20
 */
const getLikes = async (req, res) => {
  try {
    const postId = req.params.id;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    // Fetch likes with user info
    const { count, rows } = await Like.findAndCountAll({
      where: { post_id: postId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'full_name', 'avatar_url'],
      }],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      data: rows.map(like => like.User), // Return just the user data
      pagination: {
        total: count,
        pages: Math.ceil(count / limitNum),
        current_page: pageNum,
        per_page: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({
      error: 'Failed to fetch likes',
      message: error.message,
    });
  }
};

/**
 * Check if current user liked a post
 * GET /api/posts/:id/like/status
 */
const checkLikeStatus = async (req, res) => {
  try {
    const postId = req.params.id;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(200).json({
        success: true,
        data: {
          liked: false,
        },
      });
    }

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    // Check if user liked this post
    const like = await Like.findOne({
      where: {
        user_id,
        post_id: postId,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        liked: !!like,
      },
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({
      error: 'Failed to check like status',
      message: error.message,
    });
  }
};

module.exports = {
  toggleLike,
  getLikes,
  checkLikeStatus,
};
