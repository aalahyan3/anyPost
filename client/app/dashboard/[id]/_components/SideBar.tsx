"use client"

import { api } from "@/app/lib/api"
import { FormType } from "@/app/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useForm } from "@/context/form-context"
import { cn } from "@/lib/utils"
import { FileText, Loader2, AlertCircle, FilePlus } from "lucide-react"
import React, { useEffect, useState } from "react"
import CreateFormDialog from "./CreateFormDialog"

function SideBar({
  className,
  projectId,
  onFormSelect,
}: {
  className?: string
  projectId: string
  onFormSelect?: (id: string) => void
}) {
  const [forms, setForms] = useState<FormType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const [currForm, setCurrForm] = useState<string | null>(null);
  const { form: currForm, setForm, refreshCounter } = useForm()
  const [openCreateModal, setOpenCreateModal] = useState(false)

  const fetchForms = React.useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .get(`/api/v1/projects/${projectId}/forms`)
      .then((res) => {
        const list: FormType[] = res.data?.data ?? res.data ?? []
        setForms(Array.isArray(list) ? list : [])
        
        // set selected form only if none is currently selected
        // using the state updater function runtime feature to avoid stale closures
        setForm((prev: any) => {
          // If we have a previous form, check if it still exists in the new list
          if (prev && list.some(f => f.id === prev.id)) {
            return prev;
          }
          return list[0] || null;
        })
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load forms")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [projectId, setForm])

  useEffect(() => {
    fetchForms()
  }, [fetchForms, refreshCounter])

  const handleFormSelect = (id: FormType | null) => {
    setForm(id)
    onFormSelect?.(id?.id ?? "")
  }

  return (
    <aside className={cn("flex flex-col bg-sidebar md:h-full mt-10 rounded-xl md:m-10  border", className)}>
      {/* Header */}
      <div className="border-b border-border/60 px-4 py-4 md:py-5">
        <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2 text-sm font-medium transition-all duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <FilePlus className="h-3.5 w-3.5" />
              New Form
            </Button>
          </DialogTrigger>
          <CreateFormDialog projectId={projectId} onSuccess={() => {
            setOpenCreateModal(false)
            fetchForms()
          }} />
        </Dialog>
      </div>

      {/* Form List */}
      <div className="max-h-[40vh] flex-1 space-y-0.5 overflow-y-auto px-3 py-3 md:max-h-none">
        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-xs">Loading forms…</span>
          </div>
        )}

        {error && !loading && (
          <div className="mx-1 mt-2 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {!loading && !error && forms.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              No forms yet
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/60">
              Create your first form above
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          forms.map((form) => {
            const isActive = currForm?.id === form.id
            return (
              <button
                key={form.id}
                onClick={() => handleFormSelect(form)}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-md p-3 text-left text-sm transition-all duration-100",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                )}
              >
                <FileText
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="truncate">{form.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
      </div>
    </aside>
  )
}

export default SideBar
