const express = require('express');
const postsRouter = require('./posts');
const authRouter = require('./auth');
const usersRouter = require('./users');
const adminRouter = require('./admin');

const router = express.Router();

/**
 * API Routes Aggregator
 */

// Authentication routes
router.use('/auth', authRouter);

// Users routes
router.use('/users', usersRouter);

// Posts routes
router.use('/posts', postsRouter);

// Admin routes
router.use('/admin', adminRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Mini Blog System API',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
    },
  });
});

module.exports = router;
