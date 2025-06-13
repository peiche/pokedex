import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Eye, EyeOff, Filter, Grid, List } from 'lucide-react';
import { usePokemonWithAbility } from '../hooks/usePokemon';
import { TypeBadge } from '../components/common/TypeBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AbilityPokemonSkeleton } from '../components/common/PokemonSkeleton';
import {
  formatPokemonName,
  extractIdFromUrl,
} from '../utils/pokemon';
import { PokeAPI } from 'pokeapi-types';

type ViewMode = 'grid' | 'list';
type SortOption = 'pokedex' | 'name' | 'type';
type FilterOption = 'all' | 'primary' | 'hidden';

export const AbilityDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('pokedex');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const { data, isLoading, error } = usePokemonWithAbility(name!);

  // Process and sort Pokemon
  const processedPokemon = useMemo(() => {
    if (!data?.pokemon) return [];

    let filtered = data.pokemon.slice();

    // Filter by ability type
    if (filterBy === 'primary') {
      filtered = filtered.filter(p => !p.pokemon.is_hidden);
    } else if (filterBy === 'hidden') {
      filtered = filtered.filter(p => p.pokemon.is_hidden);
    }

    // Sort Pokemon
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'pokedex': {
          const idA = extractIdFromUrl(a.pokemon.pokemon.url);
          const idB = extractIdFromUrl(b.pokemon.pokemon.url);
          return idA - idB;
        }
        case 'name': {
          return a.pokemon.pokemon.name.localeCompare(b.pokemon.pokemon.name);
        }
        case 'type': {
          // Sort by primary type, then by name
          const typeA = a.pokemonData?.types?.[0]?.type?.name || 'zzz';
          const typeB = b.pokemonData?.types?.[0]?.type?.name || 'zzz';
          if (typeA !== typeB) {
            return typeA.localeCompare(typeB);
          }
          return a.pokemon.pokemon.name.localeCompare(b.pokemon.pokemon.name);
        }
        default:
          return 0;
      }
    });
  }, [data, sortBy, filterBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading ability details..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ability not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The ability you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link
          to="/abilities"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Abilities
        </Link>
      </div>
    );
  }

  const { ability, pokemon } = data;

  const description = ability.effect_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.effect;

  const shortDescription = ability.flavor_text_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text;

  const primaryCount = pokemon.filter(p => !p.pokemon.is_hidden).length;
  const hiddenCount = pokemon.filter(p => p.pokemon.is_hidden).length;

  // Check if Pokemon data is still loading
  const isPokemonDataLoading = pokemon.some(p => !p.pokemonData);

  const PokemonCard: React.FC<{
    pokemonEntry: {
      pokemon: PokeAPI.AbilityPokemon;
      pokemonData?: PokeAPI.Pokemon;
    }
  }> = ({ pokemonEntry }) => {
    const pokemonId = extractIdFromUrl(pokemonEntry.pokemon.pokemon.url);
    const pokemonData = pokemonEntry.pokemonData;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    return (
      <Link
        to={`/pokemon/${pokemonId}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
        aria-label={`View details for ${formatPokemonName(pokemonEntry.pokemon.pokemon.name)}`}
      >
        <div className="p-6">
          {/* Pokemon Image */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={imageUrl}
              alt={formatPokemonName(pokemonEntry.pokemon.pokemon.name)}
              className="w-full h-full object-contain"
              loading="lazy"
            />
            {pokemonEntry.pokemon.is_hidden && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <EyeOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Pokemon Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {formatPokemonName(pokemonEntry.pokemon.pokemon.name)}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              #{pokemonId.toString().padStart(3, '0')}
            </p>

            {/* Types */}
            {pokemonData?.types && (
              <div className="flex justify-center gap-1 mb-2">
                {pokemonData.types.map((type) => (
                  <TypeBadge
                    key={type.type.name}
                    type={type.type.name}
                    size="sm"
                  />
                ))}
              </div>
            )}

            {/* Ability Type Badge */}
            <div className="flex justify-center">
              <span className={`px-2 py-1 text-xs rounded-full ${pokemonEntry.pokemon.is_hidden
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}>
                {pokemonEntry.pokemon.is_hidden ? 'Hidden Ability' : 'Primary Ability'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const PokemonListItem: React.FC<{
    pokemonEntry: {
      pokemon: PokeAPI.AbilityPokemon;
      pokemonData?: PokeAPI.Pokemon;
    }
  }> = ({ pokemonEntry }) => {
    const pokemonId = extractIdFromUrl(pokemonEntry.pokemon.pokemon.url);
    const pokemonData = pokemonEntry.pokemonData;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <Link
        to={`/pokemon/${pokemonId}`}
        className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 hover:shadow-md hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-200"
        aria-label={`View details for ${formatPokemonName(pokemonEntry.pokemon.pokemon.name)}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Pokemon Image */}
            <div className="relative flex-shrink-0 w-16 h-16">
              <img
                src={imageUrl}
                alt={formatPokemonName(pokemonEntry.pokemon.pokemon.name)}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {pokemonEntry.pokemon.is_hidden && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <EyeOff className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {/* Pokemon Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {formatPokemonName(pokemonEntry.pokemon.pokemon.name)}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{pokemonId.toString().padStart(3, '0')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Types */}
                {pokemonData?.types && (
                  <div className="flex gap-1">
                    {pokemonData.types.map((type) => (
                      <TypeBadge
                        key={type.type.name}
                        type={type.type.name}
                        size="sm"
                      />
                    ))}
                  </div>
                )}

                {/* Ability Type */}
                <span className={`px-2 py-1 text-xs rounded-full ${pokemonEntry.pokemon.is_hidden
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                  {pokemonEntry.pokemon.is_hidden ? 'Hidden' : 'Primary'}
                </span>
              </div>
            </div>

            {/* Stats Preview */}
            {pokemonData?.stats && (
              <div className="hidden lg:block text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Stats</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {pokemonData.stats.reduce((sum: number, stat) => sum + stat.base_stat, 0)}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link
        to="/abilities"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Abilities
      </Link>

      {/* Ability Header */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {formatPokemonName(name!)}
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {pokemon.length} Pokémon have this ability
            </p>

            <div className="flex gap-4 text-sm">
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{primaryCount} Primary</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  <span>{hiddenCount} Hidden</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ability Description */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Ability Description
        </h2>

        <div className="space-y-4">
          {shortDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {shortDescription.replace(/\f/g, ' ')}
              </p>
            </div>
          )}

          {description && description !== shortDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Detailed Effect
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {description.replace(/\f/g, ' ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="bg-gray-50 dark:bg-gray-700 border border-border-light dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-border-light-focus dark:text-white"
                aria-label="Filter Pokemon by ability type"
              >
                <option value="all">All Pokémon ({pokemon.length})</option>
                <option value="primary">Primary Only ({primaryCount})</option>
                <option value="hidden">Hidden Only ({hiddenCount})</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-50 dark:bg-gray-700 border border-border-light dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-border-light-focus dark:text-white"
              aria-label="Sort Pokemon"
            >
              <option value="pokedex">Sort by Pokédex #</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-border-light dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm border border-border-light dark:border-gray-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm border border-border-light dark:border-gray-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pokemon List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pokémon with {formatPokemonName(name!)}
        </h2>

        {/* Show skeleton while Pokemon data is loading */}
        {isPokemonDataLoading ? (
          <AbilityPokemonSkeleton viewMode={viewMode} />
        ) : processedPokemon.length > 0 ? (
          <div className="animate-fade-in">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {processedPokemon.map((pokemonEntry) => (
                  <PokemonCard key={`${pokemonEntry.pokemon.pokemon.name}-${pokemonEntry.pokemon.is_hidden}`} pokemonEntry={pokemonEntry} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {processedPokemon.map((pokemonEntry) => (
                  <PokemonListItem key={`${pokemonEntry.pokemon.pokemon.name}-${pokemonEntry.pokemon.is_hidden}`} pokemonEntry={pokemonEntry} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No Pokémon found with the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};