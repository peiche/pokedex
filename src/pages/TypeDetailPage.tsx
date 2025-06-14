import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { usePokemonByType } from '../hooks/usePokemon';
import { usePagePreferences } from '../hooks/useUIPreferences';
import { useFilterSort, sortItems, filterByGeneration, filterBySearch } from '../hooks/useFilterSort';
import { FilterSortControls } from '../components/common/FilterSortControls';
import { TypeBadge } from '../components/common/TypeBadge';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  formatPokemonName,
  typeColors,
  getTextColorForBackground,
  extractIdFromUrl,
} from '../utils/pokemon';

export const TypeDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { preferences, updatePagePreference } = usePagePreferences(`type-${name}`);

  // Get all Pokemon of this type for filtering and sorting
  const { data, isLoading, error } = usePokemonByType(name!, 1, 1000);

  // Filter and sort state management
  const filterSort = useFilterSort({
    enableSearch: true,
    enableGenerationFilter: true,
    enableTypeFilter: false,
    enableCategoryFilter: false,
    enableStatusFilter: false,
    availableSorts: ['pokedex-asc', 'pokedex-desc', 'name-asc', 'name-desc'],
    defaultSort: preferences.sortOrder === 'pokedex-asc' ? 'pokedex-asc' : 'pokedex-asc',
    defaultItemsPerPage: preferences.itemsPerPage
  });

  // Process and filter Pokemon
  const processedPokemon = useMemo(() => {
    if (!data?.pokemon) return [];

    // Convert to the format expected by our utility functions
    let filtered = data.pokemon.map(p => ({
      name: p.pokemon.name,
      url: p.pokemon.url
    }));

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
    // Smooth scroll to top of Pokemon section
    document.getElementById('pokemon-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
    updatePagePreference('viewMode', newViewMode);
  };

  const handleItemsPerPageChange = (newItemsPerPage: 10 | 25 | 50 | 100) => {
    updatePagePreference('itemsPerPage', newItemsPerPage);
    filterSort.setItemsPerPage(newItemsPerPage);
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
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
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
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
          {filterSort.generationFilter !== 'all' && ` in Generation ${filterSort.generationFilter.replace('gen', '')}`}
        </p>
      </div>

      {/* Type Effectiveness Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
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

      {/* Filter and Sort Controls */}
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
        availableSorts={['pokedex-asc', 'pokedex-desc', 'name-asc', 'name-desc']}
        totalItems={data?.pokemon?.length}
        filteredItems={processedPokemon.length}
        isLoading={isLoading}
      />

      {/* Pokemon of this type */}
      <div id="pokemon-section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPokemonName(name!)} Type Pokémon
          </h2>
        </div>

        {paginatedPokemon.length > 0 ? (
          <>
            <PokemonGrid
              pokemon={paginatedPokemon}
              viewMode={preferences.viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={filterSort.currentPage}
                totalPages={totalPages}
                baseUrl={`/type/${name}`}
                showPageInfo
                totalItems={processedPokemon.length}
                itemsPerPage={filterSort.itemsPerPage}
                onPageChange={handlePageChange}
                className="pt-8 mt-8 border-t border-border-light dark:border-gray-700"
              />
            )}
          </>
        ) : filterSort.searchQuery || filterSort.generationFilter !== 'all' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pokémon found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No {formatPokemonName(name!)} type Pokémon match your current search and filter criteria.
            </p>
            <button
              onClick={filterSort.resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
            >
              Clear filters and show all {formatPokemonName(name!)} type Pokémon
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