import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

export default function CommentForm({ onSubmit, loading = false, isReply = false }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit({ content: content.trim() });
      setContent(''); // Clear input after successful submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const isFormValid = content.trim().length > 0 && content.length <= 1000;

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? 'Write a reply...' : 'Write a comment...'}
          maxLength="1000"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
        />
        <div
          style={{
            fontSize: '0.85rem',
            color: '#999',
            marginTop: '0.25rem',
            textAlign: 'right',
          }}
        >
          {content.length}/1000
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || loading}
          className="btn-sm"
        >
          {loading ? '📤 Sending...' : '📤 Send'}
        </Button>
      </div>
    </form>
  );
}
