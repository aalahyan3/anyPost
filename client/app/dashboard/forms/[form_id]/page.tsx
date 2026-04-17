"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Check, Copy, Plug, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/app/lib/api"
import { FormType } from "@/app/lib/types"
import { Modal } from "@/components/ui/modal"
import { validateName, extractFieldErrors } from "@/app/lib/utils"
import { useRouter } from "next/navigation"
import { SubmissionsTable } from "./_components/submissions-table"

export default function FormDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ form_id: string }>,
  searchParams: Promise<{ projectId?: string }>
}) {
  const { form_id } = use(params)
  const query = use(searchParams)
  const id = query.projectId
  const router = useRouter()

  const [form, setForm] = useState<FormType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit State
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState("")
  const [editActive, setEditActive] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editErrors, setEditErrors] = useState<{ name?: string; general?: string }>({})

  // Delete State
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Copy & Integration State
  const [copied, setCopied] = useState<"url" | "react" | "html" | null>(null)
  const [integrationOpen, setIntegrationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"react" | "html">("react")

  const handleCopy = (text: string, type: "url" | "react" | "html") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    let mounted = true
    if (!id) {
      setError("Missing project ID. Please navigate from the project dashboard.")
      setLoading(false)
      return
    }

    setLoading(true)
    api.get(`/api/v1/projects/${id}/forms/${form_id}`)
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
    return () => { mounted = false }
  }, [id, form_id])

  const openEdit = () => {
    if (!form) return
    setEditName(form.name)
    setEditActive(form.active)
    setEditErrors({})
    setShowEdit(true)
  }

  const handleEdit = async () => {
    const trimmed = editName.trim()
    const clientErr = validateName(trimmed)
    if (clientErr) { setEditErrors({ name: clientErr }); return }

    setEditing(true); setEditErrors({})
    try {
      // NOTE: Using fallback pathing if your backend route differs slightly.
      const res = await api.put(`/api/v1/projects/${id}/forms/${form_id}`, { name: trimmed, active: editActive })
      const updatedForm = res.data?.data ?? res.data
      setForm(updatedForm)
      setShowEdit(false)
    } catch (err: any) {
      setEditErrors(extractFieldErrors(err))
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true); setDeleteError(null)
    try {
      await api.delete(`/api/v1/projects/${id}/forms/${form_id}`)
      router.push(`/dashboard/projects/${id}`)
    } catch (err: any) {
      const { general } = extractFieldErrors(err)
      setDeleteError(general || "Failed to delete form.")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <svg className="h-6 w-6 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center mt-12 border border-dashed rounded-xl bg-muted/20">
        <h1 className="text-xl font-semibold">Form Not Found</h1>
        <p className="text-sm text-muted-foreground">{error || "The form you are looking for does not exist."}</p>
        <Link href={`/dashboard/projects/${id}`} className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <ArrowLeft className="mr-2 size-4" /> Back to Project
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 ">
      <div>
        <Link
          href={`/dashboard/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Project
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{form.name}</h1>
            <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${form.active
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
              }`}>
              {form.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex gap-2">
            <button onClick={openEdit} className="inline-flex items-center gap-2 h-9 rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted">
              <Pencil className="size-3.5" />
              Edit Form
            </button>
            <button onClick={() => { setDeleteError(null); setShowDelete(true) }} className="inline-flex items-center gap-2 h-9 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive px-4 text-sm font-medium transition-colors hover:bg-destructive/20">
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 text-sm text-muted-foreground border-y py-4">
          <div className="font-mono text-xs text-foreground bg-muted py-1 px-2.5 rounded border">ID: {form.id}</div>
          <span>&middot;</span>
          <span>Created {new Date(form.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      {/* ── Integration Section ── */}
      <div className="flex flex-col gap-6 mt-4">
        <div className={`rounded-xl border bg-card overflow-hidden transition-all duration-300`}>

          <button
            onClick={() => setIntegrationOpen(!integrationOpen)}
            className="flex items-center w-full justify-between border-b bg-muted/30 px-6 py-4 hover:bg-muted/50 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Plug className="size-4" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold tracking-tight">Integration Options</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Link your projects tightly. Connect via POST to this endpoint.</p>
              </div>
            </div>
            <ChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${integrationOpen ? "rotate-180" : ""}`} />
          </button>

          {integrationOpen && (
            <div className="p-6 space-y-8 animate-in slide-in-from-top-2 fade-in duration-300">

              {/* Endpoint */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Endpoint URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm font-mono overflow-auto">
                    <span className="text-emerald-500 font-semibold mr-2">POST</span>
                    https://anypost.com/f/{form.id}
                  </code>
                  <button
                    onClick={() => handleCopy(`https://anypost.com/f/${form.id}`, "url")}
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border h-10 w-10 bg-background hover:bg-muted transition-colors"
                    title="Copy URL"
                  >
                    {copied === "url" ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <hr className="border-border" />

              {/* TABS HEADER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b px-1">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab("react")}
                      className={`pb-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "react" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      React (Fetch)
                    </button>
                    <button
                      onClick={() => setActiveTab("html")}
                      className={`pb-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "html" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Raw HTML Form
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (activeTab === "react") {
                        handleCopy(`const response = await fetch("https://anypost.com/f/${form.id}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ email: "user@example.com", message: "Hello!" })\n});`, "react")
                      } else {
                        handleCopy(`<form action="https://anypost.com/f/${form.id}" method="POST">\n  <input type="email" name="email" placeholder="Your Email" />\n  <textarea name="message" placeholder="Your Message"></textarea>\n  <button type="submit">Submit</button>\n</form>`, "html")
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-2"
                  >
                    {copied === activeTab ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    {copied === activeTab ? "Copied!" : "Copy Code"}
                  </button>
                </div>

                {/* TABS CONTENT */}
                <pre className="rounded-lg border bg-zinc-950 p-5 overflow-auto text-[13px] leading-relaxed shadow-inner">
                  {activeTab === "react" && (
                    <code className="text-zinc-50 font-mono">
                      <span className="text-purple-400">const</span> <span className="text-blue-300">response</span> <span className="text-purple-400">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&quot;https://anypost.com/f/{form.id}&quot;</span>, {"{"}
                      {"\n"}  <span className="text-zinc-400">method:</span> <span className="text-emerald-300">&quot;POST&quot;</span>,
                      {"\n"}  <span className="text-zinc-400">headers:</span> {"{"} <span className="text-emerald-300">&quot;Content-Type&quot;</span>: <span className="text-emerald-300">&quot;application/json&quot;</span> {"}"},
                      {"\n"}  <span className="text-zinc-400">body:</span> <span className="text-yellow-200">JSON</span>.<span className="text-blue-400">stringify</span>({"{"} <span className="text-blue-300">email</span>: <span className="text-emerald-300">&quot;user@example.com&quot;</span>, <span className="text-blue-300">message</span>: <span className="text-emerald-300">&quot;Hello!&quot;</span> {"}"})
                      {"\n"}{"})"};
                    </code>
                  )}

                  {activeTab === "html" && (
                    <code className="text-zinc-50 font-mono">
                      <span className="text-zinc-400">&lt;</span><span className="text-pink-400">form</span> <span className="text-purple-300">action</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;https://anypost.com/f/{form.id}&quot;</span> <span className="text-purple-300">method</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;POST&quot;</span><span className="text-zinc-400">&gt;</span>
                      {"\n  "}<span className="text-zinc-400">&lt;</span><span className="text-pink-400">input</span> <span className="text-purple-300">type</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;email&quot;</span> <span className="text-purple-300">name</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;email&quot;</span> <span className="text-purple-300">placeholder</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;Your Email&quot;</span> <span className="text-zinc-400">/&gt;</span>
                      {"\n  "}<span className="text-zinc-400">&lt;</span><span className="text-pink-400">textarea</span> <span className="text-purple-300">name</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;message&quot;</span> <span className="text-purple-300">placeholder</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;Your Message&quot;</span><span className="text-zinc-400">&gt;&lt;/</span><span className="text-pink-400">textarea</span><span className="text-zinc-400">&gt;</span>
                      {"\n  "}<span className="text-zinc-400">&lt;</span><span className="text-pink-400">button</span> <span className="text-purple-300">type</span><span className="text-zinc-400">=</span><span className="text-emerald-300">&quot;submit&quot;</span><span className="text-zinc-400">&gt;</span>Submit<span className="text-zinc-400">&lt;/</span><span className="text-pink-400">button</span><span className="text-zinc-400">&gt;</span>
                      {"\n"}<span className="text-zinc-400">&lt;/</span><span className="text-pink-400">form</span><span className="text-zinc-400">&gt;</span>
                    </code>
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <SubmissionsTable projectId={id!} formId={form_id} />

      {/* ── Edit Form Modal ── */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Form"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="edit-name" className="text-sm font-medium">Form Name</label>
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
              className={`h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/30 transition-colors ${editErrors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
                }`}
            />
            {editErrors.name && (
              <p className="text-xs text-destructive mt-1">{editErrors.name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditActive(!editActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${editActive ? "bg-primary" : "bg-muted"
                }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${editActive ? "translate-x-4" : "translate-x-0"
                }`} />
            </button>
            <span className="text-sm font-medium text-foreground">
              {editActive ? "Form is Active" : "Form is Inactive"}
            </span>
          </div>

          {editErrors.general && <p className="text-sm text-destructive">{editErrors.general}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleEdit} disabled={!editName.trim() || editing} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {editing ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Form Modal ── */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Form"
        description={form ? <>Are you sure you want to delete <span className="font-medium text-foreground">{form.name}</span>? This action is permanent and will destroy all collected responses.</> : null}
      >
        <div className="space-y-4">
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowDelete(false)} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancel</button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="h-9 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {deleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
