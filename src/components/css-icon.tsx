import { useTheme } from "@/contexts/theme-context";
import type { SVGProps } from "react";

export const CSSIcon = (props: SVGProps<SVGSVGElement>) => {
  const { ifDark } = useTheme()
  const text = '*'
  return (
    <svg viewBox="0 0 15 15" {...props}>
      <rect fill="#66309a" width="15" height="15" rx="4" />
      <text x="4.5" y="15" fontSize="14" fill={ifDark('black', 'white')}>{text}</text>
    </svg>
  )
}
