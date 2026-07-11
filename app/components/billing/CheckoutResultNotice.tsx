"use client"

import type { CSSProperties } from "react"
import Link from "next/link"

type Props = {
  checkout?: string | null
}

export default function CheckoutResultNotice({ checkout }: Props) {
  if (checkout === "success") {
    return (
      <section style={successBox}>
        <div style={{ fontWeight: 900, fontSize: 20, color: "#166534" }}>
          ご購入ありがとうございます
        </div>
        <div style={successText}>
          購入手続きを受け付けました。クレジットカード決済は決済確認後、コンビニ決済は入金確認後に学習機能が有効になります。
          反映まで少し時間がかかる場合があります。マイページで利用状態をご確認ください。
        </div>
        <div style={buttonRow}>
          <Link href="/select-mode" style={primaryBtn}>学習を始める</Link>
          <Link href="/mypage" style={secondaryBtn}>マイページ</Link>
        </div>
      </section>
    )
  }

  if (checkout === "cancel") {
    return (
      <section style={cancelBox}>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>
          決済はまだ完了していません
        </div>
        <div style={cancelText}>
          もう一度プランを選び直して購入できます。コンビニ決済は入金確認後に反映されます。
        </div>
      </section>
    )
  }

  return null
}

const successBox: CSSProperties = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 8,
  padding: 20,
}

const cancelBox: CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  borderRadius: 8,
  padding: 20,
}

const successText: CSSProperties = {
  marginTop: 8,
  fontSize: 14,
  lineHeight: 1.8,
  color: "#166534",
}

const cancelText: CSSProperties = {
  marginTop: 8,
  fontSize: 14,
  lineHeight: 1.8,
  color: "#4b5563",
}

const buttonRow: CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
}

const primaryBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: 8,
  background: "#111827",
  color: "#ffffff",
  fontWeight: 900,
  textDecoration: "none",
}

const secondaryBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#ffffff",
  color: "#111827",
  fontWeight: 900,
  textDecoration: "none",
}
