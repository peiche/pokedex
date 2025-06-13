import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEvolutionChain, usePokemon } from '../../hooks/usePokemon';
import { formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';
import { LoadingSpinner } from '../common/LoadingSpinner';
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
      <div className="flex flex-col items-center p-4">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!pokemon) return null;

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default;

  return (
    <Link
      to={`/pokemon/${pokemonId}`}
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
      aria-label={`View ${formatPokemonName(species.name)}`}
    >
      <div className="w-20 h-20 mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={formatPokemonName(species.name)}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        )}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
        {formatPokemonName(species.name)}
      </span>
      <span className="text-xs text-gray-500">
        #{pokemonId.toString().padStart(3, '0')}
      </span>
    </Link>
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
    <div className="flex items-center justify-center flex-wrap gap-4">
      {evolutions.map((species, index) => (
        <React.Fragment key={species.name}>
          <EvolutionNode species={species} />
          {index < evolutions.length - 1 && (
            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};