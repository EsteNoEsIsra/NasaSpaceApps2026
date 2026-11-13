/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#090a0f',
          subtle: '#0f1118',
          card: '#141721',
          elevated: '#1a1e2b',
        },
        ink: {
          DEFAULT: '#f3f4f6',
          muted: '#8b93a4',
          subtle: '#525a6c',
        },
        border: {
          hairline: 'rgba(255, 255, 255, 0.07)',
          subtle: 'rgba(255, 255, 255, 0.12)',
          focus: 'rgba(255, 255, 255, 0.24)',
        },
        clinical: {
          sage: '#38b293',       // Understated ceramic teal for nominal/calm
          honey: '#d99b43',      // Warm honey for mild caution
          coral: '#d25d52',      // Ceramic coral for acute clinical attention
          titanium: '#dfdbd4',   // Warm titanium/bone
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.14em',
      },
      boxShadow: {
        'fine': '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
