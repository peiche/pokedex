import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemon';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { Pagination } from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const [searchParams] = useSearchParams();
  
  // Get page from URL params first, then from search params, default to 1
  const currentPage = parseInt(pageNumber || searchParams.get('page') || '1', 10);
  
  const { data, isLoading, error } = usePokemonList(currentPage, 20);

  const totalPages = data ? Math.ceil(data.count / 20) : 0;

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error loading Pokémon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pokédex
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover and learn about Pokémon
        </p>
        {data && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, data.count)} of {data.count} Pokémon
          </p>
        )}
      </div>

      {/* Pokemon Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading Pokémon..." />
        </div>
      ) : (
        <PokemonGrid pokemon={data?.results || []} />
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/"
          showPageInfo
          totalItems={data.count}
          itemsPerPage={20}
          className="pt-8"
        />
      )}
    </div>
  );
};