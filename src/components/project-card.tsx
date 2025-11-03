import { useProjectContext } from "@/contexts/project-context"
import type { FC } from "react"

interface ProjectCardProps {
  project: string
}
export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const { setProjectName } = useProjectContext()

  return (
    <div
      onClick={() => {
        if (project) setProjectName(project)
      }}
      className={`cursor-pointer p-2 px-4 hover:bg-background hover:shadow-md rounded-xl
                 flex flex-col gap-2 items-center justify-center text-xs
                 transition-colors duration-200`}>
      <img
        className="rounded-lg  border-1 border-foreground/20 w-full h-full object-cover"
        src={`api/image/project/${project}?md=${Date.now().toFixed()}`} />
      <div>
        {project}
      </div>
    </div>
  )
}
