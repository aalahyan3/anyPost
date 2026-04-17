"use client"

import { useProjects } from "@/context/projects-provider"
import { ProjectType } from "@/app/lib/types"
import { Folder, Plus, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ProjectCard } from "../_components/project-card"
import { Modal } from "@/components/ui/modal"
import { ProjectActionModals } from "../_components/project-dialogs"
import { validateName, extractFieldErrors } from "@/app/lib/utils"




// ── Main page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()

  // Create dialog
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState("")
  const [creating, setCreating] = useState(false)
  const [createErrors, setCreateErrors] = useState<{ name?: string; general?: string }>({})

  // Edit dialog
  const [editProject, setEditProject] = useState<ProjectType | null>(null)
  const [editName, setEditName] = useState("")
  const [editing, setEditing] = useState(false)
  const [editErrors, setEditErrors] = useState<{ name?: string; general?: string }>({})

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<ProjectType | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const openEdit = (p: ProjectType) => { setEditProject(p); setEditName(p.name); setEditErrors({}) }
  const openDelete = (p: ProjectType) => { setDeleteTarget(p); setDeleteError(null) }

  const handleCreate = async () => {
    const trimmed = createName.trim()
    const clientErr = validateName(trimmed)
    if (clientErr) { setCreateErrors({ name: clientErr }); return }
    
    setCreating(true); setCreateErrors({})
    try {
      await addProject(trimmed)
      setCreateName(""); setShowCreate(false)
    } catch (err: any) {
      setCreateErrors(extractFieldErrors(err))
    } finally { setCreating(false) }
  }



  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your projects here.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      {/* Grid / loading / empty */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <svg className="h-7 w-7 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4">
            <Folder className="size-6 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium mb-1">No projects yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">Get started by creating your first project.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={openEdit} 
              onDelete={openDelete} 
            />
          ))}
        </div>
      )}

      {/* ── Create dialog ── */}
      <Modal
        open={showCreate}
        onClose={() => { setShowCreate(false); setCreateErrors({}) }}
        title="New Project"
        description="Give your project a name to get started."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="create-name" className="text-sm font-medium">Project name</label>
            <input
              id="create-name"
              type="text"
              autoFocus
              value={createName}
              onChange={(e) => {
                setCreateName(e.target.value)
                if (createErrors.name) setCreateErrors({ ...createErrors, name: undefined })
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. My Awesome Project"
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/30 transition-colors ${
                createErrors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
              }`}
            />
            {createErrors.name && (
              <p className="text-xs text-destructive mt-1">{createErrors.name}</p>
            )}
          </div>
          {createErrors.general && <p className="text-sm text-destructive">{createErrors.general}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowCreate(false); setCreateErrors({}) }} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleCreate} disabled={!createName.trim() || creating} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </Modal>

      <ProjectActionModals
        editProject={editProject}
        deleteTarget={deleteTarget}
        onCloseEdit={() => setEditProject(null)}
        onCloseDelete={() => setDeleteTarget(null)}
      />
    </div>
  )
}
