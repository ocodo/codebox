import { useProjectContext } from "@/contexts/project-context";
import { buttonIconClasses, thinIconStyle } from "@/lib/combined-styles";
import { cn } from "@/lib/utils";
import { Fullscreen } from "lucide-react";
import { useRef, type FC } from "react";


export const ViewCard: FC = () => {
  const { projectName, updating, setUpdating } = useProjectContext()
  const url = `/api/composed/project/${projectName}`;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const iframeUrl = () => {
    if (updating) {
      setUpdating(false)
      return
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
      <div className="p-1 flex flex-row items-center justify-end">
        <Fullscreen
          style={thinIconStyle}
          className={cn(buttonIconClasses)}
          onClick={() => {
            if (iframeRef.current != null) {
              toggleFullscreen()
            }
          }}
        />
      </div>
      {iframeUrl() &&
        <iframe
          id="iframe-view"
          ref={iframeRef}
          className={`w-full h-full`}
          src={iframeUrl()}></iframe>
      }
    </div>
  )
}
