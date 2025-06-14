import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeBadge } from '../common/TypeBadge';
import { FavoriteButton } from '../common/FavoriteButton';
import { usePokemon } from '../../hooks/usePokemon';
import { formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';

interface PokemonListItemProps {
  pokemon: {
    name: string;
    url: string;
  };
  exitingPokemonIds?: Set<number>;
  onAnimationEnd?: (id: number) => void;
  onUnfavorite?: (id: number) => void;
}

export const PokemonListItem: React.FC<PokemonListItemProps> = ({ 
  pokemon, 
  exitingPokemonIds,
  onAnimationEnd,
  onUnfavorite
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const pokemonId = extractIdFromUrl(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  // Fetch Pokemon data to get types and stats
  const { data: pokemonData, isLoading: typesLoading } = usePokemon(pokemonId);

  // Check if this Pokemon is currently exiting
  const isExiting = exitingPokemonIds?.has(pokemonId) || false;

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only handle the opacity transition on the wrapper div
    if (e.propertyName === 'opacity' && isExiting && onAnimationEnd) {
      onAnimationEnd(pokemonId);
    }
  };

  const handleUnfavoriteClick = () => {
    if (onUnfavorite) {
      onUnfavorite(pokemonId);
    }
  };

  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 hover:shadow-md hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <Link 
        to={`/pokemon/${pokemonId}`}
        className="block p-4"
        aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
      >
        <div className="flex items-center gap-4">
          {/* Pokemon Image */}
          <div className="relative flex-shrink-0 w-16 h-16">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-background-neutral-muted dark:bg-gray-700 rounded-lg animate-pulse"></div>
            )}
            
            {!imageError ? (
              <img
                src={imageUrl}
                alt={formatPokemonName(pokemon.name)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  // Try fallback image
                  const img = new Image();
                  img.onload = () => setImageLoaded(true);
                  img.src = fallbackImageUrl;
                }}
                loading="lazy"
              />
            ) : (
              <img
                src={fallbackImageUrl}
                alt={formatPokemonName(pokemon.name)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            )}
          </div>

          {/* Pokemon Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {formatPokemonName(pokemon.name)}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                #{pokemonId.toString().padStart(3, '0')}
              </span>
            </div>

            {/* Types */}
            <div className="flex gap-1 min-h-[24px]">
              {typesLoading ? (
                // Loading skeleton for types
                <>
                  <div className="w-16 h-6 bg-background-neutral-muted dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-16 h-6 bg-background-neutral-muted dark:bg-gray-700 rounded-full animate-pulse"></div>
                </>
              ) : pokemonData?.types ? (
                // Actual types
                pokemonData.types.map((type) => (
                  <TypeBadge 
                    key={type.type.name} 
                    type={type.type.name} 
                    size="sm"
                  />
                ))
              ) : (
                // Fallback if no types available
                <div className="w-16 h-6 bg-background-neutral-muted dark:bg-gray-700 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Stats Preview */}
          {pokemonData?.stats && (
            <div className="hidden lg:block text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Stats</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {pokemonData.stats.reduce((sum: number, stat) => sum + stat.base_stat, 0)}
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <div className="flex-shrink-0 group-hover:opacity-100 transition-opacity duration-200">
            <FavoriteButton 
              pokemon={pokemon} 
              size="sm" 
              variant="minimal"
              showTooltip={false}
              onUnfavorite={handleUnfavoriteClick}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};