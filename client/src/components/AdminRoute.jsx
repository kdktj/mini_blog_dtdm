import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * AdminRoute Component
 * Protects routes that require admin role
 * Checks both authentication and admin role
 *
 * Usage:
 * <Route
 *   path="/admin"
 *   element={
 *     <AdminRoute>
 *       <AdminComponent />
 *     </AdminRoute>
 *   }
 * />
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { showToast } = useToast();

  // Show warning when redirecting non-admin users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showToast('🔐 You need to login to access this page', 'warning');
    }
  }, [isLoading, isAuthenticated, showToast]);

  // Show warning when non-admin tries to access
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.role !== 'admin') {
      showToast('❌ You do not have permission to access this page', 'error');
    }
  }, [isLoading, isAuthenticated, user, showToast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative w-12 h-12 mb-4 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to home
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If admin, render the protected component
  return children;
};

export default AdminRoute;
