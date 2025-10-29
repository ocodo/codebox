import { useCallback, type Dispatch, type FC, type SetStateAction } from "react"

import CodeMirror from '@uiw/react-codemirror';

import { gruvboxDark } from '@uiw/codemirror-themes-all';
import { Save } from "lucide-react";
import { buttonIconClasses, thinIconStyle } from "@/lib/styles";

interface CodeCardProps {
  title: string;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  mtime: number;
  save: () => void;
  extension: any[]
}

export const CodeCard: FC<CodeCardProps> = ({ title, code, mtime, setCode, save, extension }) => {

  const onChange = useCallback((val: string) => {
    console.log('val:', val);
    setCode(val);
  }, []);

  return (
    <div>
      <div className='text-xs p-1'>
        <div className="flex-row flex gap-2 items-center justify-between">
          <div>
            {title} ({new Date(mtime * 1000).toISOString()})
          </div>
          <Save className={buttonIconClasses} style={thinIconStyle} onClick={save} />
        </div>
      </div>
      <div className='h-[35vh] bg-card rounded-lg border border-card overflow-y-auto'>
        {extension &&
          <CodeMirror
            value={code}
            height="40vh"
            theme={gruvboxDark}
            extensions={extension}
            onChange={onChange} />
        }
      </div>
    </div>
  );
}
