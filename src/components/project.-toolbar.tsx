import { AddNewProject } from "@/components/add-new-project"
import { LiveUpdatingToggle } from "@/components/live-updating-toggle"
import { LongPressTooltipButton } from "@/components/long-press-tooltip-button"
import { NameInput } from "@/components/name-input"
import { ThemeSwitch } from "@/components/theme-switch"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useProjectContext } from "@/contexts/project-context"
import { useSettingsModal } from "@/contexts/settings-context"
import { Camera, CircleX, Columns3, Edit, ImageIcon, ImageUpIcon, Rows3, Save, Settings, Trash2, XCircle } from "lucide-react"
import { useCallback, useState, type FC } from "react"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"
import { dropStyle, buttonIconClasses, thinIconStyle, buttonClassNames } from "@/lib/combined-styles"
import { useUploadedImages } from "@/contexts/uploaded-images-provider"
import prettyBytes from 'pretty-bytes';

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
    commitProjectChanges,
  } = useProjectContext()

  const { setOpen } = useSettingsModal()
  const { uploadedImages, setUploadedImages } = useUploadedImages()
  const [showProjectImageButtons, setShowProjectImageButtons] = useState<boolean>(false)
  const [showImageUploadPanel, setShowImageUploadPanel] = useState<boolean>(false)

  const onDrop = useCallback((files: File[]) => {
    setUploadedImages(files);
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className='flex flex-wrap gap-2 items-center'>
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
        <LiveUpdatingToggle />
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
            commitProjectChanges()
          }}
          icon={
            <Save
              style={thinIconStyle}
            />
          }
        />
      }
      {
        projectName && !showProjectImageButtons &&
        <>
          <TooltipCompact tooltipChildren={`Project Image`}>
            <ImageIcon
              onClick={() => setShowProjectImageButtons(true)}
              className={buttonIconClasses}
              style={thinIconStyle} />
          </TooltipCompact>
        </>
      }
      {
        projectName && showProjectImageButtons &&
        <>
          <TooltipCompact tooltipChildren={`Set thumbnail from view`}>
            <Camera
              onClick={() => snapshotView()}
              className={buttonIconClasses}
              style={thinIconStyle} />
          </TooltipCompact>
          <TooltipCompact tooltipChildren={`Upload thumbnail image`}>
            <ImageUpIcon
              onClick={() => setShowImageUploadPanel(!showImageUploadPanel)}
              className={buttonIconClasses}
              style={thinIconStyle} />
          </TooltipCompact>
          {
            showImageUploadPanel &&
            <>
              <div className="fixed rounded-lg z-1000 w-[30vw] h-[20vh] right-10 top-15 bg-card border border-1 p-2">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {
                    isDragActive ?
                      <div className={dropStyle}>Drop the files here ...</div> :
                      <div className={dropStyle}>Drag image files here, or click to select files</div>
                  }
                </div>
              </div>
              {
                uploadedImages.length > 0 && (
                  <div
                    className={buttonClassNames}
                    onClick={() => setUploadedImages([])}
                  >
                    <XCircle style={thinIconStyle} />
                    Clear
                  </div>
                )
              }
              {
                uploadedImages.length > 0 &&
                <div className='flex flex-wrap gap-2'>
                  {uploadedImages.map((file: File) => (
                    <div className='grid grid-cols-1 gap-2 bg-card border border-card rounded-xl p-3 shadow-xl' key={file.name}>
                      <img src={URL.createObjectURL(file)} />
                      <div className='flex flex-row gap-2 items-center justify-center font-mono'>
                        <div className='text-xs'>{file.name}</div>
                        <div className='text-xs'>{prettyBytes(file.size)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </>
          }
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
