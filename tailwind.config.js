/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        primaryDark: "#4338ca",
        success: "#10b981",
      },
      fontFamily: {
        sans: ["Cairo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
