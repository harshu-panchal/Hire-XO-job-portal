import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    effectiveTheme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        setEffectiveTheme('light');
        localStorage.setItem('theme', 'light');
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, [theme]);

    const toggleTheme = () => {
        // Forced light mode: do nothing or ensure it stays light
        setTheme('light');
    };

    return (
        <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
