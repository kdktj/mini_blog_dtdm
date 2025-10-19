import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getPostById, updatePost } from '../api/posts';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPostById(id);
      setPost(response.data);

      // Check if user is post author
      if (response.data.User?.id !== currentUser.id) {
        showError('You can only edit your own posts');
        navigate(`/posts/${id}`);
        return;
      }

      setFormData({
        title: response.data.title || '',
        content: response.data.content || '',
        excerpt: response.data.excerpt || '',
        featured_image: response.data.featured_image || '',
        status: response.data.status || 'draft',
      });
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch post';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      const msg = 'Title is required';
      setError(msg);
      showError(msg);
      return;
    }

    if (!formData.content.trim()) {
      const msg = 'Content is required';
      setError(msg);
      showError(msg);
      return;
    }

    if (formData.title.length > 255) {
      const msg = 'Title must be less than 255 characters';
      setError(msg);
      showError(msg);
      return;
    }

    try {
      setSaving(true);
      await updatePost(id, formData);
      showSuccess('✅ Post updated successfully!');
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to update post';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  if (loading) {
    return <Loading message="Loading post..." />;
  }

  if (error && !post) {
    return (
      <div className="main-content">
        <div className="form-container">
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <strong>Error:</strong> {error}
          </div>
          <Button onClick={handleCancel} variant="primary">
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="main-content">
        <div className="form-container">
          <p style={{ textAlign: 'center', color: '#999' }}>Post not found</p>
          <Button onClick={() => navigate('/')} variant="primary">
            ← Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = currentUser.id === post.User?.id;

  if (!isAuthor) {
    return (
      <div className="main-content">
        <div className="form-container">
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <strong>Error:</strong> You can only edit your own posts
          </div>
          <Button onClick={() => navigate(`/posts/${id}`)} variant="primary">
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="form-container">
        <h2 className="form-title">✏️ Edit Post</h2>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <Input
            label="Post Title"
            type="text"
            placeholder="Enter post title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          {/* Featured Image Input */}
          <Input
            label="Featured Image URL (Optional)"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.featured_image}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
          />

          {/* Content Textarea */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Post Content
            </label>
            <textarea
              placeholder="Write your post content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '300px',
              }}
              required
            />
          </div>

          {/* Excerpt Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Excerpt (Optional)
            </label>
            <textarea
              placeholder="Short summary of your post..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '100px',
              }}
            />
          </div>

          {/* Status Select */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              <option value="draft">📌 Draft (Only you can see)</option>
              <option value="published">🌐 Published (Public)</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
