import type { SVGProps } from "react";

export const CSSIcon = (props: SVGProps<SVGSVGElement>) => {
  const text = '*'
  return (
    <svg viewBox="0 0 15 15" {...props}>
      <rect fill="#66309a" width="15" height="15" rx="4" />
      <text x="4.5" y="15" font-size="14" >{text}</text>
    </svg>
  )
}
