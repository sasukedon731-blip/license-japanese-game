"use client"

import { db } from "@/app/lib/firebase"
import { Timestamp, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

export type UserRole = "admin" | "company_admin" | "user"

type EnsureParams = {
  uid: string
  email?: string | null
  displayName?: string | null
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function createTrialBilling() {
  const trialEnd = addDays(new Date(), 1)
  return {
    accountType: "personal",
    method: "trial",
    status: "trialing",
    currentPlan: "trial",
    currentPeriodEnd: Timestamp.fromDate(trialEnd),
    trialStartedAt: serverTimestamp(),
    trialEndsAt: Timestamp.fromDate(trialEnd),
  }
}

export async function ensureUserProfile(params: EnsureParams) {
  const { uid } = params
  const email = params.email ?? null
  const displayName = params.displayName ?? null

  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      email,
      displayName,
      role: "user" as UserRole,
      accountType: "personal",
      plan: "trial",
      selectedQuizTypes: [],
      billing: createTrialBilling(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return
  }

  const data = snap.data() as any
  const patch: Record<string, any> = {
    uid,
    updatedAt: serverTimestamp(),
  }

  if (email && !data?.email) patch.email = email
  if (displayName && !data?.displayName) patch.displayName = displayName
  if (!data?.accountType) patch.accountType = "personal"
  if (!data?.plan) patch.plan = "trial"
  if (!Array.isArray(data?.selectedQuizTypes)) patch.selectedQuizTypes = []
  if (!data?.billing && data?.accountType !== "company") patch.billing = createTrialBilling()

  await setDoc(ref, patch, { merge: true })
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return "user"
  const role = (snap.data() as any)?.role
  return role === "admin" || role === "company_admin" ? role : "user"
}
