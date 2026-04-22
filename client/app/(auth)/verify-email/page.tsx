"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import { ArrowLeft, CheckCircle, Clock, Loader2, MailCheck, RotateCcw, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export function AuthCard({
  icon,
  iconBg,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="w-full max-w-[440px] rounded-xl border border-border/20 bg-foreground/5 p-10 shadow-sm">
      <div className="mb-5 flex justify-center">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
      <h1 className="mb-3 text-center text-2xl font-medium">{title}</h1>
      <p className="mb-8 text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children && <div className="flex flex-col gap-2.5">{children}</div>}
    </div>
  )
}

function Notify() {
  return (
    <AuthCard
      icon={<MailCheck className="h-6 w-6 text-primary" />}
      iconBg="bg-primary/10"
      title="Check your email"
      description="We sent a verification link to your email address. Click the link to verify. Don't forget to check your spam folder if you can't find it."
    >
      <Button asChild className="w-full">
        <Link href="/login">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </Button>
      <Button disabled variant="outline" className="w-full">
        <RotateCcw className="h-4 w-4" /> Didn't receive it? Resend email
      </Button>
    </AuthCard>
  )
}

function Verify({ token }: { token: string }) {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [info, setInfo] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,
          { token }
        )
        setStatus(res.status === 200 ? "success" : "error")
        setInfo(res.data.message || "")
      } catch (error: any) {
        setInfo(error.response?.data?.message || "An unexpected error occurred.")
        setStatus("error")
      }
    }
    verifyEmail()
  }, [token])

  if (status === "verifying") {
    return (
      <AuthCard
        icon={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        iconBg="bg-muted"
        title="Verifying your email"
        description="Please wait while we verify your email address. This should only take a moment."
      />
    )
  }

  if (status === "success") {
    return (
      <AuthCard
        icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
        iconBg="bg-emerald-500/10"
        title="Email verified"
        description={info || "Your email has been successfully verified. You can now sign in."}
      >
        <Button asChild className="w-full">
          <Link href="/login">Continue to login</Link>
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      icon={<XCircle className="h-6 w-6 text-destructive" />}
      iconBg="bg-destructive/10"
      title="Verification failed"
      description={info || "This link has expired or is invalid. Please request a new verification email."}
    >
      {/* <Button asChild className="w-full">
        <Link href="/login?resend=true">
          <RotateCcw className="h-4 w-4" /> Resend verification email
        </Link>
      </Button> */}
      <Button asChild variant="outline" className="w-full">
        <Link href="/login">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </Button>
    </AuthCard>
  )
}

function SessionExpired() {
  return (
    <AuthCard
      icon={<Clock className="h-6 w-6 text-amber-600" />}
      iconBg="bg-amber-500/10"
      title="Session expired"
      description="Your verification session has expired. Please sign in again to request a new link."
    >
      <Button asChild className="w-full">
        <Link href="/login">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </Button>
    </AuthCard>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const type = searchParams.get("type")

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      {type === "notify" ? (
        <Notify />
      ) : token ? (
        <Verify token={token} />
      ) : (
        <SessionExpired />
      )}
    </main>
  )
}

export default function VerifyEmailClient() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}