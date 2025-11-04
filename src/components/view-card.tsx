import { useProjectContext } from "@/contexts/project-context";
import { buttonIconClasses, thinIconStyle } from "@/lib/combined-styles";
import { cn } from "@/lib/utils";
import { Fullscreen } from "lucide-react";
import { type FC, useRef } from "react";

export const ViewCard: FC = () => {
  const { projectName} = useProjectContext();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;

    if (document.fullscreenElement === iframeRef.current) {
      document.exitFullscreen();
    } else {
      iframeRef.current.requestFullscreen();
    }
  };

  if (!projectName) return null;

  return (
    <div className="h-full">
      <div className="p-1 flex flex-row items-center justify-end">
        <Fullscreen
          style={thinIconStyle}
          className={cn(buttonIconClasses)}
          onClick={toggleFullscreen}
        />
      </div>

      <iframe
        id="iframe-view"
        ref={iframeRef}
        className="w-full h-full"
        src={`api/composed/project/${projectName}`}
      />
    </div>
  );
};
