"use client"

import { ProjectType } from "@/app/lib/types"
import { useProjects } from "@/context/projects-provider"
import { validateName, extractFieldErrors } from "@/app/lib/utils"
import { Modal } from "@/components/ui/modal"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function ProjectActionModals({
  editProject,
  deleteTarget,
  onCloseEdit,
  onCloseDelete,
  onDeleteSuccess
}: {
  editProject: ProjectType | null
  deleteTarget: ProjectType | null
  onCloseEdit: () => void
  onCloseDelete: () => void
  onDeleteSuccess?: () => void
}) {
  const { updateProject, deleteProject } = useProjects()

  // Edit State
  const [editName, setEditName] = useState("")
  const [editing, setEditing] = useState(false)
  const [editErrors, setEditErrors] = useState<{ name?: string; general?: string }>({})

  // Delete State
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Sync edit name when modal opens
  useEffect(() => {
    if (editProject) {
      setEditName(editProject.name)
      setEditErrors({})
    }
  }, [editProject])

  // Sync delete error when modal opens
  useEffect(() => {
    if (deleteTarget) setDeleteError(null)
  }, [deleteTarget])

  const handleEdit = async () => {
    if (!editProject) return
    const trimmed = editName.trim()
    const clientErr = validateName(trimmed)
    if (clientErr) { setEditErrors({ name: clientErr }); return }
    
    setEditing(true); setEditErrors({})
    try {
      await updateProject(editProject.id, { name: trimmed })
      onCloseEdit()
    } catch (err: any) {
      setEditErrors(extractFieldErrors(err))
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true); setDeleteError(null)
    try {
      await deleteProject(deleteTarget.id)
      onCloseDelete()
      if (onDeleteSuccess) onDeleteSuccess()
    } catch (err: any) {
      const { general } = extractFieldErrors(err)
      setDeleteError(general || "Failed to delete project.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Modal
        open={!!editProject}
        onClose={onCloseEdit}
        title="Rename Project"
        description={editProject ? <>Enter a new name for <span className="font-medium text-foreground">{editProject.name}</span>.</> : null}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="edit-name" className="text-sm font-medium">Project name</label>
            <input
              id="edit-name"
              type="text"
              autoFocus
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value)
                if (editErrors.name) setEditErrors({ ...editErrors, name: undefined })
              }}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/30 transition-colors ${
                editErrors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
              }`}
            />
            {editErrors.name && (
              <p className="text-xs text-destructive mt-1">{editErrors.name}</p>
            )}
          </div>
          {editErrors.general && <p className="text-sm text-destructive">{editErrors.general}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onCloseEdit} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleEdit} disabled={!editName.trim() || editing} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {editing ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={onCloseDelete}
        title="Delete Project"
        description={deleteTarget ? <>Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget.name}</span>? This action cannot be undone.</> : null}
      >
        <div className="space-y-4">
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onCloseDelete} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="h-9 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
