"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/app/lib/firebase"
import { isCompanyAccount } from "@/app/lib/companyAccount"
import CheckoutResultNotice from "@/app/components/billing/CheckoutResultNotice"
import KonbiniGuideNotice from "@/app/components/billing/KonbiniGuideNotice"
import LegalFooter from "@/app/components/LegalFooter"
import AppHeader from "@/app/components/AppHeader"
import { PLAN_OPTIONS, formatYen, type DurationDays } from "@/app/lib/pricing"
type PaymentMethod = "card" | "convenience"

const FULL_ACCESS_PLAN = "7"

export default function PlansPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkout = searchParams.get("checkout")
  const [durationDays, setDurationDays] = useState<DurationDays>(90)
  const [method, setMethod] = useState<PaymentMethod>("convenience")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [companyUser, setCompanyUser] = useState(false)
  const [accountChecking, setAccountChecking] = useState(true)

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setAccountChecking(false)
      return
    }
    try {
      const snapshot = await getDoc(doc(db, "users", user.uid))
      setCompanyUser(snapshot.exists() && isCompanyAccount(snapshot.data()))
    } catch (loadError) {
      console.error("Failed to check company account on plans page", loadError)
    } finally {
      setAccountChecking(false)
    }
  }), [])

  const selected = useMemo(
    () => PLAN_OPTIONS.find((p) => p.durationDays === durationDays) ?? PLAN_OPTIONS[1],
    [durationDays]
  )

  if (accountChecking) {
    return <main style={styles.page}><div style={styles.shell}>契約情報を確認中...</div></main>
  }

  if (companyUser) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <AppHeader title="プラン" />
          <section style={styles.hero}>
            <p style={styles.eyebrow}>企業契約</p>
            <h1 style={styles.h1}>個人で購入する必要はありません</h1>
            <p style={styles.text}>利用料金は企業契約に含まれています。企業コードでログインして、そのまま学習を利用できます。</p>
          </section>
          <div style={styles.backWrap}><Link href="/select-mode" style={styles.backLink}>学習選択へ戻る</Link></div>
        </div>
      </main>
    )
  }

  const handleCheckout = async () => {
    setError("")
    setLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        router.push("/login")
        return
      }

      const idToken = await user.getIdToken(true)
      const res = await fetch("/api/komoju/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          plan: FULL_ACCESS_PLAN,
          method,
          durationDays,
          industry: "driver",
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "決済ページの作成に失敗しました。")
      }

      window.location.href = data.url
    } catch (e: unknown) {
      console.error(e)
      setError(e instanceof Error ? e.message : "決済ページの作成に失敗しました。")
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="プラン" />
        <CheckoutResultNotice checkout={checkout} />
        <KonbiniGuideNotice />

        <section style={styles.hero}>
          <p style={styles.eyebrow}>基本学習プラン</p>
          <h1 style={styles.h1}>利用期間を選んで学習を続ける</h1>
          <p style={styles.text}>
            外免切替の知識対策、日本語学習、復習機能を利用できます。自動更新はありません。
            長期割引はなく、30日あたり500円の同一料金です。コンビニ決済は入金確認後に有効化されます。
          </p>
        </section>

        {error ? <div style={styles.error}>{error}</div> : null}

        <section style={styles.card}>
          <h2 style={styles.h2}>利用期間</h2>
          <div style={styles.optionGrid}>
            {PLAN_OPTIONS.map((p) => {
              const active = p.durationDays === durationDays
              return (
                <button
                  key={p.durationDays}
                  type="button"
                  onClick={() => setDurationDays(p.durationDays)}
                  style={{ ...styles.option, ...(active ? styles.optionActive : null) }}
                >
                  {p.badge ? <span style={styles.badge}>{p.badge}</span> : null}
                  <span style={styles.optionTitle}>{p.label}</span>
                  <span style={styles.optionSub}>{p.sub}</span>
                  <span style={styles.price}>{formatYen(p.price)}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>支払い方法</h2>
          <div style={styles.payGrid}>
            <button
              type="button"
              onClick={() => setMethod("convenience")}
              style={{ ...styles.payOption, ...(method === "convenience" ? styles.payOptionActive : null) }}
            >
              <b>コンビニ決済</b>
              <span>入金確認後に利用開始</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("card")}
              style={{ ...styles.payOption, ...(method === "card" ? styles.payOptionActive : null) }}
            >
              <b>クレジットカード</b>
              <span>決済完了後すぐに利用可能</span>
            </button>
          </div>
        </section>

        <section style={styles.totalCard}>
          <div>
            <div style={styles.totalLabel}>今回のお支払い</div>
            <div style={styles.total}>{formatYen(selected.price)}</div>
            <p style={styles.text}>{selected.label}</p>
          </div>
          <button type="button" onClick={handleCheckout} disabled={loading} style={{ ...styles.checkout, opacity: loading ? 0.7 : 1 }}>
            {loading ? "決済ページを作成中..." : "購入へ進む"}
          </button>
        </section>

        <div style={styles.backWrap}>
          <Link href="/select-mode" style={styles.backLink}>学習選択へ戻る</Link>
        </div>

        <LegalFooter compact />
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px" },
  shell: { maxWidth: 900, margin: "0 auto" },
  hero: { marginTop: 12, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  eyebrow: { margin: 0, color: "#2563eb", fontWeight: 900, fontSize: 13 },
  h1: { margin: "6px 0 0", fontSize: 30, lineHeight: 1.2, fontWeight: 900 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.7, fontSize: 14 },
  card: { marginTop: 12, padding: 16, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  h2: { margin: 0, fontSize: 20, fontWeight: 900 },
  optionGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 },
  option: { position: "relative", minHeight: 128, padding: 14, borderRadius: 8, border: "1px solid rgba(17,24,39,.12)", background: "#fff", textAlign: "left", cursor: "pointer" },
  optionActive: { borderColor: "#2563eb", boxShadow: "0 0 0 2px rgba(37,99,235,.12)" },
  badge: { position: "absolute", top: 10, right: 10, padding: "4px 8px", borderRadius: 999, background: "#e0f2fe", fontSize: 11, fontWeight: 900 },
  optionTitle: { display: "block", fontWeight: 900, fontSize: 16 },
  optionSub: { display: "block", marginTop: 8, color: "#6b7280", fontSize: 13 },
  price: { display: "block", marginTop: 14, fontSize: 28, fontWeight: 900 },
  payGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 },
  payOption: { padding: 14, borderRadius: 8, border: "1px solid rgba(17,24,39,.12)", background: "#fff", textAlign: "left", cursor: "pointer", display: "grid", gap: 5 },
  payOptionActive: { background: "#111827", color: "#fff", borderColor: "#111827" },
  totalCard: { marginTop: 12, padding: 18, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" },
  totalLabel: { fontWeight: 900, color: "#475569", fontSize: 13 },
  total: { marginTop: 4, fontSize: 38, fontWeight: 900, color: "#1d4ed8" },
  checkout: { padding: "14px 20px", borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer" },
  error: { marginTop: 12, padding: 12, borderRadius: 8, background: "#fef2f2", color: "#991b1b", fontWeight: 800 },
  backWrap: { marginTop: 14 },
  backLink: { color: "#2563eb", fontWeight: 900, textDecoration: "none" },
}
