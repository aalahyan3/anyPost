"use client"

import { useEffect, useState, useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { api } from "@/app/lib/api"

type TrendPoint = {
  date: string
  label: string
  count: number
}

type TrendResponse = {
  range: string
  timezone: string
  points: TrendPoint[]
  total: number
}

export function SubmissionsChart({ projectId, formId }: { projectId: string; formId: string }) {
  const [trend, setTrend] = useState<TrendResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    api.get(`/api/v1/projects/${projectId}/forms/${formId}/submissions/trend`)
      .then((res) => {
        if (!mounted) return
        setTrend(res.data?.data ?? res.data)
      })
      .catch(() => {
        // silently fail – chart just won't render
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [projectId, formId])

  const chartData = useMemo(() => {
    if (!trend?.points) return []
    return trend.points.map((point) => ({
      name: point.label,
      submissions: point.count
    }))
  }, [trend])

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-center min-h-[180px]">
        <svg className="h-5 w-5 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!trend || chartData.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-center min-h-[180px]">
        <p className="text-sm text-muted-foreground">No trend data available.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
      <div className="mb-4 flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold tracking-tight">Last 7 Days</h2>
        <p className="text-xs text-muted-foreground">Submission activity over the past week.</p>
      </div>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="submissionsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)" }}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="linear"
              dataKey="submissions"
              name="Submissions"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#submissionsFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: "var(--primary)" }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
