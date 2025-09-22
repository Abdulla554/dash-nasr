import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first, then system preference
        const saved = localStorage.getItem('nsr-theme');
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // نظام الألوان الجديد الممتاز
    const colorPalette = {
        // الألوان الأساسية الأربعة
        dark: '#1a1a2e',           // 1️⃣ الأسود/الغامق
        light: '#F9F3EF',          // 2️⃣ الأبيض/الفاتح  
        secondary: '#749BC2',      // 3️⃣ الأزرق الباهت الفخم
        accent: '#2C6D90',         // 4️⃣ التركواز المعدني
        
        // ألوان إضافية
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
            900: '#1a1a2e',
            950: '#0f0f1a',
        },
        lightVariants: {
            50: '#F9F3EF',
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
        secondaryVariants: {
            50: '#f0f4f8',
            100: '#d9e4f0',
            200: '#b3c9e1',
            300: '#8daed2',
            400: '#749BC2',
            500: '#5a8bb3',
            600: '#4a7ba3',
            700: '#3a6b93',
            800: '#2a5b83',
            900: '#1a4b73',
            950: '#0a3b63',
        },
        accentVariants: {
            50: '#e6f2f7',
            100: '#b3d9e6',
            200: '#80c0d5',
            300: '#4da7c4',
            400: '#2C6D90',
            500: '#2a5f7d',
            600: '#28516a',
            700: '#264357',
            800: '#243544',
            900: '#222731',
            950: '#20191e',
        }
    };

    // الحصول على الألوان حسب الوضع
    const getThemeColors = () => {
        if (isDark) {
            return {
                primary: colorPalette.dark,
                secondary: colorPalette.darkVariants[800],
                tertiary: colorPalette.darkVariants[700],
                text: colorPalette.light,
                textSecondary: colorPalette.lightVariants[100],
                textMuted: '#adb5bd',
                accent: colorPalette.accent,
                primaryColor: colorPalette.secondary,
                border: colorPalette.darkVariants[700],
                shadow: 'rgba(26, 26, 46, 0.3)',
            };
        } else {
            return {
                primary: colorPalette.light,
                secondary: colorPalette.lightVariants[100],
                tertiary: '#e8ddd2',
                text: colorPalette.dark,
                textSecondary: colorPalette.darkVariants[800],
                textMuted: '#6c757d',
                accent: colorPalette.accent,
                primaryColor: colorPalette.secondary,
                border: '#ddd0c1',
                shadow: 'rgba(249, 243, 239, 0.3)',
            };
        }
    };

    useEffect(() => {
        // Update localStorage and document class
        localStorage.setItem('nsr-theme', isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
        
        // Update CSS custom properties
        const colors = getThemeColors();
        const root = document.documentElement;
        
        root.style.setProperty('--bg-primary', colors.primary);
        root.style.setProperty('--bg-secondary', colors.secondary);
        root.style.setProperty('--bg-tertiary', colors.tertiary);
        root.style.setProperty('--text-primary', colors.text);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--text-muted', colors.textMuted);
        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--primary', colors.primaryColor);
        root.style.setProperty('--border', colors.border);
        root.style.setProperty('--shadow', colors.shadow);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const setTheme = (theme) => {
        setIsDark(theme === 'dark');
    };

    const value = {
        isDark,
        toggleTheme,
        setTheme,
        colorPalette,
        getThemeColors,
        currentColors: getThemeColors(),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
