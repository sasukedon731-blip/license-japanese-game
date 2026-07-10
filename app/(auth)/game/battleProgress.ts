"use client"

import { db } from "@/app/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export function comboMultiplier(nextCombo: number) {
  if (nextCombo >= 10) return 2.0
  if (nextCombo >= 5) return 1.5
  if (nextCombo >= 3) return 1.2
  return 1.0
}

/**
 * Cumulative XP thresholds (level 1 starts at 0 XP)
 * - Lv2: 100
 * - Lv3: 250
 * - Lv4: 500
 * - Lv5: 900
 * After Lv5, it grows steadily.
 */
export function levelFromXp(totalXp: number) {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4400, 5400]
  let lvl = 1
  for (let i = 1; i < thresholds.length; i++) {
    if (totalXp >= thresholds[i]) lvl = i + 1
  }
  if (totalXp < thresholds[thresholds.length - 1]) return lvl

  // After the last threshold: +600 XP per level
  const baseLvl = thresholds.length
  const baseXp = thresholds[thresholds.length - 1]
  const extra = Math.floor((totalXp - baseXp) / 600)
  return baseLvl + extra
}

export async function addJlptBattleXp(uid: string, xpGain: number) {
  if (!uid) return
  if (!Number.isFinite(xpGain) || xpGain <= 0) return

  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  const data = snap.exists() ? (snap.data() as any) : {}

  const prevXp = typeof data?.jlptBattleXp === "number" ? (data.jlptBattleXp as number) : 0
  const nextXp = prevXp + Math.floor(xpGain)
  const nextLevel = levelFromXp(nextXp)

  await setDoc(
    ref,
    {
      jlptBattleXp: nextXp,
      jlptBattleLevel: nextLevel,
      jlptBattleUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
