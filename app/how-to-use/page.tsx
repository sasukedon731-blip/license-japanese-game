"use client"

import { useRouter } from "next/navigation"

export default function HowToUsePage() {
  const router = useRouter()

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>使い方</h1>
        <p style={styles.text}>
          外国免許切替の知識対策、日本語学習、反復ゲームを収録した学習アプリです。
        </p>
      </section>

      <section style={styles.grid}>
        <Info title="1. 教材を選ぶ" text="外免切替、道路標識、日本語リスニングなどから学習する教材を選びます。" />
        <Info title="2. 学習モードを選ぶ" text="通常学習、模擬試験、復習から目的に合わせて進めます。" />
        <Info title="3. 結果を確認する" text="正答率や苦手問題を確認しながら、繰り返し学習します。" />
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>料金</h2>
        <p style={styles.text}>
          個人プランは30日500円・90日1,500円・180日3,000円（税込）から選べます。長期割引はなく、30日あたり500円の同一料金です。自動更新はありません。
          企業コードで登録したユーザーは、企業契約として利用できます。
        </p>
        <div style={styles.actions}>
          <button type="button" onClick={() => router.push("/select-mode")} style={styles.primary}>学習を始める</button>
          <button type="button" onClick={() => router.push("/plans")} style={styles.secondary}>プランを見る</button>
        </div>
      </section>
    </main>
  )
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.h2}>{title}</h2>
      <p style={styles.text}>{text}</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 920, margin: "0 auto", padding: "24px 14px 40px" },
  card: { padding: 20, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  title: { margin: 0, fontSize: 30, fontWeight: 900 },
  h2: { margin: 0, fontSize: 20, fontWeight: 900 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.8 },
  grid: { marginTop: 12, marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
  actions: { marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" },
  primary: { padding: "12px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 900 },
  secondary: { padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 900 },
}
