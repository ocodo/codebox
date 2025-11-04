import { useProjectContext } from "@/contexts/project-context";
import { buttonIconClasses, thinIconStyle } from "@/lib/combined-styles";
import { cn } from "@/lib/utils";
import { Fullscreen } from "lucide-react";
import { type FC, useRef } from "react";

export const ViewCard: FC = () => {
  const { projectName, htmlCode, cssCode, jsCode } = useProjectContext();
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

  // Build the full HTML document as a string for srcDoc
  const srcDoc = `
    <html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}<\/script>
      </body>
    </html>
  `;

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
        sandbox="allow-scripts allow-same-origin"
        srcDoc={srcDoc}
      />
    </div>
  );
};
