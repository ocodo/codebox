import { ModalHeader } from "@/components/modal-header"
import { ModalOverlay } from "@/components/modal-overlay"
import { useSettings } from "@/contexts/settings-context"

export const SettingsModal = () => {
  const { open, close } = useSettings()

  return (
    <ModalOverlay isOpen={open} onClose={close} >
      <ModalHeader title="Settings" />
    </ModalOverlay>
  )
}
