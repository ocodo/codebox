import { useProjectContext } from "@/contexts/project-context";
import { type FC } from "react";

export const ViewCard: FC = () => {
  const { projectName, updating, setUpdating } = useProjectContext()
  const url = `/api/composite/project/${projectName}`;

  const iframeUrl = () => {
    if(updating) {
      setUpdating(false)
      return ''
    } else {
      return url
    }
  }

  if (projectName != undefined) {
    return <iframe className='w-full h-[48vh]' src={iframeUrl()}></iframe>
  }
  return
}
