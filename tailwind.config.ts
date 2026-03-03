import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        choc: {
          bg: '#f5e6d3',
          card: '#e6ccb2',
          accent: '#6b3e26',
          text: '#3d1f0a',
          muted: '#8b5a3a',
          border: '#c4956a',
        },
      },
    },
  },
  plugins: [],
};

export default config;