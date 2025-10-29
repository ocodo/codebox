import { type FC } from 'react';
import { ThemeSwitch } from '@/components/theme-switch';
import { CircleX, Code, LayoutGrid, LayoutPanelTop } from 'lucide-react';
import { buttonIconClasses, rotated180, thinIconStyle } from '@/lib/styles';
import { useProjectContext } from '@/contexts/project-context';

export const ProjectToolbar: FC = () => {
  const { setProjectName } = useProjectContext()
  return (
    <CircleX
      className={buttonIconClasses} style={thinIconStyle}
      onClick={() => setProjectName(undefined)} />
  )
}

interface LayoutSelectorProps { }

export const LayoutSelector: FC<LayoutSelectorProps> = ({ }) => {
  return (
    <>
      <LayoutGrid
        className='w-10 h-10' style={thinIconStyle} />
      <LayoutPanelTop
        className='w-10 h-10'
        style={{ ...thinIconStyle, ...rotated180 }} />
    </>
  )
}

interface HeadingProps {
  title: string
}

export const Heading: FC<HeadingProps> = ({ title }) => {

  const { projectName } = useProjectContext()

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className='flex flex-row gap-2'>
        <Code className='w-10 h-10' style={thinIconStyle} />
        <div className="font-black tracking-tighter text-4xl">{title}</div>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        {
          projectName != ''
          && <div className="font-base text-xl">{projectName}</div>
        }
      </div>
      <div className='flex flex-row gap-2'>
        {projectName != '' &&
          <ProjectToolbar />
        }
        <ThemeSwitch />
      </div>
    </div>
  )
}
