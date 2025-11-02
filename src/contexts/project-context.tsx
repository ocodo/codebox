import type { FC, ReactNode } from "react";
import { useContext, useEffect, useState } from "react";
import { createContext, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import html2canvas from 'html2canvas';
import type { CodeCardProps } from "@/components/code-card";
import { useLocalStorage } from "usehooks-ts";
import { JSIcon } from "@/components/js-icon";
import { CSSIcon } from "@/components/css-icon";
import { HTMLIcon } from "@/components/html-icon";
import { useSet } from '@uidotdev/usehooks';

export type LayoutType = 'vertical' | 'horizontal';

export type WebLanguageType = 'js' | 'html' | 'css'

export interface CodeProcessorType {
  target: WebLanguageType
}

export interface CDNLinkType {
  type: 'script' | 'link';
  name: string;
  url: string;
}

export interface ProjectContextType {
  projectName: string | undefined
  projectCode: ProjectCodeType[]
  setProjectName: Dispatch<SetStateAction<string | undefined>>;
  updateProjectFile: (name: string, code: string, silent?: boolean) => Promise<void>;
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
  focused: string;
  setFocused: Dispatch<SetStateAction<string>>;
  updating: boolean;
  setUpdating: Dispatch<SetStateAction<boolean>>;
  renameCurrentProject: (newName: string) => Promise<void>;
  deleteCurrentProject: () => Promise<void>;
  snapshotView: () => Promise<void>;
  codeCards: CodeCardProps[];
  layout: LayoutType;
  setLayout: (newValue: LayoutType) => void;
  toggleLayout: () => void;
  horizontal: () => boolean;
  vertical: () => boolean;
  isFocused: (title: string) => boolean;
  CDNLinks: CDNLinkType[];
  fetchCDNLinks: () => Promise<void>;
  activeCDNLinks: Set<string>;
  fetchActiveCDNLinks: () => Promise<void>;
  updateActiveCDNLinks: () => Promise<void>;
  codeProcessors: CodeProcessorType[];
  fetchCodeProcessors: () => Promise<void>;
  commitProjectChanges: () => Promise<void>;
  liveUpdating: boolean;
  setLiveUpdating: Dispatch<SetStateAction<boolean>>;
}

export const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectFile {
  filename: string;
  mtime: number;
}

interface ProjectCodeType {
  title: string;
  language: WebLanguageType;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  mtime: number;
  mtimeSet: Dispatch<SetStateAction<number>>;
  filename: string;
  icon: ReactNode;
}

export const ProjectProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useLocalStorage<LayoutType>('viewLayout', 'vertical')
  const [projectName, setProjectName] = useState<string | undefined>()
  const [htmlCode, setHtmlCode] = useState<string>('')
  const [jsCode, setJsCode] = useState<string>('')
  const [cssCode, setCssCode] = useState<string>('')
  const [htmlMtime, setHtmlMtime] = useState<number>(0)
  const [jsMtime, setJsMtime] = useState<number>(0)
  const [cssMtime, setCssMtime] = useState<number>(0)
  const [updating, setUpdating] = useState<boolean>(false)
  const [liveUpdating, setLiveUpdating] = useLocalStorage<boolean>('liveUpdatingEnabled', false)
  const [focused, setFocused] = useState<string>('')

  const toggleLayout = () => setLayout(layout == 'vertical' ? 'horizontal' : 'vertical')

  const vertical = () => layout == 'vertical';

  const horizontal = () => layout == 'horizontal';

  const isFocused = (title: string) => focused == title

  const projectCode: ProjectCodeType[] = [
    {
      title: 'html',
      language: 'html',
      mtime: htmlMtime,
      mtimeSet: setHtmlMtime,
      code: htmlCode,
      setCode: setHtmlCode,
      filename: 'code.html',
      icon: <HTMLIcon className="w-5 h-5" />
    },
    {
      title: 'css',
      language: 'css',
      mtime: cssMtime,
      mtimeSet: setCssMtime,
      code: cssCode,
      setCode: setCssCode,
      filename: 'code.css',
      icon: <CSSIcon className="w-5 h-5" />
    },
    {
      title: 'js',
      language: 'js',
      mtime: jsMtime,
      mtimeSet: setJsMtime,
      code: jsCode,
      setCode: setJsCode,
      filename: 'code.js',
      icon: <JSIcon className="w-5 h-5" />
    },
  ]

  const activeCDNLinks = useSet<string>([])

  const fetchActiveCDNLinks = async () => {
    const data = await fetchProjectJsonFile('code.cdn')
    if (Array.isArray(data)) {
      activeCDNLinks.clear()
      data.forEach(activeCDNLinks.add)
    }
  }

  const [CDNLinks, setCDNLinks] = useState<CDNLinkType[]>([])

  const fetchCDNLinks = async () => {
    const response = await fetch(`api/cdn_links`)
    if (response.ok) {
      const data = await response.json()
      setCDNLinks(data)
    }
  }

  const [codeProcessors, setCodeProcessors] = useState<CodeProcessorType[]>([])

  const fetchCodeProcessors = async () => {
    const response = await fetch(`api/code_processors`)
    if (response.ok) {
      const data = await response.json()
      setCodeProcessors(data)
    }
  }

  useEffect(() => {
    fetchCodeProcessors()
  }, [])

  const projectCodeLookup = projectCode.reduce((acc, current) => {
    acc[current.title] = current;
    return acc;
  }, {} as Record<string, ProjectCodeType>);

  const codeCards: CodeCardProps[] = [
    {
      title: 'html',
      save: () => updateProjectFile('code.html', htmlCode),
      extension: [html()]
    },
    {
      title: 'css',
      save: () => updateProjectFile('code.css', cssCode),
      extension: [css()]
    },
    {
      title: 'js',
      save: () => updateProjectFile('code.js', jsCode),
      extension: [javascript({ jsx: true })]
    },
  ].map(card => {
    const code = projectCodeLookup[card.title];

    if (!code) {
      throw new Error(`System Fault: Required code block for title '${card.title}' not found in projectCode source.`);
    }

    const { mtimeSet, ...restOfCodeProps } = code;
    return { ...card, ...restOfCodeProps } as CodeCardProps;
  });

  const snapshotView = async () => {
    const iframe = document.getElementById('iframe-view') as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) {
      toast.error('Cannot access iframe document');
      return;
    }

    const styleSheet = iframeDoc.styleSheets[0];

    const rules = Array.from(styleSheet.cssRules || styleSheet.rules);
    const bodyRule: CSSStyleRule | null = rules.find(rule => (rule as CSSStyleRule).selectorText === "body") as CSSStyleRule;
    const bgColor = bodyRule?.style.background;

    try {
      const canvas = await html2canvas(iframeDoc.body, {
        useCORS: true,
        scale: 1,
        logging: false,
        height: 720,
        width: 1280,
        backgroundColor: bgColor
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob: Blob | null) => {
          blob ? resolve(blob) : reject();
        }, 'image/png');
      });

      const formData = new FormData();
      formData.append('image', blob, 'code.png');

      const response = await fetch(`api/image/project/${projectName}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        toast.error('Upload failed');
        return;
      } else {
        toast.success(`Uploaded snapshot`)
      }

    } catch (error) {
      toast.error('Snapshot failed');
    }
  };

  const [projectList, setProjectList] = useState<string[]>([])

  const fetchProjects = async () => {
    const response = await fetch(`api/projects`)
    if (response.ok) {
      const data = await response.json()
      setProjectList(data)
    }
  }

  const updateProjectFile = async (name: string, code: string, silent: boolean = false): Promise<void> => {
    const response = await fetch(`api/project/${projectName}/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({ 'content': code })
    });
    if (!response.ok) {
      if (!silent) toast(`Error updating ${projectName}/${name}`);
    } else {
      setUpdating(true)
      if (!silent) toast(`Saved ${projectName}/${name}`);
    }
  }

  const updateActiveCDNLinks = async () => {
    const json = JSON.stringify(Array.from(activeCDNLinks))
    await updateProjectFile('code.cdn', json)
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

  const renameCurrentProject = async (newName: string): Promise<void> => {
    if (projectName) {
      const response = await fetch(`api/project/${projectName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newName })
      })
      if (response.ok) {
        toast(`Renamed ${projectName} to ${newName}`)
        setProjectName(newName)
      } else {
        toast(`Error renaming ${projectName} to ${newName}`)
      }
    } else {
      toast(`No project open`)
    }
  }

  const deleteCurrentProject = async (): Promise<void> => {
    if (projectName) {
      const response = await fetch(`api/project/${projectName}`,
        {
          method: 'DELETE'
        }
      )
      if (response.ok) {
        toast(`${projectName} deleted`)
        setProjectName(undefined)
      } else {
        toast(`Error deleting ${projectName}`)
      }
    } else {
      toast(`No project open`)
    }

  }


  const fetchProjectJsonFile = async (filename: string) => {
    const response = await fetch(`api/project/${projectName}/${filename}`);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        return data
      }
    }
  }

  const fetchProjectFiles = async (name: string): Promise<void> => {
    const response = await fetch(`api/project/${name}`);
    if (response.ok) {
      const data: ProjectFile[] = await response.json();
      projectCode
        .filter((code) => data.find((projectFile) => projectFile.filename == code.filename))
        .forEach(async (code) => {
          const response = await fetch(`api/project/${name}/${code.filename}`);
          if (response.ok) {
            const content = await response.text();
            if (content) {
              code.setCode(content);
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

  const commitProjectChanges = async () => {
    if (!projectName) return;
    const response = await fetch(`api/commit/project/${projectName}`)
    if (response.ok) {
      toast.success(`Commited changes in ${projectName}`)
    } else {
      toast.error(`Failed to commit changes in ${projectName}`)
    }
  }

  return (
    <ProjectContext.Provider value={{
      projectName,
      projectCode,
      codeCards,
      vertical,
      horizontal,
      isFocused,
      layout,
      setLayout,
      toggleLayout,
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
      focused,
      setFocused,
      liveUpdating,
      setLiveUpdating,
      updating, // - to signal an update is taking place
      setUpdating, // - " -
      renameCurrentProject,
      deleteCurrentProject,
      snapshotView,
      codeProcessors,
      fetchCodeProcessors,
      CDNLinks,
      fetchCDNLinks,
      activeCDNLinks,
      fetchActiveCDNLinks,
      updateActiveCDNLinks,
      commitProjectChanges,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
