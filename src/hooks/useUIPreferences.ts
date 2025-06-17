import { usePersistedState } from './usePersistedState';

// UI Preference Types
export type ViewMode = 'grid' | 'list';
export type SortOrder = 'name-asc' | 'name-desc' | 'pokedex-asc' | 'pokedex-desc' | 'date-added' | 'popularity';
export type ItemsPerPage = 10 | 25 | 50 | 100;

export interface UIPreferences {
  viewMode: ViewMode;
  sortOrder: SortOrder;
  itemsPerPage: ItemsPerPage;
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showTypeColors: boolean;
  autoPlayAnimations: boolean;
}

export interface PageSpecificPreferences {
  homepage: Partial<UIPreferences>;
  abilities: Partial<UIPreferences>;
  types: Partial<UIPreferences>;
  [key: string]: Partial<UIPreferences>;
}

// Default preferences
const DEFAULT_PREFERENCES: UIPreferences = {
  viewMode: 'grid',
  sortOrder: 'pokedex-asc',
  itemsPerPage: 25,
  theme: 'system',
  compactMode: false,
  showTypeColors: true,
  autoPlayAnimations: true,
};

// Validator function to ensure preferences are valid
const isValidPreferences = (value: unknown): value is Partial<UIPreferences> => {
  if (typeof value !== 'object' || value === null) return false;
  
  const prefs = value as Record<string, unknown>;
  
  // Validate viewMode
  if (prefs.viewMode !== undefined && !['grid', 'list'].includes(prefs.viewMode as string)) {
    return false;
  }
  
  // Validate sortOrder
  if (prefs.sortOrder !== undefined && 
      !['name-asc', 'name-desc', 'pokedex-asc', 'pokedex-desc', 'date-added', 'popularity'].includes(prefs.sortOrder as string)) {
    return false;
  }
  
  // Validate itemsPerPage
  if (prefs.itemsPerPage !== undefined && 
      ![10, 25, 50, 100].includes(prefs.itemsPerPage as number)) {
    return false;
  }
  
  // Validate theme
  if (prefs.theme !== undefined && 
      !['light', 'dark', 'system'].includes(prefs.theme as string)) {
    return false;
  }
  
  // Validate boolean fields
  if (prefs.compactMode !== undefined && typeof prefs.compactMode !== 'boolean') {
    return false;
  }
  
  if (prefs.showTypeColors !== undefined && typeof prefs.showTypeColors !== 'boolean') {
    return false;
  }
  
  if (prefs.autoPlayAnimations !== undefined && typeof prefs.autoPlayAnimations !== 'boolean') {
    return false;
  }
  
  return true;
};

// Hook for global UI preferences
export const useUIPreferences = () => {
  const [preferences, setPreferences, resetPreferences] = usePersistedState<UIPreferences>(
    'pokemonApp_globalPreferences',
    DEFAULT_PREFERENCES,
    { validator: isValidPreferences as (value: unknown) => value is UIPreferences }
  );

  const updatePreference = <K extends keyof UIPreferences>(
    key: K,
    value: UIPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updatePreferences = (updates: Partial<UIPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };
};

// Hook for page-specific preferences
export const usePagePreferences = (pageKey: string) => {
  const { preferences: globalPreferences, updatePreference: updateGlobalPreference } = useUIPreferences();
  
  const [pagePreferences, setPagePreferences, resetPagePreferences] = usePersistedState<PageSpecificPreferences>(
    'pokemonApp_pagePreferences',
    {} as PageSpecificPreferences,
    { validator: (value): value is PageSpecificPreferences => typeof value === 'object' && value !== null }
  );

  // Get effective preferences (page-specific overrides global)
  const effectivePreferences: UIPreferences = {
    ...globalPreferences,
    ...pagePreferences[pageKey],
  };

  const updatePagePreference = <K extends keyof UIPreferences>(
    key: K,
    value: UIPreferences[K],
    applyGlobally = false
  ) => {
    if (applyGlobally) {
      // Update global preference
      updateGlobalPreference(key, value);
      // Remove page-specific override if it exists
      setPagePreferences(prev => {
        const newPagePrefs = { ...prev };
        if (newPagePrefs[pageKey]) {
          delete newPagePrefs[pageKey][key];
          // Remove page entry if it's empty
          if (Object.keys(newPagePrefs[pageKey]).length === 0) {
            delete newPagePrefs[pageKey];
          }
        }
        return newPagePrefs;
      });
    } else {
      // Update page-specific preference
      setPagePreferences(prev => ({
        ...prev,
        [pageKey]: {
          ...prev[pageKey],
          [key]: value,
        },
      }));
    }
  };

  const resetPagePreference = (key: keyof UIPreferences) => {
    setPagePreferences(prev => {
      const newPagePrefs = { ...prev };
      if (newPagePrefs[pageKey]) {
        delete newPagePrefs[pageKey][key];
        // Remove page entry if it's empty
        if (Object.keys(newPagePrefs[pageKey]).length === 0) {
          delete newPagePrefs[pageKey];
        }
      }
      return newPagePrefs;
    });
  };

  const resetAllPagePreferences = () => {
    setPagePreferences(prev => {
      const newPagePrefs = { ...prev };
      delete newPagePrefs[pageKey];
      return newPagePrefs;
    });
  };

  return {
    preferences: effectivePreferences,
    pagePreferences: pagePreferences[pageKey] || {},
    updatePagePreference,
    resetPagePreference,
    resetAllPagePreferences,
    resetPagePreferences,
  };
};

// Specialized hooks for common preferences
export const useViewModePreference = (pageKey: string = 'global') => {
  const { preferences, updatePagePreference } = usePagePreferences(pageKey);
  
  return [
    preferences.viewMode,
    (viewMode: ViewMode, applyGlobally = false) => 
      updatePagePreference('viewMode', viewMode, applyGlobally)
  ] as const;
};

export const useSortOrderPreference = (pageKey: string = 'global') => {
  const { preferences, updatePagePreference } = usePagePreferences(pageKey);
  
  return [
    preferences.sortOrder,
    (sortOrder: SortOrder, applyGlobally = false) => 
      updatePagePreference('sortOrder', sortOrder, applyGlobally)
  ] as const;
};

export const useItemsPerPagePreference = (pageKey: string = 'global') => {
  const { preferences, updatePagePreference } = usePagePreferences(pageKey);
  
  return [
    preferences.itemsPerPage,
    (itemsPerPage: ItemsPerPage, applyGlobally = false) => 
      updatePagePreference('itemsPerPage', itemsPerPage, applyGlobally)
  ] as const;
};

// Hook for managing all preferences with bulk operations
export const usePreferencesManager = () => {
  const { preferences: globalPreferences, resetPreferences: resetGlobal } = useUIPreferences();
  const [pagePreferences, , resetPagePreferences] = usePersistedState<PageSpecificPreferences>(
    'pokemonApp_pagePreferences',
    {} as PageSpecificPreferences,
  );

  const exportPreferences = () => {
    return {
      global: globalPreferences,
      pages: pagePreferences,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
  };

  const importPreferences = (data: ReturnType<typeof exportPreferences>) => {
    try {
      if (data.version === '1.0') {
        // Validate and import global preferences
        if (isValidPreferences(data.global)) {
          localStorage.setItem('pokemonApp_globalPreferences', JSON.stringify(data.global));
        }
        
        // Validate and import page preferences
        if (typeof data.pages === 'object' && data.pages !== null) {
          localStorage.setItem('pokemonApp_pagePreferences', JSON.stringify(data.pages));
        }
        
        // Reload the page to apply changes
        window.location.reload();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  };

  const resetAllPreferences = () => {
    resetGlobal();
    resetPagePreferences();
  };

  const getStorageUsage = () => {
    try {
      const globalSize = localStorage.getItem('pokemonApp_globalPreferences')?.length || 0;
      const pageSize = localStorage.getItem('pokemonApp_pagePreferences')?.length || 0;
      return {
        global: globalSize,
        pages: pageSize,
        total: globalSize + pageSize,
      };
    } catch {
      return { global: 0, pages: 0, total: 0 };
    }
  };

  return {
    globalPreferences,
    pagePreferences,
    exportPreferences,
    importPreferences,
    resetAllPreferences,
    getStorageUsage,
  };
};