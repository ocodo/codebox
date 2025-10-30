import { CodeBox } from '@/components/codebox-main';
import { Heading } from '@/components/heading';
import { ProjectSelector } from '@/components/project-selector';
import { SettingsModal } from '@/components/settings-modal';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProjectProvider, useProjectContext } from '@/contexts/project-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { ThemeProvider } from '@/contexts/theme-provider';

import { useEffect, type FC } from 'react';

const Main: FC = () => {
  const { projectName } = useProjectContext()

  useEffect(() => {
    console.log(`Project Name: ${projectName}`)
  }, [projectName])

  return (
    <div className='h-[100vh]'>
      <Heading title='CodeBox' />
      {
        projectName && <CodeBox />
      }
      {
        !!projectName || <ProjectSelector />
      }
    </div>
  )
}

export const App: FC = () => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SettingsProvider>
          <ProjectProvider>
            <Main />
            <SettingsModal />
            <Toaster />
          </ProjectProvider>
        </SettingsProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
