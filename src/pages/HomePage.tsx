import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { usePokemonList } from '../hooks/usePokemon';
import { useViewPreference } from '../hooks/useViewPreference';
import { useFilterSort, sortItems, filterByGeneration, filterBySearch } from '../hooks/useFilterSort';
import { FilterSortControls } from '../components/common/FilterSortControls';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { extractIdFromUrl } from '../utils/pokemon';

export const HomePage: React.FC = () => {
  const [viewMode, setViewMode] = useViewPreference('homepage');
  
  // Get all Pokemon for filtering and sorting
  const { data, isLoading, error } = usePokemonList(1, 1010);

  // Filter and sort state management
  const filterSort = useFilterSort({
    enableSearch: true,
    enableGenerationFilter: true,
    enableTypeFilter: false,
    enableCategoryFilter: false,
    enableStatusFilter: false,
    availableSorts: ['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc', 'popularity'],
    defaultSort: 'pokedex-asc',
    defaultItemsPerPage: 25
  });

  // Process and filter Pokemon
  const processedPokemon = useMemo(() => {
    if (!data?.results) return [];

    let filtered = data.results.slice();

    // Apply search filter
    filtered = filterBySearch(filtered, filterSort.searchQuery);

    // Apply generation filter
    filtered = filterByGeneration(filtered, filterSort.generationFilter, extractIdFromUrl);

    // Apply sorting
    filtered = sortItems(filtered, filterSort.sortBy, extractIdFromUrl);

    return filtered;
  }, [data, filterSort.searchQuery, filterSort.generationFilter, filterSort.sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(processedPokemon.length / filterSort.itemsPerPage);
  const startIndex = (filterSort.currentPage - 1) * filterSort.itemsPerPage;
  const paginatedPokemon = processedPokemon.slice(startIndex, startIndex + filterSort.itemsPerPage);

  const handlePageChange = (newPage: number) => {
    filterSort.setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error loading Pokémon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please try refreshing the page
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FilterSortControls
        searchQuery={filterSort.searchQuery}
        sortBy={filterSort.sortBy}
        generationFilter={filterSort.generationFilter}
        typeFilter={filterSort.typeFilter}
        categoryFilter={filterSort.categoryFilter}
        statusFilter={filterSort.statusFilter}
        itemsPerPage={filterSort.itemsPerPage}
        viewMode={viewMode}
        onSearchChange={filterSort.setSearchQuery}
        onSortChange={filterSort.setSortBy}
        onGenerationFilterChange={filterSort.setGenerationFilter}
        onItemsPerPageChange={filterSort.setItemsPerPage}
        onViewModeChange={setViewMode}
        onResetFilters={filterSort.resetFilters}
        enableSearch={true}
        enableGenerationFilter={true}
        enableViewModeToggle={true}
        availableSorts={['pokedex-asc', 'pokedex-desc', 'name-asc', 'name-desc']}
        totalItems={data?.results?.length}
        filteredItems={processedPokemon.length}
        isLoading={isLoading}
      />

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
              currentPage={filterSort.currentPage}
              totalPages={totalPages}
              baseUrl="/"
              showPageInfo
              totalItems={processedPokemon.length}
              itemsPerPage={filterSort.itemsPerPage}
              onPageChange={handlePageChange}
              className="pt-8"
            />
          )}
        </>
      ) : filterSort.searchQuery || filterSort.generationFilter !== 'all' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <Search className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Pokémon found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No Pokémon match your current search and filter criteria.
          </p>
          <button
            onClick={filterSort.resetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
          >
            Clear filters and show all Pokémon
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text="Loading Pokémon..." />
        </div>
      )}
    </div>
  );
};