/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        merelax: {
          primary: '#4A90E2',
          secondary: '#7ED321',
          accent: '#F5A623',
          rule: '#4A90E2',
          distance: '#7ED321',
          blink: '#FF6B9D',
          tracking: '#F5A623',
          success: '#4CAF50',
          pending: '#CCCCCC',
        },
        bg: {
          main: '#F8F9FA',
          card: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}
