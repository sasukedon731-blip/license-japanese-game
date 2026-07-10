"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/useAuth"
import LegalFooter from "@/app/components/LegalFooter"

const APP_NAME = "外免切替 Japanese Learning App"

const categories = [
  {
    title: "外免切替の知識対策",
    text: "道路標識、交通ルール、試験で問われやすい表現を日本語で確認できます。",
    href: "/select-mode?group=license",
  },
  {
    title: "日本語学習",
    text: "日常表現、リスニング、JLPT基礎をまとめて復習できます。",
    href: "/select-mode?group=japanese",
  },
  {
    title: "反復ゲーム",
    text: "短時間で語彙と判断力を鍛えるミニゲーム形式の学習です。",
    href: "/game",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const startLearning = () => {
    if (loading) return
    router.push(user ? "/select-mode" : "/login")
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.brand}>{APP_NAME}</div>
          <div style={styles.subBrand}>外国免許切替向けの日本語・知識学習アプリ</div>
        </div>
        <nav style={styles.nav}>
          <Link href="/for-business" style={styles.navLink}>法人向け</Link>
          <Link href="/plans" style={styles.navLink}>プラン</Link>
          {user ? (
            <Link href="/mypage" style={styles.primaryLink}>マイページ</Link>
          ) : (
            <Link href="/login" style={styles.primaryLink}>ログイン</Link>
          )}
        </nav>
      </header>

      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>1日無料体験つき</p>
          <h1 style={styles.h1}>{APP_NAME}</h1>
          <p style={styles.lead}>
            外国免許切替に必要な日本語と交通知識を、クイズ・復習・模擬試験で継続学習できます。
            個人利用はKOMOJU決済、企業利用は企業コードで開始できます。
          </p>
          <div style={styles.actions}>
            <button type="button" onClick={startLearning} style={styles.mainButton}>学習を開始</button>
            <Link href="/company" style={styles.secondaryButton}>企業コードで登録</Link>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <div style={styles.panelTitle}>対応内容</div>
          <ul style={styles.list}>
            <li>外免切替の知識対策</li>
            <li>道路標識</li>
            <li>日本語リスニング</li>
            <li>通常学習・模擬試験・復習</li>
            <li>企業コード登録</li>
            <li>KOMOJU決済</li>
          </ul>
        </div>
      </section>

      <section style={styles.categoryGrid}>
        {categories.map((category) => (
          <Link key={category.title} href={category.href} style={styles.categoryCard}>
            <div style={styles.categoryTitle}>{category.title}</div>
            <p style={styles.categoryText}>{category.text}</p>
            <div style={styles.categoryMeta}>開く</div>
          </Link>
        ))}
      </section>

      <section style={styles.planBand}>
        <div>
          <h2 style={styles.h2}>個人プランは500円から</h2>
          <p style={styles.bandText}>30日・90日・180日から選択できます。コンビニ決済は入金確認後に有効化されます。</p>
        </div>
        <Link href="/plans" style={styles.darkButton}>プランを見る</Link>
      </section>

      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <LegalFooter />
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", color: "#111827", padding: "18px 14px 40px" },
  header: { maxWidth: 1040, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  brand: { fontWeight: 900, fontSize: 18 },
  subBrand: { marginTop: 3, fontSize: 12, color: "#6b7280", fontWeight: 700 },
  nav: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  navLink: { color: "#111827", textDecoration: "none", fontWeight: 800 },
  primaryLink: { padding: "10px 14px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
  hero: { maxWidth: 1040, margin: "28px auto 0", display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(260px, .75fr)", gap: 16, alignItems: "stretch" },
  eyebrow: { margin: 0, color: "#2563eb", fontWeight: 900, fontSize: 13 },
  h1: { margin: "8px 0 0", fontSize: 42, lineHeight: 1.12, letterSpacing: 0, fontWeight: 900 },
  lead: { marginTop: 14, fontSize: 15, lineHeight: 1.9, color: "#4b5563" },
  actions: { marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" },
  mainButton: { padding: "13px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { padding: "13px 18px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#111827", textDecoration: "none", fontWeight: 900 },
  heroPanel: { padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)", boxShadow: "0 12px 28px rgba(17,24,39,.06)" },
  panelTitle: { fontWeight: 900, fontSize: 16 },
  list: { margin: "12px 0 0", paddingLeft: 20, lineHeight: 2 },
  categoryGrid: { maxWidth: 1040, margin: "22px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
  categoryCard: { minHeight: 150, padding: 16, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)", textDecoration: "none", color: "#111827", display: "flex", flexDirection: "column" },
  categoryTitle: { fontSize: 18, fontWeight: 900 },
  categoryText: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.7 },
  categoryMeta: { marginTop: "auto", color: "#2563eb", fontWeight: 900 },
  planBand: { maxWidth: 1040, margin: "22px auto 0", padding: 18, borderRadius: 8, background: "#e0f2fe", border: "1px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  h2: { margin: 0, fontSize: 22, fontWeight: 900 },
  bandText: { margin: "6px 0 0", color: "#475569", lineHeight: 1.7 },
  darkButton: { padding: "12px 16px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
}
