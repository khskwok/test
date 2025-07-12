/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aws-orange': '#FF9900',
        'aws-blue': '#232F3E',
        'aws-light-blue': '#4B9CD3',
      },
    },
  },
  plugins: [],
}