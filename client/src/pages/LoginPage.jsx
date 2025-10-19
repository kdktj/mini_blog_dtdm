import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!emailOrUsername.trim()) {
      setError('Please enter email or username');
      return;
    }

    if (!password) {
      setError('Please enter password');
      return;
    }

    setIsLoading(true);

    try {
      await login(emailOrUsername, password);
      navigate('/', { replace: true });
    } catch (err) {
      const errorMsg = err?.error || err?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back 👋</h1>
          <p style={styles.subtitle}>Sign in to your Mini Blog account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Error Message */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Email/Username Input */}
          <div style={styles.formGroup}>
            <label htmlFor="emailOrUsername" style={styles.label}>
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>Don't have an account?</span>
        </div>

        {/* Register Link */}
        <Link to="/register" style={styles.registerLink}>
          Create a new account
        </Link>
      </div>

      {/* Decorative Element */}
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    animation: 'slideUp 0.5s ease-out',
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
    gap: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
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
    transition: 'opacity 0.3s ease',
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

  button: {
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

  registerLink: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem 1rem',
    background: '#f5f5f5',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
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

export default LoginPage;
