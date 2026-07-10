import Link from "next/link"
import LegalFooter from "@/app/components/LegalFooter"

export default function ForBusinessPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>法人・学校・支援団体向け</p>
        <h1 style={styles.h1}>外免切替 Japanese Learning App</h1>
        <p style={styles.lead}>
          企業コードを発行し、所属学習者の学習回数、正答率、最終学習日、進行中教材を管理できます。
        </p>
        <div style={styles.actions}>
          <Link href="/company" style={styles.primary}>企業コードで登録</Link>
          <Link href="/company-admin" style={styles.secondary}>企業管理画面</Link>
        </div>
      </section>
      <section style={styles.grid}>
        <div style={styles.item}><b>支払い不要</b><span>企業契約ユーザーは個人決済なしで利用できます。</span></div>
        <div style={styles.item}><b>CSV出力</b><span>学習者一覧を管理用CSVとして出力できます。</span></div>
        <div style={styles.item}><b>進捗確認</b><span>学習回数、正答率、最終学習日、教材の進行状況を確認できます。</span></div>
      </section>
      <LegalFooter />
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "20px 16px 40px", color: "#111827" },
  hero: { maxWidth: 960, margin: "0 auto", padding: "34px 0" },
  eyebrow: { margin: 0, color: "#2563eb", fontWeight: 900 },
  h1: { margin: "8px 0 0", fontSize: 42, lineHeight: 1.15, fontWeight: 900 },
  lead: { maxWidth: 680, color: "#4b5563", lineHeight: 1.8 },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 },
  primary: { padding: "12px 16px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 900 },
  secondary: { padding: "12px 16px", borderRadius: 8, background: "#fff", color: "#111827", border: "1px solid #d1d5db", textDecoration: "none", fontWeight: 900 },
  grid: { maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 },
  item: { display: "grid", gap: 8, background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 16 },
}
