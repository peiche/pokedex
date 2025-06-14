import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Eye, EyeOff, Search } from 'lucide-react';
import { usePokemonWithAbility } from '../hooks/usePokemon';
import { usePagePreferences } from '../hooks/useUIPreferences';
import { useFilterSort, sortItems, filterByGeneration, filterBySearch } from '../hooks/useFilterSort';
import { FilterSortControls } from '../components/common/FilterSortControls';
import { TypeBadge } from '../components/common/TypeBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AbilityPokemonSkeleton } from '../components/common/PokemonSkeleton';
import { Pagination } from '../components/common/Pagination';
import {
  formatPokemonName,
  extractIdFromUrl,
} from '../utils/pokemon';
import { FavoriteButton } from '../components/common/FavoriteButton';

export const AbilityDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { preferences, updatePagePreference } = usePagePreferences(`ability-${name}`);

  const { data, isLoading, error } = usePokemonWithAbility(name!);

  // Filter and sort state management
  const filterSort = useFilterSort({
    enableSearch: true,
    enableGenerationFilter: true,
    enableTypeFilter: false,
    enableCategoryFilter: true, // Enable category filter for primary/hidden abilities
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
      name: p.pokemon.pokemon.name,
      url: p.pokemon.pokemon.url,
      is_hidden: p.pokemon.is_hidden
    }));

    // Apply search filter
    filtered = filterBySearch(filtered, filterSort.searchQuery);

    // Apply generation filter
    filtered = filterByGeneration(filtered, filterSort.generationFilter, extractIdFromUrl);

    // Apply category filter (primary vs hidden abilities)
    if (filterSort.categoryFilter === 'primary') {
      filtered = filtered.filter(p => !p.is_hidden);
    } else if (filterSort.categoryFilter === 'hidden') {
      filtered = filtered.filter(p => p.is_hidden);
    }

    // Apply sorting
    filtered = sortItems(filtered, filterSort.sortBy, extractIdFromUrl);

    return filtered;
  }, [data, filterSort.searchQuery, filterSort.generationFilter, filterSort.categoryFilter, filterSort.sortBy]);

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
        <LoadingSpinner size="lg" text="Loading ability details..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ability not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The ability you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link
          to="/abilities"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Abilities
        </Link>
      </div>
    );
  }

  const { ability, pokemon } = data;

  const description = ability.effect_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.effect;

  const shortDescription = ability.flavor_text_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text;

  const primaryCount = pokemon.filter(p => !p.pokemon.is_hidden).length;
  const hiddenCount = pokemon.filter(p => p.pokemon.is_hidden).length;

  // Check if Pokemon data is still loading
  const isPokemonDataLoading = pokemon.some(p => !p.pokemonData);

  const PokemonCard: React.FC<{
    pokemonEntry: {
      name: string;
      url: string;
      is_hidden: boolean;
    }
  }> = ({ pokemonEntry }) => {
    const pokemonId = extractIdFromUrl(pokemonEntry.url);
    const pokemonData = data.pokemon.find(p => 
      extractIdFromUrl(p.pokemon.pokemon.url) === pokemonId
    )?.pokemonData;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 overflow-hidden">
        {/* Favorite Button - Positioned absolutely in top-right corner */}
        <div className="absolute top-3 right-3 z-10 duration-200">
          <FavoriteButton
            pokemon={{ name: pokemonEntry.name, url: pokemonEntry.url }}
            size="sm"
            variant="overlay"
            showTooltip={false}
          />
        </div>
        <Link
          to={`/pokemon/${pokemonId}`}
          aria-label={`View details for ${formatPokemonName(pokemonEntry.name)}`}
        >
          <div className="p-6">
            {/* Pokemon Image */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={imageUrl}
                alt={formatPokemonName(pokemonEntry.name)}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {pokemonEntry.is_hidden && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <EyeOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Pokemon Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {formatPokemonName(pokemonEntry.name)}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                #{pokemonId.toString().padStart(3, '0')}
              </p>

              {/* Types */}
              {pokemonData?.types && (
                <div className="flex justify-center gap-1 mb-2">
                  {pokemonData.types.map((type) => (
                    <TypeBadge
                      key={type.type.name}
                      type={type.type.name}
                      size="sm"
                    />
                  ))}
                </div>
              )}

              {/* Ability Type Badge */}
              <div className="flex justify-center">
                <span className={`px-2 py-1 text-xs rounded-full ${pokemonEntry.is_hidden
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                  {pokemonEntry.is_hidden ? 'Hidden Ability' : 'Primary Ability'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const PokemonListItem: React.FC<{
    pokemonEntry: {
      name: string;
      url: string;
      is_hidden: boolean;
    }
  }> = ({ pokemonEntry }) => {
    const pokemonId = extractIdFromUrl(pokemonEntry.url);
    const pokemonData = data.pokemon.find(p => 
      extractIdFromUrl(p.pokemon.pokemon.url) === pokemonId
    )?.pokemonData;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 hover:shadow-md hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-200">
        <Link
          to={`/pokemon/${pokemonId}`}
          className="block p-4"
          aria-label={`View details for ${formatPokemonName(pokemonEntry.name)}`}
        >
          <div className="flex items-center gap-4">
            {/* Pokemon Image */}
            <div className="relative flex-shrink-0 w-16 h-16">
              <img
                src={imageUrl}
                alt={formatPokemonName(pokemonEntry.name)}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {pokemonEntry.is_hidden && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <EyeOff className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {/* Pokemon Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {formatPokemonName(pokemonEntry.name)}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{pokemonId.toString().padStart(3, '0')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Types */}
                {pokemonData?.types && (
                  <div className="flex gap-1">
                    {pokemonData.types.map((type) => (
                      <TypeBadge
                        key={type.type.name}
                        type={type.type.name}
                        size="sm"
                      />
                    ))}
                  </div>
                )}

                {/* Ability Type */}
                <span className={`px-2 py-1 text-xs rounded-full ${pokemonEntry.is_hidden
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                  {pokemonEntry.is_hidden ? 'Hidden' : 'Primary'}
                </span>
              </div>
            </div>

            {/* Stats Preview */}
            {pokemonData?.stats && (
              <div className="hidden lg:block text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Stats</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {pokemonData.stats.reduce((sum: number, stat) => sum + stat.base_stat, 0)}
                </div>
              </div>
            )}

            {/* Favorite Button */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <FavoriteButton 
                pokemon={{ name: pokemonEntry.name, url: pokemonEntry.url }}
                size="sm" 
                variant="minimal"
                showTooltip={false}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link
        to="/abilities"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Abilities
      </Link>

      {/* Ability Header */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {formatPokemonName(name!)}
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {pokemon.length} Pokémon have this ability
            </p>

            <div className="flex gap-4 text-sm">
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{primaryCount} Primary</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  <span>{hiddenCount} Hidden</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ability Description - Clean layout without decorative container styling */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Ability Description
        </h2>

        <div className="space-y-4">
          {shortDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {shortDescription.replace(/\f/g, ' ')}
              </p>
            </div>
          )}

          {description && description !== shortDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Detailed Effect
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {description.replace(/\f/g, ' ')}
              </p>
            </div>
          )}
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
        onCategoryFilterChange={filterSort.setCategoryFilter}
        onItemsPerPageChange={handleItemsPerPageChange}
        onViewModeChange={handleViewModeChange}
        onResetFilters={filterSort.resetFilters}
        enableSearch={true}
        enableGenerationFilter={true}
        enableCategoryFilter={true}
        enableViewModeToggle={true}
        availableSorts={['pokedex-asc', 'pokedex-desc', 'name-asc', 'name-desc']}
        totalItems={pokemon.length}
        filteredItems={processedPokemon.length}
        isLoading={isLoading}
      />

      {/* Pokemon List - Clean layout without decorative container styling */}
      <div id="pokemon-section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pokémon with {formatPokemonName(name!)}
          </h2>
        </div>

        {/* Show skeleton while Pokemon data is loading */}
        {isPokemonDataLoading ? (
          <AbilityPokemonSkeleton viewMode={preferences.viewMode} />
        ) : paginatedPokemon.length > 0 ? (
          <div className="space-y-6">
            <div className="animate-fade-in">
              {preferences.viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {paginatedPokemon.map((pokemonEntry) => (
                    <PokemonCard key={`${pokemonEntry.name}-${pokemonEntry.is_hidden}`} pokemonEntry={pokemonEntry} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedPokemon.map((pokemonEntry) => (
                    <PokemonListItem key={`${pokemonEntry.name}-${pokemonEntry.is_hidden}`} pokemonEntry={pokemonEntry} />
                  ))}
                </div>
              )}
            </div>

            {/* Full Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-border-light dark:border-gray-600">
                <Pagination
                  currentPage={filterSort.currentPage}
                  totalPages={totalPages}
                  baseUrl={`/ability/${name}`}
                  showPageInfo
                  totalItems={processedPokemon.length}
                  itemsPerPage={filterSort.itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : filterSort.searchQuery || filterSort.generationFilter !== 'all' || filterSort.categoryFilter !== 'all' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pokémon found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No Pokémon found with the selected filters.
            </p>
            <button
              onClick={filterSort.resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
            >
              Show all Pokémon with this ability
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No Pokémon found with this ability.
          </div>
        )}
      </div>
    </div>
  );
};