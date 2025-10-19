import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * If user is not authenticated, redirects to login page with toast notification
 *
 * Usage:
 * <Route
 *   path="/protected"
 *   element={
 *     <PrivateRoute>
 *       <ProtectedComponent />
 *     </PrivateRoute>
 *   }
 * />
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { warning } = useToast();

  // Show warning when redirecting unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      warning('🔐 You need to login to access this page');
    }
  }, [isLoading, isAuthenticated, warning]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="form-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;
