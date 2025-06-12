import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePokemonByType } from '../hooks/usePokemon';
import { TypeBadge } from '../components/common/TypeBadge';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  formatPokemonName, 
  typeColors, 
  getTextColorForBackground 
} from '../utils/pokemon';

export const TypeDetailPage: React.FC = () => {
  const { name, pageNumber } = useParams<{ name: string; pageNumber?: string }>();
  const currentPage = parseInt(pageNumber || '1', 10);
  
  const { data, isLoading, error } = usePokemonByType(name!, currentPage, 20);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading type data..." />
      </div>
    );
  }

  if (error || !data) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isPageNotFound = errorMessage.includes('Page') && errorMessage.includes('not found');
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isPageNotFound ? 'Page Not Found' : 'Type Not Found'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isPageNotFound 
            ? errorMessage
            : `The type "${name}" doesn't exist or couldn't be loaded.`
          }
        </p>
        <div className="space-y-4">
          <Link
            to={`/type/${name}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Type Overview
          </Link>
          <div className="text-sm text-gray-500">
            <Link to="/types" className="text-blue-600 hover:underline">
              Browse all types
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { pokemon, pagination, typeInfo } = data;
  const backgroundColor = typeColors[name!] || '#68D391';
  const textColor = getTextColorForBackground(backgroundColor);

  // Convert Pokemon data to the format expected by PokemonGrid
  const pokemonList = pokemon.map((p: any) => ({
    name: p.pokemon.name,
    url: p.pokemon.url
  }));

  const TypeEffectivenessSection: React.FC<{ 
    title: string; 
    types: Array<{ name: string; url: string }>;
    multiplier: string;
    description: string;
  }> = ({ title, types, multiplier, description }) => {
    if (types.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({multiplier})
          </span>
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <TypeBadge key={type.name} type={type.name} clickable />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link
        to="/types"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Types
      </Link>

      {/* Type Header */}
      <div 
        className="rounded-2xl shadow-lg p-8 text-center"
        style={{ backgroundColor }}
      >
        <h1 
          className="text-5xl font-bold mb-4"
          style={{ color: textColor }}
        >
          {formatPokemonName(name!)} Type
        </h1>
        <p 
          className="text-xl opacity-90"
          style={{ color: textColor }}
        >
          {pagination.totalItems} Pokémon found
        </p>
        {pagination.totalPages > 1 && (
          <p 
            className="text-lg opacity-75 mt-2"
            style={{ color: textColor }}
          >
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Type Effectiveness Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Type Effectiveness
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Understanding how {formatPokemonName(name!)} type interacts with other types in battle.
        </p>

        {/* Attacking Effectiveness */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            When {formatPokemonName(name!)} Attacks
          </h3>
          
          <TypeEffectivenessSection
            title="Super Effective Against"
            types={typeInfo.damage_relations.double_damage_to}
            multiplier="2x damage"
            description={`${formatPokemonName(name!)} type moves deal double damage to these types.`}
          />
          
          <TypeEffectivenessSection
            title="Not Very Effective Against"
            types={typeInfo.damage_relations.half_damage_to}
            multiplier="0.5x damage"
            description={`${formatPokemonName(name!)} type moves deal half damage to these types.`}
          />
          
          <TypeEffectivenessSection
            title="No Effect Against"
            types={typeInfo.damage_relations.no_damage_to}
            multiplier="0x damage"
            description={`${formatPokemonName(name!)} type moves have no effect on these types.`}
          />
        </div>

        {/* Defending Effectiveness */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            When {formatPokemonName(name!)} Defends
          </h3>
          
          <TypeEffectivenessSection
            title="Weak To"
            types={typeInfo.damage_relations.double_damage_from}
            multiplier="2x damage taken"
            description={`${formatPokemonName(name!)} type Pokémon take double damage from these types.`}
          />
          
          <TypeEffectivenessSection
            title="Resists"
            types={typeInfo.damage_relations.half_damage_from}
            multiplier="0.5x damage taken"
            description={`${formatPokemonName(name!)} type Pokémon take half damage from these types.`}
          />
          
          <TypeEffectivenessSection
            title="Immune To"
            types={typeInfo.damage_relations.no_damage_from}
            multiplier="0x damage taken"
            description={`${formatPokemonName(name!)} type Pokémon are immune to these types.`}
          />
        </div>
      </div>

      {/* Pokemon of this type */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPokemonName(name!)} Type Pokémon
          </h2>
        </div>
        
        {pokemonList.length > 0 ? (
          <>
            <PokemonGrid pokemon={pokemonList} />
            
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              baseUrl={`/type/${name}`}
              showPageInfo
              totalItems={pagination.totalItems}
              itemsPerPage={20}
              className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700"
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No Pokémon found for this type.
          </div>
        )}
      </div>
    </div>
  );
};