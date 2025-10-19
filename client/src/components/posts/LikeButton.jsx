import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { toggleLike, checkLikeStatus } from '../../api/likes';

/**
 * Modern LikeButton with Animation
 * Design System: Heart animation like Medium/Linear
 */
export default function LikeButton({ postId, initialLikeCount = 0, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    if (currentUser?.id) {
      checkCurrentUserLike();
    }
  }, [postId, currentUser?.id]);

  const checkCurrentUserLike = async () => {
    try {
      const response = await checkLikeStatus(postId);
      setLiked(response.data?.liked || false);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser?.id) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      // Optimistic update
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;
      setLiked(newLiked);
      setLikeCount(newCount);
      
      // Trigger animation
      if (newLiked) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }

      // Call API
      const response = await toggleLike(postId);
      // Update with actual values from server
      setLiked(response.data?.liked || false);
      setLikeCount(response.data?.like_count || 0);
      showSuccess(newLiked ? '❤️ You liked this post!' : '👍 Like removed');
    } catch (error) {
      console.error('Error toggling like:', error);
      showError('Failed to update like');
      // Revert optimistic update on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${liked 
          ? 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border-2 border-red-200' 
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border-2 border-gray-200'
        }
        hover:scale-105 active:scale-95
      `}
    >
      <span 
        className={`text-xl ${isAnimating ? 'animate-ping absolute' : ''}`}
        style={{ 
          display: 'inline-block',
          transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="ml-1 text-sm font-semibold">
        {likeCount}
      </span>
    </button>
  );
}
