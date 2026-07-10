// app/lib/entitlement.ts
"use client"

import { db } from "@/app/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export type UserEntitlement = {
  quizLimit: number
  selectedQuizTypes: string[]
}

export async function getUserEntitlement(uid: string): Promise<UserEntitlement> {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  const data = snap.exists() ? (snap.data() as any) : {}

  return {
    quizLimit: typeof data.quizLimit === "number" ? data.quizLimit : 3,
    selectedQuizTypes: Array.isArray(data.selectedQuizTypes) ? data.selectedQuizTypes : [],
  }
}

export async function setSelectedQuizTypes(uid: string, selectedQuizTypes: string[]) {
  const ref = doc(db, "users", uid)
  await setDoc(
    ref,
    {
      selectedQuizTypes,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export function canAccessQuiz(selectedQuizTypes: string[], quizType: string) {
  return selectedQuizTypes.includes(quizType)
}
