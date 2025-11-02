import { LongPressTooltipButton } from "@/components/long-press-tooltip-button"
import { useProjectContext } from "@/contexts/project-context"
import { buttonIconClasses, strokeIconStyle, thinIconStyle } from "@/lib/styles"
import { Zap, ZapOff } from "lucide-react"
import type { FC } from "react"

export const LiveUpdatingToggle: FC = () => {

  const { setLiveUpdating, liveUpdating } = useProjectContext()

  return (
    <LongPressTooltipButton
      duration={200}
      fillColor={`${liveUpdating ? 'bg-emerald-500' : 'bg-red-500'}`}
      title={`Live Updating is ${liveUpdating ? 'on' : 'off'}`}
      onLongPress={() => {
        setLiveUpdating(!liveUpdating)
      }}
      icon={
        liveUpdating
          ? <Zap
            className={buttonIconClasses}
            style={strokeIconStyle}
          />
          : <ZapOff
            className={buttonIconClasses}
            style={thinIconStyle}
          />
      }
    />
  )
}
