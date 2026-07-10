import LegalFooter from "@/app/components/LegalFooter"

export default function TermsPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>利用規約</h1>
        <Section title="第1条（適用）">本規約は、株式会社アウトインプラスが提供する「外免切替 Japanese Learning App」の利用条件を定めます。</Section>
        <Section title="第2条（アカウント）">利用者は、登録情報を正確に管理し、第三者にアカウントを利用させないものとします。</Section>
        <Section title="第3条（料金および支払い）">個人プランはKOMOJUを通じた期間利用型の決済です。企業コード利用者は企業契約に基づき利用できます。</Section>
        <Section title="第4条（禁止事項）">不正アクセス、コンテンツの無断転載、決済情報や企業コードの不正利用を禁止します。</Section>
        <Section title="第5条（お問い合わせ）">お問い合わせは support@outin-plus.com までご連絡ください。</Section>
        <LegalFooter compact />
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section style={styles.section}><h2>{title}</h2><p>{children}</p></section>
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 16 },
  card: { maxWidth: 820, margin: "0 auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 22 },
  section: { borderTop: "1px solid #e5e7eb", paddingTop: 14, marginTop: 14, lineHeight: 1.8 },
}
