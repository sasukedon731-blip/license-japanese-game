export type BillingLike = Partial<{
  status: "trialing" | "pending" | "active" | "past_due" | "canceled" | "inactive"
  currentPlan: "trial" | "free" | "3" | "5" | "7"
  currentPeriodEnd: unknown
  accountType: "personal" | "company"
}>

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    const d = value.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  if (typeof value === "object" && value !== null && "seconds" in value && typeof value.seconds === "number") {
    return new Date(value.seconds * 1000)
  }
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

export function isBillingActive(billing?: BillingLike | null) {
  if (!billing) return false
  if (billing.accountType === "company") return true
  if (billing.status !== "active" && billing.status !== "trialing") return false
  const end = toDate(billing.currentPeriodEnd)
  return !!end && end.getTime() > Date.now()
}

export function getBillingDaysLeft(billing?: BillingLike | null) {
  if (billing?.accountType === "company") return 0
  const end = toDate(billing?.currentPeriodEnd)
  if (!end) return 0
  const diff = end.getTime() - Date.now()
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

export function getBillingEndDate(billing?: BillingLike | null) {
  return toDate(billing?.currentPeriodEnd)
}

export function getBillingViewState(billing?: BillingLike | null) {
  if (!billing) return "none" as const
  if (billing.accountType === "company") return "company" as const
  if (billing.status === "trialing" && isBillingActive(billing)) return "trialing" as const
  if (billing.status === "pending") return "pending" as const
  if (billing.status === "past_due") return "past_due" as const
  if (billing.status === "canceled") return "canceled" as const
  if (billing.status === "inactive") return "inactive" as const
  if (isBillingActive(billing)) return "active" as const
  return "expired" as const
}

export function getPlanLabel(plan?: string | null) {
  switch (plan) {
    case "3":
    case "5":
    case "7":
      return "基本学習プラン"
    case "trial":
      return "1日無料体験"
    case "free":
      return "無料プラン"
    default:
      return "未契約"
  }
}

export function formatDateJP(date?: Date | null) {
  if (!date) return "-"
  return date.toLocaleDateString("ja-JP")
}
