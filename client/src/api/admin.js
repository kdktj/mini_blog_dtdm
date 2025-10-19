import axios from './axios';

/**
 * Admin API Services
 */

// ========== STATISTICS ==========

export const getAdminStats = async () => {
  try {
    const response = await axios.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== USERS MANAGEMENT ==========

export const getAllUsers = async (page = 1, limit = 20, search = '') => {
  try {
    const response = await axios.get('/admin/users', {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserDetail = async (userId) => {
  try {
    const response = await axios.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await axios.put(`/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const promoteUserToAdmin = async (userId) => {
  return updateUser(userId, { role: 'admin' });
};

export const demoteUserFromAdmin = async (userId) => {
  return updateUser(userId, { role: 'user' });
};

export const banUser = async (userId) => {
  return updateUser(userId, { is_banned: true });
};

export const unbanUser = async (userId) => {
  return updateUser(userId, { is_banned: false });
};

// ========== POSTS MANAGEMENT ==========

export const getAllPosts = async (page = 1, limit = 20, status = '', search = '') => {
  try {
    const response = await axios.get('/admin/posts', {
      params: { page, limit, status, search },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPostDetail = async (postId) => {
  try {
    const response = await axios.get(`/admin/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePost = async (postId, data) => {
  try {
    const response = await axios.put(`/admin/posts/${postId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`/admin/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const hidePost = async (postId) => {
  return updatePost(postId, { status: 'draft' });
};

export const publishPost = async (postId) => {
  return updatePost(postId, { status: 'published' });
};
