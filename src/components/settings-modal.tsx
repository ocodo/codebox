import { ModalHeader } from "@/components/modal-header"
import { ModalOverlay } from "@/components/modal-overlay"
import { useSettingsModal } from "@/contexts/settings-context"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjectContext } from "@/contexts/project-context"
import { TooltipCompact } from "@/components/tooltip-compact"
import type { CodeCardProps } from "@/components/code-card"

export const SettingsModal = () => {
  const { open, close, tab } = useSettingsModal()

  const { codeCards, codeProcessors, projectName } = useProjectContext()

  const activeCards = codeProcessors
    .map(({ target }) => codeCards.find(e => e.title == target))
    .filter(Boolean) as CodeCardProps[]

  return (
    <ModalOverlay isOpen={open} onClose={close} >
      <ModalHeader title={`Project Settings: ${projectName}`} />
      <div className='w-[100vw] sm:w-[70vw] h-[100vh] sm:h-[80vh]'>
        <Tabs defaultValue={tab}>
          <TabsList className='h-full'>
            {activeCards.map(({ title, icon }) =>
              <div key={title}>
                <TooltipCompact tooltipChildren={<div className='px-2 py-1 text-xs'>{title}</div>}>
                  <span>
                    <TabsTrigger
                      value={title}
                      className='flex flex-col items-center gap-1 px-2.5 sm:px-3'
                      aria-label='tab-trigger'
                    >
                      {icon}
                    </TabsTrigger>
                  </span>
                </TooltipCompact>
              </div>
            )}
          </TabsList>

          {
            activeCards.map(({ title }) => (
              <TabsContent key={title} value={title}>
                <div className='text-muted-foreground text-sm'>{title.toUpperCase()} - Settings</div>
              </TabsContent>
            ))
          }
        </Tabs>

      </div>
    </ModalOverlay>
  )
}
