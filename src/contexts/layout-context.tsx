import { createContext, useContext } from "react";
import type { FC, ReactNode } from "react";

/// TODO ...

interface LayoutContextType {}

export const LayoutContext = createContext<LayoutContextType>({} as LayoutContextType);

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LayoutContext.Provider value={{
    }} >
      {children}
    </LayoutContext.Provider>
  )
};
