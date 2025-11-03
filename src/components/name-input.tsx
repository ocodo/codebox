import { buttonIconClasses, thinIconStyle } from "@/lib/combined-styles"
import { CircleX } from "lucide-react"
import { useState, type FC, type ReactNode } from "react"

interface NameInputProps {
  addAction: (newName: string | undefined) => boolean
  placeholder: string | undefined
  icon: ReactNode
}

export const NameInput: FC<NameInputProps> = ({ addAction, placeholder, icon }) => {
  const [newName, setNewName] = useState<string>()
  const [showEnterName, setShowEnterName] = useState(false)

  return (
    <div>
      {!showEnterName &&
        <div
          onClick={() => setShowEnterName(true)}
        >{icon}</div>
      }
      {showEnterName &&
        <div className='flex flex-row gap-2 items-center bg-card rounded-full p-1'>
          <input
            value={newName}
            placeholder={placeholder}
            className='rounded-full p-1'
            onChange={(e) => setNewName(e.currentTarget.value)}
          />
          <div
            onClick={() => {
              if (addAction(newName)) {
                setNewName('')
                setShowEnterName(false)
              }
            }}
          >
            {icon}
          </div>
          <CircleX
            onClick={() => {
              setNewName('')
              setShowEnterName(false)
            }}
            className={buttonIconClasses}
            style={thinIconStyle} />
        </div>
      }
    </div>
  )
}
