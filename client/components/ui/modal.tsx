"use client"

import { X } from "lucide-react"

export function Modal({
  open,
  onClose,
  title,
  description,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}
