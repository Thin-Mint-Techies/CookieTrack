/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#1a9988',
        'green-light': '#48ada0',
        'green-dark': '#157a6d',
        'orange': '#eb5600',
        'orange-light': '#ef7833',
        'orange-dark': '#bc4500',
        'white': '#ffffff',
        'off-white': '#d9d9d9',
        'white-overlay': 'rgba(255,255,255,0.6)',
        'black': '#343434',
        'gray': '#D1D5DB',
        'red': '#d53d3d'
      },
      fontFamily: {
        sans: ['Lilita One', 'sans-serif']
      },
      borderRadius: {
        'default': '8px'
      },
      boxShadow: {
        'default': '0 3px 6px #00000029, 0 3px 6px #0000003b'
      },
      backgroundImage: {
        'main-bg': "url('/images/main-bg.png')"
      }
    },
  },
  plugins: [],
};
