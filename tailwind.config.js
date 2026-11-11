/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        univ: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          text: '#111111',
          muted: '#6B6B6B',
          border: '#E2E2E2',
          dark: '#2B2B2B',
          accent: '#1B3A8C',
          alert: '#DC2626',
        },
        brand: {
          50: '#f0f4fc',
          100: '#e0e9f8',
          200: '#c2d4f2',
          300: '#95b6e9',
          400: '#6191dd',
          500: '#3c71ce',
          600: '#1B3A8C', // Primary university accent
          700: '#162e70',
          800: '#13265b',
          900: '#11214c',
          950: '#0b1430',
        },
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
      },
    },
  },
  plugins: [],
}
