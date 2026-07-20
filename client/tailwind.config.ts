import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#5865f2', // Discord Blurple
          600: '#4752c4',
          700: '#3c45a5',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          sidebar: '#0b1120',
        },
      },
    },
  },
  plugins: [],
};
export default config;
