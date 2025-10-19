import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminStats } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

/**
 * AdminDashboard Component
 * Shows statistics and overview
 */
function AdminDashboard() {
  const [stats, setStats] = useState({
    data: {
      users: { total: 0, admins: 0, banned: 0 },
      posts: { total: 0, published: 0, draft: 0 },
      comments: 0,
      likes: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats();
        console.log('Stats response:', response);
        setStats(response.data ? { data: response.data } : stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        showToast('Failed to load statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative w-12 h-12 mb-4 mx-auto">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ icon, label, value, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      red: 'bg-red-50 border-red-200',
    };

    return (
      <div className={`${colorClasses[color]} border rounded-lg p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="👥"
            label="Total Users"
            value={stats?.data?.users?.total || 0}
            color="blue"
          />
          <StatCard
            icon="🔐"
            label="Admin Users"
            value={stats?.data?.users?.admins || 0}
            color="purple"
          />
          <StatCard
            icon="🚫"
            label="Banned Users"
            value={stats?.data?.users?.banned || 0}
            color="red"
          />
          <StatCard
            icon="📝"
            label="Total Posts"
            value={stats?.data?.posts?.total || 0}
            color="green"
          />
        </div>

        {/* Posts & Comments Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Published Posts</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.data?.posts?.published || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Ready for readers
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Draft Posts</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.data?.posts?.draft || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Work in progress
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Comments</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.data?.comments || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Community engagement
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
            >
              <p className="text-2xl mb-2">👥</p>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </a>
            <a
              href="/admin/posts"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
            >
              <p className="text-2xl mb-2">📝</p>
              <p className="font-medium text-gray-900">Manage Posts</p>
              <p className="text-sm text-gray-600">View and manage all posts</p>
            </a>
            <a
              href="/"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
            >
              <p className="text-2xl mb-2">🏠</p>
              <p className="font-medium text-gray-900">Back to Home</p>
              <p className="text-sm text-gray-600">Return to main site</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
