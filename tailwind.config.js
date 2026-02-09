/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#13c8ec',
          dark: '#0ea5c4',
          light: '#e0f9fd',
        },
        accent: '#4c8d9a',
        background: {
          light: '#f6f8f8',
          dark: '#101f22',
        },
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(19, 200, 236, 0.5)',
        'glow-lg': '0 0 40px -8px rgba(19, 200, 236, 0.6)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px -8px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        checkerboard:
          "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
      },
    },
  },
  plugins: [],
};
