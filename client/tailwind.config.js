const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#070816',
          800: '#0B1020',
          700: '#12091D',
        },
        glow: {
          violet: '#8B5CF6',
          purple: '#A855F7',
          pink: '#EC4899',
          sky: '#7DD3FC',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: '#070816',
            foreground: '#F5F3FF',
            primary: { DEFAULT: '#8B5CF6', foreground: '#ffffff' },
            secondary: { DEFAULT: '#EC4899', foreground: '#ffffff' },
          },
        },
      },
    }),
  ],
};
