import { NameInput } from "@/components/name-input"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useProjectContext } from "@/contexts/project-context"
import { buttonIconClasses, thinIconStyle } from "@/lib/styles"
import { PlusCircle } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"

export const AddNewProject: FC = () => {
  const { createProject } = useProjectContext()
  return (
    <TooltipCompact tooltipChildren={`Add new project`}>
      <NameInput
        icon={
          <PlusCircle
            className={buttonIconClasses}
            style={thinIconStyle} />
        }
        placeholder='Enter new project name...'
        addAction={
          (newName) => {
            if (newName) {
              toast(`Creating project ${newName}`)
              createProject(newName)
              return true
            }
            toast('Enter a new project name')
            return false
          }
        } />
    </TooltipCompact>
  )
}
