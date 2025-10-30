import { CodeCard } from "@/components/code-card"
import { useProjectContext } from "@/contexts/project-context"

import type { FC } from "react"

export const CodeColumsLayout: FC = () => {
  const {
    focused,
    codeCards,
  } = useProjectContext()

  const containerClassName = () => {
    if (focused == '') {
      return 'grid grid-cols-3  gap-2'
    } else {
      return 'grid grid-cols-1  gap-2'
    }
  }

  const cards = () => {
    if (focused == '') {
      return codeCards;
    } else {
      return codeCards.filter(c => c.title == focused)
    }
  }

  return (
    <div className={containerClassName()}>
      {
        cards().map(card => <CodeCard key={card.title} {...card} />)
      }
    </div>
  )
}
