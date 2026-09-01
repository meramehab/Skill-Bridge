/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F6F2',
        ink: {
          DEFAULT: '#1E2A5E',
          light: '#2E3E82',
          dark: '#12193B',
        },
        signal: {
          DEFAULT: '#E8A33D',
          light: '#F3BE6E',
          dark: '#C9821F',
        },
        charcoal: '#1F2430',
        muted: '#6B7280',
        success: '#2F9E6B',
        danger: '#D9534F',
        line: '#E4E1D8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(30,42,94,0.06), 0 8px 24px rgba(30,42,94,0.06)',
      },
    },
  },
  plugins: [],
};
