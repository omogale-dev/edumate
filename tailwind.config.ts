import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0A0A0A',
        elevated: '#111111',
        border: 'rgba(255, 255, 255, 0.06)',
        'border-strong': 'rgba(255, 255, 255, 0.1)',
        accent: {
          DEFAULT: '#00D4FF',
          glow: '#0EA5E9',
          dim: '#0284C7',
        },
        foreground: '#FFFFFF',
        muted: 'rgba(255, 255, 255, 0.6)',
        'muted-strong': 'rgba(255, 255, 255, 0.4)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-sm': '0 0 20px rgba(0, 212, 255, 0.2)',
        'glow-lg': '0 0 80px rgba(0, 212, 255, 0.4)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
