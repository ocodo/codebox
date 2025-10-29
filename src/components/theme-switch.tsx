import { Moon, Sun } from "lucide-react"
import { useContext, type FC } from "react"
import { ThemeContext, type ThemeContextType } from "@/contexts/theme-context"
import { buttonIconClasses } from "@/lib/styles"

export const ThemeSwitch: FC = () => {

  const { theme, setTheme } = useContext<ThemeContextType>(ThemeContext)

  const iconProps = {
    className: buttonIconClasses,
    style: {
      strokeWidth: 1
    }
  }

  return (
    <>
      {
        theme === 'dark'
          ? <Moon onClick={() => setTheme('light')} {...iconProps} />
          : <Sun onClick={() => setTheme('dark')} {...iconProps} />
      }
    </>
  )
}


