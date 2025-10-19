import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,50}$/.test(formData.username)) {
      newErrors.username = 'Username must be 3-50 characters (alphanumeric and underscore)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain lowercase letter';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain a number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password, formData.fullName);
      navigate('/', { replace: true });
    } catch (err) {
      const errorMsg = err?.error || err?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMsg });
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Join Mini Blog ✨</h1>
          <p style={styles.subtitle}>Create your account and start blogging today</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Submit Error */}
          {errors.submit && <div style={styles.errorBox}>{errors.submit}</div>}

          {/* Username Input */}
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="e.g., john_doe"
              value={formData.username}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.username ? '#f99' : '#e0e0e0',
              }}
              disabled={isLoading}
            />
            {errors.username && <span style={styles.errorText}>{errors.username}</span>}
          </div>

          {/* Full Name Input */}
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Full Name (Optional)
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g., John Doe"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., john@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.email ? '#f99' : '#e0e0e0',
              }}
              disabled={isLoading}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars with uppercase, lowercase, number"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingRight: '2.5rem',
                  borderColor: errors.password ? '#f99' : '#e0e0e0',
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Confirm Password Input */}
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.confirmPassword ? '#f99' : '#e0e0e0',
              }}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>Already have an account?</span>
        </div>

        {/* Login Link */}
        <Link to="/login" style={styles.loginLink}>
          Sign in instead
        </Link>
      </div>

      {/* Decorative Elements */}
      <div style={styles.decorLeft}></div>
      <div style={styles.decorRight}></div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },

  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '460px',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 0.5rem 0',
  },

  subtitle: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
  },

  input: {
    padding: '0.75rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    outlineStyle: 'none',
  },

  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  togglePassword: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },

  errorBox: {
    background: '#fee',
    border: '2px solid #fcc',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#c33',
    fontSize: '0.9rem',
    fontWeight: '500',
  },

  errorText: {
    fontSize: '0.8rem',
    color: '#c33',
    fontWeight: '500',
  },

  button: {
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },

  divider: {
    textAlign: 'center',
    margin: '1.5rem 0',
    fontSize: '0.85rem',
    color: '#999',
  },

  dividerText: {
    background: 'white',
    padding: '0 0.5rem',
  },

  loginLink: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem 1rem',
    background: '#f5f5f5',
    color: '#f5576c',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },

  decorLeft: {
    position: 'absolute',
    left: '-100px',
    top: '-100px',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0,
  },

  decorRight: {
    position: 'absolute',
    right: '-100px',
    bottom: '-100px',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 0,
  },
};

export default RegisterPage;
