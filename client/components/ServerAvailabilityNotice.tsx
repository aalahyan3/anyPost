"use client"


import axios from 'axios'
import { ServerCrash } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function ServerAvailabilityNotice() {
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/health`)
        if (!mounted) return
        setAvailable(res.status === 200)
      } catch (e) {
        if (!mounted) return
        setAvailable(false)
      }
    }
    check()
    return () => {
      mounted = false
    }
  }, [])

  if (available === null) return null
  if (available === false) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-amber-500/10 font-mono uppercase border-amber-500/30 text-amber-500 rounded-lg p-2 mt-2  text-center text-sm border-dotted border-2"
      >
        The server is not available for the moment. I'm so sorry about that 🙏
      </div>
    )
  }

  return null
}

export default ServerAvailabilityNotice