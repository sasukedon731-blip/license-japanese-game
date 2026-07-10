"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { quizCatalog } from "@/app/data/quizCatalog"
import Button from "@/app/components/Button"

export default function QuizDetailPage() {
  const router = useRouter()
  const params = useParams()

  const quizType = (params?.quizType ?? "") as string

  // ✅ useMemoを使わず、毎回普通に引く（これが一番安全）
  const quiz = quizCatalog.find((q) => q.id === quizType)

  if (!quiz) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <h1>教材が見つかりません</h1>
          <Button variant="main" onClick={() => router.push("/contents")}>
            一覧へ戻る
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        {/* ヘッダー */}
        <div style={styles.header}>
          <h1 style={styles.title}>{quiz.title}</h1>
          <div style={styles.badge}>教材ID: {quiz.id}</div>
        </div>

        {/* 説明 */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>教材について</h2>
          <p style={styles.description}>
            {quiz.description || "この教材の詳細説明は準備中です。"}
          </p>
        </div>

        {/* 特徴 */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>学習できる内容</h2>
          <ul style={styles.list}>
            <li>通常モード（基礎定着）</li>
            <li>模擬試験モード（本番対策）</li>
            <li>復習モード（弱点克服）</li>
          </ul>
        </div>

        {/* CTA */}
        <div style={styles.actions}>
          {/* ✅ /select-mode 経由だとプラン状態読み込み等で固まるケースがあるため、まず通常学習へ直行 */}
          <Button
            variant="main"
            onClick={() => router.push(`/normal?type=${encodeURIComponent(quiz.id)}`)}
          >
            この教材で学習を始める
          </Button>

          {/* ✅ もし通常が弾かれた時の逃げ道（教材のモード一覧へ） */}
          <Button
            variant="sub"
            onClick={() => router.push(`/quiz?type=${encodeURIComponent(quiz.id)}`)}
          >
            モード一覧を見る
          </Button>

          <Button variant="sub" onClick={() => router.push("/contents")}>
            教材一覧へ戻る
          </Button>
        </div>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 18 },
  shell: { maxWidth: 820, margin: "0 auto" },

  header: { marginBottom: 18 },
  title: { margin: 0, fontSize: 28 },
  badge: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.6,
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  },

  sectionTitle: { marginBottom: 8 },
  description: { lineHeight: 1.7, opacity: 0.85 },
  list: { paddingLeft: 18, lineHeight: 1.8 },

  actions: {
    marginTop: 20,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
}
