/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#f2ead9',
        green: {
          DEFAULT: '#16281c',
          soft: '#1e3526',
        },
      },
      fontFamily: {
        chewy: ['Chewy', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
