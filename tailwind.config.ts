import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
    extend: {
      colors: {
        text: {
          DEFAULT: '#f5ece5',
          50: '#f8f2ed',
          100: '#f1e4da',
          200: '#e2c9b6',
          300: '#d4ae91',
          400: '#c6936c',
          500: '#b87847',
          600: '#936039',
          700: '#6e482b',
          800: '#49301d',
          900: '#25180e',
          950: '#120c07',
        },
        background: {
          DEFAULT: '#1b0f09',
          50: '#f9f0ec',
          100: '#f2e1d9',
          200: '#e6c4b3',
          300: '#d9a68c',
          400: '#cc8866',
          500: '#bf6a40',
          600: '#995533',
          700: '#734026',
          800: '#4d2b19',
          900: '#26150d',
          950: '#130b06',
        },
        primary: {
          DEFAULT: '#eead85',
          50: '#fcf0e9',
          100: '#f9e1d2',
          200: '#f3c3a5',
          300: '#eda578',
          400: '#e7874b',
          500: '#e0691f',
          600: '#b45418',
          700: '#873f12',
          800: '#5a2a0c',
          900: '#2d1506',
          950: '#160a03',
        },
        secondary: {
          DEFAULT: '#7d4f26',
          50: '#f9f2eb',
          100: '#f3e5d8',
          200: '#e7cab1',
          300: '#dbb08a',
          400: '#cf9563',
          500: '#c37b3c',
          600: '#9c6230',
          700: '#754a24',
          800: '#4e3118',
          900: '#27190c',
          950: '#140c06',
        },
        accent: {
          DEFAULT: '#fe8720',
          50: '#fff1e6',
          100: '#ffe4cc',
          200: '#fec99a',
          300: '#fead67',
          400: '#fe9234',
          500: '#fe7701',
          600: '#cb5f01',
          700: '#984701',
          800: '#653001',
          900: '#331800',
          950: '#190c00',
        },
      },
    },
  },
  plugins: [],
};
export default config;
