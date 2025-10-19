import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUser, updateProfile } from '../api/users';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';

export default function EditProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    // Check if user is editing their own profile
    if (currentUser?.id !== parseInt(userId)) {
      showError('You can only edit your own profile');
      navigate(`/profile/${userId}`);
      return;
    }
    
    fetchUser();
  }, [userId, currentUser?.id, navigate]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await getUser(userId);
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        bio: userData.bio || '',
        avatar_url: userData.avatar_url || '',
      });
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch user';
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

    try {
      setSaving(true);
      await updateProfile(userId, {
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
      });
      showSuccess('✅ Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to update profile';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="main-content">
        <Card>
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <strong>Error:</strong> {error}
          </div>
          <Button onClick={handleCancel} variant="primary">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 className="form-title">✏️ Edit Profile</h2>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar URL Preview */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
                margin: '0 auto 1rem',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                overflow: 'hidden',
              }}
            >
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                '👤'
              )}
            </div>
            <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>
              Avatar preview
            </p>
          </div>

          {/* Full Name Input */}
          <Input
            label="Full Name"
            type="text"
            name="full_name"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          {/* Bio Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Bio
            </label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
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
            <p style={{ fontSize: '0.85rem', color: '#999', margin: '0.25rem 0 0 0' }}>
              Maximum 500 characters
            </p>
          </div>

          {/* Avatar URL Input */}
          <Input
            label="Avatar URL"
            type="url"
            name="avatar_url"
            placeholder="https://example.com/avatar.jpg"
            value={formData.avatar_url}
            onChange={handleChange}
          />
         

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
