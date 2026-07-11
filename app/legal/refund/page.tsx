import LegalFooter from "@/app/components/LegalFooter"

export default function RefundPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>返金ポリシー</h1>
        <Section title="1. 基本方針">本サービスは、決済完了後に利用権が付与されるデジタル学習サービスです。その性質上、利用者都合による決済完了後のキャンセル、返金、利用期間の短縮または他プランへの変更は原則として承っておりません。</Section>
        <Section title="2. コンビニ決済">コンビニ決済は、購入手続き画面に表示される支払期限までに入金してください。入金確認前は有料機能が有効化されません。支払期限を過ぎた未払い申込みは完了しません。</Section>
        <Section title="3. 返金を検討する場合">二重決済、当社のシステム不具合により利用権が付与されない場合、その他当社の責めに帰すべき重大な事由が確認された場合は、決済記録および利用状況を確認したうえで個別に対応します。</Section>
        <Section title="4. 連絡期限">決済に関する問題がある場合は、決済日、登録メールアドレス、決済方法および状況を記載し、問題を確認した日から速やかにお問い合わせください。</Section>
        <Section title="5. お問い合わせ">株式会社アウトインプラス support@outin-plus.com</Section>
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
  card: { maxWidth: 900, margin: "0 auto", background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 10, padding: 22 },
  section: { borderTop: "1px solid #e5e7eb", paddingTop: 14, marginTop: 14, lineHeight: 1.8 },
}
