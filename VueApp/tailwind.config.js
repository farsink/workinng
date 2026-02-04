export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ecda13',
        error: '#f87272',
        success: '#36d399',
        warning: '#fbbd23',
        info: '#3abff8',
        'background-light': '#f8f8f6',
        'background-dark': '#222010',
        'surface-dark': '#2c2a1a',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#ecda13",
          "secondary": "#34D399",
          "accent": "#ecda13",
          "neutral": "#2c2a1a",
          "base-100": "#222010",
          "base-200": "#2c2a1a",
          "base-300": "#1a180c",
          "base-content": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}
