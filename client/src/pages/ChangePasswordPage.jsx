import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { changePassword } from '../api/users';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function ChangePasswordPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Check if user is changing their own password
  if (currentUser?.id !== parseInt(userId)) {
    return (
      <div className="main-content">
        <Card>
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <strong>Error:</strong> You can only change your own password
          </div>
          <Button onClick={() => navigate(`/profile/${userId}`)} variant="primary">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

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
    if (!formData.current_password.trim()) {
      const msg = 'Current password is required';
      setError(msg);
      showError(msg);
      return;
    }

    if (!formData.new_password.trim()) {
      const msg = 'New password is required';
      setError(msg);
      showError(msg);
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      const msg = 'New passwords do not match';
      setError(msg);
      showError(msg);
      return;
    }

    if (formData.new_password.length < 8) {
      const msg = 'Password must be at least 8 characters';
      setError(msg);
      showError(msg);
      return;
    }

    try {
      setLoading(true);
      await changePassword(userId, {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      showSuccess('✅ Password changed successfully!');
      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to change password';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="main-content">
      <div className="form-container" style={{ maxWidth: '500px' }}>
        <h2 className="form-title">🔐 Change Password</h2>

        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Enter your current password and then choose a new one.
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <Input
            label="Current Password"
            type="password"
            name="current_password"
            placeholder="Enter your current password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />

          {/* New Password */}
          <Input
            label="New Password"
            type="password"
            name="new_password"
            placeholder="Enter a new password (min 8 characters)"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
          <p style={{ fontSize: '0.85rem', color: '#999', margin: '-1rem 0 1.5rem 0' }}>
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>

          {/* Confirm Password */}
          <Input
            label="Confirm New Password"
            type="password"
            name="confirm_password"
            placeholder="Confirm your new password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

          {/* Form Actions */}
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? '⏳ Changing...' : '✅ Change Password'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
