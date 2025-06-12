import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeBadge } from '../common/TypeBadge';
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

  return (
    <Link 
      to={`/pokemon/${pokemonId}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
      aria-label={`View details for ${formatPokemonName(pokemon.name)}`}
    >
      <div className="p-6">
        {/* Pokemon Image */}
        <div className="relative w-32 h-32 mx-auto mb-4">
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
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {formatPokemonName(pokemon.name)}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            #{pokemonId.toString().padStart(3, '0')}
          </p>

          {/* Types will be loaded separately for performance */}
          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};