import React, { useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    // ثيم ثابت - لا حاجة لمتغير isDark

    // نظام الألوان الثابت الأربعة المطلوبة
    const colorPalette = {
        // الألوان الأساسية الأربعة المطلوبة
        dark: '#1a1a2e',           // 1️⃣ الأسود/الغامق (الخلفية الرئيسية)
        light: '#F9F3EF',          // 2️⃣ الأبيض/الفاتح (النصوص الرئيسية)
        secondary: '#749BC2',      // 3️⃣ الأزرق الباهت الفخم (اللون الثانوي)
        accent: '#2C6D90',         // 4️⃣ التركواز المعدني (لون الأكسنت)

        // تدرجات اللون الغامق
        darkVariants: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#1a1a2e',         // اللون الأساسي
            950: '#0f0f1a',
        },

        // تدرجات اللون الفاتح
        lightVariants: {
            50: '#F9F3EF',           // اللون الأساسي
            100: '#f5f0eb',
            200: '#f0e8e0',
            300: '#e8ddd2',
            400: '#ddd0c1',
            500: '#d1c2b0',
            600: '#c4b39e',
            700: '#b5a28b',
            800: '#a59077',
            900: '#947d62',
        },

        // تدرجات اللون الثانوي (الأزرق الباهت)
        secondaryVariants: {
            50: '#f0f6fa',
            100: '#d9e8f2',
            200: '#b3d1e5',
            300: '#8dbad8',
            400: '#749BC2',          // اللون الأساسي
            500: '#5e88ab',
            600: '#4f7594',
            700: '#40627d',
            800: '#314f66',
            900: '#223c4f',
            950: '#132938',
        },

        // تدرجات لون الأكسنت (التركواز المعدني)
        accentVariants: {
            50: '#e6f3f8',
            100: '#bce0eb',
            200: '#92cdde',
            300: '#68bad1',
            400: '#3e87a4',
            500: '#2C6D90',          // اللون الأساسي
            600: '#255e7d',
            700: '#1e4f6a',
            800: '#174057',
            900: '#103144',
            950: '#092231',
        }
    };

    // الحصول على ألوان الثيم الثابتة
    const getThemeColors = () => {
        return {
            // الخلفيات
            primary: colorPalette.dark,                    // #1a1a2e
            secondary: colorPalette.darkVariants[800],     // #212529
            tertiary: colorPalette.darkVariants[700],      // #343a40

            // النصوص
            text: colorPalette.light,                      // #F9F3EF
            textSecondary: colorPalette.lightVariants[100], // #f5f0eb
            textMuted: colorPalette.lightVariants[300],    // #e8ddd2

            // الألوان التفاعلية
            accent: colorPalette.accent,                   // #2C6D90
            primaryColor: colorPalette.secondary,          // #749BC2

            // العناصر الإضافية
            border: colorPalette.secondaryVariants[800],   // #314f66
            borderLight: colorPalette.secondaryVariants[600], // #4f7594
            shadow: 'rgba(26, 26, 46, 0.3)',
            overlay: 'rgba(26, 26, 46, 0.8)',

            // حالات خاصة
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: colorPalette.secondary,
        };
    };

    useEffect(() => {
        // تطبيق الثيم الثابت
        localStorage.setItem('nsr-theme', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');

        // تحديث CSS custom properties
        const colors = getThemeColors();
        const root = document.documentElement;

        // الألوان الأساسية
        root.style.setProperty('--color-dark', colorPalette.dark);
        root.style.setProperty('--color-light', colorPalette.light);
        root.style.setProperty('--color-secondary', colorPalette.secondary);
        root.style.setProperty('--color-accent', colorPalette.accent);

        // خصائص CSS للاستخدام في التطبيق
        root.style.setProperty('--bg-primary', colors.primary);
        root.style.setProperty('--bg-secondary', colors.secondary);
        root.style.setProperty('--bg-tertiary', colors.tertiary);
        root.style.setProperty('--text-primary', colors.text);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--text-muted', colors.textMuted);
        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--primary', colors.primaryColor);
        root.style.setProperty('--border', colors.border);
        root.style.setProperty('--border-light', colors.borderLight);
        root.style.setProperty('--shadow', colors.shadow);
        root.style.setProperty('--overlay', colors.overlay);

        // ألوان الحالات
        root.style.setProperty('--success', colors.success);
        root.style.setProperty('--warning', colors.warning);
        root.style.setProperty('--error', colors.error);
        root.style.setProperty('--info', colors.info);

        // تدرجات للاستخدام في CSS
        Object.entries(colorPalette.darkVariants).forEach(([key, value]) => {
            root.style.setProperty(`--dark-${key}`, value);
        });
        Object.entries(colorPalette.lightVariants).forEach(([key, value]) => {
            root.style.setProperty(`--light-${key}`, value);
        });
        Object.entries(colorPalette.secondaryVariants).forEach(([key, value]) => {
            root.style.setProperty(`--secondary-${key}`, value);
        });
        Object.entries(colorPalette.accentVariants).forEach(([key, value]) => {
            root.style.setProperty(`--accent-${key}`, value);
        });

        // إضافة تدرجات مخصصة
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colorPalette.dark}, ${colorPalette.accent})`);
        root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${colorPalette.accent}, ${colorPalette.secondary})`);
        root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${colorPalette.secondary}, ${colorPalette.light})`);

    }, []);

    const value = {
        isDark: true, // ثابت - للتوافق مع المكونات الموجودة
        colorPalette,
        getThemeColors,
        currentColors: getThemeColors(),

        // دوال مساعدة للوصول السريع للألوان
        colors: {
            dark: colorPalette.dark,
            light: colorPalette.light,
            secondary: colorPalette.secondary,
            accent: colorPalette.accent,
        },

        // دوال للحصول على التدرجات
        getDarkVariant: (shade) => colorPalette.darkVariants[shade] || colorPalette.dark,
        getLightVariant: (shade) => colorPalette.lightVariants[shade] || colorPalette.light,
        getSecondaryVariant: (shade) => colorPalette.secondaryVariants[shade] || colorPalette.secondary,
        getAccentVariant: (shade) => colorPalette.accentVariants[shade] || colorPalette.accent,

        // دوال للتدرجات
        gradients: {
            primary: `linear-gradient(135deg, ${colorPalette.dark}, ${colorPalette.accent})`,
            secondary: `linear-gradient(135deg, ${colorPalette.accent}, ${colorPalette.secondary})`,
            accent: `linear-gradient(135deg, ${colorPalette.secondary}, ${colorPalette.light})`,
            elegant: `linear-gradient(135deg, ${colorPalette.accent}, ${colorPalette.secondary})`,
        }
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook للوصول لسياق الثيم
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};