import { Moon, Sun } from "lucide-react"
import type { FC } from "react"
import { buttonIconClasses } from "@/lib/combined-styles"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useTheme } from "@/contexts/theme-context"

export const ThemeSwitch: FC = () => {

  const { theme, toggleTheme } = useTheme()

  const iconProps = {
    className: buttonIconClasses,
    style: {
      strokeWidth: 1
    }
  }

  return (
    <TooltipCompact tooltipChildren={`Switch theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <div onClick={() => toggleTheme()} >
        {
          theme === 'dark'
            ? <Moon {...iconProps} />
            : <Sun {...iconProps} />
        }
      </div>
    </TooltipCompact>
  )
}


