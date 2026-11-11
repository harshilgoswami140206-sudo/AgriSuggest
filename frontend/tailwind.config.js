/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f5eee3',
          200: '#ecd9c4',
          300: '#ddbc9c',
          400: '#ca9b73',
          500: '#ba8053',
          600: '#a36844',
          700: '#825039',
          800: '#6d4234',
          900: '#5a372d',
        }
      }
    },
  },
  plugins: [],
}
