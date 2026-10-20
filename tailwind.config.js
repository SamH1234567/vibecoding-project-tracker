/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens from DESIGN.md §2. Use e.g. `bg-brand-primary`, `border-due-warning`.
      colors: {
        brand: { primary: '#4F46E5', accent: '#0EA5E9' },
        surface: { page: '#F8FAFC', card: '#FFFFFF' },
        text: { primary: '#0F172A', muted: '#64748B' },
        type: { feature: '#3B82F6', bug: '#9333EA' },
        due: { safe: '#10B981', warning: '#F59E0B', overdue: '#DC2626', neutral: '#94A3B8' },
      },
      // DESIGN.md §3
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
