import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Users, Filter, Grid, List } from 'lucide-react';
import { useAllAbilities, useSearchAbilities } from '../hooks/usePokemon';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Pagination } from '../components/common/Pagination';
import { formatPokemonName, debounce } from '../utils/pokemon';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'pokemon-count';

export const AbilitiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showSearch, setShowSearch] = useState(false);

  const { data: allAbilitiesData, isLoading: isLoadingAll } = useAllAbilities(1, 1000); // Get all for sorting
  const { data: searchResults, isLoading: isSearching } = useSearchAbilities(searchQuery);

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShowSearch(value.length > 0);
    debouncedSearch(value);
  };

  // Process and sort abilities
  const processedAbilities = useMemo(() => {
    const abilities = searchQuery.length > 0 ? searchResults?.slice() : allAbilitiesData?.results?.slice();
    
    if (!abilities) return [];

    // Sort abilities
    return abilities.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'pokemon-count':
          // Note: We don't have pokemon count in the basic list, so we'll sort by name as fallback
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [allAbilitiesData, searchResults, searchQuery, sortBy]);

  // Pagination
  const itemsPerPage = 24;
  const totalPages = Math.ceil(processedAbilities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAbilities = processedAbilities.slice(startIndex, startIndex + itemsPerPage);

  const isLoading = isLoadingAll || (searchQuery.length > 0 && isSearching);

  if (isLoading && !processedAbilities.length) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading abilities..." />
      </div>
    );
  }

  const AbilityCard: React.FC<{ ability: any }> = ({ ability }) => (
    <Link
      to={`/ability/${ability.name}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
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

  const AbilityListItem: React.FC<{ ability: any }> = ({ ability }) => (
    <Link
      to={`/ability/${ability.name}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
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
            {searchQuery ? `Found ${processedAbilities.length} abilities matching "${searchQuery}"` : `${processedAbilities.length} abilities available`}
          </p>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search abilities..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              onChange={handleSearchChange}
              aria-label="Search for abilities"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                aria-label="Sort abilities"
              >
                <option value="name">Sort by Name</option>
                <option value="pokemon-count">Sort by Pokémon Count</option>
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
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/abilities"
              showPageInfo
              totalItems={processedAbilities.length}
              itemsPerPage={itemsPerPage}
              className="pt-8"
            />
          )}
        </>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <Search className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No abilities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or browse all abilities.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text="Loading abilities..." />
        </div>
      )}

      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
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