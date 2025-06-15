import React from 'react';
import { Search, RotateCcw, Grid, List } from 'lucide-react';
import {
  SortOption,
  FilterOption,
  TypeFilter,
  CategoryFilter,
  StatusFilter,
  ItemsPerPageOption
} from '../../hooks/useFilterSort';

interface FilterSortControlsProps {
  // Current state
  searchQuery: string;
  sortBy: SortOption;
  generationFilter: FilterOption;
  typeFilter: TypeFilter;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  itemsPerPage: ItemsPerPageOption;
  viewMode?: 'grid' | 'list';

  // Update functions
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onGenerationFilterChange: (generation: FilterOption) => void;
  onTypeFilterChange?: (type: TypeFilter) => void;
  onCategoryFilterChange?: (category: CategoryFilter) => void;
  onStatusFilterChange?: (status: StatusFilter) => void;
  onItemsPerPageChange: (items: ItemsPerPageOption) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onResetFilters: () => void;

  // Configuration
  enableSearch?: boolean;
  enableGenerationFilter?: boolean;
  enableTypeFilter?: boolean;
  enableCategoryFilter?: boolean;
  enableStatusFilter?: boolean;
  enableViewModeToggle?: boolean;
  availableSorts?: SortOption[];
  availableTypes?: string[];

  // Additional props
  totalItems?: number;
  filteredItems?: number;
  isLoading?: boolean;
  className?: string;
}

export const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  // Current state
  searchQuery,
  sortBy,
  generationFilter,
  typeFilter,
  categoryFilter,
  statusFilter,
  itemsPerPage,
  viewMode = 'grid',

  // Update functions
  onSearchChange,
  onSortChange,
  onGenerationFilterChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onItemsPerPageChange,
  onViewModeChange,
  onResetFilters,

  // Configuration
  enableSearch = true,
  enableGenerationFilter = true,
  enableTypeFilter = false,
  enableCategoryFilter = false,
  enableStatusFilter = false,
  enableViewModeToggle = true,
  availableSorts = ['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc'],
  availableTypes = [],

  // Additional props
  totalItems,
  filteredItems,
  isLoading = false,
  className = ''
}) => {
  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'pokedex-asc': return 'Pokémon Number (Ascending)';
      case 'pokedex-desc': return 'Pokémon Number (Descending)';
      case 'date-added': return 'Date Added';
      case 'popularity': return 'Popularity';
      case 'type': return 'Type';
      case 'category': return 'Category';
      default: return sort;
    }
  };

  const hasActiveFilters = searchQuery !== '' ||
    generationFilter !== 'all' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all';

  // Shared input styling that matches header search box
  const inputBaseClasses = "bg-background-light-secondary dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-border-light-focus dark:text-white hover:border-border-light-hover dark:hover:border-gray-500 transition-colors";

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Search Bar with Inline Reset Button */}
        {enableSearch && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-10 pr-12 py-2 ${inputBaseClasses}`}
              disabled={isLoading}
            />
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors z-10"
                disabled={isLoading}
                title="Clear all filters"
                aria-label="Clear all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filters and Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Generation Filter */}
            {enableGenerationFilter && (
              <select
                value={generationFilter}
                onChange={(e) => onGenerationFilterChange(e.target.value as FilterOption)}
                className={`px-3 py-2 text-sm ${inputBaseClasses}`}
                disabled={isLoading}
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
            )}

            {/* Type Filter */}
            {enableTypeFilter && onTypeFilterChange && (
              <select
                value={typeFilter}
                onChange={(e) => onTypeFilterChange(e.target.value as TypeFilter)}
                className={`px-3 py-2 text-sm ${inputBaseClasses}`}
                disabled={isLoading}
              >
                <option value="all">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Type
                  </option>
                ))}
              </select>
            )}

            {/* Category Filter */}
            {enableCategoryFilter && onCategoryFilterChange && (
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value as CategoryFilter)}
                className={`px-3 py-2 text-sm ${inputBaseClasses}`}
                disabled={isLoading}
              >
                <option value="all">All Categories</option>
                <option value="primary">Primary Only</option>
                <option value="hidden">Hidden Only</option>
              </select>
            )}

            {/* Status Filter */}
            {enableStatusFilter && onStatusFilterChange && (
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
                className={`px-3 py-2 text-sm ${inputBaseClasses}`}
                disabled={isLoading}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deprecated">Deprecated</option>
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`px-3 py-2 text-sm ${inputBaseClasses}`}
              disabled={isLoading}
            >
              {availableSorts.map(sort => (
                <option key={sort} value={sort}>
                  {getSortLabel(sort)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          {enableViewModeToggle && onViewModeChange && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-border-light dark:border-gray-600">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors border ${viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm border-border-light dark:border-gray-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent hover:border-border-light-hover dark:hover:border-gray-500'
                  }`}
                disabled={isLoading}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors border ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm border-border-light dark:border-gray-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent hover:border-border-light-hover dark:hover:border-gray-500'
                  }`}
                disabled={isLoading}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Results Summary and Items Per Page Row */}
        {(totalItems !== undefined || filteredItems !== undefined) && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Results Summary - Left Side */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredItems !== undefined && totalItems !== undefined ? (
                hasActiveFilters ? (
                  <>Showing {filteredItems} of {totalItems.toLocaleString()} results</>
                ) : (
                  <>{totalItems.toLocaleString()} total results</>
                )
              ) : filteredItems !== undefined ? (
                <>{filteredItems} results</>
              ) : totalItems !== undefined ? (
                <>{totalItems.toLocaleString()} total results</>
              ) : null}

              {hasActiveFilters && (
                <span className="inline-block text-sm text-blue-600 dark:text-blue-400 ml-2">
                  Filters active
                </span>
              )}
            </div>

            {/* Items Per Page - Right Side */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(parseInt(e.target.value) as ItemsPerPageOption)}
                className={`px-3 py-2 text-sm ${inputBaseClasses}`}
                disabled={isLoading}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};