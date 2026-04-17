"use client"
import { login, LoginState } from "@/app/(auth)/login/action"
import { signup } from "@/app/(auth)/signup/action"
import { useRouter } from "next/navigation"

import React, { useActionState, useEffect, useRef, useState } from "react"


const initialState: LoginState = {
  message: "",
  success: false,
}

function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState)
  const alertRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter();

  useEffect(() => {
    if (state.message && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [state.message])

  useEffect(() => {
    if (state.success) {
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      router.push("/verify-email?type=notify")
    }
  }, [state.success])

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          ref={alertRef}
          role="alert"
          aria-live="polite"
          className={`flex animate-in items-start gap-3 rounded-lg border px-4 py-3 text-sm duration-300 fade-in slide-in-from-top-1 ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          } `}
        >
          <span>{state.message}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <a
            href="/forgot-password"
            tabIndex={isPending ? -1 : 0}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
          Confirm password
        </label>
        <div>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="current-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            disabled={isPending}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="relative inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <span
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/15 to-transparent"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              Signing up…
            </span>
          </>
        ) : (
          "Sign up"
        )}
      </button>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </form>
  )
}

export default SignUpForm
