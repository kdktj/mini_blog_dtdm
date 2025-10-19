/**
 * Admin Role Verification Middleware
 * Ensures user has admin role
 * Must be used AFTER auth.verifyToken middleware
 */
const isAdmin = (req, res, next) => {
  try {
    // Verify that user is attached (from auth middleware)
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      error: 'Admin verification failed',
      message: error.message,
    });
  }
};

module.exports = isAdmin;
