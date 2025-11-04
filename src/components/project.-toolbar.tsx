import { AddNewProject } from "@/components/add-new-project"
import { LiveUpdatingToggle } from "@/components/live-updating-toggle"
import { LongPressTooltipButton } from "@/components/long-press-tooltip-button"
import { NameInput } from "@/components/name-input"
import { ThemeSwitch } from "@/components/theme-switch"
import { TooltipCompact } from "@/components/tooltip-compact"
import { useProjectContext } from "@/contexts/project-context"
import { useSettingsModal } from "@/contexts/settings-context"
import { Camera, CircleX, Columns3, CropIcon, Edit, ImageIcon, ImageUpIcon, Rows3, Save, SaveIcon, Settings, Trash2, XCircle, XIcon } from "lucide-react"
import { useCallback, useState, type FC } from "react"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"
import { dropStyle, buttonIconClasses, thinIconStyle, buttonClassNames } from "@/lib/combined-styles"
import { useUploadedImages } from "@/contexts/uploaded-images-provider"
import prettyBytes from 'pretty-bytes';
import ReactCrop, { type Crop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import { cropImageFile } from "@/lib/crop-image-file"

export const ProjectToolbar: FC = () => {
  const {
    projectName,
    closeProject,
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

  const { setOpen: setOpenSettings } = useSettingsModal()
  const [showProjectImageButtons, setShowProjectImageButtons] = useState<boolean>(false)
  const [showImageUploadPanel, setShowImageUploadPanel] = useState<boolean>(false)

  return (
    <div className='flex flex-wrap gap-2 items-center'>
      {
        projectName &&
        <TooltipCompact
          tooltipChildren={`Set layout to ${layout == 'horizontal' ? 'vertical' : 'horizontal'}`}
        >
          <div onClick={toggleLayout}
            className="cursor-pointer" >
            {
              layout == 'vertical'
                ? <Columns3 style={thinIconStyle} />
                : <Rows3 style={thinIconStyle} />
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
            <UploadImagePanel
              onClose={() => setShowImageUploadPanel(false)} />
          }
        </>
      }
      {
        projectName &&
        <>
          <TooltipCompact tooltipChildren={`Project settings`}>
            <Settings
              onClick={() => setOpenSettings(true)}
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
            onLongPress={() => closeProject()}
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

const UploadImagePanel: FC<{ onClose: () => void }> = ({
  onClose
}) => {
  const { setUploadedImages } = useUploadedImages()
  const onDrop = useCallback((files: File[]) => {
    setUploadedImages(files);
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onError: (err) => {
      toast.error(`Error uploading image: ${err.message}`)
    },
    maxFiles: 1,
    accept: { 'image/*': [] }
  })

  return (
    <>
      <div className="fixed rounded-lg z-1000 w-[50vw] right-[25vw] top-[10vh] bg-card border border-1 p-2">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive
              ?
              <div className={dropStyle}>
                Drop the files here ...
              </div>
              :
              <div className={dropStyle}>
                Drag image files here, or click to select files
              </div>
          }
        </div>
        <UploadedImageDisplay {...{ onClose }} />
      </div>
    </>
  )
}

const UploadedImageDisplay: FC<{ onClose: () => void }> = ({
  onClose
}) => {
  const { uploadedImages, setUploadedImages } = useUploadedImages()
  const { uploadProfilePng } = useProjectContext()
  const [isCropping, setIsCropping] = useState<boolean>(false)
  const oneHundredPercentCrop: Crop = { unit: '%', width: 100, height: 100, x: 0, y: 0 }
  const [crop, setCrop] = useState<Crop>(oneHundredPercentCrop)
  return (
    <div className="mt-2 flex flex-col gap-2">
      {
        uploadedImages.length > 0 && (
          <div className="mt-2 flex flex-row gap-2 justify-center">
            <div
              className={buttonClassNames}
              onClick={() => {
                setUploadedImages([])
                setIsCropping(false)
                onClose()
              }}
            >
              <XCircle style={thinIconStyle} />
              Clear
            </div>
            <div
              className={buttonClassNames}
              onClick={async () => {
                if (isCropping) {
                  const croppedImage = cropImageFile(uploadedImages[0], crop!)
                  setUploadedImages([await croppedImage])
                }
                setIsCropping(!isCropping)
              }}
            >
              <CropIcon style={thinIconStyle} />
              Crop
            </div>
            <div
              className={buttonClassNames}
              onClick={async () => {
                if (uploadedImages.length === 0) {
                  toast.error('Upload an image first')
                  return
                }

                let croppedImage: File;

                if (!isCropping) {
                  setCrop(oneHundredPercentCrop)
                  croppedImage = await cropImageFile(uploadedImages[0], oneHundredPercentCrop)
                } else {
                  croppedImage = await cropImageFile(uploadedImages[0], crop)
                }

                await uploadProfilePng(croppedImage)
                toast.success('Uploaded project thumbnail image')
                setIsCropping(false)
                setUploadedImages([])
                onClose()
              }}
            >
              <SaveIcon style={thinIconStyle} />
              Save
            </div>
            <div
              className={buttonClassNames}
              onClick={() => {
                setIsCropping(false)
                setUploadedImages([])
                onClose()
              }}
            >
              <XIcon style={thinIconStyle} />
              Cancel
            </div>
          </div>
        )
      }
      {
        uploadedImages.length > 0 &&
        <div className='flex flex-wrap gap-2'>
          {uploadedImages.map((file: File) => (
            <div className='grid grid-cols-1 gap-2 bg-card border border-card rounded-xl p-3 shadow-xl' key={file.name}>
              {isCropping ?
                <>
                  <ReactCrop
                    crop={crop}
                    aspect={16 / 9}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                  >
                    <img src={URL.createObjectURL(file)} />
                  </ReactCrop>
                </>
                :
                <img src={URL.createObjectURL(file)} />
              }
              <div className='flex flex-row gap-2 items-center justify-center font-mono'>
                <div className='text-xs'>{file.name}</div>
                <div className='text-xs'>{prettyBytes(file.size)}</div>
              </div>
            </div>
          ))}
        </div>
      }
    </div >
  )
}
