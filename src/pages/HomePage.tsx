import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import { usePokemonList } from '../hooks/usePokemon';
import { useViewPreference } from '../hooks/useViewPreference';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractIdFromUrl, getPokemonGeneration } from '../utils/pokemon';

type SortOption = 'pokedex' | 'pokedex-desc' | 'name' | 'name-desc';
type FilterOption = 'all' | 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'gen5' | 'gen6' | 'gen7' | 'gen8' | 'gen9';

export const HomePage: React.FC = () => {
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const [searchParams] = useSearchParams();
  
  // Get page from URL params first, then from search params, default to 1
  const currentPage = parseInt(pageNumber || searchParams.get('page') || '1', 10);
  
  const [sortBy, setSortBy] = useState<SortOption>('pokedex');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useViewPreference('homepage');
  
  const { data, isLoading, error } = usePokemonList(1, 1010); // Get all Pokemon for sorting/filtering

  // Process and sort Pokemon
  const processedPokemon = useMemo(() => {
    if (!data?.results) return [];

    let filtered = data.results.slice();

    // Filter by generation
    if (filterBy !== 'all') {
      const genNumber = parseInt(filterBy.replace('gen', ''));
      filtered = filtered.filter(pokemon => {
        const id = extractIdFromUrl(pokemon.url);
        return getPokemonGeneration(id) === genNumber;
      });
    }

    // Sort Pokemon
    return filtered.sort((a, b) => {
      const idA = extractIdFromUrl(a.url);
      const idB = extractIdFromUrl(b.url);
      
      switch (sortBy) {
        case 'pokedex':
          return idA - idB;
        case 'pokedex-desc':
          return idB - idA;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
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

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error loading Pokémon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pokédex
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover and learn about Pokémon
        </p>
        {processedPokemon.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {filterBy === 'all' 
              ? `${processedPokemon.length} Pokémon available`
              : `${processedPokemon.length} Pokémon in Generation ${filterBy.replace('gen', '')}`
            }
          </p>
        )}
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

      {/* Pokemon Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading Pokémon..." />
        </div>
      ) : paginatedPokemon.length > 0 ? (
        <>
          <PokemonGrid 
            pokemon={paginatedPokemon} 
            viewMode={viewMode}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
              showPageInfo
              totalItems={processedPokemon.length}
              itemsPerPage={itemsPerPage}
              className="pt-8"
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <Search className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Pokémon found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No Pokémon match the selected filters.
          </p>
          <button
            onClick={() => setFilterBy('all')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show all Pokémon
          </button>
        </div>
      )}
    </div>
  );
};