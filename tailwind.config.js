/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      },
      colors: {
        ink: '#030712',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'glow-pulse': 'glowPulse 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
