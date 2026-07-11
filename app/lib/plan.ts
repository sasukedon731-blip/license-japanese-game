import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"

export type PlanId = "trial" | "free" | "3" | "5" | "7"
export type SelectLimit = number

export function getSelectLimit(plan: PlanId): SelectLimit {
  void plan
  return Object.keys(quizzes).length
}

export function buildEntitledQuizTypes(plan: PlanId): QuizType[] {
  void plan
  const all = Object.keys(quizzes) as QuizType[]
  return all
}

export function normalizeSelectedForPlan(
  selected: QuizType[],
  entitled: QuizType[],
  plan: PlanId
): QuizType[] {
  const uniq = Array.from(new Set(selected)).filter((q) => entitled.includes(q))
  const limit = getSelectLimit(plan)

  const trimmed = uniq.slice(0, limit)

  if (trimmed.length < limit) {
    for (const q of entitled) {
      if (trimmed.length >= limit) break
      if (!trimmed.includes(q)) trimmed.push(q)
    }
  }

  return trimmed
}

export type BillingStatus = "trialing" | "pending" | "active" | "past_due" | "canceled" | "inactive"
export type BillingMethod = "convenience" | "card" | "bank_transfer"
export type AccountType = "personal" | "company"

export function getBillingStatus(userDoc: any): BillingStatus {
  if (userDoc?.accountType === "company" || userDoc?.billing?.accountType === "company") {
    return "active"
  }

  const s = userDoc?.billing?.status
  if (
    s === "trialing" ||
    s === "pending" ||
    s === "active" ||
    s === "past_due" ||
    s === "canceled" ||
    s === "inactive"
  ) {
    return s
  }
  return "inactive"
}

export function isAccessActive(userDoc: any): boolean {
  if (userDoc?.accountType === "company" || userDoc?.billing?.accountType === "company") {
    return true
  }

  const status = getBillingStatus(userDoc)
  if (status !== "active" && status !== "trialing") return false

  const end = userDoc?.billing?.currentPeriodEnd
  if (!end) return false

  try {
    const endDate = typeof end?.toDate === "function" ? end.toDate() : new Date(end)
    return endDate.getTime() > Date.now()
  } catch {
    return false
  }
}

export function getEffectivePlanId(userDoc: any): PlanId {
  if (userDoc?.accountType === "company" || userDoc?.billing?.accountType === "company") return "7"

  const p = userDoc?.billing?.currentPlan ?? userDoc?.plan
  return p === "trial" || p === "free" || p === "3" || p === "5" || p === "7"
    ? p
    : "trial"
}
