import api from './axios';

/**
 * Authentication API Module
 * Handles all authentication-related API calls
 */

/**
 * Register a new user
 * @param {object} data - Registration data
 * @param {string} data.username - Username
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @param {string} data.full_name - Full name (optional)
 * @returns {Promise} Response with token and user data
 */
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

/**
 * Login user
 * @param {object} data - Login credentials
 * @param {string} data.email - User email (optional if username provided)
 * @param {string} data.username - Username (optional if email provided)
 * @param {string} data.password - Password
 * @returns {Promise} Response with token and user data
 */
export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise} Response with user data
 */
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user' };
  }
};

export default {
  register,
  login,
  getMe,
};
