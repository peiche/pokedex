import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { extractIdFromUrl } from '../../utils/pokemon';

interface FavoriteButtonProps {
  pokemon: {
    name: string;
    url: string;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'overlay' | 'minimal';
  className?: string;
  showTooltip?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  pokemon,
  size = 'md',
  variant = 'default',
  className = '',
  showTooltip = true
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const pokemonId = extractIdFromUrl(pokemon.url);
  const favorited = isFavorite(pokemonId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    toggleFavorite({
      id: pokemonId,
      name: pokemon.name,
      url: pokemon.url
    });
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleClick(e as any);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800 
      border border-border-light dark:border-gray-600 
      hover:bg-gray-50 dark:hover:bg-gray-700 
      shadow-sm hover:shadow-md
    `,
    overlay: `
      bg-white/90 dark:bg-gray-800/90 
      backdrop-blur-sm 
      border border-white/20 dark:border-gray-600/20 
      hover:bg-white dark:hover:bg-gray-800
      shadow-lg
    `,
    minimal: `
      bg-transparent 
      hover:bg-gray-100 dark:hover:bg-gray-700
    `
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        group
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        ${className}
      `}
      aria-label={favorited ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
      title={showTooltip ? (favorited ? 'Remove from favorites' : 'Add to favorites') : undefined}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${favorited 
            ? 'text-red-500 fill-red-500 drop-shadow-sm' 
            : 'text-gray-400 dark:text-gray-500 group-hover:text-red-400 dark:group-hover:text-red-400'
          }
          ${isAnimating ? 'scale-125' : ''}
        `}
      />
    </button>
  );
};