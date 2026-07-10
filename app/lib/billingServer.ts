import { adminDb } from "@/app/lib/firebaseAdmin"
import { buildEntitledQuizTypes, normalizeSelectedForPlan } from "@/app/lib/plan"
import type { QuizType } from "@/app/data/types"

export type BillingStatus = "trialing" | "pending" | "active" | "past_due" | "canceled" | "inactive"
export type BillingMethod = "trial" | "company" | "komoju"
export type PlanId = "trial" | "free" | "3" | "5" | "7"

export type BillingPatch = Partial<{
  accountType: "personal" | "company"
  method: BillingMethod
  status: BillingStatus
  currentPlan: PlanId
  currentPeriodEnd: unknown
  komojuSessionId: string | null
  komojuPaymentId: string | null
  komojuOrderId: string | null
  komojuPaymentMethod: "convenience" | "card" | null
  updatedAt: unknown
  purchasedDurationDays: 30 | 90 | 180
}>

type UserDoc = {
  selectedQuizTypes?: QuizType[]
  billing?: BillingPatch
}

function isPaidPlanId(v: unknown): v is "3" | "5" | "7" {
  return v === "3" || v === "5" || v === "7"
}

function toDateOrNull(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    const d = value.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

function addDays(from: Date, days: number) {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d
}

function nextMonthDate(from = new Date()) {
  const d = new Date(from)
  d.setMonth(d.getMonth() + 1)
  return d
}

function calcExtendedEnd(currentEnd: unknown, durationDays: 30 | 90 | 180) {
  const now = new Date()
  const current = toDateOrNull(currentEnd)
  const base = current && current.getTime() > now.getTime() ? current : now
  return addDays(base, durationDays)
}

export async function setUserIndustryMerge(uid: string, industry: string) {
  await adminDb().collection("users").doc(uid).set(
    {
      industry,
      updatedAt: new Date(),
    },
    { merge: true }
  )
}

export async function patchUserBilling(uid: string, patch: BillingPatch) {
  const ref = adminDb().collection("users").doc(uid)
  const snap = await ref.get()
  const current = (snap.exists ? (snap.data() as UserDoc) : {}) as UserDoc

  await ref.set(
    {
      billing: {
        ...(current.billing ?? {}),
        ...patch,
      },
      updatedAt: new Date(),
    },
    { merge: true }
  )
}

export async function setUserBillingMerge(uid: string, patch: BillingPatch) {
  const ref = adminDb().collection("users").doc(uid)
  const snap = await ref.get()
  const current = (snap.exists ? (snap.data() as UserDoc) : {}) as UserDoc
  const currentBilling = current.billing ?? {}

  const nextBilling: BillingPatch = {
    ...currentBilling,
    ...patch,
  }

  const becomingActive = patch.status === "active"
  if (becomingActive && patch.purchasedDurationDays) {
    nextBilling.currentPeriodEnd = calcExtendedEnd(
      currentBilling.currentPeriodEnd,
      patch.purchasedDurationDays
    )
  }

  const next: Record<string, unknown> = {
    billing: nextBilling,
    updatedAt: new Date(),
  }

  if (becomingActive && isPaidPlanId(patch.currentPlan)) {
    const entitled = buildEntitledQuizTypes(patch.currentPlan)
    next.selectedQuizTypes = normalizeSelectedForPlan(
      (current.selectedQuizTypes ?? []) as QuizType[],
      entitled,
      patch.currentPlan
    )
    next.nextChangeAllowedAt = nextMonthDate()
    next.plan = patch.currentPlan
  }

  await ref.set(next, { merge: true })
}
