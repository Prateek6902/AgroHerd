/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D68C45',     // Tan Orange — buttons, highlights
        accent: '#FFC9B9',      // Soft Peach — cards, subtle backgrounds
        base: '#FEFEE3',        // Cream — main page bg
        green: {
          light: '#4C956C',     // Leafy green — headers, nav
          dark: '#2C6E49',      // Deep forest — strong text, sidebar
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
