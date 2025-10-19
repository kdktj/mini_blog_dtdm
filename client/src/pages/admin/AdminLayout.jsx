import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

/**
 * AdminLayout Component
 * Sidebar navigation for admin dashboard
 */
function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: '📊',
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: '👥',
    },
    {
      label: 'Posts',
      path: '/admin/posts',
      icon: '📝',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-900">Admin</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">←</span>
            {sidebarOpen && <span className="text-sm font-medium">Back</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">👨‍💼 Admin</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
