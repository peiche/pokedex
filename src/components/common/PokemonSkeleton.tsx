import React from 'react';

interface PokemonSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
  className?: string;
}

export const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="animate-pulse">
          {/* Pokemon Image Skeleton */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
            {/* Hidden ability indicator skeleton */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>

          {/* Pokemon Info Skeleton */}
          <div className="text-center space-y-3">
            {/* Name skeleton */}
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] mx-auto w-3/4"></div>
            
            {/* ID skeleton */}
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] mx-auto w-16"></div>
            
            {/* Type badges skeleton */}
            <div className="flex justify-center gap-1 mb-2">
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            {/* Ability type badge skeleton */}
            <div className="flex justify-center">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PokemonListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            {/* Pokemon Image Skeleton */}
            <div className="relative flex-shrink-0 w-16 h-16">
              <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
              {/* Hidden ability indicator skeleton */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>

            {/* Pokemon Info Skeleton */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                {/* Name skeleton */}
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-32"></div>
                {/* ID skeleton */}
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-12"></div>
              </div>

              <div className="flex items-center gap-3">
                {/* Types skeleton */}
                <div className="flex gap-1">
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                </div>

                {/* Ability type skeleton */}
                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
              </div>
            </div>

            {/* Stats Preview Skeleton (hidden on smaller screens) */}
            <div className="hidden lg:block text-right space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-16"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PokemonSkeleton: React.FC<PokemonSkeletonProps> = ({ 
  viewMode = 'grid', 
  count = 12,
  className = ''
}) => {
  if (viewMode === 'list') {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label="Loading Pokémon">
        {Array.from({ length: count }, (_, i) => (
          <PokemonListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}
      role="status" 
      aria-label="Loading Pokémon"
    >
      {Array.from({ length: count }, (_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Specialized skeleton for ability detail page
export const AbilityPokemonSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ 
  viewMode = 'grid' 
}) => {
  return (
    <div className="space-y-6">
      {/* Loading message */}
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          Loading Pokémon with this ability...
        </span>
      </div>
      
      {/* Skeleton grid/list */}
      <PokemonSkeleton viewMode={viewMode} count={8} />
    </div>
  );
};