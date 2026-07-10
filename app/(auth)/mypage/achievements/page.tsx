"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import {
  getAllBadgeMeta,
  getBadgeGroupLabel,
  getRarityColors,
  getTotalBadgeCount,
  getUnlockedBadgeCount,
} from "@/app/lib/badges"

type BadgeView = ReturnType<typeof getAllBadgeMeta>[number]

export default function AchievementsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [badgeIds, setBadgeIds] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login")
        return
      }

      try {
        const ref = doc(db, "users", u.uid)
        const snap = await getDoc(ref)
        const data = snap.exists() ? (snap.data() as Record<string, unknown>) : {}
        const list = Array.isArray(data.badges)
          ? data.badges.filter((x): x is string => typeof x === "string")
          : []
        setBadgeIds(list)
      } catch (error) {
        console.error("Failed to load badges:", error)
        setBadgeIds([])
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  const badges = useMemo(() => getAllBadgeMeta(badgeIds), [badgeIds])

  const groups = useMemo(() => {
    const set = new Set(badges.map((b) => b.group))
    return ["all", ...Array.from(set)]
  }, [badges])

  const filtered = useMemo(() => {
    if (selectedGroup === "all") return badges
    return badges.filter((b) => b.group === selectedGroup)
  }, [badges, selectedGroup])

  if (loading) {
    return (
      <main style={S.page}>
        <div style={S.wrap}>
          <section style={S.card}>読み込み中...</section>
        </div>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <div style={S.wrap}>
        <header style={S.header}>
          <div>
            <div style={S.title}>🏅 実績一覧</div>
            <div style={S.sub}>
              獲得 {getUnlockedBadgeCount(badgeIds)} / {getTotalBadgeCount()}
            </div>
          </div>

          <Link href="/mypage" style={S.backBtn}>
            ← マイページ
          </Link>
        </header>

        <section style={S.card}>
          <div style={S.filterRow}>
            {groups.map((g) => {
              const active = selectedGroup === g
              const label = g === "all" ? "すべて" : getBadgeGroupLabel(g as any)

              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGroup(g)}
                  style={{
                    ...S.filterBtn,
                    background: active ? "#111827" : "#fff",
                    color: active ? "#fff" : "#111827",
                    borderColor: active ? "#111827" : "#e5e7eb",
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div style={S.grid}>
            {filtered.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function BadgeCard({ badge }: { badge: BadgeView }) {
  const c = getRarityColors(badge.rarity)
  const isLocked = !badge.unlocked
  const imageSrc = badge.image

  return (
    <div
      style={{
        ...S.badgeCard,
        border: `1px solid ${isLocked ? "#d1d5db" : c.border}`,
        background: isLocked
          ? "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)"
          : c.bg,
        boxShadow: isLocked
          ? "0 10px 22px rgba(15,23,42,0.08)"
          : `0 14px 28px ${c.glow}`,
      }}
    >
      <div
        style={{
          ...S.badgeIconWrap,
          background: isLocked
            ? "linear-gradient(135deg, #d1d5db 0%, #b8bec8 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.78) 100%)",
          boxShadow: isLocked
            ? "inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.08)"
            : "inset 0 2px 10px rgba(255,255,255,0.78), 0 8px 18px rgba(0,0,0,0.10)",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={badge.label}
            width={72}
            height={72}
            style={{
              ...S.badgeImage,
              filter: isLocked
                ? "grayscale(1) saturate(0) brightness(0.78) opacity(0.48)"
                : "none",
              transform: isLocked ? "scale(0.96)" : "scale(1.02)",
            }}
          />
        ) : (
          <div
            style={{
              ...S.badgeIcon,
              filter: isLocked
                ? "grayscale(1) saturate(0) brightness(0.72) opacity(0.42)"
                : "none",
              transform: isLocked ? "scale(0.96)" : "scale(1.05)",
            }}
          >
            {badge.icon}
          </div>
        )}
      </div>

      <div style={S.badgeBody}>
        <div style={S.badgeTopRow}>
          <span style={S.badgeTitle}>
            {isLocked && badge.hidden ? "？？？？？" : badge.label}
          </span>

          <span
            style={{
              ...S.badgeState,
              background: isLocked ? "rgba(15,23,42,0.08)" : "#111827",
              color: isLocked ? "#64748b" : "#fff",
            }}
          >
            {isLocked ? "LOCKED" : "GET"}
          </span>
        </div>

        <div style={S.badgeDesc}>
          {isLocked && badge.hidden
            ? "条件不明のシークレットバッジ"
            : badge.description}
        </div>

        <div style={S.badgeHowTo}>
          条件：{isLocked && badge.hidden ? "？？？" : badge.howToUnlock}
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> & Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: 18,
  },
  wrap: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.75,
    fontWeight: 700,
  },
  backBtn: {
    textDecoration: "none",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 900,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterBtn: {
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  badgeCard: {
    borderRadius: 24,
    padding: 16,
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    transition: "all 0.2s ease",
  },
  badgeIconWrap: {
    width: 78,
    height: 78,
    minWidth: 78,
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.72)",
    overflow: "hidden",
  },
  badgeIcon: {
    fontSize: 38,
    lineHeight: 1,
  },
  badgeImage: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  badgeBody: {
    minWidth: 0,
    flex: 1,
  },
  badgeTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  badgeTitle: {
    fontWeight: 900,
    fontSize: 17,
    letterSpacing: "0.02em",
  },
  badgeState: {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
    whiteSpace: "nowrap",
    letterSpacing: "0.06em",
  },
  badgeDesc: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.65,
    opacity: 0.88,
  },
  badgeHowTo: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.6,
    fontWeight: 800,
    opacity: 0.78,
  },
}
