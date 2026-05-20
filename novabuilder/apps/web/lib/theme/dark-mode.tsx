'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('nova-theme') as Theme | null;
    if (stored) setThemeState(stored);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mq.matches ? 'dark' : 'light');

    function handleChange(e: MediaQueryListEvent) {
      setSystemPreference(e.matches ? 'dark' : 'light');
    }
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemPreference : theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('nova-theme', t);
  }

  function toggle() {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const darkModeStyles = `
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --bg-card: #ffffff;
    --border-primary: #e2e8f0;
    --border-secondary: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --accent: #2563eb;
    --accent-bg: #eff6ff;
    --danger: #dc2626;
    --danger-bg: #fef2f2;
    --success: #16a34a;
    --success-bg: #f0fdf4;
    --warning: #d97706;
    --warning-bg: #fefce8;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.1);
  }

  [data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --bg-card: #1e293b;
    --border-primary: #334155;
    --border-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --accent: #3b82f6;
    --accent-bg: #1e3a5f;
    --danger: #f87171;
    --danger-bg: #450a0a;
    --success: #4ade80;
    --success-bg: #052e16;
    --warning: #fbbf24;
    --warning-bg: #451a03;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  }
`;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div style={toggleContainer}>
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          style={{
            ...toggleBtn,
            ...(theme === t ? activeBtn : {}),
          }}
        >
          {{ light: '○', dark: '●', system: '◐' }[t]}
          <span style={toggleLabel}>{t}</span>
        </button>
      ))}
    </div>
  );
}

const toggleContainer: React.CSSProperties = {
  display: 'flex', borderRadius: 10, border: '1px solid var(--border-primary, #e2e8f0)',
  overflow: 'hidden', background: 'var(--bg-secondary, #f8fafc)',
};
const toggleBtn: React.CSSProperties = {
  flex: 1, padding: '8px 12px', border: 'none', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 4, fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600,
  textTransform: 'capitalize',
};
const activeBtn: React.CSSProperties = {
  background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #0f172a)',
  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
};
const toggleLabel: React.CSSProperties = { fontSize: '0.7rem' };
