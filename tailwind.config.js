/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vue: {
          50: '#f3f9f6',
          100: '#e0f0eb',
          200: '#b3e0d4',
          300: '#41b883',
          400: '#41b883',
          500: '#00bd7e',
          600: '#009f6b',
          700: '#007d51',
          800: '#005a3c',
          900: '#004530',
        },
      },
    },
    plugins: [],
  }
}

