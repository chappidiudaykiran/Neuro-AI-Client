/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#edf2fb',
        bg2: '#ffffff',
        bg3: '#f7f9fc',
        surface: '#e8edf7',
        border: '#dbe3f0',
        border2: '#c8d6ea',
        accent: '#3b82f6',
        accent2: '#8b5cf6',
        text: '#12294a',
        text2: '#4f6280',
        text3: '#7d8da8',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
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

