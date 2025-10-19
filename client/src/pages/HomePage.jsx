import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getPosts } from '../api/posts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { PostListSkeleton } from '../components/skeletons/PostSkeleton';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const fetchPosts = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await getPosts(pageNum, 10, 'published', 'latest', searchQuery);
      setPosts(response.data);
      setPage(pageNum);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch posts';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(1, search);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleCreatePost = () => {
    navigate('/posts/create');
  };

  const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to Mini Blog
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <Button onClick={handleCreatePost} variant="primary" size="lg">
          ✨ Start Writing
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search posts by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <Button type="submit" variant="primary">
              🔍 Search
            </Button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Content Section */}
      {loading ? (
        <PostListSkeleton count={3} />
      ) : posts.length === 0 ? (
        <Card className="max-w-2xl mx-auto text-center" padding="lg">
          <div className="py-8">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {search 
                ? 'Try adjusting your search terms' 
                : 'Be the first to share your thoughts with the world!'}
            </p>
            {!search && (
              <Button onClick={handleCreatePost} variant="primary" size="lg">
                Create Your First Post
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="space-y-6 mb-12">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                hover 
                onClick={() => handlePostClick(post.id)}
                className="transition-all duration-200"
              >
                {/* Post Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {post.status === 'draft' && '📌 Draft • '}
                      {formatDate(post.created_at)}
                    </span>
                    {post.User && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(post.User.full_name || post.User.username).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-700">
                          {post.User.full_name || post.User.username}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Excerpt */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {truncate(post.excerpt || post.content, 200)}
                </p>

                {/* Post Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span>👁️</span>
                    <span>{post.views_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>❤️</span>
                    <span>{post.like_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>💬</span>
                    <span>{post.comment_count || 0}</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => fetchPosts(page - 1, search)}
                disabled={page === 1}
                variant="secondary"
                size="sm"
              >
                ← Previous
              </Button>

              <span className="text-sm text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                onClick={() => fetchPosts(page + 1, search)}
                disabled={page >= totalPages}
                variant="secondary"
                size="sm"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
