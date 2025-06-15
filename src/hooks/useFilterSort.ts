import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// Common filter and sort types
export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'pokedex-asc'
  | 'pokedex-desc'
  | 'date-added'
  | 'popularity'
  | 'type'
  | 'category';

export type FilterOption =
  | 'all'
  | 'gen1'
  | 'gen2'
  | 'gen3'
  | 'gen4'
  | 'gen5'
  | 'gen6'
  | 'gen7'
  | 'gen8'
  | 'gen9';

export type StatusFilter = 'all' | 'active' | 'deprecated';
export type TypeFilter = 'all' | string; // 'all' or specific type name
export type CategoryFilter = 'all' | 'primary' | 'hidden';
export type ItemsPerPageOption = 10 | 25 | 50 | 100;

export interface FilterSortState {
  searchQuery: string;
  sortBy: SortOption;
  generationFilter: FilterOption;
  typeFilter: TypeFilter;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  currentPage: number;
  itemsPerPage: ItemsPerPageOption;
}

export interface FilterSortConfig {
  enableSearch?: boolean;
  enableGenerationFilter?: boolean;
  enableTypeFilter?: boolean;
  enableCategoryFilter?: boolean;
  enableStatusFilter?: boolean;
  availableSorts?: SortOption[];
  defaultSort?: SortOption;
  defaultItemsPerPage?: ItemsPerPageOption;
}

export const useFilterSort = (config: FilterSortConfig = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    enableSearch = true,
    enableGenerationFilter = true,
    enableTypeFilter = false,
    enableCategoryFilter = false,
    enableStatusFilter = false,
    availableSorts = ['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc'],
    defaultSort = 'pokedex-asc',
    defaultItemsPerPage = 25
  } = config;

  // Get current state from URL parameters
  const currentState: FilterSortState = useMemo(() => ({
    searchQuery: searchParams.get('search') || '',
    sortBy: (searchParams.get('sort') as SortOption) || defaultSort,
    generationFilter: (searchParams.get('generation') as FilterOption) || 'all',
    typeFilter: searchParams.get('type') || 'all',
    categoryFilter: (searchParams.get('category') as CategoryFilter) || 'all',
    statusFilter: (searchParams.get('status') as StatusFilter) || 'all',
    currentPage: parseInt(searchParams.get('page') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('limit') || defaultItemsPerPage.toString(), 10) as ItemsPerPageOption,
  }), [searchParams, defaultSort, defaultItemsPerPage]);

  // Update URL parameters
  const updateState = useCallback((updates: Partial<FilterSortState>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' ||
        (key === 'searchQuery' && value === '') ||
        (key === 'sortBy' && value === defaultSort) ||
        (key === 'generationFilter' && value === 'all') ||
        (key === 'typeFilter' && value === 'all') ||
        (key === 'categoryFilter' && value === 'all') ||
        (key === 'statusFilter' && value === 'all') ||
        (key === 'currentPage' && value === 1) ||
        (key === 'itemsPerPage' && value === defaultItemsPerPage)) {
        // Map state keys to URL parameter names
        const paramKey = key === 'searchQuery' ? 'search' :
          key === 'sortBy' ? 'sort' :
            key === 'generationFilter' ? 'generation' :
              key === 'typeFilter' ? 'type' :
                key === 'categoryFilter' ? 'category' :
                  key === 'statusFilter' ? 'status' :
                    key === 'currentPage' ? 'page' :
                      key === 'itemsPerPage' ? 'limit' : key;
        newParams.delete(paramKey);
      } else {
        const paramKey = key === 'searchQuery' ? 'search' :
          key === 'sortBy' ? 'sort' :
            key === 'generationFilter' ? 'generation' :
              key === 'typeFilter' ? 'type' :
                key === 'categoryFilter' ? 'category' :
                  key === 'statusFilter' ? 'status' :
                    key === 'currentPage' ? 'page' :
                      key === 'itemsPerPage' ? 'limit' : key;
        newParams.set(paramKey, value.toString());
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams, defaultSort, defaultItemsPerPage]);

  // Individual update functions
  const setSearchQuery = useCallback((query: string) => {
    updateState({ searchQuery: query, currentPage: 1 });
  }, [updateState]);

  const setSortBy = useCallback((sort: SortOption) => {
    updateState({ sortBy: sort, currentPage: 1 });
  }, [updateState]);

  const setGenerationFilter = useCallback((generation: FilterOption) => {
    updateState({ generationFilter: generation, currentPage: 1 });
  }, [updateState]);

  const setTypeFilter = useCallback((type: TypeFilter) => {
    updateState({ typeFilter: type, currentPage: 1 });
  }, [updateState]);

  const setCategoryFilter = useCallback((category: CategoryFilter) => {
    updateState({ categoryFilter: category, currentPage: 1 });
  }, [updateState]);

  const setStatusFilter = useCallback((status: StatusFilter) => {
    updateState({ statusFilter: status, currentPage: 1 });
  }, [updateState]);

  const setCurrentPage = useCallback((page: number) => {
    updateState({ currentPage: page });
  }, [updateState]);

  const setItemsPerPage = useCallback((items: ItemsPerPageOption) => {
    updateState({ itemsPerPage: items, currentPage: 1 });
  }, [updateState]);

  const resetFilters = useCallback(() => {
    updateState({
      searchQuery: '',
      sortBy: defaultSort,
      generationFilter: 'all',
      typeFilter: 'all',
      categoryFilter: 'all',
      statusFilter: 'all',
      currentPage: 1,
      itemsPerPage: defaultItemsPerPage
    });
  }, [updateState, defaultSort, defaultItemsPerPage]);

  return {
    // Current state
    ...currentState,

    // Update functions
    setSearchQuery,
    setSortBy,
    setGenerationFilter,
    setTypeFilter,
    setCategoryFilter,
    setStatusFilter,
    setCurrentPage,
    setItemsPerPage,
    resetFilters,

    // Configuration
    config: {
      enableSearch,
      enableGenerationFilter,
      enableTypeFilter,
      enableCategoryFilter,
      enableStatusFilter,
      availableSorts,
    }
  };
};

// Utility functions for sorting and filtering
export const sortItems = <T extends { name: string; url?: string; id?: number }>(
  items: T[],
  sortBy: SortOption,
  extractId?: (item: T) => number
): T[] => {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'pokedex-asc': {
        const idA = extractId ? extractId(a) : (a.id || 0);
        const idB = extractId ? extractId(b) : (b.id || 0);
        return idA - idB;
      }
      case 'pokedex-desc': {
        const idA = extractId ? extractId(a) : (a.id || 0);
        const idB = extractId ? extractId(b) : (b.id || 0);
        return idB - idA;
      }
      case 'date-added': {
        // For now, sort by ID as a proxy for date added
        const idA = extractId ? extractId(a) : (a.id || 0);
        const idB = extractId ? extractId(b) : (b.id || 0);
        return idA - idB;
      }
      case 'popularity': {
        // For now, sort by reverse ID as a proxy for popularity
        const popIdA = extractId ? extractId(a) : (a.id || 0);
        const popIdB = extractId ? extractId(b) : (b.id || 0);
        return popIdB - popIdA;
      }
      case 'type':
        // This would need additional type information
        return a.name.localeCompare(b.name);
      case 'category':
        // This would need additional category information
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};

export const filterByGeneration = <T extends { url?: string; id?: number }>(
  items: T[],
  generation: FilterOption,
  extractId?: (item: T) => number
): T[] => {
  if (generation === 'all') return items;

  const genNumber = parseInt(generation.replace('gen', ''));
  return items.filter(item => {
    const id = extractId ? extractId(item) : (item.id || 0);
    return getPokemonGeneration(id) === genNumber;
  });
};

export const filterBySearch = <T extends { name: string }>(
  items: T[],
  query: string
): T[] => {
  if (!query.trim()) return items;

  const searchTerm = query.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(searchTerm)
  );
};

// Helper function to determine Pokemon generation
const getPokemonGeneration = (id: number): number => {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
};