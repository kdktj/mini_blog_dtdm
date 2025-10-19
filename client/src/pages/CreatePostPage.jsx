import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { createPost } from '../api/posts';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setLoading(true);
      const response = await createPost(formData);
      showSuccess('✅ Post created successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create post';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const isAuthor = !!localStorage.getItem('token');

  if (!isAuthor) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg" className="text-center">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">
              <strong>Error:</strong> You must be logged in to create a post.
            </p>
          </div>
          <Button onClick={() => navigate('/login')} variant="primary">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <Input
            label="Post Title"
            type="text"
            placeholder="Write an amazing title..."
            value={formData.title}
            onChange={handleChange}
            name="title"
            required
            error={!formData.title && error.includes('Title') ? error : ''}
            className="text-2xl font-bold"
          />

          {/* Featured Image Input */}
          <Input
            label="Featured Image URL (Optional)"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.featured_image}
            onChange={handleChange}
            name="featured_image"
          />

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Post Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Tell your story..."
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-vertical"
              required
              rows="12"
            />
            {!formData.content && error.includes('Content') && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Excerpt Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Post Excerpt (Optional)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              placeholder="Short summary of your post..."
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-vertical"
              rows="3"
            />
            <p className="text-sm text-gray-500">
              Leave empty to auto-generate from first 500 characters
            </p>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Post Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="draft">📌 Draft (Private)</option>
              <option value="published">📰 Published (Public)</option>
            </select>
            <p className="text-sm text-gray-500">
              Draft posts are private and only visible to you
            </p>
          </div>

          {/* Preview Section */}
          {(formData.title || formData.content) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Preview</h4>
              {formData.title && (
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {formData.title}
                </h3>
              )}
              {(formData.excerpt || formData.content) && (
                <p className="text-gray-700 leading-relaxed">
                  {formData.excerpt || formData.content.substring(0, 200)}
                  {(formData.excerpt || formData.content).length > 200 ? '...' : ''}
                </p>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
              size="lg"
            >
              {loading ? '⏳ Creating...' : '✨ Create Post'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
              size="lg"
            >
              Cancel
            </Button>
          </div>

          {/* Info Tip */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> You can always save as draft and publish later!
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
