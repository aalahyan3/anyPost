"use client"

import { useEffect, useState } from "react"
import { SubmissionType } from "@/app/lib/types"
import { api } from "@/app/lib/api"
import { ArrowLeft, ArrowRight, CurlyBraces, Inbox, RefreshCcw, ServerCrash, TrashIcon, X } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import type { FormMetadata } from "./submissions-overview"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"


function DataJsonExpaner({ json, column }: { json: any, column: string }) {
  return (
    <DialogContent className="w-fit max-w-[90vw] max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Data Payload: {column}</DialogTitle>
      </DialogHeader>

      <div className="p-4 rounded overflow-auto flex-1 bg-muted">
        <pre className="text-xs whitespace-pre-wrap break-all">
          {JSON.stringify(json, null, 2)}
        </pre>
      </div>
      <div className="flex gap-2 items-center justify-end">
        <Button onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(json, null, 2))
          toast.info("Copied to clipboard")
        }}>
          Copy
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  )

}


export function SubmissionsTable({
  projectId,
  formId,
  metadata,
  refreshToken,
}: {
  projectId: string
  formId: string
  metadata: FormMetadata | null
  refreshToken: number
}) {
  const [submissions, setSubmissions] = useState<SubmissionType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc")
  const [refreshTrigger, setRefreshTrigger] = useState(0)


  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false);

  function addToSelectedSubmissions(id: string) {
    setSelectedSubmissions((prev) => [...prev, id])
  }

  function removeFromSelectedSubmissions(id: string) {
    setSelectedSubmissions((prev) => prev.filter((submission) => submission !== id))
  }

  function selectAllSubmissions() {
    setSelectedSubmissions((prev) => {
      if (prev.length === submissions.length) {
        return []
      }
      return submissions.map((submission) => submission.id)
    })
  }


  async function handleSelectionDeletion() {
    try {
      setDeleting(true)
      await api.delete(`/api/v1/projects/${projectId}/forms/${formId}/submissions`, {
        data: {
          ids: selectedSubmissions
        }
      })
      toast.success("Submissions deleted successfully")
      setSelectedSubmissions([])
      setPage(0)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error: any) {
      console.log(error?.response?.data?.message);

      toast.error(error?.response?.data?.message || "Failed to delete submissions")
    } finally {
      setDeleting(false)
    }
  }




  // const [selectedJson, setSelectedJson] = useState<{ title: string; data: any } | null>(null)

  useEffect(() => {
    // whenever thr form id or project id Change, the page go back to 1 (which is 0 lol)
    setPage(0)
  }, [projectId, formId])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    api
      .get(`/api/v1/projects/${projectId}/forms/${formId}/submissions?size=${pageSize}&page=${page}&sort=${orderDir}`)
      .then((res) => {
        if (!mounted) return

        const apiData = res.data?.data ?? res.data

        if (apiData?.content !== undefined) {
          console.log("API returned paginated response:", apiData);

          setSubmissions(Array.isArray(apiData.content) ? apiData.content : [])
          setTotalElements(apiData.totalElements || 0)
          setTotalPages(apiData.totalPages || 1)
          return
        }

        setSubmissions(Array.isArray(apiData) ? apiData : [])
        setTotalElements(Array.isArray(apiData) ? apiData.length : 0)
        setTotalPages(1)
      })
      .catch((err: any) => {
        if (!mounted) return
        setError(err.message || "Failed to load submissions")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [projectId, formId, page, pageSize, refreshToken, orderDir, refreshTrigger])

  const allColumns = metadata?.fields ?? []

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Submissions</h2>
        <div className="flex justify-center gap-6 p-12 border rounded-xl bg-card">
          <h3 className="text-muted-foreground animate-pulse">Loading submissions...</h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Submissions</h2>
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 sm:p-10 text-sm text-destructive/90 flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-col items-center text-center gap-2">
            <ServerCrash size={56} />
            <h3 className="text-xl font-bold">Can't load submissions for now</h3>
          </div>
          <span className="w-full max-w-xl text-foreground bg-muted/30 p-3 rounded-lg text-center break-words">
            {error}
          </span>
          <Button variant="outline" disabled={loading} onClick={() => {
            document.getElementById("SubmissionOverViewHandleRefrechButton")?.click();
          }}>
            <RefreshCcw className={`size-4`} />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Submissions
          <span className="text-muted-foreground text-sm font-normal ml-2">
            ({metadata?.totalSubmissions ?? totalElements})
          </span>
        </h2>
      </div>

      <div className="p-1 flex gap-4 items-center">
        <div>
          <label htmlFor="orderDir" className="text-sm font-medium text-foreground/70">Sort Type</label>
          <Select defaultValue={orderDir} onValueChange={(value) => setOrderDir(value as "asc" | "desc")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-2">
              {["asc", "desc"].map((dir) =>
                <SelectItem key={dir} value={dir}> {dir === "asc" ? "Oldest first" : "Newest first"}</SelectItem>
              )}
            </SelectContent>

          </Select>
        </div>
        <div>
          <label htmlFor="orderDir" className="text-sm font-medium text-foreground/70">Page size</label>
          <Select defaultValue={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-2">
              {[10, 20, 50, 100].map((size) =>
                <SelectItem key={size} value={size.toString()}> {size}</SelectItem>
              )}
            </SelectContent>

          </Select>
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
                <tr >
                  <th className="px-6 py-4 whitespace-nowrap"> <Input className="text-destructive/70  block w-6 mx-auto" type="checkbox" onChange={() => selectAllSubmissions()} checked={selectedSubmissions.length === submissions.length} /> </th>
                  <th className="px-6 py-4 whitespace-nowrap">Received</th>
                  {allColumns.map((column) => (
                    <th key={column} className="px-6 py-4 whitespace-nowrap">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-foreground">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-muted/30 transition-colors group" onClick={() => {
                    if (selectedSubmissions.includes(submission.id)) {
                      removeFromSelectedSubmissions(submission.id)
                    } else {
                      addToSelectedSubmissions(submission.id)
                    }
                  }}>
                    <td className="px-6 py-3.5 font-medium whitespace-nowrap text-xs" onClick={(e) => e.stopPropagation()}>
                      <Input checked={selectedSubmissions.includes(submission.id)} onChange={(e) => {
                        if (e.target.checked) {
                          addToSelectedSubmissions(submission.id)
                        } else {
                          removeFromSelectedSubmissions(submission.id)
                        }
                      }} className="text-destructive/70  block w-6 mx-auto" type="checkbox" />
                    </td>
                    <td className="px-6 py-3.5 font-medium whitespace-nowrap text-xs">
                      {new Date(submission.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    {allColumns.map((column) => {
                      const value = submission.data?.[column]

                      if (value === undefined || value === null) {
                        return (
                          <td key={column} className="px-6 py-3.5 text-muted-foreground/60 text-xs font-mono  italic">
                            -
                          </td>
                        )
                      }

                      if (typeof value === "object") {
                        return (
                          <td key={column} className="px-6 py-3.5 whitespace-nowrap">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  size={"sm"}
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-primary/70! text-primary/80"
                                >
                                  <CurlyBraces className="size-3" />
                                </Button>
                              </DialogTrigger>

                              <DataJsonExpaner json={value} column={column} />

                            </Dialog>

                          </td>
                        )
                      }

                      return (
                        <td key={column} className="px-6 py-3.5 max-w-60 truncate text-sm" title={String(value)}>
                          {String(value)}
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
            <Button variant={"ghost"} onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}>
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground mx-2">
              {page + 1} / {Math.max(1, totalPages)}
            </span>
            <Button
              variant={"ghost"}
              onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
              disabled={page >= totalPages - 1}
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {
        selectedSubmissions.length > 0 && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300"
          >
            <div className="relative bg-background/80 backdrop-blur-xl border border-border/50 px-6 py-4 rounded-2xl  flex items-center gap-5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
                </span>
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold tabular-nums">{selectedSubmissions.length}</span>
                  <span className="text-muted-foreground ml-1">selected</span>
                </p>
              </div>
              <div className="w-px h-6 bg-border/60" />
              <div className="flex items-center gap-2">
                <Button disabled={deleting} onClick={() => setSelectedSubmissions([])} variant={"ghost"} size={"sm"} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" /> Cancel
                </Button>
                <Button disabled={deleting} onClick={handleSelectionDeletion} variant={"destructive"} size={"sm"} className="shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]">
                  <TrashIcon className="size-3.5" />{deleting ? "Deleting..." : "Delete All"}
                </Button>
              </div>
            </div>
          </div>
        )
      }

    </>
  )
}
