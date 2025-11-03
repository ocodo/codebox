import { ProjectCard } from "@/components/project-card"
import { useProjectContext } from "@/contexts/project-context"
import { type FC, useEffect } from "react"

export const ProjectSelector: FC = () => {
  const { fetchProjects, projectList } = useProjectContext()

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="p-4 bg-card border-white/20 border-1 rounded-lg m-5 shadow-lg overflow-y-auto max-h-[80vh]">
      <div className="text-xl tracking-tighter font-black">Projects</div>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
          {
            projectList.map(
              (project) => <ProjectCard key={project} project={project} />
            )
          }
        </div>
      </div>
    </div>
  )
}

