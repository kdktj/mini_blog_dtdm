const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

/**
 * POST /api/auth/register
 * User registration endpoint
 * @param {string} username - Username (3-50 chars, alphanumeric + underscore)
 * @param {string} email - User email
 * @param {string} password - Password (min 8 chars with uppercase, lowercase, number)
 * @param {string} full_name - User full name (optional)
 * @returns {object} token and user data
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * User login endpoint
 * @param {string} email - User email (optional if username provided)
 * @param {string} username - Username (optional if email provided)
 * @param {string} password - User password
 * @returns {object} token and user data
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current authenticated user
 * @requires Authorization header with Bearer token
 * @returns {object} current user data
 */
router.get('/me', verifyToken, getMe);

module.exports = router;
