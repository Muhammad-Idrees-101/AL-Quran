import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Scheherazade New', 'serif'],
        scheherazade: ['Scheherazade New', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'islamic-emerald': '#0D5F4F',
        'islamic-emerald-light': '#0E7A63',
        'islamic-emerald-dark': '#094035',
        'islamic-gold': '#D4A574',
        'islamic-gold-light': '#E8C99A',
        'islamic-gold-dark': '#B8845A',
        'slate-gray': '#475569',
        'dark-slate': '#1E293B',
        'deep-emerald': '#052E20',
        'warm-gold': '#C9963A',
        emerald: {
          900: '#064E3B',
          950: '#022C22',
        },
      },
      backdropBlur: {
        glass: '12px',
        heavy: '20px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 2px #D4A574, 0 0 20px rgba(212,165,116,0.3)' },
          '50%':       { boxShadow: '0 0 0 2px #D4A574, 0 0 40px rgba(212,165,116,0.6)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
      },
      fontSize: {
        'quran-sm':   ['1.25rem', { lineHeight: '2.5rem' }],
        'quran-base': ['1.75rem', { lineHeight: '3.5rem' }],
        'quran-lg':   ['2.25rem', { lineHeight: '4.5rem' }],
        'quran-xl':   ['3rem',    { lineHeight: '5.5rem' }],
      },
      boxShadow: {
        'glow-gold':    '0 0 20px rgba(212, 165, 116, 0.4)',
        'glow-emerald': '0 0 20px rgba(13, 95, 79, 0.4)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-hover':  '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'emerald-dark': 'linear-gradient(135deg, #052E20 0%, #0D1B2A 50%, #0A1A12 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
