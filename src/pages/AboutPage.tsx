import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Zap, 
  ChevronRight, 
  Eye, 
  EyeOff,
  ArrowRight,
  BookOpen,
  Target,
  Layers,
  TrendingUp,
  Heart,
  Settings,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { TypeBadge } from '../components/common/TypeBadge';

export const AboutPage: React.FC = () => {
  const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
  }> = ({ icon, title, description, children }) => (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );

  const StepCard: React.FC<{
    step: number;
    title: string;
    description: string;
    visual?: React.ReactNode;
  }> = ({ step, title, description, visual }) => (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>
          {visual && (
            <div className="mt-3">
              {visual}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Poke-Vista
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Your comprehensive guide to exploring the world of Pokémon. Learn how to use all the features 
          of this modern Poke-Vista to discover, research, and understand Pokémon like never before.
        </p>
      </div>

      {/* Main Features Overview - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Main Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            title="Smart Search & Browse"
            description="Instantly find any Pokémon with our powerful search functionality, or browse through organized lists with advanced filtering options."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-green-600 dark:text-green-400" />}
            title="Type Exploration"
            description="Discover Pokémon by their types and learn about type effectiveness, strengths, and weaknesses in battle."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            title="Ability Database"
            description="Explore all Pokémon abilities with detailed descriptions and see which Pokémon possess each ability."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            title="Evolution Chains"
            description="Visualize complete evolution paths and understand how Pokémon transform and grow."
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6 text-red-600 dark:text-red-400" />}
            title="Personal Favorites"
            description="Save your favorite Pokémon for quick access and build your personal collection with persistent storage."
          />
          <FeatureCard
            icon={<Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
            title="Customizable Experience"
            description="Personalize your browsing with adjustable view modes, sorting options, and results per page settings."
          />
        </div>
      </div>

      {/* Theme and Display Modes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          Light & Dark Mode
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Finding the Theme Toggle"
            description="Look for the theme toggle button in the top-right corner of the header, next to the mobile menu button. It displays a sun icon in dark mode and a moon icon in light mode."
            visual={
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-border-light dark:border-gray-500">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Light Mode</span>
                </div>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-border-light dark:border-gray-500">
                  <Moon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
                </div>
              </div>
            }
          />
          
          <StepCard
            step={2}
            title="Switching Between Modes"
            description="Click the theme toggle button to instantly switch between light and dark modes. The change applies immediately across the entire application with smooth transitions."
          />
          
          <StepCard
            step={3}
            title="System Preference Detection"
            description="When you first visit Poke-Vista, the theme automatically matches your device's system preference. If your device is set to dark mode, the site will load in dark mode, and vice versa."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically detects your system preference
                </span>
              </div>
            }
          />
          
          <StepCard
            step={4}
            title="Persistent Theme Choice"
            description="Your theme preference is automatically saved to your browser's local storage. When you return to Poke-Vista, it will remember your choice and load in your preferred mode."
          />
        </div>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
            🌙 Dark Mode Benefits
          </h4>
          <p className="text-sm text-purple-800 dark:text-purple-300">
            Dark mode reduces eye strain in low-light environments and can help save battery life on devices with OLED screens. 
            All colors and contrasts are carefully optimized to maintain readability and visual hierarchy in both themes.
          </p>
        </div>
      </div>

      {/* Favorites System */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
          Managing Your Favorite Pokémon
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Adding Favorites"
            description="Click the heart icon on any Pokémon card to instantly add it to your favorites. The heart will turn red to show it's been saved."
            visual={
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border border-border-light dark:border-gray-500">
                  <Heart className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
                <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border border-border-light dark:border-gray-500">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Click to favorite</span>
              </div>
            }
          />
          
          <StepCard
            step={2}
            title="Accessing Your Collection"
            description="Visit your favorites page by clicking 'Favorites' in the main navigation. All your saved Pokémon are stored locally and persist between sessions."
            visual={
              <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Favorites</span>
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                    12 saved
                  </span>
                </div>
              </div>
            }
          />
          
          <StepCard
            step={3}
            title="Managing Your Favorites"
            description="On the favorites page, you can search, filter, and sort your collection. Remove individual Pokémon by clicking their heart icon again, or clear all favorites at once."
          />
          
          <StepCard
            step={4}
            title="Automatic Sync"
            description="Your favorites are automatically saved to your browser's local storage. They'll be there when you return, even after closing your browser."
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            💡 Pro Tip
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Your favorites are sorted by most recently added by default, making it easy to find Pokémon you've just discovered. 
            You can change the sorting to alphabetical or by Pokémon number in the favorites page controls.
          </p>
        </div>
      </div>

      {/* Search Results Customization */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          Customizing Your Search Results
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Adjusting Results Per Page"
            description="Control how many Pokémon appear on each page using the 'Show' dropdown. Choose from 10, 25, 50, or 100 results per page based on your preference."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
                <select className="bg-white dark:bg-gray-700 border border-border-light dark:border-gray-500 rounded-lg px-3 py-2 text-sm">
                  <option>25 per page</option>
                </select>
              </div>
            }
          />
          
          <StepCard
            step={2}
            title="Switching View Modes"
            description="Toggle between grid and list views using the view mode buttons. Grid view shows larger cards with images, while list view displays more compact information."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1 border border-border-light dark:border-gray-500">
                  <button className="p-2 bg-blue-600 text-white rounded-md">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Grid / List view</span>
              </div>
            }
          />
          
          <StepCard
            step={3}
            title="Persistent Preferences"
            description="Your view preferences are automatically saved for each page. The homepage, favorites, types, and abilities pages each remember your preferred settings."
          />
          
          <StepCard
            step={4}
            title="Smart Filtering"
            description="Use the generation filter to narrow results to specific regions, and combine with search to find exactly what you're looking for. All filters work together seamlessly."
          />
        </div>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
            ⚡ Performance Note
          </h4>
          <p className="text-sm text-green-800 dark:text-green-300">
            Higher results per page (50-100) may take slightly longer to load but reduce the need for pagination. 
            Choose the setting that works best for your device and internet connection.
          </p>
        </div>
      </div>

      {/* How to Browse and Search - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Browsing & Searching Pokémon
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Start from the Homepage"
            description="The main page displays all Pokémon in a grid or list view. Use the view toggle buttons to switch between layouts."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1 border border-border-light dark:border-gray-500">
                  <button className="p-2 bg-blue-600 text-white rounded-md">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">View mode toggle</span>
              </div>
            }
          />
          
          <StepCard
            step={2}
            title="Use the Search Bar"
            description="Type any Pokémon name in the search bar at the top of the page. Results appear instantly as you type, showing matching Pokémon with their ID numbers."
            visual={
              <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Pokémon..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-border-light dark:border-gray-500 rounded-lg text-sm"
                    value="pika"
                    readOnly
                  />
                </div>
              </div>
            }
          />
          
          <StepCard
            step={3}
            title="Filter by Generation"
            description="Use the generation filter to narrow down results to specific regions like Kanto, Johto, or Hoenn."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <Filter className="w-4 h-4 text-gray-500" />
                <select className="bg-white dark:bg-gray-700 border border-border-light dark:border-gray-500 rounded-lg px-3 py-2 text-sm">
                  <option>Generation I (Kanto)</option>
                </select>
              </div>
            }
          />
          
          <StepCard
            step={4}
            title="Sort Results"
            description="Choose how to sort Pokémon: by Pokémon number, name (A-Z or Z-A), or generation."
          />
        </div>
      </div>

      {/* Type Exploration - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Layers className="w-6 h-6 text-green-600 dark:text-green-400" />
          Exploring Pokémon Types
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Access the Types Page"
            description="Click 'Types' in the main navigation to see all 18 Pokémon types displayed as colorful badges."
            visual={
              <div className="flex flex-wrap gap-2">
                <TypeBadge type="fire" size="sm" />
                <TypeBadge type="water" size="sm" />
                <TypeBadge type="grass" size="sm" />
                <TypeBadge type="electric" size="sm" />
                <span className="text-sm text-gray-500 dark:text-gray-400">...and 14 more</span>
              </div>
            }
          />
          
          <StepCard
            step={2}
            title="Click on Any Type"
            description="Select a type to see all Pokémon of that type, along with a comprehensive type effectiveness chart."
          />
          
          <StepCard
            step={3}
            title="Understand Type Effectiveness"
            description="Learn which types are super effective, not very effective, or have no effect against each other. This is crucial for battle strategy."
            visual={
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">2x damage</span>
                  <span className="text-gray-600 dark:text-gray-400">Super Effective Against</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs">0.5x damage</span>
                  <span className="text-gray-600 dark:text-gray-400">Not Very Effective Against</span>
                </div>
              </div>
            }
          />
          
          <StepCard
            step={4}
            title="Filter and Sort by Generation"
            description="Within each type page, you can filter Pokémon by generation and sort them by various criteria."
          />
        </div>
      </div>

      {/* Abilities Guide - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          Understanding Pokémon Abilities
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Browse All Abilities"
            description="Visit the Abilities page to see a searchable list of all Pokémon abilities with descriptions."
          />
          
          <StepCard
            step={2}
            title="Search for Specific Abilities"
            description="Use the search function to quickly find abilities by name, perfect for research or team building."
          />
          
          <StepCard
            step={3}
            title="Explore Ability Details"
            description="Click on any ability to see its detailed description, effects, and all Pokémon that can have it."
          />
          
          <StepCard
            step={4}
            title="Understand Hidden vs. Primary Abilities"
            description="Learn the difference between regular abilities and rare hidden abilities that are harder to obtain."
            visual={
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    Primary
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                    Hidden
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Evolution Chains - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Navigating Evolution Chains
        </h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Access from Pokémon Detail Pages"
            description="Evolution chains are displayed at the bottom of each Pokémon's detail page, showing the complete evolutionary line."
          />
          
          <StepCard
            step={2}
            title="Visual Evolution Flow"
            description="See the evolution progression with arrows connecting each stage, making it easy to understand the transformation path."
            visual={
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800 dark:text-green-200">001</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800 dark:text-green-200">002</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800 dark:text-green-200">003</span>
                </div>
              </div>
            }
          />
          
          <StepCard
            step={3}
            title="Click to Navigate"
            description="Click on any Pokémon in the evolution chain to instantly navigate to their detail page and explore their specific information."
          />
          
          <StepCard
            step={4}
            title="Understand Evolution Requirements"
            description="While evolution methods aren't detailed in this version, the chain shows you which Pokémon evolve into others."
          />
        </div>
      </div>

      {/* Navigation Tips - Removed gray background, padding, and borders */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Navigation Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Navigation</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Use the Previous/Next buttons on Pokémon detail pages
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Click the back button to return to your previous location
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Bookmark specific Pokémon pages for quick access
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Tips</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                Type badges are clickable - click to explore that type
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                Ability names are links to detailed ability pages
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                Use filters to find Pokémon from your favorite generation
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                Heart icons save Pokémon to your personal favorites
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Exploring?</h2>
        <p className="text-lg opacity-90 mb-6">
          Now that you know how to use all the features, dive into the world of Pokémon!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Search className="w-4 h-4" />
            Start Browsing Pokémon
          </Link>
          <Link
            to="/types"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/30"
          >
            <Layers className="w-4 h-4" />
            Explore Types
          </Link>
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/30"
          >
            <Heart className="w-4 h-4" />
            View Favorites
          </Link>
        </div>
      </div>
    </div>
  );
};