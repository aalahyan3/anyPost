"use client"

import { ProjectType } from "@/app/lib/types"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ProjectMenu({
  project,
  onEdit,
  onDelete,
  triggerClassName = "",
}: {
  project: ProjectType
  onEdit: (p: ProjectType) => void
  onDelete: (p: ProjectType) => void
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0" onClick={(e) => e.preventDefault()}>
      <button
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o) }}
        className={`flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${triggerClassName}`}
        aria-label="Project options"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[140px] rounded-lg border bg-card shadow-lg py-1">
          <button
            onClick={(e) => { e.preventDefault(); setOpen(false); onEdit(project) }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <Pencil className="size-3.5" />
            Rename
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setOpen(false); onDelete(project) }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
