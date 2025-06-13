import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeBadge } from '../common/TypeBadge';
import { FavoriteButton } from '../common/FavoriteButton';
import { usePokemon } from '../../hooks/usePokemon';
import { formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
  };
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const pokemonId = extractIdFromUrl(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  // Fetch Pokemon data to get types
  const { data: pokemonData, isLoading: typesLoading } = usePokemon(pokemonId);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 overflow-hidden">
      {/* Favorite Button - Positioned absolutely in top-right corner */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton 
          pokemon={pokemon} 
          size="sm" 
          variant="overlay"
          showTooltip={false}
        />
      </div>

      <Link 
        to={`/pokemon/${pokemonId}`}
        className="block p-6"
        aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
      >
        {/* Pokemon Image */}
        <div className="relative w-32 h-32 mx-auto mb-4">
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
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {formatPokemonName(pokemon.name)}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            #{pokemonId.toString().padStart(3, '0')}
          </p>

          {/* Types */}
          <div className="flex justify-center gap-2 min-h-[24px]">
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
      </Link>
    </div>
  );
};