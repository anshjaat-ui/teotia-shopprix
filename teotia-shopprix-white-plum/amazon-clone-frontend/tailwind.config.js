/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        luxe: {
          bg: '#ffffff',
          panel: '#ffffff',
          border: '#eadfe8',
        },
        gold: {
          DEFAULT: '#6D214F',
          light: '#8E3A6B',
          dark: '#4D1738',
        },
        plum: {
          DEFAULT: '#6D214F',
          light: '#8E3A6B',
          dark: '#4D1738',
          soft: '#F6EEF4',
        },
        blush: {
          from: '#8E3A6B',
          to: '#6D214F',
        },
      },
      fontFamily: {
        sans: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        goldGlow: '0 0 0 1px rgba(109,33,79,0.18), 0 8px 24px -4px rgba(109,33,79,0.14)',
        goldGlowLg: '0 0 0 1px rgba(109,33,79,0.22), 0 12px 40px -6px rgba(109,33,79,0.18)',
        plum: '0 8px 24px -6px rgba(109,33,79,0.16)',
      },
      backgroundImage: {
        'blush-gradient': 'linear-gradient(90deg, #8E3A6B 0%, #6D214F 100%)',
      },
    },
  },
  plugins: [],
}
