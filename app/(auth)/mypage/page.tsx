"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import AppHeader from "@/app/components/AppHeader"
import BillingStatusCard from "@/app/components/billing/BillingStatusCard"
import type { BillingLike } from "@/app/lib/billingAccess"

export default function MyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [billing, setBilling] = useState<BillingLike | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login")
        return
      }
      setLoading(true)
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        const data = snap.exists() ? snap.data() : {}
        setDisplayName(data?.displayName || user.displayName || "")
        setEmail(user.email || data?.email || "")
        setBilling((data?.billing ?? null) as BillingLike | null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [router])

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>読み込み中...</div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <AppHeader title="マイページ" />

        <section style={styles.profile}>
          <div>
            <div style={styles.name}>{displayName || "ユーザー"}</div>
            <div style={styles.email}>{email}</div>
          </div>
        </section>

        <BillingStatusCard billing={billing} />

        <section style={styles.grid}>
          <Card href="/select-mode" title="学習を始める" text="外国免許切替、日本語系、ゲーム系から選びます。" />
          <Card href="/select-quizzes" title="教材を選ぶ" text="今月使う教材を確認・変更します。" />
          <Card href="/game" title="ゲーム" text="日本語バトルで反復練習します。" />
          <Card href="/mypage/achievements" title="バッジ" text="学習で獲得したバッジを確認します。" />
        </section>
      </div>
    </main>
  )
}

function Card({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} style={styles.cardLink}>
      <div style={styles.cardTitle}>{title}</div>
      <p style={styles.text}>{text}</p>
      <div style={styles.meta}>開く</div>
    </Link>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7fb", padding: "16px 14px 40px" },
  shell: { maxWidth: 920, margin: "0 auto" },
  profile: { marginTop: 12, marginBottom: 12, padding: 18, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)" },
  name: { fontSize: 24, fontWeight: 900 },
  email: { marginTop: 4, color: "#6b7280", fontSize: 13 },
  grid: { marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 },
  cardLink: { minHeight: 132, padding: 16, borderRadius: 8, background: "#fff", border: "1px solid rgba(17,24,39,.10)", color: "#111827", textDecoration: "none", display: "flex", flexDirection: "column" },
  cardTitle: { fontWeight: 900, fontSize: 16 },
  text: { margin: "8px 0 0", color: "#4b5563", lineHeight: 1.6, fontSize: 13 },
  meta: { marginTop: "auto", color: "#2563eb", fontWeight: 900 },
}
