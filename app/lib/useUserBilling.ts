"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"

import { db } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"
import type { BillingLike } from "@/app/lib/billingAccess"

type UseUserBillingResult = {
  billing: BillingLike | null
  loading: boolean
  error: string
}

type UserDoc = {
  billing?: BillingLike
}

export function useUserBilling(): UseUserBillingResult {
  const { user, loading: authLoading } = useAuth()
  const [billing, setBilling] = useState<BillingLike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading) return

    if (!user?.uid) {
      setBilling(null)
      setLoading(false)
      setError("")
      return
    }

    setLoading(true)
    setError("")

    const ref = doc(db, "users", user.uid)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists() ? (snap.data() as UserDoc) : null
        setBilling(data?.billing ?? null)
        setLoading(false)
        setError("")
      },
      (err) => {
        console.error("useUserBilling onSnapshot error:", err)
        setBilling(null)
        setLoading(false)
        setError("課金状態の取得に失敗しました。")
      }
    )

    return () => unsub()
  }, [authLoading, user?.uid])

  return { billing, loading: authLoading || loading, error }
}
