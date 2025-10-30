import { useProjectContext } from "@/contexts/project-context";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { Fullscreen } from "lucide-react";
import { useRef, type FC } from "react";


export const ViewCard: FC = () => {
  const { projectName, updating, setUpdating, horizontal } = useProjectContext()
  const url = `/api/composite/project/${projectName}`;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // const isFullscreen = document.fullscreenElement === iframeRef?.current;

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

  return (
    projectName &&
    <div className="h-full">
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
        className={`w-full ${horizontal() ? 'h-[83vh]' : 'h-[38vh]'}` }
        src={iframeUrl()}></iframe>
    </div>
  )
}
