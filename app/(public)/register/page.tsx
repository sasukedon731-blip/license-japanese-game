"use client"

import Link from "next/link"
import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { Timestamp, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import { auth, db } from "@/app/lib/firebase"
import { buildEntitledQuizTypes, normalizeSelectedForPlan, type PlanId } from "@/app/lib/plan"

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setError("")
    setLoading(true)

    if (!username.trim()) {
      setError("ユーザー名を入力してください。")
      setLoading(false)
      return
    }
    if (!email.trim()) {
      setError("メールアドレスを入力してください。")
      setLoading(false)
      return
    }
    if (!password || password.length < 6) {
      setError("パスワードは6文字以上で入力してください。")
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: username })

      const uid = userCredential.user.uid
      const plan: PlanId = "trial"
      const entitledQuizTypes = buildEntitledQuizTypes(plan)
      const selectedQuizTypes = normalizeSelectedForPlan([], entitledQuizTypes, plan)
      const trialEnd = addDays(new Date(), 1)

      await setDoc(doc(db, "users", uid), {
        uid,
        email: userCredential.user.email ?? email,
        displayName: username,
        role: "user",
        accountType: "personal",
        plan,
        schemaVersion: 3,
        selectedQuizTypes,
        billing: {
          accountType: "personal",
          method: "trial",
          status: "trialing",
          currentPlan: plan,
          currentPeriodEnd: Timestamp.fromDate(trialEnd),
          trialStartedAt: serverTimestamp(),
          trialEndsAt: Timestamp.fromDate(trialEnd),
        },
        nextChangeAllowedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push("/select-mode")
    } catch (err: any) {
      const code = err?.code ?? ""
      if (code === "auth/email-already-in-use") setError("このメールアドレスは既に登録されています。")
      else if (code === "auth/invalid-email") setError("メールアドレスの形式が正しくありません。")
      else if (code === "auth/weak-password") setError("パスワードが弱すぎます。6文字以上で入力してください。")
      else setError(code || "登録に失敗しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.h1}>新規登録</h1>
        <p style={styles.lead}>登録後、1日無料体験が自動で付与されます。</p>

        <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
        <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="パスワード（6文字以上）" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button onClick={handleRegister} disabled={loading} style={styles.button}>
          {loading ? "登録中..." : "無料体験を開始"}
        </button>

        <div style={styles.links}>
          <Link href="/company">企業コードで登録</Link>
          <Link href="/login">ログイン</Link>
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f7fb", padding: 16 },
  card: { width: "100%", maxWidth: 420, background: "#fff", border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: 22 },
  h1: { margin: 0, fontSize: 26, fontWeight: 900 },
  lead: { margin: "8px 0 18px", color: "#4b5563", lineHeight: 1.7 },
  input: { width: "100%", padding: 11, marginBottom: 10, borderRadius: 8, border: "1px solid #d1d5db" },
  button: { width: "100%", padding: 12, border: "none", borderRadius: 8, background: "#111827", color: "#fff", fontWeight: 900 },
  error: { color: "#b91c1c", fontWeight: 800 },
  links: { marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, fontWeight: 800 },
}
