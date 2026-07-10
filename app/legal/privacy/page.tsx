import LegalFooter from "@/app/components/LegalFooter"

export default function PrivacyPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>プライバシーポリシー</h1>
        <Section title="1. 取得する情報">氏名、メールアドレス、学習履歴、決済状態、企業コードなど、サービス提供に必要な情報を取得します。</Section>
        <Section title="2. 利用目的">本人確認、学習機能の提供、決済管理、企業管理機能、サポート対応、サービス改善に利用します。</Section>
        <Section title="3. 外部サービス">本サービスでは Firebase、KOMOJU などの外部サービスを利用します。</Section>
        <Section title="4. 第三者提供">法令に基づく場合を除き、本人の同意なく第三者に提供しません。</Section>
        <Section title="5. お問い合わせ窓口">株式会社アウトインプラス support@outin-plus.com</Section>
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
