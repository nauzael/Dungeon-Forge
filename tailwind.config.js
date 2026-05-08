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
        // Colores dinámicos con CSS Variables para sistema de temas
        "primary": "var(--color-primary, #359EFF)",
        "primary-dark": "var(--color-primary-dark, #2B7DE0)",
        "background": "var(--color-background, #0F172A)",
        "background-secondary": "var(--color-background-secondary, #1E293B)",
        "background-light": "var(--color-background, #0F172A)",
        "background-dark": "var(--color-background, #0F172A)",
        "surface": "var(--color-surface, #1E293B)",
        "surface-dark": "var(--color-surface, #1E293B)",
        "surface-light": "var(--color-surface, #FFFFFF)",
        "surface-highlight": "var(--color-surface-highlight, #334155)",
        "text-primary": "var(--color-text-primary, #F8FAFC)",
        "text-secondary": "var(--color-text-secondary, #E2E8F0)",
        "text-muted": "var(--color-text-muted, #94A3B8)",
        "success": "var(--color-success, #22C55E)",
        "warning": "var(--color-warning, #F59E0B)",
        "error": "var(--color-error, #EF4444)",
        "info": "var(--color-info, #3B82F6)",
        "secondary": "var(--color-secondary, #64748B)",
        "accent": "var(--color-accent, #9ADBFF)",
        "border": "var(--color-border, rgba(154, 219, 255, 0.1))",
      },
      fontFamily: {
        "display": ["var(--font-family-display, 'Spline Sans')", "sans-serif"],
        "body": ["var(--font-family-body, 'Noto Sans')", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "var(--border-radius, 0.25rem)",
        "lg": "var(--border-radius-lg, 0.5rem)",
        "xl": "var(--border-radius-xl, 0.75rem)",
        "2xl": "var(--border-radius-xl, 1rem)",
        "3xl": "var(--border-radius-xl, 1.5rem)",
        "full": "9999px"
      },
      boxShadow: {
        "DEFAULT": "var(--box-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.5))",
        "lg": "var(--box-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.5))",
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
