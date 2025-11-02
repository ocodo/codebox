import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { duotoneLight, tokyoNight } from '@uiw/codemirror-themes-all';
import { Fullscreen, Paintbrush, Settings2 } from "lucide-react";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";
import { useTheme } from "@/contexts/theme-context";
import { TooltipCompact } from "@/components/tooltip-compact";
import { useProjectContext, type WebLanguageType } from "@/contexts/project-context";
import { useSettingsModal } from '@/contexts/settings-context';
import estree from 'prettier/plugins/estree'
import parserBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import * as parserHtml from "prettier/parser-html";
import * as parserPostCSS from "prettier/parser-postcss";

export interface CodeCardProps {
  title: string;
  language: WebLanguageType;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  mtime: number;
  save: () => void;
  extension: any[]
  icon: ReactNode
}

export const CodeCard: FC<CodeCardProps> = ({ icon, title, language, code, mtime, setCode, extension }) => {
  const { ifDark } = useTheme()

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

  const formatCode = async () => {
    let parser = "babel";
    let plugins = [parserBabel, estree];
    switch (language) {
      case 'html':
        parser = 'html';
        plugins = [parserHtml];
        break;
      case 'css':
        parser = 'css';
        plugins = [parserPostCSS];
        break;
    }

    const formatted = await prettier.format(code, {
      parser,
      plugins,
    });

    setCode(() => {
      const silent = true;
      updateProjectFile(`code.${language}`, formatted, silent);
      return formatted
    })
  }

  const onChange = useCallback(
    async (val: string) => {
      setCode(() => {
        if (liveUpdating) {
          const silent = true;
          updateProjectFile(`code.${language}`, val, silent);
        }
        return val
      })
    },
    [liveUpdating, updateProjectFile]
  );

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
            <div>
              Last updated {new Date(mtime * 1000).toLocaleString()}
            </div>
          } >
            <div>
              <div className='flex flex-row gap-2 items-center justify-start'>
                <div>
                  {icon}
                </div>
                <div>
                  {title.toUpperCase()}
                </div>
              </div>
            </div>
          </TooltipCompact>
          {
            activeCodeProcessors.length > 0 && (
              <TooltipCompact tooltipChildren={`${title} settings`}>
                <div onClick={() => {
                  setOpen(() => {
                    setTab(language)
                    return true
                  })
                }}>
                  <Settings2 className={buttonIconClasses} />
                </div>
              </TooltipCompact>
            )
          }
          <div className={`
            flex flex-row gap-1 w-full transition-colors duration-300
            p-1 rounded-xl text-transparent
            hover:bg-foreground/10 hover:text-foreground/70
            items-center justify-center select-none
            `}>
            doubleclick to {focused == title ? 'restore' : 'maximize'}
          </div>
          <div className="flex flex-row gap-2 items-center justify-end">
            <TooltipCompact tooltipChildren='Format Code'>
              <Paintbrush
                onClick={() => formatCode()}
                style={thinIconStyle}
                className={buttonIconClasses} />
            </TooltipCompact>
            <TooltipCompact tooltipChildren={'Full Screen'}>
              <Fullscreen
                className={buttonIconClasses}
                style={thinIconStyle}
                onClick={toggleFullscreen} />
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
            theme={ifDark(tokyoNight, duotoneLight)}
            extensions={extension}
            onChange={onChange} />
        }
      </div>
    </div>
  );
}
