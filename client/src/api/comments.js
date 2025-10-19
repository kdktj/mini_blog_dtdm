import api from './axios';

/**
 * Create a new comment on a post
 */
export const createComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all comments for a post
 */
export const getComments = async (postId, page = 1, limit = 20) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a comment
 */
export const updateComment = async (postId, commentId, commentData) => {
  try {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
