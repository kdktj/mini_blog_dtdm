import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getPostById, deletePost } from '../api/posts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import LikeButton from '../components/posts/LikeButton';
import CommentList from '../components/comments/CommentList';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPostById(id);
      setPost(response.data);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch post';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      await deletePost(id);
      success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      showError(err.message || 'Failed to delete post');
      console.error('Error deleting post:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading message="Loading post..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg" className="text-center">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">
              <strong>Error:</strong> {error}
            </p>
          </div>
          <Button onClick={handleBack} variant="primary">
            ← Back to Posts
          </Button>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg text-gray-600 mb-6">Post not found</p>
          <Button onClick={handleBack} variant="primary">
            ← Back to Posts
          </Button>
        </Card>
      </div>
    );
  }

  const isAuthor = currentUser.id === post.User?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        onClick={handleBack} 
        variant="ghost" 
        size="sm" 
        className="mb-6 -ml-2"
      >
        ← Back to Posts
      </Button>

      {/* Main Article Card */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-soft overflow-hidden mb-8">
        {/* Featured Image */}
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-80 object-cover"
          />
        )}

        <div className="p-8 md:p-12">
          {/* Draft Warning */}
          {post.status === 'draft' && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <p className="text-amber-800 text-sm font-medium">
                ⚠️ This is a draft post. Only you can see it.
              </p>
            </div>
          )}

          {/* Post Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author & Meta Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 mb-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* Author Avatar & Info */}
              {post.User && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {(post.User.full_name || post.User.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {post.User.full_name || post.User.username}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>{post.views_count || 0} views</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Button onClick={handleEdit} variant="secondary" size="sm">
                  ✏️ Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  size="sm"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : '🗑️ Delete'}
                </Button>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-8">
            {post.content.split('\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Post Stats & Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-gray-200">
            {/* Like Button */}
            <LikeButton 
              postId={post.id} 
              initialLikeCount={post.like_count || 0}
              currentUser={currentUser}
            />

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <span>💬</span>
                <span>{post.comment_count || 0} comments</span>
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <Card padding="lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>💬</span>
          <span>Comments</span>
        </h2>
        <CommentList postId={post.id} currentUser={currentUser} />
      </Card>
    </div>
  );
}
