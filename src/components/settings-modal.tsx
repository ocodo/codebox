import { ModalHeader } from "@/components/modal-header"
import { ModalOverlay } from "@/components/modal-overlay"
import { useSettingsModal } from "@/contexts/settings-context"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjectContext, type CdnLinkType } from "@/contexts/project-context"
import { TooltipCompact } from "@/components/tooltip-compact"
import type { CodeCardProps } from "@/components/code-card"
import { Circle, CircleCheck, CloudCog } from "lucide-react"
import type { FC } from "react"

export const SettingsModal = () => {
  const { open, close, tab } = useSettingsModal()

  const { codeCards, codeProcessors, projectName, cdnLinks } = useProjectContext()

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
                      className='flex flex-col items-center gap-1 px-2.5 sm:px-3 cursor-pointer'
                      aria-label='tab-trigger'
                    >
                      {icon}
                    </TabsTrigger>
                  </span>
                </TooltipCompact>
              </div>
            )}
            <div>
              <TooltipCompact tooltipChildren={<div className='px-2 py-1 text-xs'>cdn</div>}>
                <span>
                  <TabsTrigger
                    value='cdn'
                    className='flex flex-col items-center gap-1 px-2.5 sm:px-3 cursor-pointer'
                  >
                    <CloudCog
                      className="w-6 h-6 p-1 text-background bg-emerald-700 rounded-sm"
                    />
                  </TabsTrigger>
                </span>
              </TooltipCompact>
            </div>
          </TabsList>

          {
            activeCards.map(({ title }) => (
              <TabsContent key={title} value={title}>
                <div className='text-muted-foreground text-sm'>{title.toUpperCase()} - Settings</div>
              </TabsContent>
            ))
          }

          <TabsContent value='cdn'>
            <div className="p-2 mt-1 flex flex-col gap-2">
              <div className="text-lg font-bold tracking-tighter">CDNs</div>
              <div>CDN tags will be automatically added to the project view when selected</div>
              {
                cdnLinks.map(cdn => {
                  return (
                    <CdnSelect {...cdn} />
                  )
                })
              }
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </ModalOverlay>
  )
}

export const CdnSelect: FC<CdnLinkType> = ({ name, type, url }) => {
  const { activeCdnLinks, updateActiveCdnLinks } = useProjectContext()

  const toggleCdn = () => {
    if (activeCdnLinks.has(name)) {
      activeCdnLinks.delete(name)
    } else {
      activeCdnLinks.add(name)
    }
    updateActiveCdnLinks()
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => toggleCdn()}
        className="flex flex-row gap-2 items-center justify-start cursor-pointer">
        {activeCdnLinks.has(name)
          ? <CircleCheck className={`w-3 h-3`} />
          : <Circle className={`w-3 h-3`} />
        }
        <div>{name}</div>
      </div>
      <div className="bg-background rounded-lg text-xs m-1 p-2 overflow-x-auto">
        <pre>{`<${type} ${type == 'link' ? 'href' : 'src'}="${url}"><${type}>`}</pre>
      </div>
    </div>
  )
}
