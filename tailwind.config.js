/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html'],
  theme: {
    colors: {
      'green': '#1a9988',
      'green-light': '#48ada0',
      'green-dark': '#157a6d',
      'orange': '#eb5600',
      'white': '#ffffff',
      'off-white': '#d9d9d9',
      'black': '#343434',
      'gray' : '#D1D5DB'
    }, 
    fontFamily: {
      sans: ['Lilita One', 'sans-serif']
    },
    borderRadius: {
      'default': '8px'
    },
    boxShadow: {
      'default': '0 3px 6px #00000029, 0 3px 6px #0000003b'
    }
  },
  plugins: [],
}

