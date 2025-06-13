import { useViewModePreference } from './useUIPreferences';

type ViewMode = 'grid' | 'list';

// Updated hook that uses the new persistent state system
export const useViewPreference = (key: string = 'default'): [ViewMode, (mode: ViewMode) => void] => {
  const [viewMode, setViewMode] = useViewModePreference(key);
  
  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode, false); // Don't apply globally by default
  };

  return [viewMode, updateViewMode];
};