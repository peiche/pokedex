import React from 'react';
import { PokemonCard } from './PokemonCard';
import { PokemonListItem } from './PokemonListItem';
import { SkeletonGrid } from '../common/SkeletonCard';

interface PokemonGridProps {
  pokemon: Array<{
    name: string;
    url: string;
  }>;
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  exitingPokemonIds?: Set<number>;
  onAnimationEnd?: (id: number) => void;
  onUnfavorite?: (id: number) => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  pokemon, 
  isLoading, 
  viewMode = 'grid',
  exitingPokemonIds,
  onAnimationEnd,
  onUnfavorite
}) => {
  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3" role="list" aria-label="Pokémon list">
        {pokemon.map((poke) => (
          <div key={poke.name} role="listitem">
            <PokemonListItem 
              pokemon={poke} 
              exitingPokemonIds={exitingPokemonIds}
              onAnimationEnd={onAnimationEnd}
              onUnfavorite={onUnfavorite}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      role="grid"
      aria-label="Pokémon grid"
    >
      {pokemon.map((poke) => (
        <div key={poke.name} role="gridcell">
          <PokemonCard 
            pokemon={poke} 
            exitingPokemonIds={exitingPokemonIds}
            onAnimationEnd={onAnimationEnd}
            onUnfavorite={onUnfavorite}
          />
        </div>
      ))}
    </div>
  );
};