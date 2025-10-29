import { rotated180, thinIconStyle } from "@/lib/styles"
import { LayoutGrid, LayoutPanelTop } from "lucide-react"
import type { FC } from "react"

interface LayoutSelectorProps { }

export const LayoutSelector: FC<LayoutSelectorProps> = ({ }) => {
  return (
    <>
      <LayoutGrid
        className='w-10 h-10' style={thinIconStyle} />
      <LayoutPanelTop
        className='w-10 h-10'
        style={{ ...thinIconStyle, ...rotated180 }} />
    </>
  )
}
