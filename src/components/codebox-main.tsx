import { CodeCard } from "@/components/code-card";
import { ViewCard } from "@/components/view-card";
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { type FC, useEffect } from "react";
import { useProjectContext } from "@/contexts/project-context";
export const CodeBox: FC = () => {

  const {
    projectName,
    fetchProjectFiles,
    updateProjectFile,
    htmlCode,
    htmlMtime,
    setHtmlCode,
    cssCode,
    cssMtime,
    setCssCode,
    jsCode,
    jsMtime,
    setJsCode,

  } = useProjectContext()


  useEffect(
    () => {
      if (projectName) {
        console.log(`projectName: ${projectName}`)
        fetchProjectFiles(projectName)
      }
    }, [projectName]
  );

  return (
    <>
      <div className="grid grid-cols-3 h-[40vh] gap-2">
        <CodeCard
          title='HTML'
          save={() => updateProjectFile('code.html', htmlCode)}
          setCode={setHtmlCode}
          code={htmlCode}
          extension={[html()]}
          mtime={htmlMtime} />
        <CodeCard
          title='JS'
          save={() => updateProjectFile('code.js', jsCode)}
          setCode={setJsCode}
          code={jsCode}
          extension={[javascript({ jsx: true })]}
          mtime={jsMtime} />
        <CodeCard
          save={() => updateProjectFile('code.css', cssCode)}
          title='CSS'
          setCode={setCssCode}
          code={cssCode}
          extension={[css()]}
          mtime={cssMtime} />
      </div>
      <ViewCard />
    </>
  )
}

