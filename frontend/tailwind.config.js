/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      lineClamp: {
        2: '2',
        3: '3',
      },
      aspectRatio: {
        '2/3': '2 / 3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}