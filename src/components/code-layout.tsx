import { CodeCard } from "@/components/code-card"
import { useProjectContext } from "@/contexts/project-context"

import type { FC } from "react"

export const CodeLayout: FC = () => {
  const {
    focused,
    codeCards,
    layout,
  } = useProjectContext();

  const containerClassName = () => {
    if (layout == 'vertical') {
      if (focused == '') {
        return 'grid grid-cols-3 gap-2';
      }
      return 'grid grid-cols-1 gap-2';
    }
    if (layout == 'horizontal') {
      if( focused == '') {
        return 'grid grid-rows-3 gap-2';
      }
      return 'grid grid-rows-1 gap-2';
    }
  }

  const cards = () => {
    if (focused == '') {
      return codeCards;
    } else {
      return codeCards.filter(c => c.title == focused);
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
