/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      colors: {
        guns: {
          bg: '#050505',
          card: '#121212',
          border: '#27272a',
          primary: '#7c3aed',
          secondary: '#a1a1aa'
        }
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(50px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        zoomIn: {
          from: { opacity: 0, transform: 'scale(0.5)' },
          to: { opacity: 1, transform: 'scale(1)' }
        },
        flipIn: {
          from: { opacity: 0, transform: 'perspective(1000px) rotateY(90deg)' },
          to: { opacity: 1, transform: 'perspective(1000px) rotateY(0deg)' }
        },
        bounceIn: {
          '0%': { opacity: 0, transform: 'scale(0.3)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
};
