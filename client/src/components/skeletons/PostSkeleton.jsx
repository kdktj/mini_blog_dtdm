import React from 'react';

/**
 * PostSkeleton Component
 * Modern loading skeleton with Tailwind CSS
 * Design System: ShadCN UI inspired skeleton
 */
const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft animate-pulse">
      {/* Title skeleton */}
      <div className="h-7 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
      
      {/* Meta info skeleton */}
      <div className="h-4 bg-gray-200 rounded mb-4 w-2/5"></div>
      
      {/* Author skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      
      {/* Content lines */}
      <div className="space-y-2.5 mb-5">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      
      {/* Stats skeleton */}
      <div className="flex gap-6 pt-4 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

/**
 * PostListSkeleton Component
 * Shows multiple post skeletons
 */
export const PostListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
};

export default PostSkeleton;
