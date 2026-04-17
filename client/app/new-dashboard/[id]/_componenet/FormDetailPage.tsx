"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Check,
  Copy,
  Plug,
  ChevronDown,
  Info,
} from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/app/lib/api"
import { FormType } from "@/app/lib/types"
import { validateName, extractFieldErrors } from "@/app/lib/utils"
import { useRouter } from "next/navigation"
import { SubmissionsTable } from "./submissions-table"
import { useForm } from "@/context/form-context"
import { Button } from "@/components/ui/button"
import IntegrationInstructions from "./IntegrationInstructions"
import FormPageHeader from "./FormPageHeader"

export default function FormDetailPage({
  projectId,
  formId,
}: {
  projectId: string
  formId: string
}) {
  //   const { form_id } = use(params)
  //   const query = use(searchParams)
  const id = projectId
  const router = useRouter()
  const { setForm: setGlobalForm, refreshForms } = useForm()

  const [form, setForm] = useState<FormType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit State
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState("")
  const [editActive, setEditActive] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editErrors, setEditErrors] = useState<{
    name?: string
    general?: string
  }>({})

  // Delete State
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)




  useEffect(() => {
    let mounted = true
    if (!id) {
      setError(
        "Missing project ID. Please navigate from the project dashboard."
      )
      setLoading(false)
      return
    }

    setLoading(true)
    api
      .get(`/api/v1/projects/${id}/forms/${formId}`)
      .then((res) => {
        if (!mounted) return
        setForm(res.data?.data ?? res.data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || "Failed to load form details")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [id, formId])

  const openEdit = () => {
    if (!form) return
    setEditName(form.name)
    setEditActive(form.active)
    setEditErrors({})
    setShowEdit(true)
  }

 

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await api.delete(`/api/v1/projects/${id}/forms/${formId}`)
      setGlobalForm(null)
      refreshForms()
    } catch (err: any) {
      const { general } = extractFieldErrors(err)
      setDeleteError(general || "Failed to delete form.")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <svg
          className="h-6 w-6 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="mt-12 flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
        <h1 className="text-xl font-semibold">Form Not Found</h1>
        <p className="text-sm text-muted-foreground">
          {error || "The form you are looking for does not exist."}
        </p>
        <Link
          href={`/dashboard/projects/${id}`}
          className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Project
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <FormPageHeader
        form={form}
        onFormUpdated={(updatedForm) => setForm(updatedForm)}
        onDelete={handleDelete}
        deleting={deleting}
        deleteError={deleteError}
      />
      {!form.active && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="">
            <Info className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">This form is inactive</p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-100/80">
              It will not receive new submissions until you turn it back on.
            </p>
          </div>
        </div>
      )}
      {/* ── Integration Section ── */}
      <IntegrationInstructions formId={form.id} />

      <SubmissionsTable projectId={id!} formId={formId} />

      {/* ── Edit Form Modal ── */}
      
    </div>
  )
}
