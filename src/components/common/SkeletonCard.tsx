import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 p-6">
      <div className="animate-pulse">
        {/* Image skeleton */}
        <div className="w-32 h-32 mx-auto bg-background-neutral-muted dark:bg-gray-700 rounded-lg mb-4"></div>
        
        {/* Name skeleton */}
        <div className="h-6 bg-background-neutral-muted dark:bg-gray-700 rounded mb-2"></div>
        
        {/* ID skeleton */}
        <div className="h-4 bg-background-neutral-muted dark:bg-gray-700 rounded w-16 mx-auto mb-4"></div>
        
        {/* Type badges skeleton */}
        <div className="flex justify-center gap-2">
          <div className="h-6 w-16 bg-background-neutral-muted dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-background-neutral-muted dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};