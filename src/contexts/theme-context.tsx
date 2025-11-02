import { createContext, useContext } from "react";

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  setTheme: (theme: Theme) => void
  theme: Theme
  toggleTheme: () => void
  isDark: () => boolean
  ifDark: (yes: string, no: string) => string
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
