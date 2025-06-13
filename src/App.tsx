import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { TypesPage } from './pages/TypesPage';
import { TypeDetailPage } from './pages/TypeDetailPage';
import { AbilitiesPage } from './pages/AbilitiesPage';
import { AbilityDetailPage } from './pages/AbilityDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="page/:pageNumber" element={<HomePage />} />
                <Route path="pokemon/:id" element={<PokemonDetailPage />} />
                <Route path="types" element={<TypesPage />} />
                <Route path="type/:name" element={<TypeDetailPage />} />
                <Route path="type/:name/page/:pageNumber" element={<TypeDetailPage />} />
                <Route path="abilities" element={<AbilitiesPage />} />
                <Route path="ability/:name" element={<AbilityDetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;