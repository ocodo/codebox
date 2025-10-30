import { ViewCard } from "@/components/view-card";
import { type FC, useEffect } from "react";
import { useProjectContext } from "@/contexts/project-context";
import { CodeColumsLayout } from "@/components/code-columns-layout";
export const CodeBox: FC = () => {

  const {
    projectName,
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
    <div>
      <CodeColumsLayout />
      <ViewCard />
    </div>
  )
}

