"use client"

import React, { useMemo } from "react"

export type BadgeToastItem = {
  id: string
  icon: string
  label: string
  rarity?: "common" | "rare" | "epic" | "legend"
}

function rarityFx(rarity?: BadgeToastItem["rarity"]) {
  switch (rarity) {
    case "rare":
      return { bg: "linear-gradient(135deg,#dbeafe,#eff6ff)", glow: "rgba(59,130,246,0.34)", ring: "rgba(59,130,246,0.22)" }
    case "epic":
      return { bg: "linear-gradient(135deg,#ede9fe,#f5f3ff)", glow: "rgba(124,58,237,0.36)", ring: "rgba(124,58,237,0.24)" }
    case "legend":
      return { bg: "linear-gradient(135deg,#fef3c7,#fff7ed)", glow: "rgba(245,158,11,0.40)", ring: "rgba(245,158,11,0.24)" }
    default:
      return { bg: "linear-gradient(135deg,#eef2f7,#f9fafb)", glow: "rgba(107,114,128,0.28)", ring: "rgba(107,114,128,0.18)" }
  }
}

export default function AchievementUnlockToast({
  item,
  visible,
}: {
  item: BadgeToastItem | null
  visible: boolean
}) {
  const fx = useMemo(() => rarityFx(item?.rarity), [item])

  if (!item) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        display: "grid",
        placeItems: "center",
        zIndex: 70,
      }}
    >
      <div
        style={{
          position: "relative",
          minWidth: 280,
          maxWidth: 380,
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.86)",
          background: fx.bg,
          boxShadow: `0 28px 70px ${fx.glow}`,
          padding: "18px 18px 16px",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(14px)",
          opacity: visible ? 1 : 0,
          transition: "all 240ms ease",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            right: -60,
            top: -90,
            borderRadius: 999,
            background: fx.ring,
            filter: "blur(16px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            left: -30,
            bottom: -70,
            borderRadius: 999,
            background: fx.ring,
            filter: "blur(14px)",
          }}
        />

        <div style={{ position: "relative", fontSize: 13, fontWeight: 900, letterSpacing: "0.12em", opacity: 0.68 }}>
          NEW ACHIEVEMENT
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.86)",
              boxShadow: "inset 0 2px 8px rgba(255,255,255,0.78), 0 14px 26px rgba(0,0,0,0.08)",
              fontSize: 36,
            }}
          >
            {item.icon}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.7 }}>🏆 新しい実績</div>
            <div style={{ marginTop: 4, fontSize: 20, fontWeight: 900, lineHeight: 1.25 }}>
              {item.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
