import { CodeCard } from "@/components/code-card"
import { useProjectContext } from "@/contexts/project-context"
import { Allotment } from "allotment";

import type { FC } from "react"

export const CodeLayout: FC = () => {
  const {
    focused,
    codeCards,
    layout,
  } = useProjectContext();


  const cards = () => {
    if (focused == '') {
      return codeCards;
    } else {
      return codeCards.filter(c => c.title == focused);
    }
  }

  return (
    <div className="h-full w-full">
      <Allotment key={layout} vertical={layout === 'horizontal'}>
        {
          cards().map(card => (
            <Allotment.Pane>
              <CodeCard key={card.title} {...card} />
            </Allotment.Pane>
          ))
        }
      </Allotment>
    </div>
  )
}
