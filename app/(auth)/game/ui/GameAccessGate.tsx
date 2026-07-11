"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/app/lib/useAuth"
import { assertActiveAccess } from "@/app/lib/guards"

export default function GameAccessGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setChecked(false)
    setAllowed(false)

    ;(async () => {
      const gate = await assertActiveAccess(user.uid)
      if (!alive) return
      if (!gate.ok) {
        router.replace("/plans")
        return
      }
      setAllowed(true)
      setChecked(true)
    })().catch(() => {
      if (!alive) return
      router.replace("/plans")
    })

    return () => {
      alive = false
    }
  }, [loading, router, user])

  if (loading || !user || !checked || !allowed) return null
  return <>{children}</>
}
