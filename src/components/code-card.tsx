import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, FC, SetStateAction } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-themes-all';
import { tokyoNight } from '@uiw/codemirror-themes-all';
import { Columns3, Focus, Fullscreen, Rows3, Save } from "lucide-react";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { ThemeContext } from "@/contexts/theme-context";
import { TooltipCompact } from "@/components/tooltip-compact";
import { useProjectContext } from "@/contexts/project-context";

export interface CodeCardProps {
  title: string;
  code: string;
  codeSet: Dispatch<SetStateAction<string>>;
  mtime: number;
  save: () => void;
  extension: any[]
}

export const CodeCard: FC<CodeCardProps> = ({ title, code, mtime, codeSet, save, extension }) => {

  const { theme } = useContext(ThemeContext)
  const { focused, setFocused, layout, isFocused, horizontal } = useProjectContext()

  const onChange = useCallback((val: string) => {
    console.log('val:', val);
    codeSet(val);
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

  const focusCard = () => {
    if (focused == title) {
      setFocused('')
    } else {
      setFocused(title)
    }
  }

  const toggleFullscreen = () => {
    if (!cardRef.current) return;

    if (document.fullscreenElement === cardRef.current) {
      document.exitFullscreen();
    } else {
      cardRef.current.requestFullscreen();
    }
  };

  const codeMirrorHeight = () => {
    if (isFullscreen) return '95hv';
    if (isFocused(title) && horizontal()) return '80vh';
    if (horizontal()) return '23vh'
    return '40vh'
  }

  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={cardRef} className="h-full">
      <div className='text-xs p-1'>
        <div className={`flex-row flex gap-2 items-center justify-between`}>
          <div>
            <TooltipCompact
              tooltipChildren={`Last updated ${new Date(mtime * 1000).toLocaleString()}`}
            >
              {title}
            </TooltipCompact>
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <TooltipCompact tooltipChildren={focused == title ? 'Show All' : 'Hide Others'}>
              <div onClick={() => focusCard()}>
                {
                  focused == title
                    ? horizontal()
                      ? <Rows3 className={buttonIconClasses} style={thinIconStyle} />
                      : <Columns3 className={buttonIconClasses} style={thinIconStyle} />
                    : <Focus className={buttonIconClasses} style={thinIconStyle} />
                }
              </div>
            </TooltipCompact>
            <TooltipCompact tooltipChildren={'Full Screen'}>
              <Fullscreen className={buttonIconClasses} style={thinIconStyle} onClick={() => toggleFullscreen()} />
            </TooltipCompact>
            <TooltipCompact tooltipChildren={'Save'}>
              <Save className={buttonIconClasses} style={thinIconStyle} onClick={save} />
            </TooltipCompact>
          </div>
        </div>
      </div>
      <div className={`bg-card rounded-lg border border-card overflow-y-auto`}>
        {extension &&
          <CodeMirror
            value={code}
            width={layout == 'horizontal' ? '50vw' : '100vw'}
            height={codeMirrorHeight()}
            theme={theme == 'dark' ? tokyoNight : vscodeLight}
            extensions={extension}
            onChange={onChange} />
        }
      </div>
    </div>
  );
}
