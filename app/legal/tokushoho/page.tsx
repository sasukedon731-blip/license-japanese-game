import LegalFooter from "@/app/components/LegalFooter"

const COMPANY = {
  name: "株式会社アウトインプラス",
  representative: "高野 倫之",
  address: "東京都渋谷区道玄坂1丁目10-8 渋谷道玄坂東急ビル2F-C",
  phone: "03-6820-3675",
  email: "support@outin-plus.com",
}

export default function TokushohoPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>特定商取引法に基づく表記</h1>
        <Info label="販売事業者" value={COMPANY.name} />
        <Info label="運営責任者" value={COMPANY.representative} />
        <Info label="所在地" value={COMPANY.address} />
        <Info label="電話番号" value={COMPANY.phone} />
        <Info label="メールアドレス" value={COMPANY.email} />
        <Info label="販売価格" value="各プランページに税込価格で表示します。" />
        <Info label="支払い方法" value="KOMOJUによるクレジットカード決済・コンビニ決済" />
        <Info label="サービス提供時期" value="決済完了後、またはコンビニ決済の入金確認後に利用できます。" />
        <Info label="返品・キャンセル" value="デジタルサービスの性質上、提供開始後の返金は原則として承っておりません。" />
        <LegalFooter compact />
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.info}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 16 },
  card: { maxWidth: 820, margin: "0 auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 22 },
  info: { display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid #e5e7eb" },
}
