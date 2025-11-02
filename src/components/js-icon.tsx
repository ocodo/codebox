import { useTheme } from "@/contexts/theme-context";
import type { SVGProps } from "react";

export const JSIcon = (props: SVGProps<SVGSVGElement>) => {
  const { ifDark } = useTheme()
  const text = '{ }'
  return (
    <svg viewBox="0 0 15 15" {...props}>
      <rect fill="#fc7d00" width="15" height="15" rx="4" />
      <text x="2.6" y="10" fontSize="8" fontWeight="bold" fill={ifDark('black', 'white')} >{text}</text>
    </svg>
  )
}

