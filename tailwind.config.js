/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        venus: {
          950: '#0a0815',
          900: '#120e24',
          850: '#1a1433',
          800: '#251c47',
          700: '#342761',
          rose: '#f472b6',
          blush: '#fbcfe8',
          orchid: '#e879f9',
          purple: '#c084fc',
          mint: '#34d399',
          teal: '#2dd4bf',
          coral: '#fb7185',
          amber: '#fbbf24',
          pearl: '#f8fafc',
          border: 'rgba(244, 114, 182, 0.18)',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'glow-rose': '0 0 25px -5px rgba(244, 114, 182, 0.3)',
        'glow-mint': '0 0 25px -5px rgba(52, 211, 153, 0.3)',
        'glow-coral': '0 0 25px -5px rgba(251, 113, 133, 0.3)',
        'soft-glass': '0 8px 32px 0 rgba(10, 8, 21, 0.37)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}
