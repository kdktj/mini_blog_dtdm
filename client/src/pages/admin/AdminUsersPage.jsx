import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAllUsers,
  deleteUser,
  promoteUserToAdmin,
  demoteUserFromAdmin,
  banUser,
  unbanUser,
} from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminUsersPage Component
 * Manage all users - delete, promote, ban/unban
 */
function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(page, 20, search);
      setUsers(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleDeleteUser = async (userId, username) => {
    if (userId === currentUser.id) {
      showToast('You cannot delete your own account', 'error');
      return;
    }

    if (confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) {
      try {
        setDeleting(userId);
        await deleteUser(userId);
        showToast(`User ${username} deleted successfully`, 'success');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast(error.message || 'Failed to delete user', 'error');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleToggleRole = async (userId, currentRole, username) => {
    if (userId === currentUser.id) {
      showToast('You cannot change your own role', 'error');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'promoted to' : 'demoted from';

    try {
      if (newRole === 'admin') {
        await promoteUserToAdmin(userId);
      } else {
        await demoteUserFromAdmin(userId);
      }
      showToast(`${username} ${action} admin`, 'success');
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      showToast(error.message || 'Failed to update user role', 'error');
    }
  };

  const handleToggleBan = async (userId, isBanned, username) => {
    const action = isBanned ? 'unbanned' : 'banned';

    try {
      if (isBanned) {
        await unbanUser(userId);
      } else {
        await banUser(userId);
      }
      showToast(`${username} has been ${action}`, 'success');
      loadUsers();
    } catch (error) {
      console.error('Error updating ban status:', error);
      showToast(error.message || 'Failed to update ban status', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all users on the platform</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search by username, email, or full name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-12 h-12 mb-4 mx-auto">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.full_name || user.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            @{user.username}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_banned
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.is_banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {/* Toggle Role Button */}
                          <button
                            onClick={() =>
                              handleToggleRole(
                                user.id,
                                user.role,
                                user.full_name || user.username
                              )
                            }
                            disabled={user.id === currentUser.id}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              user.id === currentUser.id
                                ? 'Cannot change own role'
                                : user.role === 'admin'
                                ? 'Demote from admin'
                                : 'Promote to admin'
                            }
                          >
                            {user.role === 'admin' ? '👤' : '👑'}
                          </button>

                          {/* Toggle Ban Button */}
                          <button
                            onClick={() =>
                              handleToggleBan(
                                user.id,
                                user.is_banned,
                                user.full_name || user.username
                              )
                            }
                            className={`p-2 rounded transition-colors ${
                              user.is_banned
                                ? 'hover:bg-green-50 text-green-600'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                            title={
                              user.is_banned ? 'Unban user' : 'Ban user'
                            }
                          >
                            {user.is_banned ? '✅' : '⛔'}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.full_name || user.username
                              )
                            }
                            disabled={
                              deleting === user.id ||
                              user.id === currentUser.id
                            }
                            className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              user.id === currentUser.id
                                ? 'Cannot delete own account'
                                : 'Delete user'
                            }
                          >
                            {deleting === user.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Legend</p>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>👑 - Promote to admin | 👤 - Demote from admin</li>
            <li>⛔ - Ban user | ✅ - Unban user</li>
            <li>🗑️ - Delete user</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;
