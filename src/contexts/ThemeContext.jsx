import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first, then system preference
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update localStorage and document class
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const value = {
        isDark,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
