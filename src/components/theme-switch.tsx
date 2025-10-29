import { Moon, Sun } from "lucide-react"
import { useContext, type FC } from "react"
import { ThemeContext, type ThemeContextType } from "@/contexts/theme-context"
import { buttonIconClasses } from "@/lib/styles"
import { TooltipCompact } from "@/components/tooltip-compact"

export const ThemeSwitch: FC = () => {

  const { theme, setTheme } = useContext<ThemeContextType>(ThemeContext)

  const iconProps = {
    className: buttonIconClasses,
    style: {
      strokeWidth: 1
    }
  }

  return (
    <TooltipCompact tooltipChildren={`Switch theme to ${theme === 'dark' ? 'light': 'dark'} mode`}>
      {
        theme === 'dark'
          ? <Moon onClick={() => setTheme('light')} {...iconProps} />
          : <Sun onClick={() => setTheme('dark')} {...iconProps} />
      }
    </TooltipCompact>
  )
}


