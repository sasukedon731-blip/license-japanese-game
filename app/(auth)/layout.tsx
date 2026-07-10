// app/(auth)/layout.tsx
"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/useAuth"
import { ensureUserProfile } from "@/app/lib/firestore"
import { loadAndRepairUserPlanState } from "@/app/lib/userPlanState"
import AchievementUnlockViewport from "@/app/components/achievements/AchievementUnlockViewport"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const [stateLoaded, setStateLoaded] = useState(false)
  const [selectedLen, setSelectedLen] = useState(0)

  const isSelectQuizzes = pathname === "/select-quizzes"
  const isAdmin = pathname.startsWith("/admin")
  // ✅ ゲームは「無料体験（未ログインOK）」を許可する
  const isGame = pathname === "/game"

  // ✅ 重要：ルートが変わるたびに state を読み直す（保存直後の反映が遅れない）
  useEffect(() => {
    if (loading) return

    // ✅ /game は未ログインでも表示（ゲスト制限はゲーム側で制御）
    if (isGame && !user) {
      setStateLoaded(true)
      setSelectedLen(0)
      return
    }

    // 未ログインは login
    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setStateLoaded(false)

    ;(async () => {
      try {
        // users/{uid} を確実に作成
        await ensureUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })

        // ✅ plan/selected を自動修復込みで取得
        const st = await loadAndRepairUserPlanState(user.uid)
        if (!alive) return
        setSelectedLen((st.selectedQuizTypes ?? []).length)
      } catch (e) {
        console.error("AuthLayout init failed:", e)
      } finally {
        if (!alive) return
        setStateLoaded(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [user, user?.uid, user?.email, user?.displayName, loading, pathname, router, isGame])

  // ✅ 重要：redirect は render 中にしない（ループ防止）
  useEffect(() => {
    if (loading) return
    if (!user) return
    if (!stateLoaded) return

    // ✅ /game は受講教材チェック不要
    if (isGame) return

    // 受講教材が未選択なら強制的に選択へ（select-quizzes / admin は除外）
    if (!isSelectQuizzes && !isAdmin && selectedLen === 0) {
      router.replace("/select-quizzes")
    }
  }, [loading, user, stateLoaded, selectedLen, isSelectQuizzes, isAdmin, isGame, router])

  if (loading) return <p style={{ textAlign: "center" }}>読み込み中…</p>
  // ✅ /game は未ログインOK
  if (!user && !isGame) return null

  if (!user && isGame) return <><>{children}</><AchievementUnlockViewport /></>

  if (!stateLoaded) return <p style={{ textAlign: "center" }}>読み込み中…</p>

  if (isSelectQuizzes || isAdmin) {
    return <><>{children}</><AchievementUnlockViewport /></>
  }

  if (selectedLen === 0) return null

  return <><>{children}</><AchievementUnlockViewport /></>
}
