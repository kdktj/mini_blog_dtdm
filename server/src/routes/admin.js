const express = require('express');
const { verifyToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/adminController');

const router = express.Router();

/**
 * Admin Routes
 * All routes require authentication + admin role
 */

// Middleware: Apply authentication and admin check to all admin routes
router.use(verifyToken, isAdmin);

/**
 * Statistics Routes
 */
router.get('/stats', adminController.getStats);

/**
 * Users Management Routes
 */
// GET all users
router.get('/users', adminController.getAllUsers);

// GET specific user
router.get('/users/:id', adminController.getUserDetail);

// UPDATE user (role, ban status)
router.put('/users/:id', adminController.updateUser);

// DELETE user
router.delete('/users/:id', adminController.deleteUser);

/**
 * Posts Management Routes
 */
// GET all posts
router.get('/posts', adminController.getAllPosts);

// GET specific post
router.get('/posts/:id', adminController.getPostDetail);

// UPDATE post
router.put('/posts/:id', adminController.updatePost);

// DELETE post
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
