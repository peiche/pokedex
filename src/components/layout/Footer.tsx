import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export const Footer: React.FC = () => {
    const { theme } = useTheme();
    const image = theme === 'dark' ? 'boltdotnew-white.png' : 'boltdotnew-black.png';

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-border-light dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Upper Section */}
                <div className="py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left Side - Website Title */}
                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                aria-label="Go to Poké-Vista home"
                            >
                                <span>Poké-Vista</span>
                            </Link>
                        </div>

                        {/* Right Side - Navigation Menu */}
                        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <Link
                                to="/types"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-md px-2 py-1"
                            >
                                Types
                            </Link>
                            <Link
                                to="/abilities"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-md px-2 py-1"
                            >
                                Abilities
                            </Link>
                            <Link
                                to="/favorites"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-md px-2 py-1"
                            >
                                Favorites
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-md px-2 py-1"
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="py-6 border-border-light dark:border-gray-700">
                    <div className="text-center">
                        <a
                            href="https://bolt.new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <img
                                src={`/images/${image}`}
                                alt="Powered by Bolt.new"
                                className="mx-auto block h-auto w-56"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};