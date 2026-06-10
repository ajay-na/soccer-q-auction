import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { darkPalette, lightPalette, palettes, type ThemeMode, type ThemePalette } from './colors';

const STORAGE_KEY = 'auction-board-theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemePalette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({ mode, colors: palettes[mode], toggleTheme }),
    [mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export function ThemeToggle() {
  const { mode, colors, toggleTheme } = useTheme();

  const buttonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderRadius: '8px',
    border: `1px solid ${colors.toggleBorder}`,
    backgroundColor: colors.toggleBg,
    color: colors.toggleColor,
    boxShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={buttonStyle}
      aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span aria-hidden="true">{mode === 'light' ? '🌙' : '☀️'}</span>
      {mode === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}

export { darkPalette, lightPalette };

