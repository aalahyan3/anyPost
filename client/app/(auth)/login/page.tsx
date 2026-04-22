import LoginForm from '@/components/LoginForm'
import Link from 'next/link'
import React, { Suspense } from 'react'

function page() {
  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6'>
      {/* Subtle background blobs */}
      {/* <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl' /> */}
      {/* <div className='pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl' /> */}

      <section className='relative w-full max-w-sm rounded-2xl border border-border/50 bg-background/80 p-8 shadow-xl backdrop-blur-md'>
        {/* Header */}
        <div className='mb-8 space-y-1'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground'>Welcome back</h2>
          <p className='text-sm text-muted-foreground'>Sign in to your AnyPost account</p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <div className='mt-6 text-center text-sm text-muted-foreground'>
          <span>Don&apos;t have an account? </span>
          <Link
            href='/signup'
            className='font-medium text-foreground underline-offset-4 transition-colors hover:underline'
          >
            Create one
          </Link>
        </div>
      </section>
    </main>
  )
}

export default page