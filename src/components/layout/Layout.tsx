import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light-primary dark:bg-gray-900 transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};