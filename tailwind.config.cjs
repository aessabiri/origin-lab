module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '25%': { transform: 'translate(2px, -1px) rotate(1deg)' },
          '50%': { transform: 'translate(-2px, 1px) rotate(-1deg)' },
          '75%': { transform: 'translate(1px, 2px) rotate(0.5deg)' },
        },
        jiggle: {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
            '10%': { transform: 'translate(-1px, -2px) rotate(-2deg)' },
            '20%': { transform: 'translate(-3px, 0px) rotate(3deg)' },
            '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
            '40%': { transform: 'translate(1px, -1px) rotate(2deg)' },
            '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
            '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
            '70%': { transform: 'translate(3px, 1px) rotate(-2deg)' },
            '80%': { transform: 'translate(-1px, -1px) rotate(3deg)' },
            '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
        },
        'pulse-glow': {
            '0%, 100%': { 'box-shadow': '0 0 20px -5px var(--glow-color), inset 0 0 10px -5px var(--glow-color)' },
            '50%': { 'box-shadow': '0 0 30px 0px var(--glow-color), inset 0 0 20px 0px var(--glow-color)' },
        },
        spin: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
        },
        spring: {
            '0%, 100%': { transform: 'scale(1)' },
            '20%': { transform: 'scale(0.9, 1.1)' },
            '40%': { transform: 'scale(1.1, 0.9)' },
            '60%': { transform: 'scale(0.95, 1.05)' },
            '80%': { transform: 'scale(1.05, 0.95)' },
        },
        'fade-out-and-disperse': {
            from: {
              transform: 'translate(-50%, -50%) scale(1)',
              opacity: '1',
            },
            to: {
              transform: 'translate(calc(-50% + (var(--i) - 0.5) * 120px), calc(-50% + (var(--j) - 0.5) * 120px)) scale(0)',
              opacity: '0',
            },
        },
        'qcd-color-cycle-1': {
            '0%, 100%': { fill: '#ef4444' },
            '33.3%': { fill: '#22c55e' },
            '66.6%': { fill: '#2563eb' },
        },
        'qcd-color-cycle-2': {
            '0%, 100%': { fill: '#22c55e' },
            '33.3%': { fill: '#2563eb' },
            '66.6%': { fill: '#ef4444' },
        },
        'qcd-color-cycle-3': {
            '0%, 100%': { fill: '#2563eb' },
            '33.3%': { fill: '#ef4444' },
            '66.6%': { fill: '#22c55e' },
        },
        'gluon-pulse': {
            '0%, 100%': { 'stroke-opacity': '0.5', 'stroke-width': '2' },
            '50%': { 'stroke-opacity': '1', 'stroke-width': '3' },
        },
        'electron-cloud': {
            '0%, 100%': { opacity: '0.6', transform: 'scale(1.1)' },
            '50%': { opacity: '0.2', transform: 'scale(1)' },
        },
        'electron-particle': {
            '0%, 100%': { opacity: '0', r: '1' },
            '50%': { opacity: '1', r: '1.5' },
        },
        shimmer: {
            '0%': { filter: 'brightness(1) saturate(1)' },
            '50%': { filter: 'brightness(1.5) saturate(1.5)' },
            '100%': { filter: 'brightness(1) saturate(1)' },
        },
        turbulence: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2, 0.8)' },
        },
        'draw-wave': {
            to: { 'stroke-dashoffset': '0' },
        },
        'assembly-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 15px 0px rgba(34, 197, 94, 0.7)',
          },
          '50%': {
            'box-shadow': '0 0 30px 8px rgba(34, 197, 94, 0.9)',
          },
        },
        'ocean-wave': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(5deg) scale(1.05)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-1px, 1px)' },
          '75%': { transform: 'translate(1px, 1px)' },
        },
      },
      animation: {
        float: 'float 4s infinite ease-in-out',
        shake: 'shake 0.5s infinite',
        jiggle: 'jiggle 0.3s infinite',
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        spin: 'spin 8s linear infinite',
        spring: 'spring 1s infinite linear',
        'fade-out-and-disperse': 'fade-out-and-disperse 0.7s ease-out forwards',
        'qcd-color-cycle-1': 'qcd-color-cycle-1 3s linear infinite',
        'qcd-color-cycle-2': 'qcd-color-cycle-2 3s linear infinite',
        'qcd-color-cycle-3': 'qcd-color-cycle-3 3s linear infinite',
        'gluon-pulse': 'gluon-pulse 1.5s ease-in-out infinite',
        'electron-cloud': 'electron-cloud 4s infinite ease-in-out',
        'electron-particle': 'electron-particle 1.2s infinite ease-in-out',
        shimmer: 'shimmer 1.5s infinite ease-in-out',
        turbulence: 'turbulence 4s infinite ease-in-out',
        'draw-wave': 'draw-wave 1s ease-in-out forwards',
        'assembly-glow': 'assembly-glow 2.5s infinite ease-in-out',
        'ocean-wave': 'ocean-wave 4s infinite ease-in-out',
        vibrate: 'vibrate 0.1s infinite',
      }
    },
  },
  plugins: [],
};