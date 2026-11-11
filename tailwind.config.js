/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff9d',
          amber: '#f59e0b',
          cyan: '#38bdf8',
          red: '#ef4444',
          dark: '#080c10'
        }
      }
    },
  },
  plugins: [],
}
