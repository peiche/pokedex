import { usePersistedState } from './usePersistedState';
import { useCallback } from 'react';

export interface FavoritePokemon {
  id: number;
  name: string;
  url: string;
  addedAt: string; // ISO timestamp
}

// Validator function for favorites data
const isFavoritesArray = (value: unknown): value is FavoritePokemon[] => {
  if (!Array.isArray(value)) return false;
  
  return value.every(item => 
    typeof item === 'object' && 
    item !== null &&
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.url === 'string' &&
    typeof item.addedAt === 'string'
  );
};

export const useFavorites = () => {
  const [favorites, setFavorites, resetFavorites] = usePersistedState<FavoritePokemon[]>(
    'pokemonApp_favorites',
    [],
    { validator: isFavoritesArray }
  );

  // Check if a Pokemon is favorited
  const isFavorite = useCallback((pokemonId: number): boolean => {
    return favorites.some(fav => fav.id === pokemonId);
  }, [favorites]);

  // Add a Pokemon to favorites
  const addToFavorites = useCallback((pokemon: {
    id: number;
    name: string;
    url: string;
  }) => {
    setFavorites(prev => {
      // Check if already favorited
      if (prev.some(fav => fav.id === pokemon.id)) {
        return prev;
      }
      
      const newFavorite: FavoritePokemon = {
        ...pokemon,
        addedAt: new Date().toISOString()
      };
      
      return [...prev, newFavorite];
    });
  }, [setFavorites]);

  // Remove a Pokemon from favorites
  const removeFromFavorites = useCallback((pokemonId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== pokemonId));
  }, [setFavorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((pokemon: {
    id: number;
    name: string;
    url: string;
  }) => {
    if (isFavorite(pokemon.id)) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  // Get favorites count
  const favoritesCount = favorites.length;

  // Get favorites sorted by most recently added
  const getFavoritesSorted = useCallback((sortBy: 'recent' | 'name' | 'id' = 'recent') => {
    const sorted = [...favorites];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'id':
        return sorted.sort((a, b) => a.id - b.id);
      default:
        return sorted;
    }
  }, [favorites]);

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    resetFavorites();
  }, [resetFavorites]);

  return {
    favorites,
    favoritesCount,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesSorted,
    clearAllFavorites
  };
};