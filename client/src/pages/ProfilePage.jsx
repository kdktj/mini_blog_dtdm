import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUser } from '../api/users';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { success, error: showError } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await getUser(userId);
      setUser(userData);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch user';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPosts = () => {
    navigate(`/my-posts/${userId}`);
  };

  const handleEditProfile = () => {
    navigate(`/profile/${userId}/edit`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <Button onClick={handleBack} variant="primary">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="main-content">
        <Card>
          <p style={{ textAlign: 'center', color: '#999', marginBottom: '1.5rem' }}>
            User not found
          </p>
          <Button onClick={handleBack} variant="primary">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;
  const joinedDate = formatDate(user.created_at);

  return (
    <div className="main-content">
      {/* Back Button */}
      <Button
        onClick={handleBack}
        variant="secondary"
        className="btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back
      </Button>

      {/* Profile Card */}
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Profile Info */}
          <div>
            {/* Avatar */}
            <div
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                '👤'
              )}
            </div>

            {/* User Info */}
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#333' }}>
              {user.full_name || user.username}
            </h1>
            <p style={{ margin: '0 0 0.5rem 0', color: '#999', fontSize: '1.1rem' }}>
              @{user.username}
            </p>

            {user.bio && (
              <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '1rem', lineHeight: 1.5 }}>
                {user.bio}
              </p>
            )}

            <p style={{ margin: '0.75rem 0 0 0', color: '#999', fontSize: '0.9rem' }}>
              📅 Joined {joinedDate}
            </p>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button onClick={handleEditProfile} variant="primary">
                ✏️ Edit Profile
              </Button>
              <Button
                onClick={() => navigate(`/profile/${userId}/password`)}
                variant="secondary"
              >
                🔐 Change Password
              </Button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            padding: '1.5rem 0',
            borderTop: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '2rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#667eea',
                marginBottom: '0.25rem',
              }}
            >
              {user.post_count || 0}
            </div>
            <div style={{ color: '#999', fontSize: '0.9rem' }}>Published Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#764ba2',
                marginBottom: '0.25rem',
              }}
            >
              {user.email}
            </div>
            <div style={{ color: '#999', fontSize: '0.9rem' }}>Email</div>
          </div>
        </div>

        {/* Recent Posts Section */}
        {user.recent_posts && user.recent_posts.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: '#333' }}>
              📝 Recent Posts
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              {user.recent_posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f0f0f0';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f9f9f9';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {post.title}
                  </h4>
                  <p
                    style={{
                      margin: '0',
                      color: '#666',
                      fontSize: '0.9rem',
                      display: 'flex',
                      gap: '1rem',
                    }}
                  >
                    <span>
                      📅{' '}
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>👁️ {post.views_count || 0} views</span>
                  </p>
                </div>
              ))}
            </div>

            <Button onClick={handleViewPosts} variant="primary">
              View All Posts ({user.post_count || 0})
            </Button>
          </div>
        )}

        {(!user.recent_posts || user.recent_posts.length === 0) && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#999' }}>
            <p>No posts yet. {isOwnProfile && 'Start writing your first post!'}</p>
            {isOwnProfile && (
              <Button
                onClick={() => navigate('/posts/create')}
                variant="primary"
                style={{ marginTop: '1rem' }}
              >
                ✨ Create First Post
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
