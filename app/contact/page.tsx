import LegalFooter from "@/app/components/LegalFooter"

export default function ContactPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>お問い合わせ</h1>
        <p>外免切替 Japanese Learning App に関するお問い合わせは、以下までご連絡ください。</p>
        <dl style={styles.info}>
          <dt>会社名</dt><dd>株式会社アウトインプラス</dd>
          <dt>代表者</dt><dd>高野 倫之</dd>
          <dt>所在地</dt><dd>東京都渋谷区道玄坂1丁目10-8 渋谷道玄坂東急ビル2F-C</dd>
          <dt>電話番号</dt><dd>03-6820-3675</dd>
          <dt>メール</dt><dd><a href="mailto:support@outin-plus.com">support@outin-plus.com</a></dd>
        </dl>
        <LegalFooter compact />
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 16 },
  card: { maxWidth: 820, margin: "0 auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 22 },
  info: { display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, lineHeight: 1.8 },
}
