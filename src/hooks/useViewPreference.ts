import { useState, useEffect } from 'react';

type ViewMode = 'grid' | 'list';

export const useViewPreference = (key: string = 'default'): [ViewMode, (mode: ViewMode) => void] => {
  const storageKey = `pokemonApp_viewMode_${key}`;
  
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey) as ViewMode;
      return saved === 'list' || saved === 'grid' ? saved : 'grid';
    }
    return 'grid';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, mode);
    }
  };

  return [viewMode, setViewMode];
};