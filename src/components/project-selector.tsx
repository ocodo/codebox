import { ProjectContext } from "@/contexts/project-context"
import { type FC, useEffect, useContext } from "react"

export const ProjectSelector: FC = () => {
  const { setProjectName, fetchProjects, projectList } = useContext(ProjectContext)

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="p-4 bg-card border-white/20 border-1 rounded-lg m-5 shadow-lg">
      <div className="text-xl tracking-tighter font-black">Projects</div>
      <div className="flex flex-col p-3">
        {projectList.map(
          (project) => <div
            key={project}
            className="cursor-pointer p-2 px-4 hover:bg-background rounded-full"
            onClick={() => {
              console.log(`Selected: ${project}`)
              setProjectName(project)
            }}>
            {project}
          </div>
        )}
      </div>
    </div>
  )
}


