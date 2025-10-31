import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-themes-all';
import { tokyoNight } from '@uiw/codemirror-themes-all';
import { Fullscreen, Settings2 } from "lucide-react";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { ThemeContext } from "@/contexts/theme-context";
import { TooltipCompact } from "@/components/tooltip-compact";
import { useProjectContext, type WebLanguage } from "@/contexts/project-context";
import { useSettingsModal } from '@/contexts/settings-context';

export interface CodeCardProps {
  title: string;
  code: string;
  codeSet: Dispatch<SetStateAction<string>>;
  mtime: number;
  save: () => void;
  extension: any[]
  icon: ReactNode
}

export const CodeCard: FC<CodeCardProps> = ({ icon, title, code, mtime, codeSet, extension }) => {
  const { theme } = useContext(ThemeContext)
  const {
    focused,
    setFocused,
    vertical,
    horizontal,
    isFocused,
    updateProjectFile,
    liveUpdating,
    codeProcessors
  } = useProjectContext()

  const { setOpen, setTab } = useSettingsModal()

  const activeCodeProcessors = codeProcessors.filter((processor) => processor.target == title)

  const onChange = useCallback((val: string) => {
    codeSet(val);
    if (liveUpdating) {
      const silent = true
      updateProjectFile(`code.${title}`, val, silent)
    }
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
    return '30vh'
  }

  const codeMirrorWidth = () => {
    if (isFullscreen) return '100vw';
    if (isFocused(title) && vertical()) return '100vw';
    return '50vw'
  }

  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={cardRef} className="h-full">
      <div className='text-xs p-1'>
        <div className={`flex-row flex gap-2 items-center justify-between`} onDoubleClick={focusCard}>

          <TooltipCompact tooltipChildren={
            <>
              <div>
                Last updated ${new Date(mtime * 1000).toLocaleString()}
              </div>
              <div style={{ fontSize: 'x-small' }}>
                Double Click to Expand/Restore
              </div>
            </>
          } >
            <div>
              <div className='flex flex-row gap-2 items-center justify-start'>
                <div>
                  {icon}
                </div>
                <div>
                  {title.toUpperCase()}
                </div>
                {
                  activeCodeProcessors.length > 0 && (
                    <div onClick={() => {
                      setOpen(() => {
                        setTab(title as WebLanguage)
                        return true
                      })
                    }}>
                      <Settings2 className={buttonIconClasses} />
                    </div>
                  )
                }
              </div>
            </div>
          </TooltipCompact>

          <div className="flex flex-row gap-2 items-center justify-end">
            <TooltipCompact tooltipChildren={'Full Screen'}>
              <Fullscreen className={buttonIconClasses} style={thinIconStyle} onClick={toggleFullscreen} />
            </TooltipCompact>
          </div>
        </div>
      </div>
      <div className={`bg-card rounded-lg border border-card overflow-y-auto`}>
        {extension &&
          <CodeMirror
            value={code}
            width={codeMirrorWidth()}
            height={codeMirrorHeight()}
            theme={theme == 'dark' ? tokyoNight : vscodeLight}
            extensions={extension}
            onChange={onChange} />
        }
      </div>
    </div>
  );
}
