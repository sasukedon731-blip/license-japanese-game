"use client"

import Link from "next/link"
import {
  formatDateJP,
  getBillingDaysLeft,
  getBillingEndDate,
  getBillingViewState,
  getPlanLabel,
  type BillingLike,
} from "@/app/lib/billingAccess"

type Props = {
  billing?: BillingLike | null
  plansHref?: string
  companyAccount?: boolean
  userName?: string
}

export default function BillingStatusCard({ billing, plansHref = "/plans", companyAccount = false, userName = "" }: Props) {
  const state = getBillingViewState(billing)
  const daysLeft = getBillingDaysLeft(billing)
  const endDate = getBillingEndDate(billing)
  const isCompany = companyAccount || state === "company"

  return (
    <section style={styles.card}>
      <div style={styles.head}>
        <div>
          <div style={styles.title}>利用プラン</div>
          <div style={styles.sub}>契約状態と有効期限を確認できます。</div>
        </div>
        {!isCompany ? <Link href={plansHref} style={styles.link}>プランを見る</Link> : null}
      </div>

      <div style={styles.panel}>
        <div style={styles.label}>現在のプラン</div>
        <div style={styles.value}>{isCompany ? "企業契約" : getPlanLabel(billing?.currentPlan)}</div>
        {isCompany ? (
          <div style={styles.stateBox}>
            <div style={styles.stateTitle}>{userName || "企業ユーザー"}</div>
            <div style={styles.stateDesc}>契約区分：企業契約</div>
            <div style={styles.stateDesc}>利用料金は企業契約に含まれています。個人で購入する必要はありません。</div>
          </div>
        ) : <State state={state} />}
        {!isCompany && (state === "active" || state === "trialing") ? (
          <div style={styles.grid}>
            <Info label="残り日数" value={`${daysLeft}日`} />
            <Info label="有効期限" value={formatDateJP(endDate)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function State({ state }: { state: ReturnType<typeof getBillingViewState> }) {
  const map: Record<ReturnType<typeof getBillingViewState>, readonly [string, string]> = {
    none: ["未契約", "まだプラン購入はありません。"],
    trialing: ["無料体験中", "1日無料体験が有効です。"],
    pending: ["支払い確認待ち", "コンビニ決済の場合、入金確認後に有効になります。"],
    past_due: ["支払いエラー", "もう一度お手続きください。"],
    canceled: ["停止中", "必要に応じて再購入してください。"],
    inactive: ["未有効", "学習を続けるにはプラン購入が必要です。"],
    expired: ["期間切れ", "再購入すると再開できます。"],
    active: ["利用中", "基本学習プランが有効です。"],
    company: ["企業契約", "企業コードにより学習できます。"],
  }
  const [title, description] = map[state]
  return (
    <div style={styles.stateBox}>
      <div style={styles.stateTitle}>{title}</div>
      <div style={styles.stateDesc}>{description}</div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.info}>
      <div style={styles.label}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { border: "1px solid rgba(0,0,0,.08)", borderRadius: 8, background: "#fff", padding: 18 },
  head: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  title: { fontWeight: 900, fontSize: 18 },
  sub: { marginTop: 4, fontSize: 13, color: "#6b7280" },
  link: { padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,.12)", color: "#111", textDecoration: "none", fontWeight: 900, fontSize: 13 },
  panel: { marginTop: 14, border: "1px solid rgba(0,0,0,.06)", borderRadius: 8, background: "#f8fafc", padding: 14 },
  label: { fontSize: 13, color: "#6b7280" },
  value: { marginTop: 6, fontWeight: 900, fontSize: 18 },
  stateBox: { marginTop: 12, padding: 12, borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,.08)" },
  stateTitle: { fontWeight: 900 },
  stateDesc: { marginTop: 5, fontSize: 13, color: "#6b7280", lineHeight: 1.6 },
  grid: { marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 },
  info: { padding: 12, borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,.08)" },
  infoValue: { marginTop: 5, fontWeight: 900, fontSize: 18 },
}
