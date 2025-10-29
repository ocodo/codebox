import { AddNewProject } from "@/components/add-new-project"
import { LongPressTooltipButton } from "@/components/long-press-tooltip-button"
import { NameInput } from "@/components/name-input"
import { ThemeSwitch } from "@/components/theme-switch"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useProjectContext } from "@/contexts/project-context"
import { buttonIconClasses, thinIconStyle } from "@/lib/styles"
import { CircleX, Edit, Trash2 } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"

export const ProjectToolbar: FC = () => {
  const {
    setProjectName,
    projectName,
    renameCurrentProject,
    deleteCurrentProject
  } = useProjectContext()

  return (
    <div className='flex flex-row gap-2 items-center'>
      {
        projectName &&
        <>
          <TooltipCompact tooltipChildren={`Rename ${projectName}`}>
            <NameInput
              icon={
                <Edit
                  className={buttonIconClasses}
                  style={thinIconStyle}
                />
              }
              placeholder={`Rename ${projectName}...`}
              addAction={
                (newName) => {
                  if (newName) {
                    toast(`Renaming project ${projectName} -> ${newName}`)
                    renameCurrentProject(newName)
                    return true
                  }
                  toast('Enter a new project name')
                  return false
                }
              } />
          </TooltipCompact>
          <LongPressTooltipButton
            duration={200}
            title={`Close Project ${projectName}`}
            onLongPress={() => setProjectName(undefined)}
            icon={
              <CircleX
                style={thinIconStyle}
              />
            }
          />

          <LongPressTooltipButton
            duration={1000}
            title={`Delete project ${projectName}`}
            onLongPress={() => {
              deleteCurrentProject()
            }}
            icon={
              <Trash2 style={thinIconStyle} />
            }
          />
        </>
      }
      <AddNewProject />
      <ThemeSwitch />
    </div >
  )
}
