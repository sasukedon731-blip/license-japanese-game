"use client"

import type { CSSProperties } from "react"
import { useEffect, useMemo, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useRouter } from "next/navigation"

import AppHeader from "@/app/components/AppHeader"
import { db } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"

type AdminDoc = {
  role?: "admin" | "company_admin" | "user"
  companyCode?: string
  companyName?: string
}

type ProgressDoc = {
  quizType?: string
  totalSessions?: number
  lastStudyDate?: string
  accuracy?: number
  currentMaterial?: string
}

type Learner = {
  uid: string
  displayName?: string
  email?: string
  companyCode?: string
  companyName?: string
  studyCount: number
  correctRate: number | null
  lastStudiedAt: string
  currentMaterial: string
}

function csvEscape(value: unknown) {
  const s = String(value ?? "")
  return `"${s.replaceAll('"', '""')}"`
}

function normalizeAccuracy(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null
  return value > 1 ? value / 100 : value
}

function pickLatestProgress(progress: ProgressDoc[]) {
  return progress
    .filter((p) => p.lastStudyDate)
    .sort((a, b) => String(b.lastStudyDate).localeCompare(String(a.lastStudyDate)))[0]
}

export default function CompanyAdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [adminDoc, setAdminDoc] = useState<AdminDoc | null>(null)
  const [learners, setLearners] = useState<Learner[]>([])
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    let alive = true
    ;(async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        const data = snap.exists() ? (snap.data() as AdminDoc) : null
        if (!data || (data.role !== "company_admin" && data.role !== "admin")) {
          throw new Error("企業管理者のみ利用できます。")
        }
        if (data.role === "company_admin" && !data.companyCode) {
          throw new Error("企業コードが設定されていません。")
        }

        const usersQuery =
          data.role === "admin" && !data.companyCode
            ? query(collection(db, "users"), where("accountType", "==", "company"))
            : query(collection(db, "users"), where("companyCode", "==", data.companyCode))

        const rows = await getDocs(usersQuery)
        const next = await Promise.all(
          rows.docs.map(async (row) => {
            const userData = row.data() as Partial<Learner>
            const progressSnap = await getDocs(collection(db, "users", row.id, "progress"))
            const progress = progressSnap.docs.map((d) => d.data() as ProgressDoc)
            const studyCount = progress.reduce(
              (sum, p) => sum + (typeof p.totalSessions === "number" ? p.totalSessions : 0),
              0
            )
            const latest = pickLatestProgress(progress)
            const accuracies = progress.map((p) => normalizeAccuracy(p.accuracy)).filter((v): v is number => v !== null)
            const correctRate = accuracies.length
              ? accuracies.reduce((sum, v) => sum + v, 0) / accuracies.length
              : null

            return {
              uid: row.id,
              displayName: userData.displayName,
              email: userData.email,
              companyCode: userData.companyCode,
              companyName: userData.companyName,
              studyCount,
              correctRate,
              lastStudiedAt: latest?.lastStudyDate ?? "-",
              currentMaterial: latest?.currentMaterial ?? latest?.quizType ?? "-",
            }
          })
        )

        if (!alive) return
        setAdminDoc(data)
        setLearners(next)
      } catch (e: unknown) {
        if (!alive) return
        setError(e instanceof Error ? e.message : "企業管理データを読み込めませんでした。")
      }
    })()

    return () => {
      alive = false
    }
  }, [loading, router, user])

  const companyCode = adminDoc?.companyCode ?? ""
  const csv = useMemo(() => {
    const header = ["氏名", "メール", "企業コード", "学習回数", "正答率", "最終学習日", "進行中教材"]
    const rows = learners.map((l) => [
      l.displayName ?? "",
      l.email ?? "",
      l.companyCode ?? "",
      l.studyCount,
      l.correctRate !== null ? `${Math.round(l.correctRate * 100)}%` : "-",
      l.lastStudiedAt,
      l.currentMaterial,
    ])
    return [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n")
  }, [learners])

  const downloadCsv = () => {
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `company-learners-${companyCode || "all"}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCode = async () => {
    if (!companyCode) return
    await navigator.clipboard.writeText(companyCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  if (loading) return <main style={styles.page}>読み込み中...</main>

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="企業管理" />
        {error ? <div style={styles.error}>{error}</div> : null}
        {!error ? (
          <>
            <section style={styles.summary}>
              <div>
                <p style={styles.eyebrow}>{adminDoc?.companyName ?? "企業契約"}</p>
                <h1 style={styles.h1}>学習者一覧</h1>
                <p style={styles.text}>同じ企業コードに所属する学習者の進捗を確認できます。</p>
              </div>
              <div style={styles.actions}>
                {companyCode ? (
                  <button style={styles.secondary} onClick={copyCode}>
                    {copied ? "コピー済み" : "企業コードコピー"}
                  </button>
                ) : null}
                <button style={styles.primary} onClick={downloadCsv}>CSV出力</button>
              </div>
            </section>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>学習者</th>
                    <th style={styles.th}>学習回数</th>
                    <th style={styles.th}>正答率</th>
                    <th style={styles.th}>最終学習日</th>
                    <th style={styles.th}>進行中教材</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((l) => (
                    <tr key={l.uid}>
                      <td style={styles.td}>
                        <b>{l.displayName || "-"}</b>
                        <br />
                        <span>{l.email || "-"}</span>
                      </td>
                      <td style={styles.td}>{l.studyCount}</td>
                      <td style={styles.td}>{l.correctRate !== null ? `${Math.round(l.correctRate * 100)}%` : "-"}</td>
                      <td style={styles.td}>{l.lastStudiedAt}</td>
                      <td style={styles.td}>{l.currentMaterial}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px", color: "#111827" },
  shell: { maxWidth: 1040, margin: "0 auto" },
  summary: {
    marginTop: 14,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    background: "#fff",
    border: "1px solid rgba(17,24,39,.1)",
    borderRadius: 8,
    padding: 18,
  },
  eyebrow: { margin: 0, color: "#2563eb", fontWeight: 900 },
  h1: { margin: "4px 0 0", fontSize: 28, fontWeight: 900 },
  text: { margin: "6px 0 0", color: "#4b5563" },
  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  primary: { padding: "10px 14px", borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontWeight: 900 },
  secondary: { padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 900 },
  tableWrap: { marginTop: 14, overflowX: "auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 12, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td: { padding: 12, borderBottom: "1px solid #f1f5f9", verticalAlign: "top" },
  error: { marginTop: 16, padding: 14, borderRadius: 8, background: "#fef2f2", color: "#991b1b", fontWeight: 800 },
}
