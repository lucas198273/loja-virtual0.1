/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')",
      },
      screens: {
        'mobile': {'max': '640px'}, // Máximo para dispositivos móveis
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
