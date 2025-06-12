export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      dream_world: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonType {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
    double_damage_to: Array<{ name: string; url: string }>;
    half_damage_from: Array<{ name: string; url: string }>;
    half_damage_to: Array<{ name: string; url: string }>;
    no_damage_from: Array<{ name: string; url: string }>;
    no_damage_to: Array<{ name: string; url: string }>;
  };
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
}

export interface EvolutionChain {
  id: number;
  chain: {
    evolution_details: Array<any>;
    evolves_to: Array<{
      evolution_details: Array<any>;
      evolves_to: Array<any>;
      species: {
        name: string;
        url: string;
      };
    }>;
    species: {
      name: string;
      url: string;
    };
  };
}

export interface Ability {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}