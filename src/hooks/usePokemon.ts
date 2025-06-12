import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../services/pokemonApi';

export const usePokemonList = (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['pokemon-list', page, limit],
    queryFn: () => pokemonApi.getPokemonList(offset, limit),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const usePokemon = (id: string | number) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonApi.getPokemon(id),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const usePokemonSpecies = (id: string | number) => {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => pokemonApi.getPokemonSpecies(id),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useEvolutionChain = (id: string | number) => {
  return useQuery({
    queryKey: ['evolution-chain', id],
    queryFn: () => pokemonApi.getEvolutionChain(id),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const usePokemonType = (name: string) => {
  return useQuery({
    queryKey: ['pokemon-type', name],
    queryFn: () => pokemonApi.getPokemonType(name),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

// New hook for paginated Pokemon by type
export const usePokemonByType = (typeName: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['pokemon-by-type', typeName, page, limit],
    queryFn: () => pokemonApi.getPokemonByType(typeName, page, limit),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!typeName,
  });
};

export const useAllTypes = () => {
  return useQuery({
    queryKey: ['all-types'],
    queryFn: () => pokemonApi.getAllTypes(),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useAbility = (name: string) => {
  return useQuery({
    queryKey: ['ability', name],
    queryFn: () => pokemonApi.getAbility(name),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!name,
  });
};

// New hooks for abilities
export const useAllAbilities = (page: number = 1, limit: number = 50) => {
  const offset = (page - 1) * limit;
  
  return useQuery({
    queryKey: ['all-abilities', page, limit],
    queryFn: () => pokemonApi.getAllAbilities(offset, limit),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useSearchAbilities = (query: string) => {
  return useQuery({
    queryKey: ['search-abilities', query],
    queryFn: () => pokemonApi.searchAbilities(query),
    staleTime: 10 * 60 * 1000, // 10 minutes for search results
    gcTime: 10 * 60 * 1000,
    enabled: query.length > 0,
  });
};

export const usePokemonWithAbility = (abilityName: string) => {
  return useQuery({
    queryKey: ['pokemon-with-ability', abilityName],
    queryFn: () => pokemonApi.getPokemonWithAbility(abilityName),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!abilityName,
  });
};

export const useSearchPokemon = (query: string) => {
  return useQuery({
    queryKey: ['search-pokemon', query],
    queryFn: () => pokemonApi.searchPokemon(query),
    staleTime: 10 * 60 * 1000, // 10 minutes for search results
    gcTime: 10 * 60 * 1000,
    enabled: query.length > 0,
  });
};