import { SearchResult } from "../../services/pokemonApi";
import { extractIdFromUrl, formatPokemonName } from "../../utils/pokemon";

interface SearchSuggestProps {
    isSearchLoading: boolean;
    searchResults: SearchResult[] | undefined;
    handleSearchSelect: (result: SearchResult) => void;
    searchQuery: string;
}

export const SearchSuggest: React.FC<SearchSuggestProps> = ({
    isSearchLoading,
    searchResults,
    handleSearchSelect,
    searchQuery,
}) => {
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
            {isSearchLoading ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchResults && searchResults.length > 0 ? (
                <ul role="listbox" aria-label="Search results">
                    {searchResults.map((result, index) => (
                        <li key={`${result.type}-${result.name}-${index}`}>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-background-neutral-muted dark:hover:bg-gray-700 transition-colors focus:outline-none focus:bg-background-neutral-muted dark:focus:bg-gray-700"
                                onClick={() => handleSearchSelect(result)}
                                role="option"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-900 dark:text-white">
                                        {formatPokemonName(result.name)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {result.type === 'pokemon' && (
                                            <span className="text-sm text-gray-500">
                                                #{extractIdFromUrl(result.url).toString().padStart(3, '0')}
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 text-xs rounded-full ${result.type === 'pokemon'
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                            : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                            }`}>
                                            {result.type === 'pokemon' ? 'Pokémon' : 'Ability'}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : searchQuery.length > 0 ? (
                <div className="p-4 text-center text-gray-500">No results found</div>
            ) : null}
        </div>
    );
};