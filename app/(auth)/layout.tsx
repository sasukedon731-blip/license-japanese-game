"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/useAuth"
import { ensureUserProfile } from "@/app/lib/firestore"
import { loadAndRepairUserPlanState } from "@/app/lib/userPlanState"
import AchievementUnlockViewport from "@/app/components/achievements/AchievementUnlockViewport"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stateLoaded, setStateLoaded] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setStateLoaded(false)

    ;(async () => {
      try {
        await ensureUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })

        await loadAndRepairUserPlanState(user.uid)
      } catch (e) {
        console.error("AuthLayout init failed:", e)
      } finally {
        if (alive) setStateLoaded(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [loading, router, user])

  if (loading) return <p style={{ textAlign: "center" }}>読み込み中...</p>
  if (!user) return null
  if (!stateLoaded) return <p style={{ textAlign: "center" }}>読み込み中...</p>

  return <><>{children}</><AchievementUnlockViewport /></>
}
