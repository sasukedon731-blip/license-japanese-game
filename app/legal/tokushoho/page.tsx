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
        <dl style={styles.list}>
          <Info label="販売事業者" value={COMPANY.name} />
          <Info label="運営責任者" value={COMPANY.representative} />
          <Info label="所在地" value={COMPANY.address} />
          <Info label="電話番号" value={COMPANY.phone} />
          <Info label="メールアドレス" value={COMPANY.email} />
          <Info label="サービス名" value="外免切替 Japanese Learning App" />
          <Info label="販売価格（税込）" value="30日プラン 500円、90日プラン 1,500円、180日プラン 3,000円" />
          <Info label="販売価格以外に必要な費用" value="インターネット接続料金、通信料金その他の電気通信回線の利用に関する費用は、利用者の負担となります。" />
          <Info label="支払い方法" value="クレジットカード決済またはコンビニ決済" />
          <Info label="支払い時期" value="クレジットカード決済は購入手続き時に決済されます。コンビニ決済は購入手続き画面に表示される支払期限までにお支払いください。" />
          <Info label="サービス提供時期" value="クレジットカード決済は決済完了後、コンビニ決済は入金確認後に利用期間が開始されます。" />
          <Info label="利用期間" value="購入したプランに応じて30日、90日または180日です。自動更新はありません。" />
          <Info label="申込みの有効期限" value="コンビニ決済は購入手続き画面に表示される支払期限まで有効です。期限までに入金がない場合、申込みは完了しません。" />
          <Info label="返品・キャンセル・返金" value="デジタル学習サービスの性質上、決済完了後またはサービス提供開始後の返品・キャンセル・返金は原則として承っておりません。ただし、二重決済または当社の責めに帰すべき重大な障害が確認された場合は個別に対応します。" />
          <Info label="動作環境" value="最新のGoogle Chrome、Microsoft Edge、Safari等の主要ブラウザを推奨します。JavaScriptおよびCookieを有効にし、安定したインターネット接続をご利用ください。" />
        </dl>
        <LegalFooter compact />
      </section>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.info}>
      <dt style={styles.dt}>{label}</dt>
      <dd style={styles.dd}>{value}</dd>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: 16 },
  card: { maxWidth: 900, margin: "0 auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 10, padding: 22 },
  list: { margin: 0 },
  info: { display: "grid", gridTemplateColumns: "minmax(150px, 210px) 1fr", gap: 12, padding: "13px 0", borderBottom: "1px solid #e5e7eb", lineHeight: 1.8 },
  dt: { fontWeight: 900 },
  dd: { margin: 0 },
}
