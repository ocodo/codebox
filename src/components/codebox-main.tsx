import { ViewCard } from "@/components/view-card";
import { type FC, useEffect } from "react";
import { useProjectContext } from "@/contexts/project-context";
import { CodeLayout } from "@/components/code-layout";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const CodeBox: FC = () => {
  const { projectName, layout, fetchProjectFiles } = useProjectContext();

  useEffect(() => {
    if (projectName) {
      console.log(`projectName: ${projectName}`);
      fetchProjectFiles(projectName);
    }
  }, [projectName, fetchProjectFiles]);

  return (
    <div className="h-full">
      <Allotment vertical={layout === "vertical"} separator={true} key={layout}>
        <Allotment.Pane>
          <CodeLayout />
        </Allotment.Pane>
        <Allotment.Pane>
          <ViewCard />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
