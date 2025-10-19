import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Toast Context
 * Manages global toast notifications
 */
const ToastContext = createContext(null);

/**
 * Toast Types
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * ToastProvider Component
 * Wraps the app to provide toast context
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration to show toast in ms (0 = permanent)
   */
  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after duration (unless duration is 0)
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Remove specific toast
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Remove all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Convenience methods
   */
  const success = useCallback(
    (message, duration = 3000) =>
      showToast(message, TOAST_TYPES.SUCCESS, duration),
    [showToast]
  );

  const error = useCallback(
    (message, duration = 4000) =>
      showToast(message, TOAST_TYPES.ERROR, duration),
    [showToast]
  );

  const warning = useCallback(
    (message, duration = 3500) =>
      showToast(message, TOAST_TYPES.WARNING, duration),
    [showToast]
  );

  const info = useCallback(
    (message, duration = 3000) =>
      showToast(message, TOAST_TYPES.INFO, duration),
    [showToast]
  );

  const value = {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * useToast Hook
 * Custom hook to use toast context
 * Usage: const { success, error } = useToast();
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastContext;
