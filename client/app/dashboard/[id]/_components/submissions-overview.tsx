"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/app/lib/api"
import { Download, Inbox, Key, RefreshCcw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmissionsChart } from "./submissions-chart"
import { SubmissionsTable } from "./submissions-table"

export type FormMetadata = {
  fields: string[]
  lastPulse: string | null
  totalSubmissions: number
  firstSubmission: string | null
  activeForm: boolean
}

export function SubmissionsOverview({
  projectId,
  formId,
}: {
  projectId: string
  formId: string
}) {
  const [metadata, setMetadata] = useState<FormMetadata | null>(null)
  const [metadataLoading, setMetadataLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    let mounted = true
    setMetadataLoading(true)
    setError(null)

    api
      .get(`/api/v1/projects/${projectId}/forms/${formId}/submissions/metadata`)
      .then((res) => {
        if (!mounted) return
        setMetadata(res.data?.data ?? res.data)
      })
      .catch((err: any) => {
        if (!mounted) return
        setError(err.message || "Failed to load metadata")
      })
      .finally(() => {
        if (mounted) setMetadataLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [projectId, formId, refreshToken])

  const allColumns = metadata?.fields ?? []

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

  const handleRefresh = () => {
    if (metadataLoading || refreshing) return
    setRefreshing(true)
    setMetadataLoading(true)
    setRefreshToken((v) => v + 1)
  }

  useEffect(() => {
    if (!refreshing) return
    if (metadataLoading) return
    setRefreshing(false)
  }, [refreshing, metadataLoading])

  if (metadataLoading) {
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
          id="SubmissionOverViewHandleRefrechButton"
          variant={"outline"}
          size={"sm"}
          onClick={handleRefresh}
          disabled={metadataLoading || refreshing}
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
              <span className="text-2xl font-bold tracking-tight">{metadata?.totalSubmissions ?? 0}</span>
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
            disabled={exporting || (metadata?.totalSubmissions ?? 0) === 0}
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

      <SubmissionsTable
        projectId={projectId}
        formId={formId}
        metadata={metadata}
        refreshToken={refreshToken}
      />
    </div>
  )
}
