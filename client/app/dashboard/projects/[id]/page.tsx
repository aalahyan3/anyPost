"use client"

import { use } from "react"
import { useProjects } from "@/context/projects-provider"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import { ProjectMenu } from "../../_components/project-menu"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { ProjectActionModals } from "../../_components/project-dialogs"
import { FormsComponent } from "./_components/forms-component"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { projects, loading, updateProject, deleteProject } = useProjects()
  const router = useRouter()

  // Modals state
  const [editProject, setEditProject] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  const openEdit = () => {
    const p = projects.find((i) => i.id === id)
    if (p) setEditProject(p)
  }
  
  const openDelete = () => {
    const p = projects.find((i) => i.id === id)
    if (p) setDeleteTarget(p)
  }

  const handleDeleteSuccess = () => {
    router.push("/dashboard/projects")
  }

  // Wait until we have projects loaded
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="h-7 w-7 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center mt-12 border border-dashed rounded-xl bg-muted/20">
        <h1 className="text-xl font-semibold">Project Not Found</h1>
        <p className="text-sm text-muted-foreground">The project you are looking for does not exist or was deleted.</p>
        <Link href="/dashboard/projects" className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <ArrowLeft className="mr-2 size-4" /> Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}>
            {project.active ? "Active" : "Inactive"}
          </span>
          <ProjectMenu 
            project={project} 
            onEdit={openEdit} 
            onDelete={openDelete} 
          />
        </div>
      </div>
      
      <hr className="border-border" />
      
      {/* Rest of the dashboard view for this project would go here */}
      <FormsComponent projectId={id} />

      <ProjectActionModals
        editProject={editProject}
        deleteTarget={deleteTarget}
        onCloseEdit={() => setEditProject(null)}
        onCloseDelete={() => setDeleteTarget(null)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
