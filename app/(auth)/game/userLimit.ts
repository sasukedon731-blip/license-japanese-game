// app/(auth)/game/userLimit.ts
"use client"

import { db } from "@/app/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

const USER_LAST_PLAYED_KEY_FIELD = "jlptBattleLastPlayedKey"

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export async function canUserPlayToday(uid: string): Promise<boolean> {
  try {
    const ref = doc(db, "users", uid)
    const snap = await getDoc(ref)
    const data = snap.exists() ? (snap.data() as any) : {}
    const last = typeof data?.[USER_LAST_PLAYED_KEY_FIELD] === "string" ? (data[USER_LAST_PLAYED_KEY_FIELD] as string) : null
    return last !== todayKey()
  } catch {
    // If Firestore fails, be permissive (avoid blocking legit users)
    return true
  }
}

export async function markUserPlayedToday(uid: string) {
  try {
    const ref = doc(db, "users", uid)
    await setDoc(
      ref,
      {
        [USER_LAST_PLAYED_KEY_FIELD]: todayKey(),
        jlptBattleLastPlayedAt: serverTimestamp(),
      },
      { merge: true }
    )
  } catch {
    // ignore
  }
}
