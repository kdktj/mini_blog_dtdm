const { Comment, Post, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new comment on a post
 * POST /api/posts/:id/comments
 */
const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, parent_id } = req.body;
    const user_id = req.user.id;

    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Comment content is required',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Comment must be less than 1000 characters',
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

    // If parent_id is provided, verify it exists
    if (parent_id) {
      const parentComment = await Comment.findByPk(parent_id);
      if (!parentComment) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Parent comment not found',
        });
      }
      // Ensure parent comment belongs to the same post
      if (parentComment.post_id !== parseInt(postId)) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Parent comment does not belong to this post',
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      post_id: postId,
      user_id,
      content: content.trim(),
      parent_id: parent_id || null,
    });

    // Fetch comment with user info
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'full_name', 'avatar_url'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: commentWithUser,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      error: 'Failed to create comment',
      message: error.message,
    });
  }
};

/**
 * Get all comments for a post (with nested replies)
 * GET /api/posts/:id/comments?page=1&limit=20
 */
const getComments = async (req, res) => {
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

    // Fetch top-level comments (parent_id is null) with their replies
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        post_id: postId,
        parent_id: null, // Only top-level comments
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'full_name', 'avatar_url'],
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            attributes: ['id', 'username', 'full_name', 'avatar_url'],
          }],
          order: [['created_at', 'ASC']],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / limitNum),
        current_page: pageNum,
        per_page: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message,
    });
  }
};

/**
 * Update a comment
 * PUT /api/posts/:id/comments/:commentId
 */
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const user_id = req.user.id;

    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Comment content is required',
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Comment must be less than 1000 characters',
      });
    }

    // Find comment
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Comment not found',
      });
    }

    // Check ownership
    if (comment.user_id !== user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only edit your own comments',
      });
    }

    // Update comment
    comment.content = content.trim();
    await comment.save();

    // Fetch updated comment with user info
    const updatedComment = await Comment.findByPk(commentId, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'full_name', 'avatar_url'],
      }],
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      error: 'Failed to update comment',
      message: error.message,
    });
  }
};

/**
 * Delete a comment
 * DELETE /api/posts/:id/comments/:commentId
 */
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const user_id = req.user.id;

    // Find comment
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Comment not found',
      });
    }

    // Check ownership
    if (comment.user_id !== user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own comments',
      });
    }

    // Delete comment (cascade will delete replies automatically)
    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      error: 'Failed to delete comment',
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
