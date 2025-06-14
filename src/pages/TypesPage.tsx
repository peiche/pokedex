import React from 'react';
import { Link } from 'react-router-dom';
import { useAllTypes } from '../hooks/usePokemon';
import { TypeBadge } from '../components/common/TypeBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TypesPage: React.FC = () => {
  const { data: typesData, isLoading, error } = useAllTypes();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading types..." />
      </div>
    );
  }

  if (error || !typesData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error loading types
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  // Filter out unknown and shadow types
  const mainTypes = typesData.results.filter((type) =>
    !['unknown', 'shadow'].includes(type.name)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pokémon Types
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore Pokémon by their types and learn about type effectiveness
        </p>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mainTypes.map((type) => (
          <Link
            key={type.name}
            to={`/type/${type.name}`}
            className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border-light dark:border-gray-700 hover:shadow-lg hover:scale-105 hover:border-border-light-hover dark:hover:border-gray-600 transition-all duration-300"
            aria-label={`View all ${type.name} type Pokémon`}
          >
            <div className="text-center">
              <TypeBadge type={type.name} size="lg" />
            </div>
          </Link>
        ))}
      </div>

      {/* Type Information */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About Pokémon Types
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Each Pokémon has one or two types that determine their strengths and weaknesses in battle.
            Understanding type matchups is crucial for strategic gameplay. Some types are super effective
            against others, while some are not very effective or have no effect at all.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
            Click on any type above to see all Pokémon of that type and learn about their effectiveness
            against other types.
          </p>
        </div>
      </div>
    </div>
  );
};