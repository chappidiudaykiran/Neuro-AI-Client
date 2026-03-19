/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        bg2: 'var(--color-bg2)',
        bg3: 'var(--color-bg3)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        border2: 'var(--color-border2)',
        accent: 'var(--color-accent)',
        accent2: 'var(--color-accent2)',
        text: 'var(--color-text)',
        text2: 'var(--color-text2)',
        text3: 'var(--color-text3)',
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
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.7' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatBadge: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        floatBadge2: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        floatBadge3: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(1.05)' },
        },
        pulseSlow2: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.25', transform: 'scale(1.08)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translate(-50%, 0)' },
          '50%': { transform: 'translate(-50%, 8px)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'fade-up-2': 'fadeUp 0.4s 0.1s ease both',
        'fade-up-3': 'fadeUp 0.4s 0.2s ease both',
        'fade-up-4': 'fadeUp 0.4s 0.3s ease both',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-badge': 'floatBadge 4s ease-in-out infinite',
        'float-badge-2': 'floatBadge2 5s ease-in-out 0.5s infinite',
        'float-badge-3': 'floatBadge3 4.5s ease-in-out 1s infinite',
        'pulse-slow': 'pulseSlow 8s ease-in-out infinite',
        'pulse-slow-2': 'pulseSlow2 10s ease-in-out 2s infinite',
        'pulse-slow-3': 'pulseSlow 12s ease-in-out 4s infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

