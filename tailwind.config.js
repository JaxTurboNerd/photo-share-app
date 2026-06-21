/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-main)',
        accent: 'var(--accent)',
        ink: 'var(--text-color)',
        muted: '#888780',
        line: '#E5E3DA',
      },
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
        display: ['Concert One', 'cursive'],
      },
      letterSpacing: {
        tightish: '-0.02em',
      },
    },
  },
  plugins: [],
}
