import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { useCombinedSearch } from '../../hooks/usePokemon';
import { debounce, formatPokemonName, extractIdFromUrl } from '../../utils/pokemon';
import { useTheme } from '../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { data: searchResults, isLoading: isSearchLoading } = useCombinedSearch(searchQuery);

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchSelect = (result: { name: string; type: 'pokemon' | 'ability'; url: string }) => {
    if (result.type === 'pokemon') {
      const pokemonId = extractIdFromUrl(result.url);
      navigate(`/pokemon/${pokemonId}`);
    } else {
      navigate(`/ability/${result.name}`);
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border-light dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Go to Pokédex home"
          >
            <Zap className="w-8 h-8 text-yellow-500" />
            <span>Pokédex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex gap-5">
            <nav className="hidden md:flex items-center gap-5">
              <Link
                to="/types"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Types
              </Link>
              <Link
                to="/abilities"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Abilities
              </Link>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Pokémon & abilities..."
                  className="w-64 pl-10 pr-4 py-2 bg-background-light-secondary dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-border-light-focus dark:text-white"
                  onChange={handleSearchChange}
                  onFocus={(e) => e.target.value.length > 0 && setShowSearchResults(true)}
                  aria-label="Search for Pokémon and abilities"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
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
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  result.type === 'pokemon' 
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
              )}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-background-light-secondary dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-background-neutral-muted dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                className="md:hidden p-2 rounded-lg bg-background-light-secondary dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-background-neutral-muted dark:hover:bg-gray-700 transition-colors border border-border-light dark:border-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border-light dark:border-gray-700 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                to="/types"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Types
              </Link>
              <Link
                to="/abilities"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Abilities
              </Link>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Search */}
              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Pokémon & abilities..."
                    className="w-full pl-10 pr-4 py-2 bg-background-light-secondary dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-border-light-focus dark:text-white"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};