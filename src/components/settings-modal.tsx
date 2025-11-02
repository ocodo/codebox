import { ModalHeader } from "@/components/modal-header"
import { ModalOverlay } from "@/components/modal-overlay"
import { useSettingsModal } from "@/contexts/settings-context"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjectContext, type CdnLinkType, type CodeProcessorType } from "@/contexts/project-context"
import { TooltipCompact } from "@/components/tooltip-compact"
import type { CodeCardProps } from "@/components/code-card"
import { Circle, CircleCheck, CloudCog } from "lucide-react"
import type { FC } from "react"

export const SettingsModal = () => {
  const { open, close, tab } = useSettingsModal()
  const { codeCards, codeProcessors, projectName, cdnLinks } = useProjectContext()
  const availableProcessors = codeProcessors
    .map(({ target }) => codeCards.find(e => e.title == target))
    .filter(Boolean) as CodeCardProps[]

  return (
    <ModalOverlay isOpen={open} onClose={close} >
      <ModalHeader title={`Project Settings: ${projectName}`} />
      <div className='w-[100vw] sm:w-[70vw] h-[100vh] sm:h-[80vh]'>
        <Tabs defaultValue={tab}>
          <TabsList className='h-full'>
            {availableProcessors.map(({ title, icon }) =>
              <div key={title}>
                <TooltipCompact tooltipChildren={<div className='px-2 py-1 text-xs'>{title}</div>}>
                  <TabsTrigger
                    value={title}
                    className='flex flex-col items-center gap-1 px-2.5 sm:px-3 cursor-pointer'
                    aria-label='tab-trigger'
                  >
                    {icon}
                  </TabsTrigger>
                </TooltipCompact>
              </div>
            )}
            <div>
              <TooltipCompact tooltipChildren={<div className='px-2 py-1 text-xs'>cdn</div>}>
                <TabsTrigger
                  value='cdn'
                  className='flex flex-col items-center gap-1 px-2.5 sm:px-3 cursor-pointer'
                >
                  <CloudCog
                    className="w-6 h-6 p-1 text-background bg-emerald-700 rounded-sm"
                  />
                </TabsTrigger>
              </TooltipCompact>
            </div>
          </TabsList>

          {
            availableProcessors.map(({ title }) => (
              <TabsContent key={title} value={title}>
                <div className='text-lg font-bold tracking-tighter'>{title.toUpperCase()}</div>

                {codeProcessors
                  .filter(p => p.target == title)
                  .map((processor) =>
                    <ProcessorSelect {...processor} />
                  )}
              </TabsContent>
            ))
          }
          <TabsContent value='cdn'>
            <div className="p-2 mt-1 flex flex-col gap-2">
              <div className="text-lg font-bold tracking-tighter">CDN</div>
              {
                cdnLinks.map(cdn => {
                  return (
                    <CdnSelect key={cdn.name} {...cdn} />
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

export const ProcessorSelect: FC<CodeProcessorType> = ({ name }) => {

  const { activeProcessors } = useProjectContext()

  return (
    <div
      onClick={() => {
        if (name) {
          if (activeProcessors.has(name)) {
            activeProcessors.delete(name)
          } else {
            activeProcessors.add(name)
          }
        }
      }}
      className="flex-row flex items-center justify-start gap-2 cursor-pointer select-none" >
      {
        name && activeProcessors.has(name)
          ? <CircleCheck className="w-3 h-3 " />
          : <Circle className="w-3 h-3" />
      }
      <div>{name}</div>
    </div>
  )
}

export const CdnSelect: FC<CdnLinkType> = ({ name, type, url, description }) => {
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

    <TooltipCompact tooltipChildren={
      <>
        <pre>{`<${type} ${type == 'link' ? 'href' : 'src'}="${url}"><${type}>`}</pre>
        {
          description &&
          <div>{description}</div>
        }
      </>
    }>
      <div
        onClick={() => toggleCdn()}
        className="flex flex-row gap-2 items-center justify-start cursor-pointer">
        {activeCdnLinks.has(name)
          ? <CircleCheck className={`w-3 h-3`} />
          : <Circle className={`w-3 h-3`} />
        }
        <div>{name}</div>
      </div>
    </TooltipCompact>

  )
}
