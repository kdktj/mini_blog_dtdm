import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAllPosts,
  deletePost,
  hidePost,
  publishPost,
} from '../../api/admin';
import { useToast } from '../../context/ToastContext';

/**
 * AdminPostsPage Component
 * Manage all posts - delete, publish, hide
 */
function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const { showToast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts(page, 20, statusFilter, search);
      setPosts(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error loading posts:', error);
      showToast('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, statusFilter, search]);

  const handleDeletePost = async (postId, title) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      try {
        setDeleting(postId);
        await deletePost(postId);
        showToast('Post deleted successfully', 'success');
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        showToast(error.message || 'Failed to delete post', 'error');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleToggleStatus = async (postId, currentStatus, title) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'published' : 'hidden';

    try {
      setUpdating(postId);
      if (newStatus === 'published') {
        await publishPost(postId);
      } else {
        await hidePost(postId);
      }
      showToast(`Post ${action} successfully`, 'success');
      loadPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      showToast(error.message || 'Failed to update post status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-2">Manage all posts on the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-12 h-12 mb-4 mx-auto">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          {post.excerpt && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {post.User?.full_name || post.User?.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {post.user_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-gray-900 font-medium">
                          {post.views_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                post.id,
                                post.status,
                                post.title
                              )
                            }
                            disabled={updating === post.id}
                            className={`p-2 rounded transition-colors ${
                              post.status === 'published'
                                ? 'hover:bg-yellow-50 text-yellow-600'
                                : 'hover:bg-green-50 text-green-600'
                            } disabled:opacity-50`}
                            title={
                              post.status === 'published'
                                ? 'Hide post'
                                : 'Publish post'
                            }
                          >
                            {updating === post.id
                              ? '⏳'
                              : post.status === 'published'
                              ? '👁️'
                              : '👁️‍🗨️'}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeletePost(post.id, post.title)
                            }
                            disabled={deleting === post.id}
                            className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors disabled:opacity-50"
                            title="Delete post"
                          >
                            {deleting === post.id ? '⏳' : '🗑️'}
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
            <li>👁️ - Hide published post | 👁️‍🗨️ - Publish draft post</li>
            <li>🗑️ - Delete post</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPostsPage;
