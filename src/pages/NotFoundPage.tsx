import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-32 h-32 mx-auto mb-8 text-gray-400 dark:text-gray-500">
          <Search className="w-full h-full" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, deleted, 
          or you might have typed the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Poke-Vista
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Or try these popular sections:</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link 
                to="/types" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Types
              </Link>
              <span>•</span>
              <Link 
                to="/pokemon/1" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Bulbasaur
              </Link>
              <span>•</span>
              <Link 
                to="/pokemon/25" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Pikachu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};