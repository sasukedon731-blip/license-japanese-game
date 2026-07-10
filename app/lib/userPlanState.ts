"use client"

import { db } from "@/app/lib/firebase"
import type { QuizType } from "@/app/data/types"
import { quizzes } from "@/app/data/quizzes"
import {
  buildEntitledQuizTypes,
  normalizeSelectedForPlan,
  type PlanId,
} from "@/app/lib/plan"

import {
  Timestamp,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"

export type UserPlanState = {
  devUnlockAll?: boolean
  plan: PlanId
  entitledQuizTypes: QuizType[]
  selectedQuizTypes: QuizType[]
  nextChangeAllowedAt: Date | null
  displayName: string
  schemaVersion: number
  accountType: "personal" | "company"
}

function isPlanId(v: unknown): v is PlanId {
  return v === "trial" || v === "free" || v === "3" || v === "5" || v === "7"
}

function coercePlanId(v: unknown): PlanId | null {
  if (isPlanId(v)) return v
  if (typeof v === "number") {
    if (v === 1) return "trial"
    if (v === 3) return "3"
    if (v === 5) return "5"
    if (v === 7) return "7"
  }
  if (typeof v === "string") {
    const s = v.trim()
    if (s === "1") return "trial"
    if (s === "3") return "3"
    if (s === "5") return "5"
    if (s === "7") return "7"
  }
  return null
}

function inferPlanFromLegacy(data: any): PlanId {
  const coerced = coercePlanId(data?.plan)
  if (coerced) return coerced

  const limit = typeof data?.quizLimit === "number" ? data.quizLimit : null
  if (limit === 5) return "5"
  if (limit === 7) return "7"
  if (limit === 3) return "3"
  return "trial"
}

function toDateOrNull(v: any): Date | null {
  if (!v) return null
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v
  if (typeof v?.toDate === "function") {
    const d = v.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isCompanyAccount(data: any) {
  return data?.accountType === "company" || data?.billing?.accountType === "company"
}

function trialBilling(plan: PlanId) {
  const trialEnd = addDays(new Date(), 1)
  return {
    accountType: "personal",
    method: "trial",
    status: "trialing",
    currentPlan: plan,
    currentPeriodEnd: Timestamp.fromDate(trialEnd),
    trialStartedAt: serverTimestamp(),
    trialEndsAt: Timestamp.fromDate(trialEnd),
  }
}

export async function loadAndRepairUserPlanState(uid: string): Promise<UserPlanState> {
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  const data = snap.exists() ? (snap.data() as any) : {}

  const displayName = typeof data?.displayName === "string" ? data.displayName : ""
  const devUnlockAll = data?.devUnlockAll === true
  const allQuizTypes = Object.keys(quizzes) as QuizType[]

  if (devUnlockAll) {
    return {
      plan: "7",
      entitledQuizTypes: allQuizTypes,
      selectedQuizTypes: allQuizTypes,
      nextChangeAllowedAt: null,
      displayName,
      schemaVersion: 3,
      devUnlockAll: true,
      accountType: "personal",
    }
  }

  const accountType = isCompanyAccount(data) ? "company" : "personal"
  const plan = accountType === "company" ? "7" : inferPlanFromLegacy(data)
  const entitled = buildEntitledQuizTypes(plan)
  const rawSelected = Array.isArray(data?.selectedQuizTypes)
    ? (data.selectedQuizTypes as QuizType[])
    : []
  const selected = normalizeSelectedForPlan(rawSelected, entitled, plan)
  const nextChangeAllowedAt = toDateOrNull(data?.nextChangeAllowedAt)

  const patch: Record<string, any> = {}
  let needUpdate = false

  if (data?.schemaVersion !== 3) {
    patch.schemaVersion = 3
    needUpdate = true
  }

  if (data?.accountType !== accountType) {
    patch.accountType = accountType
    needUpdate = true
  }

  if (!isPlanId(data?.plan) || data.plan !== plan) {
    patch.plan = plan
    needUpdate = true
  }

  if (!data?.billing) {
    patch.billing =
      accountType === "company"
        ? {
            accountType: "company",
            method: "company",
            status: "active",
            currentPlan: "7",
            currentPeriodEnd: null,
          }
        : trialBilling(plan)
    needUpdate = true
  } else if (data.billing.currentPlan !== plan || data.billing.accountType !== accountType) {
    patch.billing = {
      ...data.billing,
      accountType,
      currentPlan: plan,
    }
    needUpdate = true
  }

  if (JSON.stringify(rawSelected) !== JSON.stringify(selected)) {
    patch.selectedQuizTypes = selected
    needUpdate = true
  }

  if (data?.entitledQuizTypes) {
    patch.entitledQuizTypes = deleteField()
    needUpdate = true
  }
  if (typeof data?.quizLimit === "number") {
    patch.quizLimit = deleteField()
    needUpdate = true
  }

  if (needUpdate) {
    patch.updatedAt = serverTimestamp()
    await setDoc(ref, patch, { merge: true })
  }

  return {
    plan,
    entitledQuizTypes: entitled,
    selectedQuizTypes: selected,
    nextChangeAllowedAt,
    displayName,
    schemaVersion: 3,
    devUnlockAll: false,
    accountType,
  }
}

export async function saveSelectedQuizTypesWithLock(params: {
  uid: string
  selectedQuizTypes: QuizType[]
}): Promise<{ saved: QuizType[]; nextChangeAllowedAt: Date | null }> {
  const state = await loadAndRepairUserPlanState(params.uid)
  const normalized = normalizeSelectedForPlan(
    params.selectedQuizTypes,
    state.entitledQuizTypes,
    state.plan
  )

  const now = new Date()
  const lockedUntil = state.nextChangeAllowedAt
  const isLocked = lockedUntil ? now < lockedUntil : false
  const next = isLocked ? lockedUntil : addMonths(now, 1)

  await setDoc(
    doc(db, "users", params.uid),
    {
      selectedQuizTypes: normalized,
      nextChangeAllowedAt: next ? Timestamp.fromDate(next) : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return { saved: normalized, nextChangeAllowedAt: next }
}

export async function saveIndustryWithLock(params: {
  uid: string
  industry: string
}): Promise<{ saved: string; nextChangeAllowedAt: Date | null; locked: boolean }> {
  const state = await loadAndRepairUserPlanState(params.uid)
  const now = new Date()
  const lockedUntil = state.nextChangeAllowedAt
  const isLocked = lockedUntil ? now < lockedUntil : false
  const next = isLocked ? lockedUntil : addMonths(now, 1)

  await setDoc(
    doc(db, "users", params.uid),
    {
      industry: params.industry,
      nextChangeAllowedAt: next ? Timestamp.fromDate(next) : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return { saved: params.industry, nextChangeAllowedAt: next, locked: isLocked }
}

export async function savePlanAndNormalizeSelected(params: {
  uid: string
  plan: PlanId
}): Promise<UserPlanState> {
  const ref = doc(db, "users", params.uid)
  const snap = await getDoc(ref)
  const data = snap.exists() ? (snap.data() as any) : {}
  const accountType = isCompanyAccount(data) ? "company" : "personal"
  const plan = accountType === "company" ? "7" : params.plan

  const entitled = buildEntitledQuizTypes(plan)
  const rawSelected = Array.isArray(data?.selectedQuizTypes)
    ? (data.selectedQuizTypes as QuizType[])
    : []
  const selected = normalizeSelectedForPlan(rawSelected, entitled, plan)

  await setDoc(
    ref,
    {
      accountType,
      plan,
      schemaVersion: 3,
      billing: data?.billing
        ? { ...data.billing, accountType, currentPlan: plan }
        : accountType === "company"
          ? {
              accountType: "company",
              method: "company",
              status: "active",
              currentPlan: "7",
              currentPeriodEnd: null,
            }
          : trialBilling(plan),
      selectedQuizTypes: selected,
      entitledQuizTypes: deleteField(),
      quizLimit: deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return {
    plan,
    entitledQuizTypes: entitled,
    selectedQuizTypes: selected,
    nextChangeAllowedAt: toDateOrNull(data?.nextChangeAllowedAt),
    displayName: typeof data?.displayName === "string" ? data.displayName : "",
    schemaVersion: 3,
    devUnlockAll: false,
    accountType,
  }
}
