import api from './axios';

/**
 * Get all posts with pagination and filtering
 */
export const getPosts = async (page = 1, limit = 10, status = 'published', sort = 'latest', search = '') => {
  try {
    const response = await api.get('/posts', {
      params: {
        page,
        limit,
        status,
        sort,
        search,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get single post by ID
 */
export const getPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create new post
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update post
 */
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete post
 */
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get posts by user
 */
export const getPostsByUser = async (userId, page = 1, limit = 10, status = 'published') => {
  try {
    const response = await api.get(`/posts/user/${userId}`, {
      params: {
        page,
        limit,
        status,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
