import { CodeCard } from "@/components/code-card"
import { useProjectContext } from "@/contexts/project-context"
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import type { FC } from "react"

export const CodeColumsLayout: FC = () => {
  const {
    htmlCode,
    htmlMtime,
    setHtmlCode,
    jsCode,
    jsMtime,
    setJsCode,
    cssCode,
    cssMtime,
    setCssCode,
    updateProjectFile,
    focused,
  } = useProjectContext()

  const containerClassName = () => {
    if (focused == '') {
      return 'grid grid-cols-3  gap-2'
    } else {
      return 'grid grid-cols-1  gap-2'
    }
  }

  const codeCards = [
    {
      title: 'HTML',
      save: () => updateProjectFile('code.html', htmlCode),
      setCode: setHtmlCode,
      code: htmlCode,
      extension: [html()],
      mtime: htmlMtime
    },
    {
      title: 'JS',
      save: () => updateProjectFile('code.js', jsCode),
      setCode: setJsCode,
      code: jsCode,
      extension: [javascript({ jsx: true })],
      mtime: jsMtime
    },
    {
      title: 'CSS',
      save: () => updateProjectFile('code.css', cssCode),
      setCode: setCssCode,
      code: cssCode,
      extension: [css()],
      mtime: cssMtime
    }
  ];

  const cards = () => {
    if (focused == '') {
      return codeCards;
    } else {
      return codeCards.filter(c => c.title == focused)
    }
  }

  return (
    <div className={containerClassName()}>
      {
        cards().map(card => <CodeCard {...card} />)
      }
    </div>
  )
}
