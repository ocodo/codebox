import type { FC } from 'react';
import { darkTitleTextForeground, lightTitleTextForeground, thinIconStyle } from '@/lib/styles';
import { useProjectContext } from '@/contexts/project-context';
import { CodeBoxIcon } from '@/components/codebox-icon';
import { ProjectToolbar } from '@/components/project.-toolbar';
import { useTheme } from '@/contexts/theme-context';

interface HeadingProps {
  title: string
}

export const Heading: FC<HeadingProps> = ({ title }) => {

  const { theme } = useTheme()
  const { projectName } = useProjectContext()

  return (
    <div className="flex flex-wrap items-center justify-between p-4 border-b">
      <div className='flex flex-row gap-2' style={theme == 'dark' ? darkTitleTextForeground : lightTitleTextForeground}>
        <CodeBoxIcon className='w-10 h-10' style={thinIconStyle} />
        <div className="font-black tracking-tighter text-4xl">{title}</div>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        {
          projectName && <div className="font-base text-xl">{projectName}</div>
        }
      </div>
      <div className='flex flex-wrap gap-2'>
        {projectName != '' &&
          <ProjectToolbar />
        }
      </div>
    </div>
  )
}
