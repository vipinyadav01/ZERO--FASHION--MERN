/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        asterion: ['Asterion', 'sans-serif'],
        'rebels-fett': ['Rebels Fett', 'sans-serif'],
        sans: ['Rebels Fett', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}