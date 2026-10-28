import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          50: '#fdfbf7',
          100: '#f8f4eb',
          200: '#eee5d3',
          300: '#e1d0b3',
          400: '#d1b48b',
          500: '#b89462',
          600: '#9b764c',
          700: '#7c5c3c',
          800: '#644a34',
          900: '#533d2e',
          950: '#2d1f16',
        },
      },
    },
  },
  plugins: [],
};

export default config;
