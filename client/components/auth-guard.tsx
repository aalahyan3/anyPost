"use client"

import { useUser } from "@/context/user-provider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && !user) {
      const query = searchParams.toString()
      const nextPath = `${pathname}?${query ? `${query}&` : ""}guard=authguard`
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`)
    }
  }, [user, loading, router, pathname, searchParams])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <svg className="h-8 w-8 animate-spin text-primary/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
