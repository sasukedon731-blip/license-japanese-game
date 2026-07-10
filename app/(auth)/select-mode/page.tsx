"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/app/lib/firebase"
import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"
import { assertActiveAccess } from "@/app/lib/guards"
import { loadAndRepairUserPlanState } from "@/app/lib/userPlanState"
import AppHeader from "@/app/components/AppHeader"

type GroupId = "license" | "japanese" | "game"

type CardItem =
  | { kind: "quiz"; id: QuizType; title: string; description: string }
  | { kind: "link"; href: string; title: string; description: string }

const groups: Array<{
  id: GroupId
  title: string
  description: string
  items: CardItem[]
}> = [
  {
    id: "license",
    title: "外免切替対策",
    description: "交通ルール、道路標識、試験で使う日本語を学びます。",
    items: [
      {
        kind: "quiz",
        id: "gaikoku-license",
        title: "外免切替の知識",
        description: "交通ルール、右左折、優先関係などを確認します。",
      },
      {
        kind: "quiz",
        id: "road-signs",
        title: "道路標識",
        description: "警戒標識、規制標識、案内標識を画像で確認します。",
      },
    ],
  },
  {
    id: "japanese",
    title: "日本語学習",
    description: "外免切替に必要な聞き取り、語彙、日常表現を学びます。",
    items: [
      { kind: "quiz", id: "japanese-n4", title: "JLPT N4", description: "基本文法、語彙、読解、聴解を復習します。" },
      { kind: "quiz", id: "japanese-n3", title: "JLPT N3", description: "日常日本語を試験形式で練習します。" },
      { kind: "quiz", id: "japanese-n2", title: "JLPT N2", description: "自然な表現と読解力を強化します。" },
      { kind: "quiz", id: "genba-listening", title: "生活・現場リスニング", description: "短い指示や会話を聞き取ります。" },
      { kind: "quiz", id: "genba-phrasebook", title: "よく使う日本語フレーズ", description: "毎日使う表現を確認します。" },
      { kind: "quiz", id: "confusing-japanese", title: "まぎらわしい日本語", description: "似ている言葉の違いを整理します。" },
      { kind: "quiz", id: "kansai-listening", title: "関西弁リスニング", description: "地域表現を音声で学びます。" },
      { kind: "quiz", id: "dialect-listening", title: "方言リスニング", description: "全国の言い方を聞き取ります。" },
      { kind: "quiz", id: "dialect-meaning", title: "全国方言 意味あて", description: "方言の意味を選んで覚えます。" },
    ],
  },
  {
    id: "game",
    title: "反復ゲーム",
    description: "短時間で語彙と判断力を反復練習します。",
    items: [
      {
        kind: "link",
        href: "/game",
        title: "日本語バトル",
        description: "短時間で遊べる語彙・文法ゲームです。",
      },
      {
        kind: "link",
        href: "/game/play",
        title: "ゲームプレイ",
        description: "バトル形式で反復練習します。",
      },
    ],
  },
]

function modeHref(id: QuizType, mode: "normal" | "exam" | "review") {
  return `/${mode}?type=${encodeURIComponent(id)}`
}

function parseGroup(value: string | null): GroupId {
  return value === "license" || value === "japanese" || value === "game" ? value : "license"
}

export default function SelectModePage() {
  const router = useRouter()
  const params = useSearchParams()
  const [activeGroup, setActiveGroup] = useState<GroupId>(() => parseGroup(params.get("group")))
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login")
        return
      }

      setLoading(true)
      setBlocked(false)
      setError("")
      try {
        const gate = await assertActiveAccess(user.uid)
        if (!gate.ok) {
          setBlocked(true)
          return
        }
        const state = await loadAndRepairUserPlanState(user.uid)
        setDisplayName(state.displayName || "")
      } catch (e) {
        console.error(e)
        setError("学習情報の読み込みに失敗しました。")
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [router])

  const current = useMemo(
    () => groups.find((group) => group.id === activeGroup) ?? groups[0],
    [activeGroup]
  )

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <AppHeader title="学習を選ぶ" />
          <section style={styles.card}>読み込み中...</section>
        </div>
      </main>
    )
  }

  if (blocked) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <AppHeader title="学習を選ぶ" />
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>プラン購入が必要です</h2>
            <p style={styles.text}>学習を続けるには、基本学習プランを購入してください。</p>
            <Link href="/plans" style={styles.primaryButton}>プランを見る</Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="学習を選ぶ" />

        <section style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>{displayName ? `${displayName} さん` : "外免切替 Japanese Learning App"}</p>
            <h1 style={styles.h1}>今日学ぶカテゴリを選んでください</h1>
            <p style={styles.text}>
              外国免許切替の知識対策、日本語学習、反復ゲームから目的に合わせて学習できます。
            </p>
          </div>
          <Link href="/plans" style={styles.planButton}>プラン確認</Link>
        </section>

        {error ? <div style={styles.error}>{error}</div> : null}

        <div style={styles.tabs}>
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroup(group.id)}
              style={{ ...styles.tab, ...(activeGroup === group.id ? styles.tabActive : null) }}
            >
              {group.title}
            </button>
          ))}
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <div>
              <h2 style={styles.h2}>{current.title}</h2>
              <p style={styles.text}>{current.description}</p>
            </div>
            <span style={styles.badge}>{current.items.length}項目</span>
          </div>

          <div style={styles.grid}>
            {current.items.map((item) => {
              if (item.kind === "link") {
                return (
                  <Link key={item.href} href={item.href} style={styles.itemCard}>
                    <div style={styles.itemTitle}>{item.title}</div>
                    <p style={styles.itemText}>{item.description}</p>
                    <div style={styles.itemMeta}>開く</div>
                  </Link>
                )
              }

              if (!quizzes[item.id]) return null

              return (
                <div key={item.id} style={styles.itemCard}>
                  <div style={styles.itemTitle}>{item.title}</div>
                  <p style={styles.itemText}>{item.description}</p>
                  <div style={styles.actions}>
                    <Link href={modeHref(item.id, "normal")} style={styles.smallButtonBlue}>通常</Link>
                    <Link href={modeHref(item.id, "exam")} style={styles.smallButtonDark}>模擬</Link>
                    <Link href={modeHref(item.id, "review")} style={styles.smallButtonGreen}>復習</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px" },
  shell: { maxWidth: 980, margin: "0 auto" },
  hero: { marginTop: 12, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" },
  eyebrow: { margin: 0, color: "#2563eb", fontWeight: 900, fontSize: 13 },
  h1: { margin: "6px 0 0", fontSize: 28, lineHeight: 1.25, fontWeight: 900 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.7, fontSize: 14 },
  planButton: { padding: "11px 14px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
  card: { marginTop: 12, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  cardTitle: { margin: 0, fontSize: 22, fontWeight: 900 },
  primaryButton: { display: "inline-flex", marginTop: 14, padding: "11px 14px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
  error: { marginTop: 12, padding: 12, borderRadius: 8, background: "#fef2f2", color: "#991b1b", fontWeight: 800 },
  tabs: { marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" },
  tab: { padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(17,24,39,.12)", background: "#fff", fontWeight: 900, cursor: "pointer" },
  tabActive: { background: "#2563eb", borderColor: "#2563eb", color: "#fff" },
  section: { marginTop: 14, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  sectionHead: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h2: { margin: 0, fontSize: 24, fontWeight: 900 },
  badge: { alignSelf: "flex-start", padding: "6px 10px", borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", fontWeight: 900, fontSize: 12 },
  grid: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
  itemCard: { padding: 16, borderRadius: 8, border: "1px solid rgba(17,24,39,.10)", background: "#f8fafc", textDecoration: "none", color: "#111827", display: "flex", flexDirection: "column", minHeight: 160 },
  itemTitle: { fontSize: 17, fontWeight: 900 },
  itemText: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.7, fontSize: 14 },
  itemMeta: { marginTop: "auto", color: "#2563eb", fontWeight: 900 },
  actions: { marginTop: "auto", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" },
  smallButtonBlue: { padding: "9px 11px", borderRadius: 8, background: "#2563eb", color: "#fff", textDecoration: "none", fontWeight: 900, fontSize: 13 },
  smallButtonDark: { padding: "9px 11px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900, fontSize: 13 },
  smallButtonGreen: { padding: "9px 11px", borderRadius: 8, background: "#16a34a", color: "#fff", textDecoration: "none", fontWeight: 900, fontSize: 13 },
}
