"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"

import styles from "./gameKind.module.css"
import { db } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"
import type { QuizType } from "@/app/data/types"

type Kind = "tile-drop" | "flash-judge" | "memory-burst"
type Mode = "normal" | "attack"

function normalizeKind(v: unknown): string {
  const s = String(v ?? "")
  let t = s
  try {
    t = decodeURIComponent(s)
  } catch {}
  t = t.split("?")[0].split("#")[0]
  return t.trim().toLowerCase()
}

function toKind(v: unknown): Kind {
  const k = normalizeKind(v)
  if (k === "tile-drop" || k === "flash-judge" || k === "memory-burst") return k
  if (k === "flashjudge") return "flash-judge"
  if (k === "memoryburst") return "memory-burst"
  return "tile-drop"
}

function isQuizType(v: any): v is QuizType {
  return (
    v === "japanese-n4" ||
    v === "japanese-n3" ||
    v === "japanese-n2" ||
    v === "gaikoku-license" ||
    v === "genba-listening" ||
    v === "road-signs"
  )
}

function kindMeta(kind: Kind) {
  if (kind === "tile-drop") {
    return {
      title: "文字ブレイク",
      desc: "落ちてくる問題を、正しい順番でタップして破壊。読み・穴埋め・助詞をテンポ良く反復する。",
      rules: ["3ミスで終了", "コンボで加点", "テンポ良く反復"],
    }
  }
  if (kind === "flash-judge") {
    return {
      title: "瞬判ジャッジ",
      desc: "文が正しいなら○、間違いなら×。反射で文法を鍛える。",
      rules: ["3ミスで終了", "○×で回答", "反射で判断"],
    }
  }
  return {
    title: "フラッシュ記憶",
    desc: "一瞬だけ表示 → 記憶して4択。記憶の瞬発力を鍛える。",
    rules: ["3ミスで終了", "4択", "テンポ重視"],
  }
}

export default function GameKindClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user } = useAuth()

  // ✅ params.kind が死んでも大丈夫：URLパスから kind を確実に取得
  const kindFromPath = useMemo(() => {
    const seg = pathname.split("/").filter(Boolean).pop() ?? ""
    return seg
  }, [pathname])

  const safeKind: Kind = useMemo(() => toKind(kindFromPath), [kindFromPath])
  const meta = useMemo(() => kindMeta(safeKind), [safeKind])

  // クエリ
  const rawType = searchParams.get("type")
  const rawMode = searchParams.get("mode")
  const quick = searchParams.get("quick") === "1"

  // 状態
  const [quizType, setQuizType] = useState<QuizType>(() => (isQuizType(rawType) ? rawType : "japanese-n4"))
  const [mode, setMode] = useState<Mode>(() => (rawMode === "attack" ? "attack" : "normal"))
  const [toast, setToast] = useState("")

  // クエリ変化で同期（直リンク/戻る進む）
  useEffect(() => {
    if (isQuizType(rawType)) setQuizType(rawType)
    setMode(rawMode === "attack" ? "attack" : "normal")
     
  }, [rawType, rawMode])

  // ✅ quick=1 は即開始（URL書き換えは事故るからやらない）
  useEffect(() => {
    if (!quick) return
    goPlay(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quick])

  // ランキング
  const [lb, setLb] = useState<{ displayName: string; bestScore: number }[]>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const col = collection(db, "attackLeaderboards", safeKind, "entries")
        const q = query(col, orderBy("bestScore", "desc"), limit(10))
        const snap = await getDocs(q)
        const list = snap.docs.map((d) => {
          const v: any = d.data()
          return {
            displayName: String(v.displayName ?? "Anonymous"),
            bestScore: Number(v.bestScore ?? 0),
          }
        })
        if (!cancelled) setLb(list)
      } catch {
        if (!cancelled) setLb([])
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [safeKind])

  function goPlay(isQuick?: boolean) {
    // kindが消える事故に備えて保存
    try {
      sessionStorage.setItem("lastGameKind", safeKind)
    } catch {}

    const wantMode: Mode = mode

    // アタックはログイン必須（未ログインならノーマルへ）
    if (wantMode === "attack" && !user) {
      setToast("アタック（ランキング）はログインが必要です。ノーマルで開始します。")
      const qs = new URLSearchParams({
        kind: safeKind,
        type: quizType,
        mode: "normal",
        autostart: "1",
      })
      router.push(`/game/play?${qs.toString()}`)
      return
    }

    const qs = new URLSearchParams({
      kind: safeKind,
      type: quizType,
      mode: wantMode,
      autostart: "1",
    })

    if (isQuick) {
      // いまは特に追加しない（将来フラグを入れるならここ）
    }

    router.push(`/game/play?${qs.toString()}`)
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.topRow}>
        <Link href="/game" className={styles.back}>
          ← ゲームTOP
        </Link>
      </div>

      <div className={styles.title}>{meta.title}</div>
      <div className={styles.desc}>{meta.desc}</div>

      <ul className={styles.ruleList}>
        {meta.rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <section className={styles.rankCard}>
        <div className={styles.rankHead}>
          <div className={styles.rankLabel}>ランキング（アタック）</div>
          <div className={styles.rankHint}>※ アタックのベストスコア上位</div>
        </div>

        {lb.length === 0 ? (
          <div className={styles.rankEmpty}>まだ記録がありません</div>
        ) : (
          <ol className={styles.rankList}>
            {lb.slice(0, 5).map((r, i) => (
              <li key={`${r.displayName}-${i}`} className={styles.rankRow}>
                <span className={styles.rankNo}>{i + 1}</span>
                <span className={styles.rankName}>{r.displayName}</span>
                <span className={styles.rankScore}>{r.bestScore}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.label}>モード</div>
        <div className={styles.seg}>
          <button
            type="button"
            className={`${styles.segBtn} ${mode === "normal" ? styles.segBtnActive : ""}`}
            onClick={() => setMode("normal")}
          >
            ノーマル（学習）
          </button>

          <button
            type="button"
            className={`${styles.segBtn} ${mode === "attack" ? styles.segBtnActive : ""}`}
            onClick={() => {
              if (!user) {
                setToast("アタックはログインが必要です（ノーマル推奨）")
                setMode("normal")
                return
              }
              setMode("attack")
            }}
          >
            アタック（ランキング）
          </button>
        </div>

        <div className={styles.help}>※ アタックはログイン必須。ノーマルはゲストでもOK。</div>

        <div style={{ marginTop: 12 }}>
          <div className={styles.label}>レベル</div>
          <div className={styles.seg}>
            {(["japanese-n4", "japanese-n3", "japanese-n2"] as QuizType[]).map((lv) => (
              <button
                key={lv}
                type="button"
                className={`${styles.segBtn} ${quizType === lv ? styles.segBtnActive : ""}`}
                onClick={() => setQuizType(lv)}
              >
                {lv === "japanese-n4" ? "N4" : lv === "japanese-n3" ? "N3" : "N2"}
              </button>
            ))}
          </div>
          <div className={styles.help}>※ いまはN4/N3/N2のみ（将来拡張）</div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnMain}`} onClick={() => goPlay()}>
            プレイ開始
          </button>
        </div>

        {toast ? <div className={styles.help} style={{ fontWeight: 900 }}>{toast}</div> : null}
      </section>
    </main>
  )
}