import React from 'react';

/**
 * CommentSkeleton Component
 * Loading skeleton for comment display
 */
const CommentSkeleton = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#f9f9f9',
        borderRadius: '6px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      {/* Avatar skeleton */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: '#e0e0e0',
          borderRadius: '50%',
          flexShrink: 0,
        }}
      />

      {/* Comment content skeleton */}
      <div style={{ flex: 1 }}>
        {/* Author and date */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              height: '14px',
              background: '#e0e0e0',
              borderRadius: '6px',
              width: '100px',
            }}
          />
          <div
            style={{
              height: '14px',
              background: '#e0e0e0',
              borderRadius: '6px',
              width: '80px',
            }}
          />
        </div>

        {/* Comment text lines */}
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: '12px',
              background: '#e0e0e0',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              width: i === 2 ? '70%' : '100%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * CommentListSkeleton Component
 * Shows multiple comment skeletons
 */
export const CommentListSkeleton = ({ count = 3 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
};

export default CommentSkeleton;
