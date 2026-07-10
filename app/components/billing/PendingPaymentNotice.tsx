"use client"

import Link from "next/link"
import { getBillingViewState, type BillingLike } from "@/app/lib/billingAccess"

type Props = {
  billing?: BillingLike | null
}

export default function PendingPaymentNotice({ billing }: Props) {
  const state = getBillingViewState(billing)

  if (state !== "pending") return null

  return (
    <section
      style={{
        border: "1px solid #facc15",
        background: "#fffbeb",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16, color: "#92400e" }}>
        コンビニでのお支払い待ちです
      </div>

      <div style={{ marginTop: 8, fontSize: 14, color: "#78350f", lineHeight: 1.7 }}>
        お支払い完了後、自動でプランが有効になります。<br />
        反映まで <b>最大10分程度</b> かかる場合があります。
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 13,
          background: "white",
          border: "1px solid #fde68a",
          borderRadius: 12,
          padding: 12,
        }}
      >
        💡 支払い後も反映されない場合は、ページを再読み込みしてください。
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link
          href="/plans"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "#111",
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          プランを確認する
        </Link>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "white",
            fontWeight: 700,
          }}
        >
          更新する
        </button>
      </div>
    </section>
  )
}