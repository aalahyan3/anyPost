"use client"

import { useEffect, useState } from "react"
import { FormType } from "@/app/lib/types"
import { api } from "@/app/lib/api"
import { FormCard } from "@/app/dashboard/_components/form-card"
import { FileText, Plus } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { validateName, extractFieldErrors } from "@/app/lib/utils"

export function FormsComponent({ projectId }: { projectId: string }) {
  const [forms, setForms] = useState<FormType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create Form State
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState("")
  const [creating, setCreating] = useState(false)
  const [createErrors, setCreateErrors] = useState<{ name?: string; general?: string }>({})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get(`/api/v1/projects/${projectId}/forms`)
      .then((res) => {
        if (!mounted) return
        const list: FormType[] = res.data?.data ?? res.data ?? []
        setForms(Array.isArray(list) ? list : [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || "Failed to load forms")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [projectId])

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <svg className="h-6 w-6 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mt-6">
        {error}
      </div>
    )
  }

  const handleCreate = async () => {
    const trimmed = createName.trim()
    const clientErr = validateName(trimmed)
    if (clientErr) { setCreateErrors({ name: clientErr }); return }
    
    setCreating(true); setCreateErrors({})
    try {
      const res = await api.post(`/api/v1/projects/${projectId}/forms`, { name: trimmed })
      const newForm: FormType = res.data.data ?? res.data
      setForms((prev) => [...prev, newForm])
      setCreateName("")
      setShowCreate(false)
    } catch (err: any) {
      setCreateErrors(extractFieldErrors(err))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Forms</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage data collection forms for this project.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="size-4" />
          New Form
        </button>
      </div>
      
      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-12 text-center mt-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium mb-1">No forms yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">Create your first form for this project to start collecting responses.</p>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="size-4" />
            New Form
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}

      {/* ── Create dialog ── */}
      <Modal
        open={showCreate}
        onClose={() => { setShowCreate(false); setCreateErrors({}) }}
        title="New Form"
        description="Give your form a name to get started."
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="create-name" className="text-sm font-medium">Form name</label>
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
              placeholder="e.g. Lead Capture Form"
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
              {creating ? "Creating..." : "Create Form"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
