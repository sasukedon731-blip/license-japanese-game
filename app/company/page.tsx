"use client"

import Link from "next/link"
import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import { auth, db } from "@/app/lib/firebase"
import { buildEntitledQuizTypes, normalizeSelectedForPlan } from "@/app/lib/plan"

export default function CompanyPage() {
  const router = useRouter()
  const [companyCode, setCompanyCode] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const register = async () => {
    setError("")
    setLoading(true)
    try {
      const code = companyCode.trim().toUpperCase()
      if (!code) throw new Error("企業コードを入力してください。")
      if (!name.trim()) throw new Error("氏名を入力してください。")
      if (!email.trim()) throw new Error("メールアドレスを入力してください。")
      if (password.length < 6) throw new Error("パスワードは6文字以上で入力してください。")

      const companySnap = await getDoc(doc(db, "companies", code))
      if (!companySnap.exists()) throw new Error("企業コードが見つかりません。")
      const company = companySnap.data() as any
      if (company?.active === false) throw new Error("この企業コードは現在利用できません。")

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })

      const entitled = buildEntitledQuizTypes("7")
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email ?? email,
        displayName: name,
        role: "user",
        accountType: "company",
        companyCode: code,
        companyName: company?.name ?? code,
        plan: "7",
        selectedQuizTypes: normalizeSelectedForPlan([], entitled, "7"),
        billing: {
          accountType: "company",
          method: "company",
          status: "active",
          currentPlan: "7",
          currentPeriodEnd: null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push("/select-mode")
    } catch (e: any) {
      setError(e?.message ?? "企業コード登録に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.h1}>企業コードで登録</h1>
        <p style={styles.lead}>企業契約ユーザーは支払い不要で学習できます。トライアル表示やプラン誘導は行われません。</p>
        <input style={styles.input} value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} placeholder="企業コード" />
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="氏名" />
        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" />
        <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード（6文字以上）" />
        {error ? <p style={styles.error}>{error}</p> : null}
        <button type="button" disabled={loading} onClick={register} style={styles.button}>
          {loading ? "登録中..." : "企業アカウントを作成"}
        </button>
        <div style={styles.links}>
          <Link href="/register">個人登録へ</Link>
          <Link href="/for-business">法人向け案内</Link>
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f7fb", padding: 16 },
  card: { width: "100%", maxWidth: 460, background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 22 },
  h1: { margin: 0, fontSize: 26, fontWeight: 900 },
  lead: { margin: "8px 0 18px", color: "#4b5563", lineHeight: 1.7 },
  input: { width: "100%", padding: 11, marginBottom: 10, borderRadius: 8, border: "1px solid #d1d5db" },
  button: { width: "100%", padding: 12, border: "none", borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 900 },
  error: { color: "#b91c1c", fontWeight: 800 },
  links: { marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, fontWeight: 800 },
}
