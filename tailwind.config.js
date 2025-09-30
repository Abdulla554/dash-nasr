/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode: "class", // تم إزالة وضع التبديل - ثيم ثابت فقط
  theme: {
    extend: {
      colors: {
        // نظام الألوان الجديد الممتاز
        // 1️⃣ الأسود/الغامق
        dark: {
          DEFAULT: "#1a1a2e", // الأسود الفخم الأساسي
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#1a1a2e", // اللون الأساسي
          950: "#0f0f1a", // أغمق للتباين
        },
        // 2️⃣ الأبيض/الفاتح
        light: {
          DEFAULT: "#F9F3EF", // الكريمي الفخم الأساسي
          50: "#F9F3EF", // اللون الأساسي
          100: "#f5f0eb",
          200: "#f0e8e0",
          300: "#e8ddd2",
          400: "#ddd0c1",
          500: "#d1c2b0",
          600: "#c4b39e",
          700: "#b5a28b",
          800: "#a59077",
          900: "#947d62",
        },
        // 3️⃣ اللون الثانوي - الأزرق الباهت الفخم
        secondary: {
          DEFAULT: "#2C6D90", // الأزرق الباهت الفخم
          50: "#f0f4f8",
          100: "#d9e4f0",
          200: "#b3c9e1",
          300: "#8daed2",
          400: "#2C6D90", // اللون الأساسي
          500: "#5a8bb3",
          600: "#4a7ba3",
          700: "#3a6b93",
          800: "#2a5b83",
          900: "#1a4b73",
          950: "#0a3b63",
        },
        // 4️⃣ اللون الأكسنت - التركواز المعدني
        accent: {
          DEFAULT: "#2C6D90", // التركواز المعدني
          50: "#e6f2f7",
          100: "#b3d9e6",
          200: "#80c0d5",
          300: "#4da7c4",
          400: "#2C6D90", // اللون الأساسي
          500: "#2a5f7d",
          600: "#28516a",
          700: "#264357",
          800: "#243544",
          900: "#222731",
          950: "#20191e",
        },
        // ألوان إضافية للدعم
        primary: {
          DEFAULT: "#2C6D90", // نفس الثانوي للتوافق
          50: "#f0f4f8",
          100: "#d9e4f0",
          200: "#b3c9e1",
          300: "#8daed2",
          400: "#2C6D90",
          500: "#5a8bb3",
          600: "#4a7ba3",
          700: "#3a6b93",
          800: "#2a5b83",
          900: "#1a4b73",
        },
        // ألوان الحالة
        success: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        warning: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        error: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      // ألوان الخلفية المخصصة
      backgroundColor: {
        "nsr-dark": "#1a1a2e",
        "nsr-light": "#F9F3EF",
        "nsr-secondary": "#2C6D90",
        "nsr-accent": "#2C6D90",
        "nsr-dark-900": "#1a1a2e",
        "nsr-light-cream": "#F9F3EF",
        "nsr-blue-elegant": "#2C6D90",
        "nsr-turquoise": "#2C6D90",
      },
      // ألوان النص المخصصة
      textColor: {
        "nsr-dark": "#1a1a2e",
        "nsr-light": "#F9F3EF",
        "nsr-secondary": "#2C6D90",
        "nsr-accent": "#2C6D90",
        "nsr-dark-900": "#1a1a2e",
        "nsr-light-cream": "#F9F3EF",
        "nsr-blue-elegant": "#2C6D90",
        "nsr-turquoise": "#2C6D90",
      },
      // ألوان الحدود المخصصة
      borderColor: {
        "nsr-dark": "#1a1a2e",
        "nsr-light": "#F9F3EF",
        "nsr-secondary": "#2C6D90",
        "nsr-accent": "#2C6D90",
        "nsr-dark-900": "#1a1a2e",
        "nsr-light-cream": "#F9F3EF",
        "nsr-blue-elegant": "#2C6D90",
        "nsr-turquoise": "#2C6D90",
      },
      // تدرجات مخصصة
      backgroundImage: {
        "gradient-nsr-dark":
          "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
        "gradient-nsr-light":
          "linear-gradient(135deg, #F9F3EF 0%, #f5f0eb 100%)",
        "gradient-nsr-secondary":
          "linear-gradient(135deg, #2C6D90 0%, #5a8bb3 100%)",
        "gradient-nsr-accent":
          "linear-gradient(135deg, #2C6D90 0%, #2a5f7d 100%)",
        "gradient-nsr-elegant":
          "linear-gradient(135deg, #2C6D90 0%, #2C6D90 100%)",
        "gradient-nsr-sunset":
          "linear-gradient(135deg, #F9F3EF 0%, #2C6D90 50%, #2C6D90 100%)",
      },
    },
  },
  plugins: [],
};
