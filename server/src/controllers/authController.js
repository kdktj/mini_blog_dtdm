const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Verify password
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username (3-50 characters, alphanumeric + underscore)
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password (min 8 chars, must include uppercase, lowercase, number)
 */
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * User Registration
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'username, email, and password are required',
      });
    }

    // Validate username format
    if (!isValidUsername(username)) {
      return res.status(400).json({
        error: 'Invalid username',
        message: 'Username must be 3-50 characters, alphanumeric and underscore only',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username already exists',
        message: 'This username is already taken',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'This email is already registered',
      });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash,
      full_name: full_name || null,
    });

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        is_banned: user.is_banned,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
    });
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate required fields
    if (!password || (!email && !username)) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide email/username and password',
      });
    }

    // Find user by email or username
    let user = null;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { username } });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Invalid email/username or password',
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email/username or password',
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        is_banned: user.is_banned,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
};

/**
 * Get Current User
 * GET /api/auth/me
 * Requires: Authorization Bearer token
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password_hash'],
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The user associated with this token no longer exists',
      });
    }

    return res.status(200).json({
      message: 'User data retrieved',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        is_banned: user.is_banned,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user',
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
