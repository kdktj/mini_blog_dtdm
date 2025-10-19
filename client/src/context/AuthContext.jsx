import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

/**
 * Authentication Context
 * Manages global authentication state and provides auth methods
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app to provide authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists in localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          // Verify token is still valid by fetching user
          try {
            const response = await authApi.getMe();
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } catch (err) {
            // Token is invalid or expired, clear auth
            clearAuth();
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * User Registration
   */
  const register = async (username, email, password, fullName = '') => {
    try {
      setError(null);
      const data = {
        username,
        email,
        password,
        full_name: fullName,
      };

      const response = await authApi.register(data);

      // Save token and user to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update context state
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * User Login
   */
  const login = async (emailOrUsername, password) => {
    try {
      setError(null);
      const data = {
        password,
      };

      // Determine if input is email or username
      if (emailOrUsername.includes('@')) {
        data.email = emailOrUsername;
      } else {
        data.username = emailOrUsername;
      }

      const response = await authApi.login(data);

      // Save token and user to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update context state
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * User Logout
   */
  const logout = () => {
    clearAuth();
  };

  /**
   * Clear authentication state
   */
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to use authentication context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
