import type { SVGProps } from "react";

export const HTMLIcon  = (props: SVGProps<SVGSVGElement>) =>  {
  const text = '<>'
  return (
    <svg viewBox="0 0 15 15" {...props}>
      <rect fill="#e54c21" width="15" height="15" rx="4" />
      <text x="1" y="10.5" fontSize="10" >{text}</text>
    </svg>
  )
}

