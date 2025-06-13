import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeBadge } from '../common/TypeBadge';
import { usePokemon } from '../../hooks/usePokemon';
import { formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';

interface PokemonListItemProps {
  pokemon: {
    name: string;
    url: string;
  };
}

export const PokemonListItem: React.FC<PokemonListItemProps> = ({ pokemon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const pokemonId = extractIdFromUrl(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  // Fetch Pokemon data to get types and stats
  const { data: pokemonData, isLoading: typesLoading } = usePokemon(pokemonId);

  return (
    <Link 
      to={`/pokemon/${pokemonId}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 hover:shadow-md hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-200"
      aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Pokemon Image */}
          <div className="relative flex-shrink-0 w-16 h-16">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
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
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
        </div>
      </div>
    </Link>
  );
};