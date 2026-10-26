/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens from DESIGN.md §2. Use e.g. `bg-brand-primary`, `border-due-warning`.
      colors: {
        brand: { primary: '#4F46E5', accent: '#0EA5E9' },
        surface: { page: '#F8FAFC', card: '#FFFFFF' },
        // Darkened for WCAG 2.2 AA contrast (see ACCESSIBILITY.md).
        text: { primary: '#0F172A', muted: '#475569' },
        type: { feature: '#2563EB', bug: '#9333EA' },
        due: { safe: '#047857', warning: '#B45309', overdue: '#DC2626', neutral: '#94A3B8' },
        // Borders of text inputs and selects: at least 3:1 against white (WCAG 1.4.11).
        line: { control: '#7B8799' },
      },
      // DESIGN.md §3
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // The only animation allowed by DESIGN §7: a 200 ms toast fade.
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
