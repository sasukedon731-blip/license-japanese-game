"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import LockedFeature from "@/app/components/LockedFeature"
import { useAuth } from "@/app/lib/useAuth"
import { assertActiveAccess } from "@/app/lib/guards"
import { loadAndRepairUserPlanState } from "@/app/lib/userPlanState"
import { parseQuizType } from "@/app/lib/quizTypeGuard"
import { getQuizByType } from "@/app/lib/getQuizByType"
import type { QuizType } from "@/app/data/types"

export default function QuizPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading } = useAuth()

  const quizType = useMemo(() => parseQuizType(params.get("type")), [params])
  const quiz = useMemo(() => (quizType ? getQuizByType(quizType) : null), [quizType])

  const [stateLoaded, setStateLoaded] = useState(false)
  const [allowed, setAllowed] = useState<QuizType[] | null>(null)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const [billingStatus, setBillingStatus] = useState<"trialing" | "pending" | "active" | "past_due" | "canceled" | "inactive">("inactive")

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    setStateLoaded(false)
    setAllowed(null)

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
        console.error("quiz page load failed:", e)
        if (!alive) return
        setAllowed([])
      } finally {
        if (!alive) return
        setStateLoaded(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [loading, router, user])

  if (loading || !stateLoaded) {
    return <div className="p-4">Loading...</div>
  }

  if (!user) return null

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

  if (!quizType || !quiz) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          教材情報を読み取れませんでした。教材一覧からやり直してください。
        </div>
      </div>
    )
  }

  if (!allowed || allowed.length === 0 || !allowed.includes(quizType)) {
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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">教材モード選択</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          学び方を選んでください。通常学習、模擬試験、復習モードに進めます。
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ModeLink href={`/normal?type=${encodeURIComponent(quizType)}`} title="通常" description="基礎を固める" />
          <ModeLink href={`/exam?type=${encodeURIComponent(quizType)}`} title="模擬試験" description="本番形式で学ぶ" />
          <ModeLink href={`/review?type=${encodeURIComponent(quizType)}`} title="復習" description="苦手をやり直す" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/select-mode" className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            学習選択へ戻る
          </Link>
          <Link href="/contents" className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            教材一覧へ戻る
          </Link>
        </div>
      </div>
    </main>
  )
}

function ModeLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
    >
      <div className="text-base font-bold text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{description}</div>
    </Link>
  )
}
