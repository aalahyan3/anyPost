"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import Link from "next/link"
import React, { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
        { email }
      )
    } catch (err) {
    } finally {
      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      )
      setIsLoading(false)
      setEmail("")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <section className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-background/80 p-8 shadow-xl backdrop-blur-md">
        <div className="mb-8 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-md bg-green-500/15 p-4 text-green-700 dark:text-green-400 border border-green-500/20">
            <span className="block font-medium mb-1">Status</span>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send email"}
            </Button>
          </div>
        </form>

        <Button variant="link" className="mt-4 w-full text-foreground/70" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </section>
    </main>
  )
}