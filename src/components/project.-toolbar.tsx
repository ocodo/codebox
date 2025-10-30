import { AddNewProject } from "@/components/add-new-project"
import { LongPressTooltipButton } from "@/components/long-press-tooltip-button"
import { NameInput } from "@/components/name-input"
import { ThemeSwitch } from "@/components/theme-switch"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useProjectContext } from "@/contexts/project-context"
import { useSettings } from "@/contexts/settings-context"
import { buttonIconClasses, thinIconStyle } from "@/lib/styles"
import { Camera, CircleX, Columns3, Edit, Rows3, Save, Settings, Trash2 } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"

export const ProjectToolbar: FC = () => {
  const {
    setProjectName,
    projectName,
    renameCurrentProject,
    deleteCurrentProject,
    htmlCode,
    jsCode,
    cssCode,
    updateProjectFile,
    snapshotView,
    toggleLayout,
    layout,
  } = useProjectContext()

  const { setOpen } = useSettings()

  return (
    <div className='flex flex-row gap-2 items-center'>
      {
        projectName &&
        <TooltipCompact tooltipChildren={`Set layout to ${layout == 'horizontal' ? 'vertical' : 'horizontal'}`}>

          <div onClick={toggleLayout}
            className="cursor-pointer" >
            {
              layout == 'vertical'
                ?
                <Columns3 style={thinIconStyle} />
                :
                <Rows3 style={thinIconStyle} />
            }
          </div>
        </TooltipCompact>
      }
      {
        projectName &&
        <LongPressTooltipButton
          duration={200}
          title={`Save ${projectName} code`}
          onLongPress={() => {
            [
              ['code.css', cssCode],
              ['code.js', jsCode],
              ['code.html', htmlCode],
            ].forEach(([name, entry]) => {
              updateProjectFile(name, entry);
            });
          }}
          icon={
            <Save
              style={thinIconStyle}
            />
          }
        />
      }
      {
        projectName &&
        <>
          <TooltipCompact tooltipChildren={`Set thumbnail from view`}>
            <Camera
              onClick={() => snapshotView()}
              className={buttonIconClasses}
              style={thinIconStyle} />
          </TooltipCompact>
        </>
      }
      {
        projectName &&
        <>
          <TooltipCompact tooltipChildren={`Project settings`}>
            <Settings
              onClick={() => setOpen(true)}
              className={buttonIconClasses}
              style={thinIconStyle} />
          </TooltipCompact>
        </>
      }
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
