export const PLAN_PRICES = {
  30: 500,
  90: 1500,
  180: 3000,
} as const

export type DurationDays = keyof typeof PLAN_PRICES

export const PLAN_OPTIONS: ReadonlyArray<{
  durationDays: DurationDays
  label: string
  sub: string
  price: number
  badge?: string
}> = [
  { durationDays: 30, label: "30日プラン", sub: "まず試したい方向け", price: PLAN_PRICES[30] },
  { durationDays: 90, label: "90日プラン", sub: "継続学習におすすめ", price: PLAN_PRICES[90], badge: "おすすめ" },
  { durationDays: 180, label: "180日プラン", sub: "じっくり対策したい方向け", price: PLAN_PRICES[180], badge: "長期対策" },
]

export function formatYen(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`
}
