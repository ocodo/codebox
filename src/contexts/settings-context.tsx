import { createContext, useContext, useState } from "react";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

interface SettingsContextType {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>;
  close: () => void
}

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
  }

  return (
    <SettingsContext.Provider value={{
      open,
      setOpen,
      close,
    }} >
      {children}
    </SettingsContext.Provider>
  )
};
