'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Coffee, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light' as const, icon: Sun,    label: 'Light'     },
    { key: 'choc'  as const, icon: Coffee, label: 'Chocolate' },
    { key: 'dark'  as const, icon: Moon,   label: 'Dark'      },
  ];

  return (
    <div
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      className="flex rounded overflow-hidden"
    >
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          title={label}
          style={{
            background: theme === key ? 'var(--accent)' : 'transparent',
            color:      theme === key ? 'var(--accent-fg)' : 'var(--muted)',
          }}
          className="p-1.5 transition-all hover:opacity-80"
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}