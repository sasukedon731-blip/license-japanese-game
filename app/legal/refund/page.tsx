import LegalFooter from "@/app/components/LegalFooter"

export default function RefundPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>返金ポリシー</h1>
        <Section title="1. 基本方針">デジタル学習サービスの性質上、決済完了後の返金は原則として承っておりません。</Section>
        <Section title="2. コンビニ決済">コンビニ決済は入金確認後に利用期間が有効化されます。未払い状態では学習機能は有効化されません。</Section>
        <Section title="3. 例外対応">二重決済や当社起因の障害が確認された場合は、個別に対応します。</Section>
        <Section title="4. お問い合わせ">株式会社アウトインプラス support@outin-plus.com</Section>
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
