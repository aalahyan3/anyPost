import React from 'react'
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("font-serif tracking-tight", className)}>
      Any<span className="italic text-primary">Post</span>
    </div>
  )
}
