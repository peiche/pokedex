import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Users } from 'lucide-react';
import { useAllAbilities } from '../hooks/usePokemon';
import { useFilterSort, sortItems, filterBySearch } from '../hooks/useFilterSort';
import { FilterSortControls } from '../components/common/FilterSortControls';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Pagination } from '../components/common/Pagination';
import { formatPokemonName } from '../utils/pokemon';
import { PokeAPI } from 'pokeapi-types';

type ViewMode = 'grid' | 'list';

export const AbilitiesPage: React.FC = () => {
  // Get all abilities for filtering and sorting
  const { data: allAbilitiesData, isLoading: isLoadingAll } = useAllAbilities(1, 1000);

  // Filter and sort state management
  const filterSort = useFilterSort({
    enableSearch: true,
    enableGenerationFilter: false,
    enableTypeFilter: false,
    enableCategoryFilter: false,
    enableStatusFilter: false,
    availableSorts: ['name-asc', 'name-desc'],
    defaultSort: 'name-asc',
    defaultItemsPerPage: 25
  });

  // View mode state (separate from filter/sort)
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  // Process and filter abilities
  const processedAbilities = useMemo(() => {
    if (!allAbilitiesData?.results) return [];

    let filtered = allAbilitiesData.results.slice();

    // Apply search filter
    filtered = filterBySearch(filtered, filterSort.searchQuery);

    // Apply sorting
    filtered = sortItems(filtered, filterSort.sortBy);

    return filtered;
  }, [allAbilitiesData, filterSort.searchQuery, filterSort.sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(processedAbilities.length / filterSort.itemsPerPage);
  const startIndex = (filterSort.currentPage - 1) * filterSort.itemsPerPage;
  const paginatedAbilities = processedAbilities.slice(startIndex, startIndex + filterSort.itemsPerPage);

  const handlePageChange = (newPage: number) => {
    filterSort.setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = isLoadingAll;

  if (isLoading && !processedAbilities.length) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading abilities..." />
      </div>
    );
  }

  const AbilityCard: React.FC<{ ability: PokeAPI.NamedAPIResource }> = ({ ability }) => (
    <Link
      to={`/ability/${ability.name}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
      aria-label={`View details for ${formatPokemonName(ability.name)} ability`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {formatPokemonName(ability.name)}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>View Pokémon with this ability</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const AbilityListItem: React.FC<{ ability: PokeAPI.NamedAPIResource }> = ({ ability }) => (
    <Link
      to={`/ability/${ability.name}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 hover:shadow-md hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-200"
      aria-label={`View details for ${formatPokemonName(ability.name)} ability`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {formatPokemonName(ability.name)}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>View Pokémon</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pokémon Abilities
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore all Pokémon abilities and discover which Pokémon have them
        </p>
        {processedAbilities.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {filterSort.searchQuery ? `Found ${processedAbilities.length} abilities matching "${filterSort.searchQuery}"` : `${processedAbilities.length} abilities available`}
          </p>
        )}
      </div>

      {/* Filter and Sort Controls */}
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
        enableGenerationFilter={false}
        enableViewModeToggle={true}
        availableSorts={['name-asc', 'name-desc']}
        totalItems={allAbilitiesData?.results?.length}
        filteredItems={processedAbilities.length}
        isLoading={isLoading}
      />

      {/* Abilities Grid/List */}
      {paginatedAbilities.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedAbilities.map((ability) => (
                <AbilityCard key={ability.name} ability={ability} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedAbilities.map((ability) => (
                <AbilityListItem key={ability.name} ability={ability} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={filterSort.currentPage}
              totalPages={totalPages}
              baseUrl="/abilities"
              showPageInfo
              totalItems={processedAbilities.length}
              itemsPerPage={filterSort.itemsPerPage}
              onPageChange={handlePageChange}
              className="pt-8"
            />
          )}
        </>
      ) : filterSort.searchQuery ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <Search className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No abilities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No abilities match your search for "{filterSort.searchQuery}".
          </p>
          <button
            onClick={filterSort.resetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
          >
            Clear search and browse all abilities
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text="Loading abilities..." />
        </div>
      )}

      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About Pokémon Abilities
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Abilities are special powers that Pokémon possess, affecting their performance in battle or 
            providing unique effects. Each Pokémon can have one or two regular abilities, and some may 
            also have a hidden ability that's rarer to obtain.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
            Click on any ability above to see detailed information about its effects and discover 
            which Pokémon can have that ability.
          </p>
        </div>
      </div>
    </div>
  );
};