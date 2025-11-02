import { createContext, useContext, useState } from "react";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

interface SettingsContextType {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>;
  close: () => void
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
}

export const SettingsModalContext = createContext<SettingsContextType>({} as SettingsContextType);

export const useSettingsModal = (): SettingsContextType => {
  const context = useContext(SettingsModalContext);
  if (!context) {
    throw new Error('useSettingsModal must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsModalProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<string>('js')

  const close = () => {
    setOpen(false)
  }

  return (
    <SettingsModalContext.Provider value={{
      open,
      setOpen,
      close,
      tab,
      setTab,
    }} >
      {children}
    </SettingsModalContext.Provider>
  )
};
