import api from './axios';

/**
 * Get user by ID
 * GET /api/users/:userId
 */
export const getUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Get user's posts
 * GET /api/users/:userId/posts
 */
export const getUserPosts = async (userId, page = 1, limit = 10, status = 'published') => {
  try {
    const response = await api.get(`/posts/user/${userId}`, {
      params: {
        page,
        limit,
        status,
      },
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user posts');
  }
};

/**
 * Update user profile
 * PUT /api/users/:userId
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Change password
 * PUT /api/users/:userId/password
 */
export const changePassword = async (userId, passwords) => {
  try {
    const response = await api.put(`/users/${userId}/password`, passwords);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

export default {
  getUser,
  getUserPosts,
  updateProfile,
  changePassword,
};
