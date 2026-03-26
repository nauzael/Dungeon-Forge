/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./Data/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#359EFF",
        "primary-dark": "#2B7DE0",
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
        "surface-dark": "#1E293B",
        "surface-light": "#FFFFFF",
        "surface-highlight": "#334155",
        "text-muted": "#94A3B8",
      },
      fontFamily: {
        "display": ["Spline Sans", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem", 
        "lg": "0.5rem", 
        "xl": "0.75rem", 
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleUp: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        scaleUp: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }
    },
  },
  plugins: [],
}
