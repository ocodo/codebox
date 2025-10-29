import { CodeBox } from '@/components/codebox-main';
import { Heading } from '@/components/heading';
import { ProjectSelector } from '@/components/project-selector';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProjectProvider, useProjectContext } from '@/contexts/project-context';
import { ThemeProvider } from '@/contexts/theme-provider';

import { useEffect, type FC } from 'react';

const Main: FC = () => {
  const { projectName } = useProjectContext()

  useEffect(() => {
    console.log(`Project Name: ${projectName}`)
  }, [projectName])

  return (
    <>
      <Heading title='CodeBox' />
      {
        projectName && <CodeBox />
      }
      {
        !!projectName  || <ProjectSelector />
      }
    </>
  )
}

export const App: FC = () => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ProjectProvider>
          <Main />
          <Toaster />
        </ProjectProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
