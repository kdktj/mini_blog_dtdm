import api from './axios';

/**
 * Toggle like on a post (like/unlike)
 */
export const toggleLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all likes for a post
 */
export const getLikes = async (postId, page = 1, limit = 20) => {
  try {
    const response = await api.get(`/posts/${postId}/likes`, {
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
 * Check if current user liked a post
 */
export const checkLikeStatus = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/like/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
