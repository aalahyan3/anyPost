import { ProjectType } from "@/app/lib/types"
import { Folder } from "lucide-react"
import Link from "next/link"
import { ProjectMenu } from "./project-menu"

export function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectType
  onEdit: (p: ProjectType) => void
  onDelete: (p: ProjectType) => void
}) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Folder className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{project.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {new Date(project.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            project.active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {project.active ? "Active" : "Inactive"}
        </span>
        <ProjectMenu
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          triggerClassName="opacity-0 group-hover:opacity-100 focus:opacity-100"
        />
      </div>
    </Link>
  )
}
