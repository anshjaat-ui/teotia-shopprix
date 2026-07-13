/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#131921',
          light: '#232f3e',
          lighter: '#37475a',
        },
        accent: {
          DEFAULT: '#febd69',
          orange: '#ff9900',
        },
        surface: '#eaeded',
        link: '#007185',
        price: '#b12704',
      },
      fontFamily: {
        sans: ['"Amazon Ember"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(213,217,217,.5)',
      },
    },
  },
  plugins: [],
}
