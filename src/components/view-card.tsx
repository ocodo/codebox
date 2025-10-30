import { useProjectContext } from "@/contexts/project-context";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { Fullscreen } from "lucide-react";
import { useRef, type FC } from "react";


export const ViewCard: FC = () => {
  const { projectName, updating, setUpdating } = useProjectContext()
  const url = `/api/composite/project/${projectName}`;

  const iframeUrl = () => {
    if (updating) {
      setUpdating(false)
      return ''
    } else {
      return url
    }
  }

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;

    if (document.fullscreenElement === iframeRef.current) {
      document.exitFullscreen();
    } else {
      iframeRef.current.requestFullscreen();
    }
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  if (projectName != undefined) {
    return (
      <div>
        <Fullscreen
          style={thinIconStyle}
          className={buttonIconClasses}
          onClick={() => {
            if (iframeRef.current != null) {
              toggleFullscreen()
            }
          }}
        />
        <iframe
          id="iframe-view"
          ref={iframeRef}
          className='w-full h-[44vh]'
          src={iframeUrl()}></iframe>
      </div>
    )
  }
}
