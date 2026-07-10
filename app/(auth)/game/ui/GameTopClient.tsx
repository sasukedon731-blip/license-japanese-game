"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"

import AppHeader from "@/app/components/AppHeader"
import { db } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"

import styles from "./gameTop.module.css"

type Kind = "tile-drop" | "flash-judge" | "memory-burst"

type GameCard = {
  kind: Kind
  title: string
  desc: string
  tags: string[]
}

const GAMES: GameCard[] = [
  {
    kind: "tile-drop",
    title: "文字ブレイク",
    desc: "落ちてくる問題を、正しい順番でタップして破壊。読み・穴埋め・助詞に強い。",
    tags: ["3ミスで終了", "コンボ", "テンポ"],
  },
  {
    kind: "flash-judge",
    title: "瞬判ジャッジ",
    desc: "文が正しいなら○、間違いなら×。テンポ良く直感で鍛える。",
    tags: ["○×", "反射", "コンボ加点"],
  },
  {
    kind: "memory-burst",
    title: "フラッシュ記憶",
    desc: "一瞬だけ表示 → 記憶して4択。短時間で記憶力を鍛える。",
    tags: ["4択", "短期記憶", "テンポ"],
  },
]

export default function GameTopClient() {
  const router = useRouter()
  const { user } = useAuth()

  // ✅ TOPでは「ランキングは出さない」方針（3ゲームが分かりにくくなるため）
  // 代わりにログイン済みなら「自分のベスト」だけ表示する
  const [myBest, setMyBest] = useState<Record<Kind, number | null>>({
    "tile-drop": null,
    "flash-judge": null,
    "memory-burst": null,
  })
  const [loadingBest, setLoadingBest] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMyBest(kind: Kind): Promise<number | null> {
      if (!user) return null
      const ref = doc(db, "attackLeaderboards", kind, "entries", user.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) return 0
      const v: any = snap.data()
      return Number(v?.bestScore ?? 0) || 0
    }

    async function run() {
      try {
        setLoadingBest(true)

        if (!user) {
          setMyBest({ "tile-drop": null, "flash-judge": null, "memory-burst": null })
          return
        }

        const results: Array<[Kind, number | null]> = await Promise.all(
          (GAMES.map((g) => g.kind) as Kind[]).map(async (k) => {
            try {
              const s = await loadMyBest(k)
              return [k, s] as [Kind, number | null]
            } catch {
              return [k, null] as [Kind, number | null]
            }
          })
        )

        if (cancelled) return

        const next: Record<Kind, number | null> = {
          "tile-drop": null,
          "flash-judge": null,
          "memory-burst": null,
        }
        for (const [k, s] of results) next[k] = s
        setMyBest(next)
      } finally {
        if (!cancelled) setLoadingBest(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [user])

  const cards = useMemo(() => GAMES, [])

  return (
    <main className={styles.wrap}>
      <AppHeader />

      <section className={styles.head}>
        <h1 className={styles.h1}>ゲーム</h1>
        <p className={styles.lead}>遊びたいゲームを選ぶ → 説明ページでモード/級を選ぶ → プレイ開始。</p>
      </section>

      <section className={styles.cards}>
        {cards.map((c) => {
          const best = myBest[c.kind]
          return (
            <div key={c.kind} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardTitle}>{c.title}</div>
                <div className={styles.cardDesc}>{c.desc}</div>

                <div className={styles.tags}>
                  {c.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className={styles.rankBox}>
                  <div className={styles.rankHead}>あなたのベスト（アタック）</div>
                  {!user ? (
                    <div className={styles.rankEmpty}>ログインすると表示されます</div>
                  ) : loadingBest ? (
                    <div className={styles.rankEmpty}>読み込み中…</div>
                  ) : best === null ? (
                    <div className={styles.rankEmpty}>取得できませんでした</div>
                  ) : best === 0 ? (
                    <div className={styles.rankEmpty}>まだ記録がありません</div>
                  ) : (
                    <div className={styles.myBestRow}>
                      <span className={styles.myBestLabel}>ベスト</span>
                      <span className={styles.myBestScore}>{best}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {/* ✅ iOSでのタップ判定のズレ回避：Linkではなく router.push で確実に遷移 */}
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnMain}`}
                  onClick={() => {
                    try {
                      sessionStorage.setItem("lastGameKind", c.kind)
                    } catch {}
                    router.push(`/game/${c.kind}`)
                  }}
                >
                  チャレンジ
                </button>
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}