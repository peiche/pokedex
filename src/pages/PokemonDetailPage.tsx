import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Ruler, Weight, Zap, ExternalLink } from 'lucide-react';
import { usePokemon, usePokemonSpecies, useAbility } from '../hooks/usePokemon';
import { TypeBadge } from '../components/common/TypeBadge';
import { StatBar } from '../components/pokemon/StatBar';
import { EvolutionChain } from '../components/pokemon/EvolutionChain';
import { Accordion } from '../components/common/Accordion';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  formatPokemonName, 
  formatHeight, 
  formatWeight,
  getPokemonGeneration,
} from '../utils/pokemon';

const AbilityContent: React.FC<{ abilityName: string }> = ({ abilityName }) => {
  const { data: ability, isLoading, error } = useAbility(abilityName);
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading ability details...</span>
      </div>
    );
  }

  if (error || !ability) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        <p>Unable to load ability details.</p>
      </div>
    );
  }

  const description = ability.effect_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.effect || ability.flavor_text_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text;

  const shortDescription = ability.flavor_text_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text;

  return (
    <div className="space-y-4">
      {shortDescription && (
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Description</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {shortDescription.replace(/\f/g, ' ')}
          </p>
        </div>
      )}
      
      {description && description !== shortDescription && (
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Detailed Effect</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description.replace(/\f/g, ' ')}
          </p>
        </div>
      )}

      {ability.pokemon && ability.pokemon.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Other Pokémon with this ability
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {ability.pokemon.length} Pokémon have this ability
          </p>
          <Link
            to={`/ability/${abilityName}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>See all Pokémon with this ability</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

export const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: pokemon, isLoading, error } = usePokemon(id!);
  const { data: species } = usePokemonSpecies(id!);

  const pokemonId = parseInt(id!, 10);
  const prevId = pokemonId > 1 ? pokemonId - 1 : null;
  const nextId = pokemonId < 1010 ? pokemonId + 1 : null; // Approximate max

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading Pokémon details..." />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pokémon not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The Pokémon you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pokédex
        </Link>
      </div>
    );
  }

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.other?.dream_world?.front_default ||
                   pokemon.sprites?.front_default;

  const description = species?.flavor_text_entries?.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text?.replace(/\f/g, ' ');

  const genus = species?.genera?.find(
    (entry) => entry.language.name === 'en'
  )?.genus;

  // Prepare accordion items for abilities
  const abilityAccordionItems = pokemon.abilities.map((ability) => ({
    id: ability.ability.name,
    title: (
      <div className="flex items-center gap-2">
        <Link
          to={`/ability/${ability.ability.name}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {formatPokemonName(ability.ability.name)}
        </Link>
      </div>
    ),
    content: <AbilityContent abilityName={ability.ability.name} />,
    icon: <Zap className="w-4 h-4" />,
    badge: ability.is_hidden ? (
      <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
        Hidden
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-background-neutral-muted dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
        Slot {ability.slot}
      </span>
    )
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-background-light-secondary dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-background-neutral-muted dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {prevId && (
            <Link
              to={`/pokemon/${prevId}`}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
              aria-label={`Previous Pokémon (#${prevId})`}
            >
              <ChevronLeft className="w-4 h-4" />
              #{prevId.toString().padStart(3, '0')}
            </Link>
          )}
          {nextId && (
            <Link
              to={`/pokemon/${nextId}`}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700"
              aria-label={`Next Pokémon (#${nextId})`}
            >
              #{nextId.toString().padStart(3, '0')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-background-blue-subtle to-background-purple-subtle dark:from-gray-700 dark:to-gray-600">
            <div className="aspect-square max-w-sm mx-auto">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={formatPokemonName(pokemon.name)}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="w-full h-full bg-background-neutral-muted dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-1/2 p-8">
            <div className="space-y-6">
              {/* Name and ID */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatPokemonName(pokemon.name)}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="text-xl font-mono">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                  {genus && (
                    <span className="text-lg">{genus}</span>
                  )}
                </div>
              </div>

              {/* Types */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Type{pokemon.types.length > 1 ? 's' : ''}
                </h3>
                <div className="flex gap-2">
                  {pokemon.types.map((type) => (
                    <TypeBadge 
                      key={type.type.name} 
                      type={type.type.name} 
                      clickable 
                      size="lg"
                    />
                  ))}
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-light-secondary dark:bg-gray-700 rounded-lg p-4 border border-border-light dark:border-gray-600">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm font-medium">Height</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatHeight(pokemon.height)}
                  </span>
                </div>
                <div className="bg-background-light-secondary dark:bg-gray-700 rounded-lg p-4 border border-border-light dark:border-gray-600">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Weight className="w-4 h-4" />
                    <span className="text-sm font-medium">Weight</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatWeight(pokemon.weight)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Base Stats
        </h2>
        <div className="space-y-4">
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.stat.name}
              statName={stat.stat.name}
              statValue={stat.base_stat}
            />
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-border-light dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span>
            <span>Generation {getPokemonGeneration(pokemon.id)}</span>
          </div>
        </div>
      </div>

      {/* Abilities Section with Accordion */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Abilities
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Click on an ability to learn more about its effects and see other Pokémon that have it.
        </p>
        <Accordion 
          items={abilityAccordionItems}
          allowMultiple={false}
          className="max-w-none"
        />
      </div>

      {/* Evolution Chain */}
      {species && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Evolution Chain
          </h2>
          <EvolutionChain speciesUrl={species.evolution_chain.url} />
        </div>
      )}
    </div>
  );
};