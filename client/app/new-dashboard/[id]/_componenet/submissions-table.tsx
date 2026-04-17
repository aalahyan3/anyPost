"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { SubmissionType } from "@/app/lib/types"
import { api } from "@/app/lib/api"
import { Inbox, Database, Search, Download, BarChart3, Clock, KeySquare, ArrowLeft, ArrowRight, Mail, SendHorizonal, Zap, Rocket, Key, RefreshCcw } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { SubmissionsChart } from "./submissions-chart"

type FormMetadata = {
  fields: string[]
  lastPulse: string | null
  totalSubmissions: number
  firstSubmission: string | null
  activeForm: boolean
}

export function SubmissionsTable({ projectId, formId }: { projectId: string; formId: string }) {
  const [submissions, setSubmissions] = useState<SubmissionType[]>([])
  const [metadata, setMetadata] = useState<FormMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const size = 20

  const [selectedJson, setSelectedJson] = useState<{ title: string; data: any } | null>(null)

  const [columnSearchQuery, setColumnSearchQuery] = useState("")
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  const fetchMetadata = useCallback(async () => {
    const res = await api.get(`/api/v1/projects/${projectId}/forms/${formId}/submissions/metadata`)
    setMetadata(res.data?.data ?? res.data)
  }, [projectId, formId])

  const fetchSubmissions = useCallback(async () => {
    const res = await api.get(`/api/v1/projects/${projectId}/forms/${formId}/submissions?size=${size}&page=${page}`)
    const apiData = res.data?.data ?? res.data

    if (apiData?.content !== undefined) {
      setSubmissions(Array.isArray(apiData.content) ? apiData.content : [])
      setTotalElements(apiData.totalElements || 0)
      setTotalPages(apiData.totalPages || 1)
      return
    }

    setSubmissions(Array.isArray(apiData) ? apiData : [])
    setTotalElements(Array.isArray(apiData) ? apiData.length : 0)
    setTotalPages(1)
  }, [projectId, formId, page, size])

  const handleRefresh = useCallback(async () => {
    if (loading || refreshing) return

    setRefreshing(true)
    setError(null)
    try {
      await Promise.all([fetchMetadata(), fetchSubmissions()])
    } catch (err: any) {
      setError(err?.message || "Failed to refresh submissions")
    } finally {
      setRefreshing(false)
    }
  }, [fetchMetadata, fetchSubmissions, loading, refreshing])

  useEffect(() => {
    let mounted = true

    fetchMetadata().catch((err: any) => {
      if (!mounted) return
      setError(err.message || "Failed to load metadata")
    })

    return () => { mounted = false }
  }, [fetchMetadata])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchSubmissions()
      .catch((err: any) => {
        if (!mounted) return
        setError(err.message || "Failed to load submissions")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [fetchSubmissions])

  const allColumns = metadata?.fields ?? []

  const visibleColumns = useMemo(() => {
    if (selectedColumns.length === 0) return allColumns
    return allColumns.filter(c =>
      selectedColumns.some(tag => tag.toLowerCase() === c.toLowerCase())
    )
  }, [allColumns, selectedColumns])

  const lastPulseStr = useMemo(() => {
    if (!metadata?.lastPulse) return "Never"
    const latest = new Date(metadata.lastPulse)
    const diffMins = Math.floor((new Date().getTime() - latest.getTime()) / 60000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hr ago`
    return `${Math.floor(diffHours / 24)} days ago`
  }, [metadata])

  const [exporting, setExporting] = useState(false)

  const downloadCSV = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const res = await api.get(
        `/api/v1/projects/${projectId}/forms/${formId}/submissions/export`,
        { responseType: "blob" }
      )
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.setAttribute("href", url)
      anchor.setAttribute("download", `form-${formId}-submissions.csv`)
      anchor.style.visibility = "hidden"
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("CSV export failed", err)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-xl font-semibold tracking-tight">Submissions</h2>
        <div className="flex justify-center p-12 border rounded-xl bg-card">
          <svg className="h-6 w-6 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-xl font-semibold tracking-tight">Submissions</h2>
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="self-end">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="mb-2"
        >
          <RefreshCcw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart – left side on large screens */}
        <SubmissionsChart projectId={projectId} formId={formId} />

        {/* Metadata cards – right side, 2×2 grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-1 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Inbox className="size-4" /> Total Submissions
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold tracking-tight">{metadata?.totalSubmissions ?? totalElements}</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-1 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Key className="size-4" /> Mapped Fields
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold tracking-tight">{allColumns.length}</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-1 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Zap className="size-4" /> Latest Pulse
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold tracking-tight">{lastPulseStr}</span>
            </div>
          </div>

          <button
            onClick={downloadCSV}
            disabled={exporting || (metadata?.totalSubmissions ?? totalElements) === 0}
            className="relative overflow-hidden rounded-xl border border-primary/20 bg-card p-5 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-all duration-300 text-primary disabled:opacity-40 disabled:cursor-not-allowed group focus:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none z-0" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            {exporting ? (
              <svg className="relative z-10 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Download className="relative z-10 size-5 opacity-80 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-sm" />
            )}
            <span className="relative z-10 font-medium text-sm tracking-tight text-foreground">
              {exporting ? "Exporting…" : "Export all CSV"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Submissions <span className="text-muted-foreground text-sm font-normal ml-2">({metadata?.totalSubmissions ?? totalElements} total)</span>
        </h2>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type column name & press Enter..."
              value={columnSearchQuery}
              onChange={(e) => setColumnSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && columnSearchQuery.trim()) {
                  e.preventDefault()
                  const matchedCol = allColumns.find(c => c.toLowerCase() === columnSearchQuery.trim().toLowerCase())
                  const toAdd = matchedCol || columnSearchQuery.trim()
                  if (!selectedColumns.includes(toAdd)) {
                    setSelectedColumns([...selectedColumns, toAdd])
                  }
                  setColumnSearchQuery("")
                } else if (e.key === "Backspace" && !columnSearchQuery && selectedColumns.length > 0) {
                  setSelectedColumns(selectedColumns.slice(0, -1))
                }
              }}
              className="h-9 w-[300px] rounded-lg border bg-background pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>

          {selectedColumns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[300px]">
              {selectedColumns.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 pl-2.5 pr-1.5 py-0.5 text-xs font-medium text-primary">
                  {tag}
                  <button
                    onClick={() => setSelectedColumns(selectedColumns.filter(t => t !== tag))}
                    className="flex size-3.5 items-center justify-center rounded-full hover:bg-primary/20 text-primary transition-colors focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedColumns([])}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-muted/20 p-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4 border shadow-sm">
                <Inbox className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium mb-1">No submissions yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect the form via the endpoint above to start receiving submissions.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Received</th>
                  {/* <th className="px-6 py-4 whitespace-nowrap">ID</th> */}
                  {visibleColumns.map(col => (
                    <th key={col} className="px-6 py-4 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-foreground">
                {visibleColumns.length === 0 && selectedColumns.length > 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No actual data fields strictly match your tracked tag: "{selectedColumns.join(", ")}".
                    </td>
                  </tr>
                )}
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-3.5 font-medium whitespace-nowrap text-xs">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    {/* <td className="px-6 py-3.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">{sub.id.slice(-6)}</td> */}
                    {visibleColumns.map(col => {
                      const val = sub.data?.[col]

                      if (val === undefined || val === null) {
                        return <td key={col} className="px-6 py-3.5 text-muted-foreground/60 text-xs font-mono italic">N/A</td>
                      }

                      if (typeof val === "object") {
                        return (
                          <td key={col} className="px-6 py-3.5 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedJson({ title: col, data: val })}
                              className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium hover:bg-primary/10 transition-colors text-primary"
                            >
                              <Database className="size-3" />
                              View Data
                            </button>
                          </td>
                        )
                      }

                      return (
                        <td key={col} className="px-6 py-3.5 max-w-[240px] truncate text-sm" title={String(val)}>
                          {String(val)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalElements > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2 pt-2">
          <div className="flex items-center gap-2 bg-muted rounded-lg">
            <Button
              variant={"ghost"}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground mx-2">
              {page + 1} / {Math.max(1, totalPages)}
            </span>
            <Button
              variant={"ghost"}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={!!selectedJson}
        onClose={() => setSelectedJson(null)}
        title={`Data Payload: ${selectedJson?.title}`}
        description="This specific field collected deeply nested JSON data or an array."
      >
        <div className="mt-4 rounded-lg bg-zinc-950 px-5 py-4 border overflow-auto max-h-[400px]">
          <pre className="text-[13px] text-emerald-400 font-mono leading-relaxed">
            {selectedJson ? JSON.stringify(selectedJson.data, null, 2) : ""}
          </pre>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={() => setSelectedJson(null)} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Close JSON Viewer
          </button>
        </div>
      </Modal>
    </div>
  )
}
