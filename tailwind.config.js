/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Literata"', 'serif'],
        sans: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}