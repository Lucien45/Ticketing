/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        paper: '#F8FAFC',
        accent: {
          DEFAULT: '#4338CA',
          hover: '#3730A3',
          soft: '#EEF2FF',
        },
        status: {
          open: '#64748B',
          progress: '#B45309',
          resolved: '#047857',
          closed: '#94A3B8',
        },
        priority: {
          low: '#64748B',
          medium: '#2563EB',
          high: '#E11D48',
          urgent: '#9F1239',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
