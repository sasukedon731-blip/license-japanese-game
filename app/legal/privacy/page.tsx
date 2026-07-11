import LegalFooter from "@/app/components/LegalFooter"

export default function PrivacyPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>プライバシーポリシー</h1>
        <Section title="1. 取得する情報">氏名または表示名、メールアドレス、認証情報、企業コード、所属企業情報、学習履歴、回答結果、進捗、端末・ブラウザ情報、アクセスログ、決済状態、問い合わせ内容その他本サービスの提供に必要な情報を取得します。クレジットカード番号等の決済情報は、原則として決済代行事業者が管理し、当社はカード番号そのものを保持しません。</Section>
        <Section title="2. 利用目的">本人確認、アカウント管理、学習機能および企業管理機能の提供、決済・利用期間の管理、不正利用防止、問い合わせ対応、障害対応、サービス改善、重要なお知らせの通知、法令上必要な対応のために利用します。</Section>
        <Section title="3. 外部サービス・委託">本サービスでは、認証・データ保存等のためFirebase、ホスティング等のためVercel、決済のため決済代行サービス等の外部サービスを利用します。これらの事業者に、利用目的の達成に必要な範囲で情報の取扱いを委託することがあります。</Section>
        <Section title="4. 企業管理者への提供">企業コードを利用するユーザーについては、所属企業の管理者に、氏名または表示名、メールアドレス、学習回数、正答率、進捗、最終学習日その他契約上必要な学習状況を表示する場合があります。</Section>
        <Section title="5. 第三者提供">法令に基づく場合、生命・身体・財産の保護に必要な場合その他法令で認められる場合を除き、本人の同意なく個人データを第三者に提供しません。</Section>
        <Section title="6. 安全管理">アクセス制御、認証、通信の保護、権限管理その他合理的な安全管理措置を講じ、個人情報への不正アクセス、漏えい、改ざん等の防止に努めます。</Section>
        <Section title="7. 保存期間">取得した情報は、利用目的の達成に必要な期間または法令上必要な期間保存し、不要となった情報は合理的な方法で削除または匿名化します。</Section>
        <Section title="8. 開示等の請求">保有個人データの利用目的の通知、開示、訂正、追加、削除、利用停止または第三者提供停止を希望する場合は、本人確認のうえ法令に従って対応します。</Section>
        <Section title="9. ポリシーの変更">法令またはサービス内容の変更に応じて、本ポリシーを変更することがあります。重要な変更は本サービス上で告知します。</Section>
        <Section title="10. お問い合わせ窓口">株式会社アウトインプラス support@outin-plus.com</Section>
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
