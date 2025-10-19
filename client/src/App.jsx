import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ToastContainer from './components/common/Toast'
import HomePage from './pages/HomePage'
import PostDetailPage from './pages/PostDetailPage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import MyPostsPage from './pages/MyPostsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminPostsPage from './pages/admin/AdminPostsPage'

/**
 * AppContent Component
 * Main app content with routes
 * Separated from App to use AuthContext
 */
function AppContent() {
  const { user, logout, isLoading } = useAuth()

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
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Modern Header - Vercel Style */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-900 hover:text-primary-600 transition-colors"
              >
                <span className="text-2xl">✍️</span>
                <span className="text-xl font-bold">Mini Blog</span>
              </Link>

              {/* Navigation */}
              <div className="flex items-center gap-6">
                {user ? (
                  <>
                    <Link
                      to="/"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to={`/my-posts/${user.id}`}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      My Posts
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors font-semibold flex items-center gap-1"
                      >
                        <span>⚙️</span>
                        Admin
                      </Link>
                    )}
                    <Link
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(user.full_name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">{user.full_name || user.username}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 hover:shadow-medium transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Post routes - specific routes first */}
            <Route
              path="/posts/create"
              element={
                <PrivateRoute>
                  <CreatePostPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <PrivateRoute>
                  <EditPostPage />
                </PrivateRoute>
              }
            />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            
            {/* Profile routes - specific routes first */}
            <Route
              path="/profile/:userId/edit"
              element={
                <PrivateRoute>
                  <EditProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId/password"
              element={
                <PrivateRoute>
                  <ChangePasswordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            
            {/* My Posts route */}
            <Route
              path="/my-posts/:userId"
              element={
                <PrivateRoute>
                  <MyPostsPage />
                </PrivateRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <AdminRoute>
                  <AdminPostsPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        {/* Modern Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-600">
              &copy; 2025 <span className="font-semibold">Mini Blog System</span>.
            </p>
          </div>
        </footer>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </Router>
  )
}

/**
 * App Component
 * Wraps the app with AuthProvider and ToastProvider
 */
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
