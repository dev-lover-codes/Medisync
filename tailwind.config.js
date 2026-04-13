/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6f5673',
        'primary-container': '#bc9ebf',
        'secondary-container': '#e9d7f1',
        background: '#faf9fa',
        'on-surface': '#1a1c1d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
