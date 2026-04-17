"use client"

import React from "react";
import { useUser } from "@/context/user-provider";

function Page() {
  const { user, loading, refreshUser } = useUser();

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-2">
          <svg className="h-8 w-8 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-muted-foreground animate-pulse">Loading user profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome home</h1>
          <p className="text-sm text-muted-foreground">Manage your settings and preferences.</p>
        </div>
        <button
          type="button"
          onClick={refreshUser}
          className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">Your Profile</h3>
          <p className="text-sm text-muted-foreground">The data fetched successfully from your backend.</p>
        </div>
        <div className="p-6 pt-0">
          <pre className="overflow-auto rounded-md bg-muted p-4 text-sm mt-4 text-muted-foreground">
            {user ? JSON.stringify(user, null, 2) : "No user session found."}
          </pre>
        </div>
      </section>
    </main>
  );
}

export default Page;