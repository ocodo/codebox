import type { FC, ReactNode } from "react";
import { useContext, useState } from "react";
import { createContext, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export interface ProjectContextType {
  projectName: string | undefined
  setProjectName: Dispatch<SetStateAction<string | undefined>>;
  updateProjectFile: (name: string, code: string) => Promise<void>;
  fetchProjectFiles: (name: string) => Promise<void>;
  createProject: (name: string) => Promise<void>
  htmlCode: string;
  setHtmlCode: Dispatch<SetStateAction<string>>;
  jsCode: string;
  setJsCode: Dispatch<SetStateAction<string>>;
  cssCode: string;
  setCssCode: Dispatch<SetStateAction<string>>;
  htmlMtime: number;
  setHtmlMtime: Dispatch<SetStateAction<number>>;
  jsMtime: number;
  setJsMtime: Dispatch<SetStateAction<number>>;
  cssMtime: number;
  setCssMtime: Dispatch<SetStateAction<number>>;
  fetchProjects: () => Promise<void>;
  projectList: string[];
  updating: boolean;
  setUpdating: Dispatch<SetStateAction<boolean>>;
}

export const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useServerConfig must be used within a ServerConfigProvider');
  }
  return context;
};

interface ProjectFile {
  filename: string;
  mtime: number;
}

interface ProjectCodeType {
  code: string;
  codeSet: Dispatch<SetStateAction<string>>;
  mtime: number;
  mtimeSet: Dispatch<SetStateAction<number>>;
  filename: string;
}

export const ProjectProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [projectName, setProjectName] = useState<string | undefined>()
  const [htmlCode, setHtmlCode] = useState<string>('')
  const [jsCode, setJsCode] = useState<string>('')
  const [cssCode, setCssCode] = useState<string>('')
  const [htmlMtime, setHtmlMtime] = useState<number>(0)
  const [jsMtime, setJsMtime] = useState<number>(0)
  const [cssMtime, setCssMtime] = useState<number>(0)
  const [updating, setUpdating] = useState<boolean>(false)

  const projectCode: ProjectCodeType[] = [
    {
      mtime: cssMtime,
      mtimeSet: setCssMtime,
      code: cssCode,
      codeSet: setCssCode,
      filename: 'code.css'
    },
    {
      mtime: htmlMtime,
      mtimeSet: setHtmlMtime,
      code: htmlCode,
      codeSet: setHtmlCode,
      filename: 'code.html'
    },
    {
      mtime: jsMtime,
      mtimeSet: setJsMtime,
      code: jsCode,
      codeSet: setJsCode,
      filename: 'code.js'
    },
  ]

  const [projectList, setProjectList] = useState<string[]>([])

  const fetchProjects = async () => {
    const response = await fetch(`/api/projects`)
    if (response.ok) {
      const data = await response.json()
      setProjectList(data)
    }
  }

  const updateProjectFile = async (name: string, code: string): Promise<void> => {
    const response = await fetch(`api/project/${projectName}/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({ 'content': code })
    });
    if (!response.ok) {
      toast(`Error updating ${projectName}/${name}`);
    } else {
      setUpdating(true)
      toast(`Saved ${projectName}/${name}`);
    }
  }

  const createProject = async (name: string): Promise<void> => {
    const response = await fetch(`api/project/${name}`,
      {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (response.ok) {
      toast(`Created ${name}`);
      setProjectName(name);
    } else {
      const data = await response.json();
      if (data.detail) {
        toast(data.detail)
      }
      toast(`Error creating ${name}`);
    }
  }

  const fetchProjectFiles = async (name: string): Promise<void> => {
    const response = await fetch(`api/project/${name}`);
    if (response.ok) {
      const data: ProjectFile[] = await response.json();
      projectCode
        .filter((code) => data.find((projectFile) => projectFile.filename == code.filename))
        .forEach(async (code) => {
          const response = await fetch(`/api/project/${name}/${code.filename}`);
          if (response.ok) {
            const content = await response.text();
            if (content) {
              code.codeSet(content);
              const file = data.find((projectFile) => projectFile.filename == code.filename);
              if (file) code.mtimeSet(file.mtime);
            }
          }
        });
    } else {
      setProjectName(undefined)
      toast(`${name} isn't a project`)
    }
  }

  return (
    <ProjectContext.Provider value={{
      projectName,
      setProjectName,
      fetchProjectFiles,
      updateProjectFile,
      createProject,
      htmlCode,
      setHtmlCode,
      jsCode,
      setJsCode,
      cssCode,
      setCssCode,
      htmlMtime,
      setHtmlMtime,
      jsMtime,
      setJsMtime,
      cssMtime,
      setCssMtime,
      fetchProjects,
      projectList,
      updating,
      setUpdating,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
