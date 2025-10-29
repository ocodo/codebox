import { useCallback, useContext, useEffect, useRef, useState, type Dispatch, type FC, type SetStateAction } from "react"

import CodeMirror from '@uiw/react-codemirror';

import { vscodeLight } from '@uiw/codemirror-themes-all';
import { tokyoNight } from '@uiw/codemirror-themes-all';
import { Fullscreen, Save } from "lucide-react";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { ThemeContext } from "@/contexts/theme-context";
import { TooltipCompact } from "@/components/tooltip-compact";

interface CodeCardProps {
  title: string;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  mtime: number;
  save: () => void;
  extension: any[]
}

export const CodeCard: FC<CodeCardProps> = ({ title, code, mtime, setCode, save, extension }) => {

  const { theme } = useContext(ThemeContext)

  const onChange = useCallback((val: string) => {
    console.log('val:', val);
    setCode(val);
  }, []);


  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === cardRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!cardRef.current) return;

    if (document.fullscreenElement === cardRef.current) {
      document.exitFullscreen();
    } else {
      cardRef.current.requestFullscreen();
    }
  };

  const cardRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <div ref={cardRef} className="h-full">
      <div className='text-xs p-1'>
        <div className="flex-row flex gap-2 items-center justify-between">
          <div>
            <TooltipCompact
              tooltipChildren={`Last updated ${new Date(mtime * 1000).toLocaleString()}`}
            >
              {title}
            </TooltipCompact>
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <TooltipCompact tooltipChildren={'Full Screen'}>
              <Fullscreen className={buttonIconClasses} style={thinIconStyle} onClick={() => toggleFullscreen()} />
            </TooltipCompact>
            <TooltipCompact tooltipChildren={'Save'}>
              <Save className={buttonIconClasses} style={thinIconStyle} onClick={save} />
            </TooltipCompact>
          </div>
        </div>
      </div>
      <div className={`h-[${isFullscreen ? '90vh' : '35vh'}] bg-card rounded-lg border border-card overflow-y-auto`}>
        {extension &&
          <CodeMirror
            value={code}
            height={isFullscreen ? '95vh' : '40vh'}
            theme={theme == 'dark' ? tokyoNight : vscodeLight}
            extensions={extension}
            onChange={onChange} />
        }
      </div>
    </div>
  );
}
