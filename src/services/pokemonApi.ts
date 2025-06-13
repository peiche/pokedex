import { PokeAPI } from "pokeapi-types";

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  // Get list of Pokemon with pagination
  getPokemonList: async (offset = 0, limit = 20): Promise<PokeAPI.NamedAPIResourceList> => {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon list');
    return response.json();
  },

  // Get individual Pokemon data
  getPokemon: async (id: string | number): Promise<PokeAPI.Pokemon> => {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon');
    return response.json();
  },

  // Get Pokemon species data
  getPokemonSpecies: async (id: string | number): Promise<PokeAPI.PokemonSpecies> => {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon species');
    return response.json();
  },

  // Get evolution chain
  getEvolutionChain: async (id: string | number): Promise<PokeAPI.EvolutionChain> => {
    const response = await fetch(`${BASE_URL}/evolution-chain/${id}`);
    if (!response.ok) throw new Error('Failed to fetch evolution chain');
    return response.json();
  },

  // Get Pokemon type data
  getPokemonType: async (name: string): Promise<PokeAPI.TypePokemon> => {
    const response = await fetch(`${BASE_URL}/type/${name}`);
    if (!response.ok) throw new Error('Failed to fetch Pokemon type');
    return response.json();
  },

  // Get paginated Pokemon by type with proper validation and metadata
  getPokemonByType: async (typeName: string, page: number = 1, limit: number = 20): Promise<{
    pokemon: Array<{ pokemon: { name: string; url: string }; slot: number }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextPage: number | null;
      previousPage: number | null;
    };
    typeInfo: PokeAPI.Type;
  }> => {
    // Validate page number
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('Page number must be a positive integer');
    }

    // First, get the complete type data to know total count
    const typeResponse = await fetch(`${BASE_URL}/type/${typeName}`);
    if (!typeResponse.ok) {
      throw new Error(`Failed to fetch type: ${typeName}`);
    }
    
    const typeData: PokeAPI.Type = await typeResponse.json();
    const allPokemon = typeData.pokemon;
    
    // Sort Pokemon consistently by ID (extracted from URL) to ensure stable pagination
    const sortedPokemon = allPokemon.sort((a, b) => {
      const idA = parseInt(a.pokemon.url.split('/').slice(-2, -1)[0]);
      const idB = parseInt(b.pokemon.url.split('/').slice(-2, -1)[0]);
      return idA - idB;
    });

    const totalItems = sortedPokemon.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Validate that the requested page exists
    if (page > totalPages && totalItems > 0) {
      throw new Error(`Page ${page} not found. Total pages available: ${totalPages}`);
    }

    // Calculate pagination
    const offset = (page - 1) * limit;
    const paginatedPokemon = sortedPokemon.slice(offset, offset + limit);
    
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      pokemon: paginatedPokemon,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null,
      },
      typeInfo: typeData,
    };
  },

  // Get all types
  getAllTypes: async (): Promise<PokeAPI.NamedAPIResourceList> => {
    const response = await fetch(`${BASE_URL}/type`);
    if (!response.ok) throw new Error('Failed to fetch types');
    return response.json();
  },

  // Get ability details
  getAbility: async (name: string): Promise<PokeAPI.Ability> => {
    const response = await fetch(`${BASE_URL}/ability/${name}`);
    if (!response.ok) throw new Error('Failed to fetch ability');
    return response.json();
  },

  // Get all abilities with pagination and search
  getAllAbilities: async (offset = 0, limit = 50): Promise<PokeAPI.NamedAPIResourceList> => {
    const response = await fetch(`${BASE_URL}/ability?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch abilities');
    return response.json();
  },

  // Search abilities by name
  searchAbilities: async (query: string): Promise<PokeAPI.NamedAPIResource[]> => {
    const response = await fetch(`${BASE_URL}/ability?limit=1000`);
    if (!response.ok) throw new Error('Failed to search abilities');
    const data: PokeAPI.NamedAPIResourceList = await response.json();
    return data.results.filter((ability) => 
      ability.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Get Pokemon with specific ability (with enhanced data)
  getPokemonWithAbility: async (abilityName: string): Promise<{
    ability: PokeAPI.Ability;
    pokemon: Array<{
      pokemon: PokeAPI.AbilityPokemon;
      pokemonData?: PokeAPI.Pokemon;
    }>;
  }> => {
    const abilityResponse = await fetch(`${BASE_URL}/ability/${abilityName}`);
    if (!abilityResponse.ok) throw new Error('Failed to fetch ability');
    const abilityData: PokeAPI.Ability = await abilityResponse.json();

    // Get detailed Pokemon data for each Pokemon with this ability
    const pokemonWithDetails = await Promise.all(
      abilityData.pokemon.map(async (pokemonEntry) => {
        try {
          const pokemonResponse = await fetch(pokemonEntry.pokemon.url);
          const pokemonData: PokeAPI.Pokemon = await pokemonResponse.json();
          
          return {
            pokemon: pokemonEntry,
            pokemonData,
          };
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          // If we can't fetch Pokemon data, return without it
          return {
            pokemon: pokemonEntry,
          };
        }
      })
    );

    return {
      ability: abilityData,
      pokemon: pokemonWithDetails,
    };
  },

  // Search Pokemon by name (using the list endpoint and filtering)
  searchPokemon: async (query: string): Promise<PokeAPI.NamedAPIResource[]> => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=1000`);
    if (!response.ok) throw new Error('Failed to search Pokemon');
    const data: PokeAPI.NamedAPIResourceList = await response.json();
    return data.results.filter((pokemon) => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results for autocomplete
  }
};