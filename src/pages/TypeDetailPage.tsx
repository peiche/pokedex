import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List, Search } from 'lucide-react';
import { usePokemonByType } from '../hooks/usePokemon';
import { useViewPreference } from '../hooks/useViewPreference';
import { TypeBadge } from '../components/common/TypeBadge';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  formatPokemonName, 
  typeColors, 
  getTextColorForBackground,
  extractIdFromUrl,
  getPokemonGeneration
} from '../utils/pokemon';

type SortOption = 'pokedex' | 'pokedex-desc' | 'name' | 'name-desc' | 'generation';
type FilterOption = 'all' | 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'gen5' | 'gen6' | 'gen7' | 'gen8' | 'gen9';

export const TypeDetailPage: React.FC = () => {
  const { name, pageNumber } = useParams<{ name: string; pageNumber?: string }>();
  const currentPage = parseInt(pageNumber || '1', 10);
  
  const [sortBy, setSortBy] = useState<SortOption>('pokedex');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useViewPreference(`type-${name}`);
  
  const { data, isLoading, error } = usePokemonByType(name!, 1, 1000); // Get all for sorting/filtering

  // Process and sort Pokemon
  const processedPokemon = useMemo(() => {
    if (!data?.pokemon) return [];

    let filtered = data.pokemon.slice();

    // Filter by generation
    if (filterBy !== 'all') {
      const genNumber = parseInt(filterBy.replace('gen', ''));
      filtered = filtered.filter(pokemonEntry => {
        const id = extractIdFromUrl(pokemonEntry.pokemon.url);
        return getPokemonGeneration(id) === genNumber;
      });
    }

    // Sort Pokemon
    return filtered.sort((a, b) => {
      const idA = extractIdFromUrl(a.pokemon.url);
      const idB = extractIdFromUrl(b.pokemon.url);
      const genA = getPokemonGeneration(idA);
      const genB = getPokemonGeneration(idB);
      
      switch (sortBy) {
        case 'pokedex':
          return idA - idB;
        case 'pokedex-desc':
          return idB - idA;
        case 'name':
          return a.pokemon.name.localeCompare(b.pokemon.name);
        case 'name-desc':
          return b.pokemon.name.localeCompare(a.pokemon.name);
        case 'generation':
          if (genA !== genB) {
            return genA - genB;
          }
          return idA - idB; // Secondary sort by Pokédex number
        default:
          return idA - idB;
      }
    });
  }, [data, sortBy, filterBy]);

  // Pagination
  const itemsPerPage = 20;
  const totalPages = Math.ceil(processedPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = processedPokemon.slice(startIndex, startIndex + itemsPerPage);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleFilterChange = (newFilter: FilterOption) => {
    setFilterBy(newFilter);
  };

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

  const { typeInfo } = data;
  const backgroundColor = typeColors[name!] || '#68D391';
  const textColor = getTextColorForBackground(backgroundColor);

  // Convert Pokemon data to the format expected by PokemonGrid
  const pokemonList = paginatedPokemon.map((p: any) => ({
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
          {processedPokemon.length} Pokémon found
          {filterBy !== 'all' && ` in Generation ${filterBy.replace('gen', '')}`}
        </p>
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

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => handleFilterChange(e.target.value as FilterOption)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                aria-label="Filter Pokémon by generation"
              >
                <option value="all">All Generations</option>
                <option value="gen1">Generation I (Kanto)</option>
                <option value="gen2">Generation II (Johto)</option>
                <option value="gen3">Generation III (Hoenn)</option>
                <option value="gen4">Generation IV (Sinnoh)</option>
                <option value="gen5">Generation V (Unova)</option>
                <option value="gen6">Generation VI (Kalos)</option>
                <option value="gen7">Generation VII (Alola)</option>
                <option value="gen8">Generation VIII (Galar)</option>
                <option value="gen9">Generation IX (Paldea)</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              aria-label="Sort Pokémon"
            >
              <option value="pokedex">Sort by Pokédex # (Low to High)</option>
              <option value="pokedex-desc">Sort by Pokédex # (High to Low)</option>
              <option value="name">Sort by Name (A-Z)</option>
              <option value="name-desc">Sort by Name (Z-A)</option>
              <option value="generation">Sort by Generation</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
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
            <PokemonGrid 
              pokemon={pokemonList} 
              viewMode={viewMode}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/type/${name}`}
                showPageInfo
                totalItems={processedPokemon.length}
                itemsPerPage={itemsPerPage}
                className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700"
              />
            )}
          </>
        ) : filterBy !== 'all' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pokémon found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No {formatPokemonName(name!)} type Pokémon found in Generation {filterBy.replace('gen', '')}.
            </p>
            <button
              onClick={() => setFilterBy('all')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show all {formatPokemonName(name!)} type Pokémon
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No Pokémon found for this type.
          </div>
        )}
      </div>
    </div>
  );
};