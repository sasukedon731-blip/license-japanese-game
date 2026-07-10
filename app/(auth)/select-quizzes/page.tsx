"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/app/lib/firebase"
import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"
import { getSelectLimit, type PlanId } from "@/app/lib/plan"
import {
  loadAndRepairUserPlanState,
  saveSelectedQuizTypesWithLock,
} from "@/app/lib/userPlanState"
import AppHeader from "@/app/components/AppHeader"

function canChange(now: Date, nextAllowedAt?: Date | null) {
  if (!nextAllowedAt) return true
  return now.getTime() >= nextAllowedAt.getTime()
}

function formatDate(d: Date) {
  return d.toLocaleDateString("ja-JP")
}

export default function SelectQuizzesPage() {
  const router = useRouter()
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState<PlanId>("trial")
  const [entitled, setEntitled] = useState<QuizType[]>([])
  const [selected, setSelected] = useState<QuizType[]>([])
  const [nextAllowedAt, setNextAllowedAt] = useState<Date | null>(null)
  const [devUnlockAll, setDevUnlockAll] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login")
        return
      }
      setUid(user.uid)
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    ;(async () => {
      if (!uid) return
      setLoading(true)
      setError("")
      try {
        const state = await loadAndRepairUserPlanState(uid)
        setPlan(state.plan)
        setEntitled(state.entitledQuizTypes)
        setSelected(state.selectedQuizTypes)
        setNextAllowedAt(state.nextChangeAllowedAt)
        setDevUnlockAll((state as any)?.devUnlockAll === true)
      } catch (e) {
        console.error(e)
        setError("教材情報の読み込みに失敗しました")
      } finally {
        setLoading(false)
      }
    })()
  }, [uid])

  const limit = useMemo(() => (devUnlockAll ? "ALL" : getSelectLimit(plan)), [plan, devUnlockAll])
  const maxCount = limit === "ALL" ? entitled.length : limit
  const editable = devUnlockAll || canChange(new Date(), nextAllowedAt)
  const list = useMemo(
    () =>
      entitled
        .filter((id) => quizzes[id])
        .map((id) => ({ id, quiz: quizzes[id] })),
    [entitled]
  )

  const toggle = (id: QuizType) => {
    if (!editable) return
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (limit !== "ALL" && prev.length >= maxCount) return prev
      return [...prev, id]
    })
  }

  const handleSave = async () => {
    if (!uid) return
    setSaving(true)
    setError("")
    try {
      if (!devUnlockAll) {
        await saveSelectedQuizTypesWithLock({ uid, selectedQuizTypes: selected })
      }
      router.replace("/select-mode")
    } catch (e) {
      console.error(e)
      setError("保存に失敗しました")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <AppHeader title="教材を選ぶ" />
          <section style={styles.card}>読み込み中...</section>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="教材を選ぶ" />

        <section style={styles.summary}>
          <div style={styles.summaryTitle}>
            プラン: {plan === "trial" || plan === "free" ? "無料体験" : "基本学習プラン"}
          </div>
          <p style={styles.text}>
            選択上限: {limit === "ALL" ? "ALL" : `${limit}つ`} / 選択中: {selected.length}
          </p>
          {!editable && nextAllowedAt ? (
            <p style={styles.warn}>次に変更できる日: {formatDate(nextAllowedAt)}</p>
          ) : null}
        </section>

        {error ? <div style={styles.error}>{error}</div> : null}

        <section style={styles.grid}>
          {list.map(({ id, quiz }) => {
            const checked = selected.includes(id)
            const disabled = !editable || (!checked && limit !== "ALL" && selected.length >= maxCount)
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => toggle(id)}
                style={{
                  ...styles.quizCard,
                  ...(checked ? styles.quizCardOn : null),
                  ...(disabled ? styles.quizCardDisabled : null),
                }}
              >
                <div style={styles.quizTitle}>{quiz.title}</div>
                <p style={styles.text}>{quiz.description ?? ""}</p>
                <div style={styles.status}>{checked ? "選択中" : "未選択"}</div>
              </button>
            )
          })}
        </section>

        <footer style={styles.footer}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editable || saving}
            style={styles.saveButton}
          >
            {saving ? "保存中..." : "この内容で保存する"}
          </button>
        </footer>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px" },
  shell: { maxWidth: 980, margin: "0 auto" },
  card: { marginTop: 12, padding: 16, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  summary: { marginTop: 12, padding: 16, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  summaryTitle: { fontWeight: 900, fontSize: 16 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.6, fontSize: 13 },
  warn: { margin: "8px 0 0", color: "#92400e", fontWeight: 800 },
  error: { marginTop: 12, padding: 12, borderRadius: 8, background: "#fef2f2", color: "#991b1b", fontWeight: 800 },
  grid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 },
  quizCard: { minHeight: 138, padding: 14, borderRadius: 8, border: "1px solid rgba(17,24,39,.12)", background: "#fff", textAlign: "left", cursor: "pointer" },
  quizCardOn: { borderColor: "#2563eb", boxShadow: "0 0 0 2px rgba(37,99,235,.12)" },
  quizCardDisabled: { opacity: 0.55, cursor: "not-allowed" },
  quizTitle: { fontWeight: 900, fontSize: 15 },
  status: { marginTop: 12, color: "#2563eb", fontWeight: 900, fontSize: 13 },
  footer: { marginTop: 16, display: "flex", justifyContent: "center" },
  saveButton: { width: "min(520px, 100%)", padding: "14px", border: "none", borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 900, cursor: "pointer" },
}
