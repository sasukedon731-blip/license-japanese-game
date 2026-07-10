"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/components/Button"
import { quizCatalog } from "@/app/data/quizCatalog"

export default function ContentsPage() {
  const router = useRouter()

  const quizzes = useMemo(() => {
    return quizCatalog
      .filter((q) => q.enabled)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description ?? "",
      }))
  }, [])

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>教材一覧</h1>
            <p style={styles.sub}>
              現在提供中の教材です。教材をクリックすると詳細ページへ移動します。
            </p>
          </div>

          <div style={styles.actions}>
            <Button variant="sub" onClick={() => router.push("/")}>
              TOPへ
            </Button>
            <Button variant="main" onClick={() => router.push("/select-mode")}>
              学習を始める
            </Button>
          </div>
        </header>

        <section style={styles.wrap}>
          <div style={styles.grid}>
            {quizzes.map((q) => (
              <div
                key={q.id}
                style={styles.card}
                onClick={() => router.push(`/contents/${q.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/contents/${q.id}`)
                  }
                }}
              >
                <div style={styles.title}>{q.title}</div>
                {q.description ? (
                  <div style={styles.desc}>{q.description}</div>
                ) : (
                  <div style={styles.descMuted}>（説明なし）</div>
                )}
                <div style={styles.meta}>詳しく見る →</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 18 },
  shell: { maxWidth: 980, margin: "0 auto" },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },

  h1: { margin: 0, fontSize: 26 },
  sub: { marginTop: 6, opacity: 0.75, lineHeight: 1.6, fontSize: 13 },

  actions: { display: "flex", gap: 10, flexWrap: "wrap" },

  wrap: {
    padding: 14,
    borderRadius: 18,
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    alignItems: "stretch",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    minHeight: 140,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  title: { fontWeight: 900, fontSize: 15 },
  desc: { marginTop: 6, opacity: 0.8, fontSize: 12.5, lineHeight: 1.6, minHeight: 36 },
  descMuted: { marginTop: 6, opacity: 0.5, fontSize: 12.5, minHeight: 36 },
  meta: { marginTop: "auto", paddingTop: 8, fontSize: 12, fontWeight: 800, opacity: 0.7 },
}
