import { useState, useEffect, useCallback } from 'react';

// Generic hook for persisting any state to localStorage
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    validator?: (value: unknown) => value is T;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validator
  } = options;

  // Initialize state from localStorage or default
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      const parsed = deserialize(item);
      
      // Validate the parsed value if validator is provided
      if (validator && !validator(parsed)) {
        console.warn(`Invalid persisted state for key "${key}", using default value`);
        return defaultValue;
      }
      
      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setState((prevState) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
        
        try {
          localStorage.setItem(key, serialize(newValue));
        } catch (error) {
          console.warn(`Error writing to localStorage key "${key}":`, error);
        }
        
        return newValue;
      });
    } catch (error) {
      console.warn(`Error updating state for key "${key}":`, error);
    }
  }, [key, serialize]);

  // Reset to default value
  const resetValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(defaultValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = deserialize(e.newValue);
          if (!validator || validator(parsed)) {
            setState(parsed);
          }
        } catch (error) {
          console.warn(`Error syncing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, validator]);

  return [state, setValue, resetValue];
}