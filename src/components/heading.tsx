import type { FC } from 'react';
import { ThemeSwitch } from '@/components/theme-switch';
import { Code, Columns3, LayoutGrid, LayoutPanelTop } from 'lucide-react';
import { rotated180, thinIconStyle } from '@/lib/styles';

interface HeadingProps {
  title: string;
  projectName: string
}

export const Heading: FC<HeadingProps> = ({ title, projectName }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className='flex flex-row gap-2'>
        <Code className='w-10 h-10' style={thinIconStyle} />
        <div className="font-black tracking-tighter text-4xl">{title}</div>
      </div>

      <div className='flex flex-row gap-2 items-center'>
        <div className="font-base text-xl">{projectName}</div>
        <LayoutGrid className='w-10 h-10' style={thinIconStyle} />
        <LayoutPanelTop className='w-10 h-10' style={{...thinIconStyle, ...rotated180}} />
      </div>
      <ThemeSwitch />
    </header>
  )
}
