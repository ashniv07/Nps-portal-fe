/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#CDDE33',
        magenta: '#731A42',
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
      },
    },
  },
  plugins: [],
}
