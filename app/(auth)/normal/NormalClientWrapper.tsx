"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/useAuth"
import { loadAndRepairUserPlanState } from "@/app/lib/userPlanState"
import { assertActiveAccess } from "@/app/lib/guards"
import { parseQuizType } from "@/app/lib/quizTypeGuard"
import { getQuizByType } from "@/app/lib/getQuizByType"
import NormalClient from "./NormalClient"
import type { QuizType } from "@/app/data/types"
import LockedFeature from "@/app/components/LockedFeature"

export default function NormalClientWrapper() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading } = useAuth()

  // URL param -> QuizType（不正なら null）
  const quizType = useMemo(() => parseQuizType(params.get("type")), [params])

  // Quizデータ取得（存在しなければ null）
  const quiz = useMemo(() => (quizType ? getQuizByType(quizType) : null), [quizType])

  // 今月の受講教材（selectedQuizTypes）
  const [allowed, setAllowed] = useState<QuizType[] | null>(null)
  const [stateLoaded, setStateLoaded] = useState(false)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const [billingStatus, setBillingStatus] = useState<"trialing" | "pending" | "active" | "past_due" | "canceled" | "inactive">("inactive")

  // ① user の plan state を読み込み（＋自動修復）
  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setAllowed(null)
    setStateLoaded(false)

    ;(async () => {
      try {
        setAccessBlocked(false)
        const gate = await assertActiveAccess(user.uid)
        setBillingStatus(gate.billingStatus)
        if (!gate.ok) {
          setAccessBlocked(true)
          setAllowed([])
          return
        }
        const st = await loadAndRepairUserPlanState(user.uid)
        if (!alive) return
        setAllowed((st.selectedQuizTypes ?? []) as QuizType[])
      } catch (e) {
        console.error("loadAndRepairUserPlanState failed:", e)
        if (!alive) return
        setAllowed([]) // 読めなかったら安全側（選択画面へ）
      } finally {
        if (!alive) return
        setStateLoaded(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [loading, user?.uid, router, user])

  // ② ガード（事故ゼロ）
  useEffect(() => {
    if (loading) return
    if (!user) return
    if (!stateLoaded) return
    if (allowed === null) return

    // (A) type が無い/不正 → hubへ
    if (!quizType) {
      router.replace("/select-mode")
      return
    }

    // (B) quizデータが無い（IDズレ等） → hubへ
    if (!quiz) {
      router.replace("/select-mode")
      return
    }

    // (C) 今月の受講教材が空 → 選択へ
    if (allowed.length === 0) {
      router.replace("/select-quizzes")
      return
    }

    // (D) 未選択教材へ直リンク → hubへ（選択済み一覧を見せる）
    if (!allowed.includes(quizType)) {
      router.replace("/select-mode")
      return
    }
  }, [loading, user, stateLoaded, allowed, quizType, quiz, router])

  
  // ③ 画面描画ガード
  if (loading) return null
  if (!user) return null
  if (!stateLoaded) return null
  if (accessBlocked) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <div style={{ padding: 14, borderRadius: 16, border: "1px solid #f59e0b", background: "#fffbeb" }}>
          <div style={{ fontWeight: 900 }}>利用開始にはお支払い手続きが必要です</div>
          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
            状態：<b>{billingStatus}</b>（コンビニ払いは入金確認後に利用可能になります）
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/plans")}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #111", background: "#111", color: "white", fontWeight: 900 }}
            >
              プラン / 支払いへ
            </button>
            <button
              onClick={() => router.push("/mypage")}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", fontWeight: 800 }}
            >
              マイページへ
            </button>
          </div>
        </div>
      </div>
    )
  }
  if (allowed === null) return null
  if (!quizType) return null
  if (!quiz) return null
  if (!allowed.includes(quizType)) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <LockedFeature
          title={quiz.title}
          description="この教材は有料プランで選択すると利用できます。無料ユーザーは日本語バトルを1日1回利用できます。"
          onClickPlan={() => router.push("/plans")}
        />
      </div>
    )
  }

  return <NormalClient quiz={quiz} />
}
