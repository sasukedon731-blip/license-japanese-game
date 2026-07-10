// app/lib/useAuth.ts
"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "./firebase"
import { ensureUserProfile } from "./firestore"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)

      if (!u) return

      try {
        await ensureUserProfile({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
        })
      } catch (e) {
        console.error("ensureUserProfile failed", e)
      }
    })

    return () => unsub()
  }, [])

  return { user, loading }
}
