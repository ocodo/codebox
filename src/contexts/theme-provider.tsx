import React, { useEffect } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import { useLocalStorage } from "usehooks-ts";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>("theme", "light");

  const isDark = () => theme === 'dark';

  const ifDark = (yes: any, no: any) => isDark() ? yes : no

  useEffect(() => {
    const gradient = document.querySelector('.body-background-gradient')
    if (theme == 'dark') {
      document.body.classList.add('dark')
      gradient?.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
      gradient?.classList.remove('dark');
    }
  }, [theme])

  const toggleTheme = () =>
    (theme == 'light')
      ? setTheme('dark')
      : setTheme('light')

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      isDark,
      ifDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
