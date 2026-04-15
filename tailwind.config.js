/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#CDDE33',
        lemon: '#F5FF9B',
        magenta: '#731A42',
        orange: {
          1: '#FFBB1C',
          2: '#FFC94C',
          3: '#FFE354',
        },
        turquoise: {
          1: '#035649',
          2: '#0F7E6D',
          3: '#25A28F',
        },
        gray: {
          50: '#FAFAF4',
          100: '#EAF4F4',
          200: '#D5E7E7',
          300: '#ABC8C8',
          400: '#86A1A1',
          500: '#4F6868',
          600: '#203030',
          700: '#203030',
          800: '#203030',
          900: '#203030',
          950: '#000000',
        },
        teal: {
          DEFAULT: '#0F7E6D',
          light: '#25A28F',
        },
        bg: '#FAFAF4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Karla', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        neon: '0 0 20px rgba(205,222,51,0.35)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #CDDE33, #F5E642, #F5A623, #731A42)',
        'gradient-teal': 'linear-gradient(135deg, #0F7E6D, #25A28F)',
        'gradient-primary': 'linear-gradient(90deg, #CDDE33, #FFE354)',
        'gradient-illuminate': 'linear-gradient(135deg, #FFBB1C, #CDDE33, #0F7E6D, #203030)',
        'gradient-orchestrate': 'linear-gradient(135deg, #CDDE33, #F5FF9B, #FFBB1C, #731A42)',
      },
    },
  },
  plugins: [],
}
