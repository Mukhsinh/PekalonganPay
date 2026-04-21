/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E8F5F5',
          100: '#B8E0DF',
          200: '#88CBC9',
          300: '#58B6B3',
          400: '#28A19D',
          500: '#0D7377', // Main teal
          600: '#0B6163',
          700: '#094F50',
          800: '#073D3E',
          900: '#052B2C',
        },
        gold: {
          50:  '#FFF8E7',
          100: '#FFEFC4',
          200: '#FFE6A1',
          300: '#FFDD7E',
          400: '#FFD45B',
          500: '#D4A843', // Main gold
          600: '#B48E38',
          700: '#94742D',
          800: '#745A22',
          900: '#544017',
        },
        dark: {
          50:  '#E8EAF0',
          100: '#B8BED0',
          200: '#8892B0',
          300: '#586690',
          400: '#283A70',
          500: '#1A2742',
          600: '#141E34',
          700: '#0F1726',
          800: '#0A1018',
          900: '#05080C',
        },
        surface: {
          dark: '#0A1628',
          card: '#111D35',
          elevated: '#162340',
        },
        accent: {
          teal: '#00D9C0',
          gold: '#FFD700',
          red: '#FF4757',
          green: '#2ED573',
          blue: '#1E90FF',
        },
        batik: {
          brown: '#8B4513',
          cream: '#FFF8E7',
          indigo: '#2E0854',
          maroon: '#800020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'button': '14px',
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(0, 217, 192, 0.3)',
        'glow-gold': '0 0 20px rgba(212, 168, 67, 0.3)',
      },
    },
  },
  plugins: [],
};
