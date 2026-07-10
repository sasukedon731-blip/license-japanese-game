"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore"

import { useAuth } from "@/app/lib/useAuth"
import { db } from "@/app/lib/firebase"
import { getUserRole } from "@/app/lib/firestore"

// ★ 追加：quizCatalog 参照
import { quizCatalog } from "@/app/data/quizCatalog"

/* =========================
   型定義
========================= */

type QuizResult = {
  score: number
  total: number
  accuracy?: number
  mode?: string
  quizType?: string
  createdAt?: { seconds: number } | null
}

type StudyProgress = {
  totalSessions: number
  todaySessions: number
  lastStudyDate: string
  streak: number
  streakUpdatedDate: string
  bestStreak: number
}

type UserProfile = {
  email?: string | null
  displayName?: string | null
  role?: "admin" | "user"
}

/**
 * 🎯 有効な教材ID一覧（quizCatalog基準）
 * - enabled=false は自動除外
 * - order 順で安定
 */
const QUIZ_TYPES = quizCatalog
  .filter(q => q.enabled)
  .sort((a, b) => a.order - b.order)
  .map(q => q.id)

/* =========================
   ユーティリティ
========================= */

function label(t?: string) {
  if (t === "japanese-n4") return "N4"
  if (t === "genba-listening") return "現場リスニング"
  if (t === "gaikoku-license") return "外国免許"
  return "-"
}

function formatDateSeconds(seconds?: number) {
  if (!seconds) return "-"
  return new Date(seconds * 1000).toLocaleString()
}

function safeProgress(p: any): StudyProgress {
  const base: StudyProgress = {
    totalSessions: 0,
    todaySessions: 0,
    lastStudyDate: "",
    streak: 0,
    streakUpdatedDate: "",
    bestStreak: 0,
  }
  if (!p) return base
  return {
    totalSessions: typeof p.totalSessions === "number" ? p.totalSessions : 0,
    todaySessions: typeof p.todaySessions === "number" ? p.todaySessions : 0,
    lastStudyDate: typeof p.lastStudyDate === "string" ? p.lastStudyDate : "",
    streak: typeof p.streak === "number" ? p.streak : 0,
    streakUpdatedDate:
      typeof p.streakUpdatedDate === "string" ? p.streakUpdatedDate : "",
    bestStreak: typeof p.bestStreak === "number" ? p.bestStreak : 0,
  }
}

/* =========================
   メインコンポーネント
========================= */

export default function AdminUserPage() {
  const router = useRouter()
  const params = useParams<{ uid: string }>()
  const uid = params?.uid

  const { user, loading } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<Record<string, StudyProgress | null>>({})
  const [results, setResults] = useState<QuizResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const [tab, setTab] = useState<"all" | (typeof QUIZ_TYPES)[number]>("all")

  /* ---------- 初期ロード ---------- */
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (!uid) return

    const init = async () => {
      setError(null)
      setReady(false)

      try {
        const role = await getUserRole(user.uid)
        if (role !== "admin") {
          router.replace("/")
          return
        }

        // profile
        const profileSnap = await getDoc(doc(db, "users", uid))
        setProfile(profileSnap.exists() ? (profileSnap.data() as UserProfile) : null)

        // progress（教材別）
        const nextProgress: Record<string, StudyProgress | null> = {}
        await Promise.all(
          QUIZ_TYPES.map(async (t) => {
            const snap = await getDoc(doc(db, "users", uid, "progress", t))
            nextProgress[t] = snap.exists() ? safeProgress(snap.data()) : null
          })
        )
        setProgress(nextProgress)

        // results（直近100件）
        const col = collection(db, "users", uid, "results")
        const qy = query(col, orderBy("createdAt", "desc"), limit(100))
        const resSnap = await getDocs(qy)
        setResults(resSnap.docs.map(d => d.data() as QuizResult))
      } catch (e: any) {
        setError(e?.message ?? "不明なエラー")
      } finally {
        setReady(true)
      }
    }

    init()
  }, [user, loading, uid, router])

  /* ---------- 派生データ ---------- */

  const filteredResults = useMemo(() => {
    if (tab === "all") return results
    return results.filter(r => r.quizType === tab)
  }, [results, tab])

  const avgOf = (quizType: string) => {
    const list = results.filter(r => r.quizType === quizType)
    if (list.length === 0) return null

    let sumScore = 0
    let sumTotal = 0
    let sumAcc = 0

    for (const r of list) {
      const score = typeof r.score === "number" ? r.score : 0
      const total = typeof r.total === "number" ? r.total : 0
      const acc =
        typeof r.accuracy === "number"
          ? r.accuracy
          : total > 0
          ? score / total
          : 0

      sumScore += score
      sumTotal += total
      sumAcc += acc
    }

    const n = list.length
    return {
      count: n,
      avgScore: sumScore / n,
      avgTotal: sumTotal / n,
      avgAcc: sumAcc / n,
    }
  }

  /* ---------- 表示 ---------- */

  if (loading || !ready) {
    return <p style={{ textAlign: "center" }}>読み込み中…</p>
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1000, margin: "30px auto", padding: 16 }}>
        <h1>ユーザー詳細</h1>
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #fca5a5",
            background: "#fef2f2",
            color: "#991b1b",
            fontWeight: 800,
            whiteSpace: "pre-wrap",
          }}
        >
          エラー：
          {"\n"}
          {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: "30px auto", padding: 16 }}>
      <h1>ユーザー詳細</h1>

      <button
        onClick={() => router.push("/admin")}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        管理画面へ戻る
      </button>

      {/* 基本情報 */}
      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>基本情報</div>
        <div>名前：{profile?.displayName ?? "-"}</div>
        <div>メール：{profile?.email ?? "-"}</div>
        <div>role：{profile?.role ?? "-"}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>UID：{uid}</div>
      </div>

      {/* 学習進捗 */}
      <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>学習進捗（教材別）</div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>教材</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>今日</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>累計</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>最終日</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>模擬平均</th>
            </tr>
          </thead>
          <tbody>
            {QUIZ_TYPES.map(t => {
              const p = progress[t]
              const a = avgOf(t)
              return (
                <tr key={t}>
                  <td style={{ border: "1px solid #ccc", padding: 8, fontWeight: 800 }}>
                    {label(t)}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {p?.todaySessions ?? 0}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {p?.totalSessions ?? 0}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {p?.lastStudyDate ?? "-"}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {a
                      ? `${a.avgScore.toFixed(1)}/${a.avgTotal.toFixed(1)}（${Math.round(
                          a.avgAcc * 100
                        )}%）`
                      : "-"}
                    {a?.count ? (
                      <div style={{ fontSize: 12, opacity: 0.7 }}>（{a.count}回）</div>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 模擬試験結果 */}
      <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          模擬試験結果（直近100件）
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <button
            onClick={() => setTab("all")}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: tab === "all" ? "#111" : "#fff",
              color: tab === "all" ? "#fff" : "#111",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            ALL
          </button>

          {QUIZ_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid #ccc",
                background: tab === t ? "#111" : "#fff",
                color: tab === t ? "#fff" : "#111",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              {label(t)}
            </button>
          ))}
        </div>

        {filteredResults.length === 0 ? (
          <p>結果がありません。</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>日時</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>教材</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>点数</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>正答率</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, idx) => {
                const acc =
                  typeof r.accuracy === "number"
                    ? r.accuracy
                    : r.total > 0
                    ? r.score / r.total
                    : 0
                return (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {formatDateSeconds(r.createdAt?.seconds)}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {label(r.quizType)}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8, fontWeight: 800 }}>
                      {r.score}/{r.total}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 8 }}>
                      {Math.round(acc * 100)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
