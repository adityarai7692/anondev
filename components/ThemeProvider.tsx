'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'choc' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'light', setTheme: () => {} });

export function useTheme() { return useContext(ThemeContext); }

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) || 'light';
    setThemeState(stored);
  }, []);

  const setTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-choc');
    if (t === 'dark')  root.classList.add('dark');
    if (t === 'choc')  root.classList.add('theme-choc');
    localStorage.setItem('theme', t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}