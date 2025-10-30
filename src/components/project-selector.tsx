import { ProjectContext, useProjectContext } from "@/contexts/project-context"
import { type FC, useEffect, useContext } from "react"

export const ProjectSelector: FC = () => {
  const { fetchProjects, projectList } = useContext(ProjectContext)

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="p-4 bg-card border-white/20 border-1 rounded-lg m-5 shadow-lg">
      <div className="text-xl tracking-tighter font-black">Projects</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
        {
          projectList.map(
            (project) => <ProjectIndexCard key={project} project={project} />
          )
        }
      </div>
    </div>
  )
}

interface ProjectIndexCardProps {
  project: string
}
const ProjectIndexCard: FC<ProjectIndexCardProps> = ({ project }) => {

  const { setProjectName } = useProjectContext()

  return (
    <div
      onClick={() => {
        setProjectName(project)
      }}
      className={`cursor-pointer p-2 px-4 hover:bg-background rounded-xl
                 flex flex-col items-center justify-center
                 transition-colors duration-800`}>
      <img
        className="rounded-lg border-1 border-foreground/20"
        width={'320px'}
        src={`api/image/project/${project}`} />
      <div>
        {project}
      </div>
    </div>
  )
}
