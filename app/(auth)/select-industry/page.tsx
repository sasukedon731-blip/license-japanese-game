"use client"

import Link from "next/link"
import AppHeader from "@/app/components/AppHeader"

export default function SelectIndustryPage() {
  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="カテゴリを選ぶ" />
        <section style={styles.card}>
          <h1 style={styles.title}>このアプリのカテゴリ</h1>
          <p style={styles.text}>
            この版では、外国免許切替・日本語系・ゲーム系だけを利用できます。
          </p>
          <div style={styles.grid}>
            <Link href="/select-mode?group=license" style={styles.link}>外国免許切替</Link>
            <Link href="/select-mode?group=japanese" style={styles.link}>日本語系</Link>
            <Link href="/select-mode?group=game" style={styles.link}>ゲーム系</Link>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px" },
  shell: { maxWidth: 760, margin: "0 auto" },
  card: { marginTop: 12, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  title: { margin: 0, fontSize: 26, fontWeight: 900 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.7 },
  grid: { marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 },
  link: { padding: 14, borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900, textAlign: "center" },
}
