"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User, signOut } from "firebase/auth"

import { auth } from "@/app/lib/firebase"
import Button from "@/app/components/Button"
import Card from "@/app/components/Card"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  // ログインユーザー監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
      // ✅ ゲストは登録へ
      if (!u) router.replace("/register")
    })
    return () => unsubscribe()
  }, [router])

  if (checking) {
    return (
      <main className="container">
        <p style={{ textAlign: "center", marginTop: 40 }}>読み込み中…</p>
      </main>
    )
  }

  // router.replaceが走るので描画しない
  if (!user) return null

  const handleLogout = async () => {
    await signOut(auth)
    router.replace("/login")
  }

  return (
    <main className="container">
      {/* タイトル */}
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>外免切替 Japanese Learning App</h1>

      {/* ユーザー名 */}
      <p style={{ textAlign: "center", marginBottom: 32 }}>
        ようこそ{" "}
        {user?.displayName ? `${user.displayName} さん` : user?.email ? user.email : "ユーザー さん"}
      </p>

      {/* クイズ選択 */}
      <Card>
        <h2 style={{ marginBottom: 16 }}>クイズを選択</h2>

        <Button variant="main" onClick={() => router.push("/select-mode?type=gaikoku-license")}>
          外国免許切替クイズ
        </Button>

        <Button variant="main" onClick={() => router.push("/select-mode?type=japanese-n4")}>
          日本語N4クイズ
        </Button>

        {/* ✅ ここを差し替え：安全教育 → 現場用語リスニング */}
        <Button variant="main" onClick={() => router.push("/select-mode?type=genba-listening")}>
          現場用語リスニング
        </Button>

        <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
          ※ MP3がなくても「読み上げ」で学習できます（問題画面の🔊ボタン）
        </div>
      </Card>

      {/* マイページ・ログアウト */}
      <Card>
        <Button variant="success" onClick={() => router.push("/mypage")}>
          マイページ
        </Button>

        <Button variant="accent" onClick={handleLogout}>
          ログアウト
        </Button>
      </Card>
    </main>
  )
}
