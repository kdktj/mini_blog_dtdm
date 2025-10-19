import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserPosts } from '../api/users';
import { deletePost } from '../api/posts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { PostListSkeleton } from '../components/skeletons/PostSkeleton';

export default function MyPostsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [status, setStatus] = useState('all');

  const isOwnProfile = currentUser?.id === parseInt(userId);

  useEffect(() => {
    fetchPosts(1);
  }, [userId, status]);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await getUserPosts(userId, pageNum, 10, status === 'all' ? 'published' : status);
      setPosts(response.data);
      setPage(pageNum);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch posts';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    try {
      setDeleting(postId);
      await deletePost(postId);
      success('Post deleted successfully');
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      showError(err.message || 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleBack = () => {
    navigate(`/profile/${userId}`);
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
    <div className="main-content">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Button onClick={handleBack} variant="secondary" className="btn-sm">
          ← Back to Profile
        </Button>
        {isOwnProfile && (
          <Button onClick={handleCreatePost} variant="primary">
            ✨ Create New Post
          </Button>
        )}
      </div>

      {/* Page Title */}
      <div className="content-section" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>📝 My Posts</h2>
        <p style={{ color: '#999', margin: 0 }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''} published
        </p>
      </div>

      {/* Status Filter (if own profile) */}
      {isOwnProfile && (
        <Card style={{ marginBottom: '2rem', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => setStatus('all')}
              variant={status === 'all' ? 'primary' : 'secondary'}
              className="btn-sm"
            >
              All Posts
            </Button>
            <Button
              onClick={() => setStatus('published')}
              variant={status === 'published' ? 'primary' : 'secondary'}
              className="btn-sm"
            >
              Published
            </Button>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <PostListSkeleton count={3} />
      ) : posts.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '1rem' }}>
              No posts found.
            </p>
            {isOwnProfile && (
              <Button onClick={handleCreatePost} variant="primary">
                ✨ Create Your First Post
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Posts List */}
          <div className="posts-grid">
            {posts.map((post) => (
              <Card key={post.id} className="post-item">
                <div
                  onClick={() => handleViewPost(post.id)}
                  style={{ cursor: 'pointer', marginBottom: '1rem' }}
                >
                  <h3 className="post-title">{post.title}</h3>

                  <p className="post-meta">
                    {post.status === 'draft' && '📌 Draft • '}
                    Published on {formatDate(post.created_at)}
                  </p>

                  <p className="post-excerpt">{truncate(post.excerpt || post.content, 200)}</p>

                  <div className="post-stats">
                    <div className="stat">
                      <span>👁️ {post.views_count || 0} views</span>
                    </div>
                    <div className="stat">
                      <span>❤️ {post.like_count || 0} likes</span>
                    </div>
                    <div className="stat">
                      <span>💬 {post.comment_count || 0} comments</span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <Button
                      onClick={() => handleViewPost(post.id)}
                      variant="primary"
                      className="btn-sm"
                    >
                      👁️ View
                    </Button>
                    <Button
                      onClick={() => handleEdit(post.id)}
                      variant="secondary"
                      className="btn-sm"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id, post.title)}
                      variant="danger"
                      className="btn-sm"
                      disabled={deleting === post.id}
                    >
                      {deleting === post.id ? '⏳ Deleting...' : '🗑️ Delete'}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                onClick={() => fetchPosts(page - 1)}
                disabled={page === 1}
                variant="secondary"
                className="btn-sm"
              >
                ← Previous
              </Button>

              <span style={{ alignSelf: 'center', padding: '0.5rem 1rem' }}>
                Page {page} of {totalPages}
              </span>

              <Button
                onClick={() => fetchPosts(page + 1)}
                disabled={page >= totalPages}
                variant="secondary"
                className="btn-sm"
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
