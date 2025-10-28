import { Heading } from '@/components/heading';
import { ThemeProvider } from '@/contexts/theme-provider';
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react';

export const App: FC = () => {

  const projectName = decodeURI(window.location.hash.replace('#', ''))

  return (
    <ThemeProvider>
      <>
        <Heading title='CodeBox' projectName={projectName} />
        <CodeBox projectName={projectName} />
      </>
    </ThemeProvider>
  )
}

interface ProjectFile {
  filename: string;
  stat: [
    mode: number,
    ino: number,
    dev: number,
    nlink: number,
    uid: number,
    gid: number,
    size: number,
    atime: number,
    mtime: number,
    ctime: number
  ];
}

interface CodeBoxProps {
  projectName: string;
}

interface ProjectCodeType {
  setter: Dispatch<SetStateAction<string>>;
  filename: string;
}

export const CodeBox: FC<CodeBoxProps> = ({ projectName }) => {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [htmlCode, setHtmlCode] = useState<string>('')
  const [jsCode, setJsCode] = useState<string>('')
  const [cssCode, setCssCode] = useState<string>('')

  const projectCode: ProjectCodeType[] = [
    { setter: setCssCode, filename: 'code.css' },
    { setter: setHtmlCode, filename: 'code.html' },
    { setter: setJsCode, filename: 'code.js' },
  ]

  const fetchProjectFiles = async (name: string) => {
    const response = await fetch(`api/project/${name}`)
    if (response.ok) {
      const data: ProjectFile[] = await response.json()
      setFiles(data)
      projectCode
        .filter((code) => data.some((projectFile) => projectFile.filename == code.filename))
        .forEach(async (code) => {
          const response = await fetch(`/api/project/${name}/${code.filename}`)
          if (response.ok) {
            const content = await response.text()
            if (content) {
              code.setter(content)
            }
          }
        });



    } else {
      console.log(`No project: ${name}`)
      setFiles([])
    }
  }

  useEffect(
    () => {
      if (projectName) {
        fetchProjectFiles(projectName)
      }
    }, []
  );

  return (
    <>
      <div className="grid grid-cols-3 h-[40vh] gap-2">
        <CodeCard title='HTML' code={htmlCode} />
        <CodeCard title='JS' code={jsCode} />
        <CodeCard title='CSS' code={cssCode} />
      </div>
      <ViewCard projectName={projectName} />
    </>
  )
}

interface ViewCardProps {
  projectName: string
}

export const ViewCard: FC<ViewCardProps> = ({ projectName }) => {

  const url = `/api/composite/project/${projectName}`;

  return (
    <iframe className='w-full h-[48vh]' src={url}></iframe>
  )
}

interface CodeCardProps {
  title: string
  code?: string
}

export const CodeCard: FC<CodeCardProps> = ({ title, code }) => {
  return (
    <div className='relative'>
      <div className='text-xs p-1 absolute top-[-20px] mb-[20px]'>
        {title}
      </div>
      <div className='h-[40vh] bg-card rounded-lg border border-card p-2 overflow-y-auto'>
        <pre className='text-xs'>
          {code}
        </pre>
      </div>
    </div>
  )
}


