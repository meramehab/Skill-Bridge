/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]', '.theme-dark'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
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
        line: '#E4E1D8',
        charcoal: {
          DEFAULT: "#1A1D24",
          50: "#2A2E38",
          100: "#22262F",
          200: "#1A1D24",
          300: "#13161E",
          400: "#0F1117"
        },
        cream: {
          DEFAULT: "#F5E6CA",
          light: "#FBF5EC",
          dark: "#E8D5B0",
          border: "#D4C4A8",
          border2: "#BFB09A"
        },
        primary: {
          DEFAULT: "#10B981", // SkillBridge Emerald
          light: "#34D399",
          dark: "#059669",
          50: "#ECFDF5",
          100: "#D1FAE5"
        },
        brandBlue: {
          DEFAULT: "#2563EB", // SkillBridge Royal Blue
          light: "#3B82F6",
          dark: "#1D4ED8",
          50: "#EFF6FF",
          100: "#DBEAFE"
        },
        accentYellow: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#D97706"
        },
        accentRed: {
          DEFAULT: "#DC2626",
          light: "#EF4444",
          dark: "#B91C1C"
        },
        accentPurple: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED"
        },
        muted: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#2563EB'
      },
      fontFamily: {
        display: ['"Space Grotesk"', "'Plus Jakarta Sans'", 'Cairo', 'sans-serif'],
        body: ['"Inter"', "'Plus Jakarta Sans'", 'Cairo', 'sans-serif'],
        sans: ["'Plus Jakarta Sans'", "Cairo", "system-ui", "-apple-system", "sans-serif"],
        title: ["'Plus Jakarta Sans'", "Cairo", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        cairo: ["Cairo", "sans-serif"]
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(30,42,94,0.06), 0 8px 24px rgba(30,42,94,0.06)',
        'glow-green': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-blue': '0 0 25px rgba(37, 99, 235, 0.25)',
        'glow-combined': '0 0 30px rgba(16, 185, 129, 0.2), 0 0 60px rgba(37, 99, 235, 0.15)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-cream': '0 4px 20px rgba(212, 196, 168, 0.3)'
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pulse-badge': 'pulse-badge 0.6s ease-in-out',
        'shimmer': 'shimmer 1.5s linear infinite',
        'confetti': 'confetti-fall 0.6s ease-out forwards',
        'glow-pulse': 'sb-glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite'
      }
    },
  },
  plugins: [],
};
