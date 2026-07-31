/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        initial: 'initial',
      },
      height: {
        'screen-d': '100dvh',
      },
    },
  },
  plugins: [],
}
