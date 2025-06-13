/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      colors: {
        gray: {
          50: '#f8f9fa',   // 5% darker than pure white (#ffffff)
          100: '#f1f3f4',  // 8% darker for subtle backgrounds
          200: '#e8eaed',  // 10% darker for muted backgrounds
          300: '#dadce0',  // Enhanced contrast for borders
          400: '#9aa0a6',  // Medium gray for secondary text
          500: '#5f6368',  // Darker gray for primary text
          600: '#3c4043',  // Very dark gray
          700: '#202124',  // Near black
          800: '#1a1a1a',  // Dark mode backgrounds
          900: '#0f0f0f',  // Darkest
        },
        // Enhanced border colors for light mode with better contrast
        border: {
          light: '#bdc1c6',      // 25% darker than original for better visibility
          'light-hover': '#9aa0a6', // Darker hover state
          'light-focus': '#80868b', // Strong focus state
          'light-strong': '#5f6368', // Very strong borders for emphasis
        },
        // Refined background colors - 5-10% darker while maintaining hierarchy
        background: {
          // Primary backgrounds (5-7% darker than white)
          'light-primary': '#f8f9fa',    // HEX: #f8f9fa, RGB: 248, 249, 250 - Main content areas
          'light-secondary': '#f1f3f4',  // HEX: #f1f3f4, RGB: 241, 243, 244 - Secondary content
          'light-tertiary': '#e8eaed',   // HEX: #e8eaed, RGB: 232, 234, 237 - Subtle emphasis
          
          // Neutral tones (6-8% darker)
          'neutral-subtle': '#f6f7f8',   // HEX: #f6f7f8, RGB: 246, 247, 248 - Very subtle backgrounds
          'neutral-muted': '#eff1f3',    // HEX: #eff1f3, RGB: 239, 241, 243 - Muted sections
          'neutral-emphasis': '#e6e9ec', // HEX: #e6e9ec, RGB: 230, 233, 236 - Emphasized areas
          
          // Cool blue tones (7-9% darker)
          'blue-subtle': '#e7f3fd',      // HEX: #e7f3fd, RGB: 231, 243, 253 - Ice blue
          'blue-muted': '#d4e9fa',       // HEX: #d4e9fa, RGB: 212, 233, 250 - Sky blue
          'blue-emphasis': '#c1dff6',    // HEX: #c1dff6, RGB: 193, 223, 246 - Ocean blue
          
          // Warm green tones (6-8% darker)
          'green-subtle': '#e6f4e6',     // HEX: #e6f4e6, RGB: 230, 244, 230 - Fresh mint
          'green-muted': '#d1ebd1',      // HEX: #d1ebd1, RGB: 209, 235, 209 - Spring green
          'green-emphasis': '#bce2bc',   // HEX: #bce2bc, RGB: 188, 226, 188 - Sage green
          
          // Warm cream/yellow tones (7-9% darker)
          'yellow-subtle': '#f6f2e4',    // HEX: #f6f2e4, RGB: 246, 242, 228 - Warm cream
          'yellow-muted': '#efe8ce',     // HEX: #efe8ce, RGB: 239, 232, 206 - Golden sand
          'yellow-emphasis': '#e8deb8',  // HEX: #e8deb8, RGB: 232, 222, 184 - Sunset glow
          
          // Purple tones (6-8% darker)
          'purple-subtle': '#f0ebf6',    // HEX: #f0ebf6, RGB: 240, 235, 246 - Lavender mist
          'purple-muted': '#e5daef',     // HEX: #e5daef, RGB: 229, 218, 239 - Violet whisper
          'purple-emphasis': '#dac9e8',  // HEX: #dac9e8, RGB: 218, 201, 232 - Amethyst glow
          
          // Rose/pink tones (7-9% darker)
          'rose-subtle': '#f5ebf0',      // HEX: #f5ebf0, RGB: 245, 235, 240 - Rose petal
          'rose-muted': '#eddde5',       // HEX: #eddde5, RGB: 237, 221, 229 - Blush pink
          'rose-emphasis': '#e5cfda',    // HEX: #e5cfda, RGB: 229, 207, 218 - Dusty rose
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};