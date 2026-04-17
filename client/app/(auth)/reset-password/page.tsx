"use client"

import { useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { AuthCard } from "../verify-email/page"
import { Lock, RotateCcw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      setSuccess(false)
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long")
      setSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
        {
          token,
          new_password: password,
        }
      )

      if (res.status === 200) {
        setMessage(
          "Password reset successful! You can now log in with your new password."
        )
        setSuccess(true)
        setPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "An unexpected error occurred.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <AuthCard
          icon={<XCircle className="h-6 w-6 text-destructive" />}
          iconBg="bg-destructive/10"
          title="Invalid link"
          description="The password reset link is invalid. Please request a new one."
        >
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">
              <RotateCcw className="mr-2 h-4 w-4" /> Request new password reset
              link
            </Link>
          </Button>
        </AuthCard>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <AuthCard
        icon={<Lock className="h-4 w-4" />}
        iconBg="bg-primary/10"
        title="Reset Password"
        description="Reset your password by entering a new one below."
      >
        {message && (
          <div
            className={`mb-6 rounded-md border p-4 ${
              success
                ? "border-green-500/20 bg-green-500/15 text-green-700 dark:text-green-400"
                : "border-red-500/20 bg-red-500/15 text-red-700 dark:text-red-400"
            }`}
          >
            <span className="mb-1 block font-medium">
              {success ? "Success" : "Error"}
            </span>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || success}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="mt-4 space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || success}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {!success && (
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isLoading || password !== confirmPassword}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          )}

          {success && (
            <Button asChild className="mt-6 w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
        </form>
      </AuthCard>
    </main>
  )
}