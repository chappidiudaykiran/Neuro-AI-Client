/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        bg2: '#111827',
        bg3: '#1a2235',
        surface: '#1e2d42',
        border: 'rgba(255,255,255,0.08)',
        border2: 'rgba(255,255,255,0.14)',
        accent: '#00d4aa',
        accent2: '#0099ff',
        text: '#f0f4ff',
        text2: '#8b9ab5',
        text3: '#4a5568',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'fade-up-2': 'fadeUp 0.4s 0.1s ease both',
        'fade-up-3': 'fadeUp 0.4s 0.2s ease both',
        'fade-up-4': 'fadeUp 0.4s 0.3s ease both',
      },
    },
  },
  plugins: [],
}

