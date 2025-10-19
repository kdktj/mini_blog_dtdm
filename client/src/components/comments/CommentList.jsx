import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { getComments, createComment, updateComment, deleteComment } from '../../api/comments';
import { CommentListSkeleton } from '../skeletons/CommentSkeleton';

export default function CommentList({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId, page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getComments(postId, page);
      setComments(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load comments';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (data) => {
    if (!currentUser?.id) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await createComment(postId, data);
      // Add new comment to the top of the list
      setComments([response.data, ...comments]);
      showSuccess('✅ Comment posted successfully!');
    } catch (err) {
      const errorMsg = err.message || 'Failed to post comment';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, data) => {
    try {
      setSubmitting(true);
      const response = await updateComment(postId, commentId, data);
      // Update comment in list
      setComments(
        comments.map((c) => (c.id === commentId ? response.data : c))
      );
    } catch (err) {
      setError(err.message || 'Failed to update comment');
      console.error('Error updating comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteComment(postId, commentId);
      // Remove comment from list
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      console.error('Error deleting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyComment = async (parentId, data) => {
    if (!currentUser?.id) {
      window.location.href = '/login';
      return;
    }

    try {
      setSubmitting(true);
      const replyData = { ...data, parent_id: parentId };
      const response = await createComment(postId, replyData);

      // Find the parent comment and add reply to its replies
      setComments(
        comments.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), response.data],
            };
          }
          return c;
        })
      );
    } catch (err) {
      setError(err.message || 'Failed to post reply');
      console.error('Error posting reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-list">
      {/* New Comment Form */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e8e8e8',
        }}
      >
        {currentUser?.id ? (
          <>
            <h4 style={{ marginBottom: '1rem', color: '#333', fontSize: '1rem' }}>
              💬 Add your comment
            </h4>
            <CommentForm onSubmit={handleAddComment} loading={submitting} />
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>
              <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Sign in
              </a>{' '}
              to comment
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fde8e8',
            color: '#c41e3a',
            borderRadius: '6px',
            border: '1px solid #f5c6c6',
            fontSize: '0.95rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Comments Count */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#333', fontSize: '1.1rem' }}>
          💬 Comments ({pagination?.total || 0})
        </h3>
      </div>

      {/* Loading State */}
      {loading && <CommentListSkeleton count={2} />}

      {/* No Comments */}
      {!loading && comments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No comments yet. Be the first to comment! 🚀</p>
        </div>
      )}

      {/* Comments List */}
      {!loading && comments.length > 0 && (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReply={handleReplyComment}
              replies={comment.replies || []}
              loading={submitting}
            />
          ))}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '2rem',
              }}
            >
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: page === 1 ? '#f5f5f5' : '#fff',
                  cursor: page === 1 ? 'default' : 'pointer',
                  color: page === 1 ? '#999' : '#333',
                }}
              >
                ← Previous
              </button>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#666',
                  fontSize: '0.9rem',
                }}
              >
                Page {page} of {pagination.pages}
              </div>
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: page === pagination.pages ? '#f5f5f5' : '#fff',
                  cursor: page === pagination.pages ? 'default' : 'pointer',
                  color: page === pagination.pages ? '#999' : '#333',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
