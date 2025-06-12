import React from 'react';
import { PokemonCard } from './PokemonCard';
import { SkeletonGrid } from '../common/SkeletonCard';

interface PokemonGridProps {
  pokemon: Array<{
    name: string;
    url: string;
  }>;
  isLoading?: boolean;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemon, isLoading }) => {
  if (isLoading) {
    return <SkeletonGrid />;
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      role="grid"
      aria-label="Pokémon grid"
    >
      {pokemon.map((poke) => (
        <div key={poke.name} role="gridcell">
          <PokemonCard pokemon={poke} />
        </div>
      ))}
    </div>
  );
};