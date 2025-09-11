/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NSR-PC Color Palette
        primary: {
          DEFAULT: '#1A73E8', // الأزرق الملكي الفخم
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1A73E8',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A3D91',
        },
        secondary: {
          DEFAULT: '#1B3C73', // النيلي الفخم
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#1B3C73',
          600: '#3949AB',
          700: '#303F9F',
          800: '#283593',
          900: '#1A237E',
        },
        dark: {
          DEFAULT: '#121212', // الأسود الفحمي
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#303030',
          900: '#121212',
        },
        neutral: {
          DEFAULT: '#B0BEC5', // الفضي الرمادي
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#B0BEC5',
          600: '#9AA0A6',
          700: '#80868B',
          800: '#5F6368',
          900: '#3C4043',
        },
        accent: {
          DEFAULT: '#00CFFF', // السماوي الكهربائي
          50: '#E0F7FF',
          100: '#B3EBFF',
          200: '#80DDFF',
          300: '#4DCEFF',
          400: '#1AC1FF',
          500: '#00CFFF',
          600: '#00B8E6',
          700: '#00A1CC',
          800: '#008AB3',
          900: '#006699',
        }
      },
      backgroundColor: {
        'nsr-dark': '#121212',
        'nsr-primary': '#1A73E8',
        'nsr-secondary': '#1B3C73',
        'nsr-neutral': '#B0BEC5',
        'nsr-accent': '#00CFFF',
      },
      textColor: {
        'nsr-primary': '#1A73E8',
        'nsr-secondary': '#1B3C73',
        'nsr-neutral': '#B0BEC5',
        'nsr-accent': '#00CFFF',
      },
      borderColor: {
        'nsr-primary': '#1A73E8',
        'nsr-secondary': '#1B3C73',
        'nsr-neutral': '#B0BEC5',
        'nsr-accent': '#00CFFF',
      }
    },
  },
  plugins: [],
}