"use client"

import { useUser } from "@/context/user-provider"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s going on in your workspace.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Projects", value: 0 },
          { label: "Active Forms", value: 0 },
          { label: "Total Submissions", value: 0 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-1"
          >
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-3xl font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}