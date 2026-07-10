import Link from "next/link"

export const metadata = { title: "利用期間・再購入について" }

export default function CancelPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>利用期間・再購入について</h1>
        <p style={styles.text}>
          外免切替 Japanese Learning App は自動更新のない期間利用プランです。
          利用期間が終了すると、個人ユーザーの学習機能は停止します。
        </p>
        <ul style={styles.list}>
          <li>解約手続きは不要です。</li>
          <li>利用期間終了後は、必要に応じて再購入してください。</li>
          <li>コンビニ決済は入金確認後に利用開始されます。</li>
        </ul>
        <div style={styles.actions}>
          <Link href="/plans" style={styles.primary}>プランを見る</Link>
          <Link href="/legal/refund" style={styles.secondary}>返金ポリシーを見る</Link>
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 860, margin: "0 auto", padding: "24px 14px 40px" },
  card: { background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 8, padding: 20 },
  title: { margin: 0, fontSize: 28, fontWeight: 900 },
  text: { marginTop: 12, fontSize: 15, lineHeight: 1.9 },
  list: { marginTop: 18, lineHeight: 1.9 },
  actions: { marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 },
  primary: { padding: "12px 18px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
  secondary: { padding: "12px 18px", borderRadius: 8, background: "#eff6ff", color: "#2563eb", textDecoration: "none", fontWeight: 900 },
}
