Create a modern, accessible Pokédex web application using the PokéAPI (pokeapi.co) with the following specifications:

Technical Stack:
- React/Next.js for the frontend
- TypeScript for type safety
- TanStack Query for data fetching/caching
- Tailwind CSS for styling

Core Features & Implementation Details:

1. Main Pokémon List View (Homepage):
- Implement paginated grid display (20 Pokémon per page)
- URL structure: '/' (home) and '/page/[number]'
- Each Pokémon card displays:
  * Official artwork (lazy loaded)
  * Name and ID number
  * Type badges with corresponding colors
- Include skeleton loading states

2. Detailed Pokémon View:
- URL pattern: '/pokemon/[id]'
- Display comprehensive information:
  * Hero section with large artwork
  * Name, ID, and classification
  * Type badges (clickable)
  * Base stats with visual bars
  * Physical attributes (height, weight)
  * Abilities with descriptions
  * Evolution chain
- Implement smooth transitions
- Add prev/next Pokémon navigation

3. Type System:
- Create '/types' index page showing all types
- Individual type pages ('/type/[name]'):
  * Type-specific theming
  * Filtered Pokémon list
  * Type effectiveness chart
  * Paginated results (20 per page)

4. Search & Navigation:
- Implement header with:
  * Responsive navigation menu
  * Search bar with debounced autocomplete
  * Types dropdown
  * Theme toggle
- Mobile-friendly hamburger menu

Technical Requirements:

1. Data Management:
- Implement TanStack Query for:
  * Automatic background refreshes
  * Optimistic updates
  * Infinite scroll support
  * Error boundary integration
- Cache strategy:
  * Store responses in localStorage
  * 24-hour cache expiration
  * Version-based invalidation

2. Error Handling:
- Create error boundaries for route segments
- Implement retry logic for failed requests
- Display user-friendly error states
- Add 404 page with suggested content

3. Performance Optimization:
- Implement route-based code splitting
- Use Next.js Image component for optimization
- Debounce search inputs (300ms)
- Preload critical data
- Implement progressive image loading

4. Accessibility Requirements:
- Ensure WCAG 2.1 AA compliance
- Implement proper heading hierarchy
- Add ARIA labels and landmarks
- Support keyboard navigation
- Maintain 4.5:1 minimum contrast ratio
- Include skip links
- Add focus management

Design Guidelines:
- Use mobile-first responsive design
- Implement CSS Grid for card layouts
- Follow 8-point spacing system
- Use semantic color tokens
- Add micro-interactions and transitions
- Ensure consistent typography scale
- Support dark/light themes

Browser Support:
- Target modern browsers (last 2 versions)
- Implement graceful degradation
- Test across Chrome, Firefox, Safari, Edge

Documentation Requirements:
- Include setup instructions
- Document component architecture
- Add API integration details
- Provide accessibility guidelines
- Include performance benchmarks