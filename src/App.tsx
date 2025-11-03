import { CodeBox } from '@/components/codebox-main';
import { Heading } from '@/components/heading';
import { ProjectSelector } from '@/components/project-selector';
import { SettingsModal } from '@/components/settings-modal';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProjectProvider, useProjectContext } from '@/contexts/project-context';
import { SettingsModalProvider } from '@/contexts/settings-context';
import { ThemeProvider } from '@/contexts/theme-provider';
import { UploadedImagesProvider } from '@/contexts/uploaded-images-provider';
import type { FC } from 'react';

const Main: FC = () => {
  const { projectName } = useProjectContext()

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
        <UploadedImagesProvider>
          <SettingsModalProvider>
            <ProjectProvider>
              <Main />
              <SettingsModal />
              <Toaster />
            </ProjectProvider>
          </SettingsModalProvider>
        </UploadedImagesProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
