import LegalFooter from "@/app/components/LegalFooter"

export default function TermsPage() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1>利用規約</h1>
        <Section title="第1条（適用）">本規約は、株式会社アウトインプラス（以下「当社」）が提供する「外免切替 Japanese Learning App」（以下「本サービス」）の利用条件を定めるものです。</Section>
        <Section title="第2条（利用登録）">利用者は、真実かつ正確な情報を登録し、メールアドレス、パスワードその他の認証情報を自己の責任で管理するものとします。第三者への貸与、譲渡または共用は禁止します。</Section>
        <Section title="第3条（無料体験）">個人ユーザーには、登録時から1日間の無料体験を提供する場合があります。無料体験は原則として1人につき1回であり、期間終了後は有料プランの購入が必要です。企業コード利用者には企業契約の条件が適用されます。</Section>
        <Section title="第4条（料金および支払い）">個人プランは、30日500円、90日1,500円、180日3,000円の期間利用型プランです。表示価格は税込です。支払いはクレジットカード決済またはコンビニ決済により行います。自動更新はありません。</Section>
        <Section title="第5条（利用期間）">クレジットカード決済は決済完了後、コンビニ決済は入金確認後に利用期間が開始されます。利用期間終了後、個人ユーザーの有料機能は停止し、継続利用には再購入が必要です。</Section>
        <Section title="第6条（企業コード）">企業コードは、当該企業契約の対象者のみが利用できます。第三者への共有、不正取得、不正利用を禁止します。企業管理者は、同一企業コードに所属する利用者の学習状況を確認できる場合があります。</Section>
        <Section title="第7条（禁止事項）">法令または公序良俗に反する行為、不正アクセス、コンテンツの無断転載・複製・配布、アカウントや企業コードの不正利用、サービス運営を妨害する行為その他当社が不適切と判断する行為を禁止します。</Section>
        <Section title="第8条（知的財産権）">本サービスに含まれる文章、問題、画像、プログラムその他のコンテンツに関する権利は、当社または正当な権利者に帰属します。私的利用の範囲を超えた利用はできません。</Section>
        <Section title="第9条（サービスの変更・停止）">当社は、保守、障害、災害その他やむを得ない事情がある場合、本サービスの全部または一部を変更、停止または終了することがあります。</Section>
        <Section title="第10条（免責）">本サービスは学習支援を目的とするものであり、外国免許切替試験の合格、行政手続の完了その他特定の結果を保証するものではありません。法令、試験制度、手続等の最新情報は、利用者自身で関係機関に確認してください。</Section>
        <Section title="第11条（利用停止）">利用者が本規約に違反した場合、当社は事前の通知なく利用停止、登録抹消その他必要な措置を講じることができます。</Section>
        <Section title="第12条（規約の変更）">当社は、法令の変更、サービス内容の変更その他必要がある場合、本規約を変更することがあります。重要な変更は、本サービス上で告知します。</Section>
        <Section title="第13条（準拠法・管轄）">本規約は日本法に準拠し、本サービスに関して紛争が生じた場合は、当社本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。</Section>
        <Section title="第14条（お問い合わせ）">お問い合わせは support@outin-plus.com までご連絡ください。</Section>
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
