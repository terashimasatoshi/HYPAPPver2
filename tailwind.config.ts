import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          600: '#166534',
          700: '#14532d',
        },
      },
      boxShadow: {
        soft: '0 10px 25px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
