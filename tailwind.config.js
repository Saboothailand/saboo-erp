/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF69B4',      // 밝은 분홍색
          pinkDark: '#FF1493',  // 진한 분홍색
          pinkLight: '#FFB6C1', // 연한 분홍색
          black: '#1A1A1A',     // 진한 검은색
          white: '#FFFFFF',     // 순백색
          gray: '#F8F9FA',      // 연한 회색
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 