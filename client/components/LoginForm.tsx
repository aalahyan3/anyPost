"use client"
import { login, LoginState } from "@/app/(auth)/login/action"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useActionState, useState, useEffect, useRef, useMemo } from "react"
import { toast } from "sonner"
import { useUser } from "@/context/user-provider"



const initialState: LoginState = {
  message: "",
  success: false,
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(login, initialState)
  const alertRef = useRef<HTMLDivElement>(null)
  const { refreshUser } = useUser()
  const router = useRouter();
  // Scroll the status message into view when it appears


  const searchParams = useSearchParams();

  const redirectTo = useMemo(()=> {
    const next = searchParams.get("next");

    if (!next || typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
      return "/home";
    }
    
    return next;
  }, [searchParams])

  useEffect(() => {
    if (state.message && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [state.message])



  useEffect(() => {
    if (state.success) {
      refreshUser()
        .catch(() => {
          // If whoami fails unexpectedly, still attempt redirect.
        })
        .finally(() => {
          toast.info(`redirected to ${redirectTo}...`);
          router.push(redirectTo)
        })
    }
  }, [state.success, redirectTo, refreshUser, router])

  return (
    <form action={formAction} className="space-y-4">
      {/* Status Banner */}
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
          {/* Icon */}
          <span className="mt-0.5 shrink-0">
            {state.success ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </span>
          <span>{state.message}</span>
        </div>
      )}

      {/* Email */}
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
          required
          disabled={isPending}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Password */}
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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            minLength={8}
            disabled={isPending}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="relative inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent"
              aria-hidden="true"
            />
            {/* Spinner + label */}
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
              Signing in…
            </span>
          </>
        ) : (
          "Sign in"
        )}
      </button>

      {/* Shimmer keyframe — inject once via a style tag */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </form>
  )
}

export default LoginForm
