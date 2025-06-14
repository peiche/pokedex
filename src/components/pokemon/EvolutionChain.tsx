import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEvolutionChain, usePokemon } from '../../hooks/usePokemon';
import { formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TypeBadge } from '../common/TypeBadge';
import { FavoriteButton } from '../common/FavoriteButton';
import { PokeAPI } from 'pokeapi-types';

interface EvolutionChainProps {
  speciesUrl: string;
}

interface EvolutionNodeProps {
  species: {
    name: string;
    url: string;
  };
}

const EvolutionNode: React.FC<EvolutionNodeProps> = ({ species }) => {
  const pokemonId = extractIdFromUrl(species.url);
  const { data: pokemon, isLoading } = usePokemon(pokemonId);
  
  if (isLoading) {
    return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="p-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="text-center space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-16"></div>
            <div className="flex justify-center gap-1">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default;

  // Create pokemon object for FavoriteButton
  const pokemonForFavorite = {
    name: species.name,
    url: species.url
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 overflow-hidden">
      {/* Favorite Button - Positioned absolutely in top-right corner */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton 
          pokemon={pokemonForFavorite} 
          size="sm" 
          variant="overlay"
          showTooltip={false}
        />
      </div>

      <Link
        to={`/pokemon/${pokemonId}`}
        className="block p-6"
        aria-label={`View ${formatPokemonName(species.name)}`}
      >
        {/* Pokemon Image */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={formatPokemonName(species.name)}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}
        </div>

        {/* Pokemon Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {formatPokemonName(species.name)}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            #{pokemonId.toString().padStart(3, '0')}
          </p>

          {/* Types */}
          {pokemon.types && (
            <div className="flex justify-center gap-1 min-h-[24px]">
              {pokemon.types.map((type) => (
                <TypeBadge 
                  key={type.type.name} 
                  type={type.type.name} 
                  size="sm"
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export const EvolutionChain: React.FC<EvolutionChainProps> = ({ speciesUrl }) => {
  const speciesId = extractIdFromUrl(speciesUrl);
  const { data: evolutionChain, isLoading, error } = useEvolutionChain(speciesId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading evolution chain..." />
      </div>
    );
  }

  if (error || !evolutionChain) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Evolution chain unavailable
      </div>
    );
  }

  const buildEvolutionTree = (chain: PokeAPI.ChainLink) => {
    const evolutions = [];
    let current = chain;

    while (current) {
      evolutions.push(current.species);
      current = current.evolves_to?.[0]; // Take first evolution path for simplicity
    }

    return evolutions;
  };

  const evolutions = buildEvolutionTree(evolutionChain.chain);

  if (evolutions.length <= 1) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        This Pokémon does not evolve
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Layout - Vertical Stack */}
      <div className="block sm:hidden space-y-4">
        {evolutions.map((species, index) => (
          <React.Fragment key={species.name}>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <EvolutionNode species={species} />
              </div>
            </div>
            {index < evolutions.length - 1 && (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-border-light dark:border-gray-600">
                  <ChevronRight className="w-5 h-5 text-gray-400 transform rotate-90" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop Layout - Horizontal Flow */}
      <div className="hidden sm:flex items-center justify-center flex-wrap gap-4">
        {evolutions.map((species, index) => (
          <React.Fragment key={species.name}>
            <div className="flex-shrink-0">
              <EvolutionNode species={species} />
            </div>
            {index < evolutions.length - 1 && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-border-light dark:border-gray-600">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};