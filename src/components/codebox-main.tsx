import { ViewCard } from "@/components/view-card";
import { type FC, useEffect } from "react";
import { useProjectContext } from "@/contexts/project-context";
import { CodeLayout } from "@/components/code-layout";

export const CodeBox: FC = () => {
  const {
    projectName,
    layout,
    fetchProjectFiles,
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
    <div className={`h-fill grid ${layout == 'vertical' ? 'grid-cols-1' : 'grid-cols-2 gap-2'}`} >
        <CodeLayout />
        <ViewCard />
    </div>
  )
}

