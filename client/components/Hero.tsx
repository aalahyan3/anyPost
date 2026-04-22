import { ArrowRight, BookOpenText } from "lucide-react"
import Image from "next/image"
import React from "react"
import { Button } from "./ui/button"
import Link from "next/link"

function Hero() {
  return (
    <div className="mx-auto grid w-full  gap-8 px-4 py-16 sm:gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:py-20 lg:px-8">
      <div className="order-2 flex w-full max-w-xl flex-col gap-8 md:order-1">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium tracking-tight leading-[1.1] sm:text-5xl md:text-6xl">
            The{" "}
            <span className="relative inline-block">
              ultimate
              <svg
                viewBox="0 0 110 12"
                className="absolute left-0 -bottom-1 w-full overflow-visible"
                style={{ height: "10px", stroke: "var(--primary)" }}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2,6 C18,2 36,10 55,5 C74,1 92,9 108,4"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            solution for developers
          </h1>
          <p className="text-base leading-relaxed text-foreground/60 max-w-[44ch]">
            Collect form submissions on any static site or frontend framework.
            Point your POST request to a unique endpoint and manage your data
            in a clean, real-time dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            className="h-10 gap-2 rounded-xl  p-6 text-sm"
            disabled
          >
            <BookOpenText className="h-4 w-4" />
            Read docs
          </Button>
          <Button className="h-10 gap-2 rounded-xl  p-6 text-sm" asChild>
            <Link href={"/dashboard"}>

              Get started
              <ArrowRight className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="order-1 flex w-full items-center justify-center md:order-2">
        <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d1117] shadow-2xl">

          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-4 py-3">
            <div className="h-[11px] w-[11px] rounded-full bg-[#ff5f56]" />
            <div className="h-[11px] w-[11px] rounded-full bg-[#ffbd2e]" />
            <div className="h-[11px] w-[11px] rounded-full bg-[#27c93f]" />
            <div className="ml-3 flex items-center gap-1.5">
              <span className="rounded px-1.5 py-0.5 font-mono text-[11px] font-medium"
                style={{ background: "rgba(99,210,166,0.15)", color: "#63d2a6" }}>
                POST
              </span>
              <span className="font-mono text-[11px] text-white/30">
                https://api.anypost.dev/f/ff_1234567890abcdef
              </span>
            </div>
          </div>

          {/* Code body */}
          <div className="p-6 font-mono text-sm leading-relaxed">
            <span className="text-white/35">{"{"}</span>
            <div className="pl-5">
              <span style={{ color: "#79b8ff" }}>"email"</span>
              <span className="text-white/30">: </span>
              <span style={{ color: "#9ecbff" }}>"dev@example.com"</span>
              <span className="text-white/25">,</span>
            </div>
            <div className="pl-5">
              <span style={{ color: "#79b8ff" }}>"message"</span>
              <span className="text-white/30">: </span>
              <span style={{ color: "#9ecbff" }}>"AnyPost is amazing!"</span>
              <span className="text-white/25">,</span>
            </div>
            <span className="text-white/35">{"}"}</span>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-2.5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
              <span className="font-mono text-[11px] text-white/30">200 OK</span>
              <span className="font-mono text-[11px] text-white/15">·</span>
              <span className="font-mono text-[11px] text-white/30">48ms</span>
            </div>
            <span className="font-mono text-[11px] text-white/20">application/json</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero
