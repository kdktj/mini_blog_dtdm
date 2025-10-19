import { useState } from 'react';
import Button from '../common/Button';
import CommentForm from './CommentForm';

export default function CommentItem({
  comment,
  currentUser,
  onUpdate,
  onDelete,
  onReply,
  replies = [],
  loading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUser?.id === comment.User?.id;

  const handleEdit = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      await onUpdate(comment.id, { content: editContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleReply = async (data) => {
    try {
      await onReply(comment.id, data);
      setIsReplying(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className="comment-item"
      style={{
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '6px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e8e8e8',
      }}
    >
      {/* Comment Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {comment.User?.avatar_url && (
            <img
              src={comment.User.avatar_url}
              alt={comment.User.username}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>
              {comment.User?.full_name || comment.User?.username}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#999' }}>
              @{comment.User?.username} · {formatDate(comment.created_at)}
            </div>
          </div>
        </div>

        {isAuthor && !isEditing && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <Button
              onClick={() => setIsEditing(true)}
              variant="text"
              className="btn-xs"
              style={{ color: '#666', padding: '0.25rem 0.5rem' }}
            >
              ✏️
            </Button>
            <Button
              onClick={() => onDelete(comment.id)}
              variant="text"
              className="btn-xs"
              style={{ color: '#d32f2f', padding: '0.25rem 0.5rem' }}
            >
              🗑️
            </Button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength="1000"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              marginBottom: '0.5rem',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={handleEdit}
              variant="primary"
              className="btn-sm"
              disabled={loading}
            >
              {loading ? '💾 Saving...' : '💾 Save'}
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              variant="secondary"
              className="btn-sm"
              disabled={loading}
            >
              ❌ Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            marginBottom: '1rem',
            color: '#333',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {comment.content}
        </div>
      )}

      {/* Comment Actions */}
      {!isEditing && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button
            onClick={() => setIsReplying(!isReplying)}
            variant="text"
            className="btn-xs"
            style={{ color: '#666', fontSize: '0.9rem' }}
          >
            💬 Reply
          </Button>
        </div>
      )}

      {/* Reply Form */}
      {isReplying && (
        <div
          style={{
            marginBottom: '1rem',
            paddingLeft: '1rem',
            borderLeft: '2px solid #ddd',
          }}
        >
          <CommentForm onSubmit={handleReply} loading={loading} isReply={true} />
        </div>
      )}

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            paddingLeft: '1rem',
            borderLeft: '2px solid #e8e8e8',
          }}
        >
          {replies.map((reply) => (
            <div key={reply.id} style={{ marginBottom: '0.75rem' }}>
              <CommentItem
                comment={reply}
                currentUser={currentUser}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onReply={onReply}
                loading={loading}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
