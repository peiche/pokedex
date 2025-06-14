import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { usePagePreferences } from '../hooks/useUIPreferences';
import { useFilterSort, sortItems, filterByGeneration, filterBySearch } from '../hooks/useFilterSort';
import { FilterSortControls } from '../components/common/FilterSortControls';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { extractIdFromUrl } from '../utils/pokemon';

export const FavoritesPage: React.FC = () => {
  const { favorites, favoritesCount, clearAllFavorites, removeFromFavorites } = useFavorites();
  const { preferences, updatePagePreference } = usePagePreferences('favorites');

  // State for managing exit animations
  const [exitingPokemonIds, setExitingPokemonIds] = useState<Set<number>>(new Set());

  // Filter and sort state management
  const filterSort = useFilterSort({
    enableSearch: true,
    enableGenerationFilter: true,
    enableTypeFilter: false,
    enableCategoryFilter: false,
    enableStatusFilter: false,
    availableSorts: ['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc', 'date-added'],
    defaultSort: 'date-added',
    defaultItemsPerPage: preferences.itemsPerPage
  });

  // Convert favorites to the format expected by our utility functions
  const favoritePokemon = useMemo(() => {
    return favorites.map(fav => ({
      name: fav.name,
      url: fav.url
    }));
  }, [favorites]);

  // Process and filter favorites
  const processedFavorites = useMemo(() => {
    if (!favoritePokemon.length) return [];

    let filtered = favoritePokemon.slice();

    // Apply search filter
    filtered = filterBySearch(filtered, filterSort.searchQuery);

    // Apply generation filter
    filtered = filterByGeneration(filtered, filterSort.generationFilter, extractIdFromUrl);

    // Apply sorting with special handling for date-added
    if (filterSort.sortBy === 'date-added') {
      // Sort by most recently added (using the favorites array order)
      const favoritesMap = new Map(favorites.map(fav => [fav.id, fav.addedAt]));
      filtered = filtered.sort((a, b) => {
        const idA = extractIdFromUrl(a.url);
        const idB = extractIdFromUrl(b.url);
        const dateA = favoritesMap.get(idA) || '';
        const dateB = favoritesMap.get(idB) || '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else {
      filtered = sortItems(filtered, filterSort.sortBy, extractIdFromUrl);
    }

    return filtered;
  }, [favoritePokemon, favorites, filterSort.searchQuery, filterSort.generationFilter, filterSort.sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(processedFavorites.length / filterSort.itemsPerPage);
  const startIndex = (filterSort.currentPage - 1) * filterSort.itemsPerPage;
  const paginatedFavorites = processedFavorites.slice(startIndex, startIndex + filterSort.itemsPerPage);

  // Handle animation completion and actual removal
  const handleAnimationEnd = useCallback((pokemonId: number) => {
    // Remove from favorites
    removeFromFavorites(pokemonId);
    // Remove from exiting set
    setExitingPokemonIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(pokemonId);
      return newSet;
    });
  }, [removeFromFavorites]);

  // Handle unfavorite action (start animation)
  const handleUnfavorite = useCallback((pokemonId: number) => {
    setExitingPokemonIds(prev => new Set(prev).add(pokemonId));
  }, []);

  const handlePageChange = (newPage: number) => {
    filterSort.setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
    updatePagePreference('viewMode', newViewMode);
  };

  const handleItemsPerPageChange = (newItemsPerPage: 10 | 25 | 50 | 100) => {
    updatePagePreference('itemsPerPage', newItemsPerPage);
    filterSort.setItemsPerPage(newItemsPerPage);
  };

  const handleClearAll = () => {
    if (window.confirm(`Are you sure you want to remove all ${favoritesCount} Pokémon from your favorites? This action cannot be undone.`)) {
      clearAllFavorites();
      filterSort.resetFilters();
      setExitingPokemonIds(new Set()); // Clear any pending animations
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Favorite Pokémon
          </h1>

          {/* Clear All Button */}
          {favoritesCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Clear all favorites"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {favoritesCount > 0 ? (
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              You have {favoritesCount} favorite Pokémon
            </p>
            {processedFavorites.length !== favoritesCount && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Showing {processedFavorites.length} after filters
              </p>
            )}
          </div>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Start building your collection of favorite Pokémon
          </p>
        )}
      </div>

      {favoritesCount > 0 ? (
        <>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <FilterSortControls
              searchQuery={filterSort.searchQuery}
              sortBy={filterSort.sortBy}
              generationFilter={filterSort.generationFilter}
              typeFilter={filterSort.typeFilter}
              categoryFilter={filterSort.categoryFilter}
              statusFilter={filterSort.statusFilter}
              itemsPerPage={filterSort.itemsPerPage}
              viewMode={preferences.viewMode}
              onSearchChange={filterSort.setSearchQuery}
              onSortChange={filterSort.setSortBy}
              onGenerationFilterChange={filterSort.setGenerationFilter}
              onItemsPerPageChange={handleItemsPerPageChange}
              onViewModeChange={handleViewModeChange}
              onResetFilters={filterSort.resetFilters}
              enableSearch={true}
              enableGenerationFilter={true}
              enableViewModeToggle={true}
              availableSorts={['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc', 'date-added']}
              totalItems={favoritesCount}
              filteredItems={processedFavorites.length}
              className="flex-1"
            />
          </div>

          {/* Favorites Grid/List */}
          {paginatedFavorites.length > 0 ? (
            <>
              <PokemonGrid
                pokemon={paginatedFavorites}
                viewMode={preferences.viewMode}
                exitingPokemonIds={exitingPokemonIds}
                onAnimationEnd={handleAnimationEnd}
                onUnfavorite={handleUnfavorite}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={filterSort.currentPage}
                  totalPages={totalPages}
                  baseUrl="/favorites"
                  showPageInfo
                  totalItems={processedFavorites.length}
                  itemsPerPage={filterSort.itemsPerPage}
                  onPageChange={handlePageChange}
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
                No favorites found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No favorite Pokémon match your current search and filter criteria.
              </p>
              <button
                onClick={filterSort.resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
              >
                Clear filters and show all favorites
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
              <Heart className="w-full h-full" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No favorites yet
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Start exploring and click the heart icon on any Pokémon card to add them to your favorites.
              Your favorite Pokémon will appear here for quick access.
            </p>

            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-blue-700"
              >
                <Search className="w-4 h-4" />
                Browse All Pokémon
              </Link>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Or explore by category:</p>
                <div className="flex justify-center gap-4 mt-2">
                  <Link
                    to="/types"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Types <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span>•</span>
                  <Link
                    to="/abilities"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Abilities <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};