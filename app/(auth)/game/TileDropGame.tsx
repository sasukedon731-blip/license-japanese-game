"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"

import { auth, db } from "@/app/lib/firebase"
import type { QuizType } from "@/app/data/types"
import type { GameDifficulty, GameMode, GameQuestion } from "./types"
import { fallbackQuestions } from "./questions"
import { fetchAttackLeaderboard, fetchMyAttackRank, submitAttackScore } from "./firestore"
import { buildGamePoolFromQuizzes } from "./fromQuizzes"
import { getTileDropPool } from "./pools/tileDropPools"
import GameEndActions from "./ui/GameEndActions"

type Phase = "ready" | "playing" | "over"

type BurstPiece = { ch: string; x: number; y: number; r: number; d: number }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function hashSeed(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRand(seed: number) {
  // xorshift32
  let x = seed || 123456789
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) / 4294967296)
  }
}

function difficultyLabelFromQuizType(qt: string): "N4" | "N3" | "N2" | "N5" {
  if (qt === "japanese-n2") return "N2"
  if (qt === "japanese-n3") return "N3"
  if (qt === "japanese-n4") return "N4"
  return "N5"
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function difficultyForAttack(level: number): GameDifficulty {
  if (level <= 3) return "N5"
  if (level <= 6) return "N4"
  if (level <= 9) return "N3"
  if (level <= 12) return "N2"
  return "N1"
}

function speedFor(mode: GameMode, level: number) {
  if (mode === "normal") return 5.5
  return clamp(6 - (level - 1) * 0.28, 2.2, 6)
}

function vib(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      ;(navigator as any).vibrate(pattern)
    }
  } catch {
    // ignore
  }
}

type SfxType = "hit" | "miss" | "combo"

export default function TileDropGame({
  quizType,
  modeParam,
}: {
  quizType: QuizType
  modeParam: string | null
}) {
  const router = useRouter()
  const params = useSearchParams()
  const hubKindParam = params.get("hubKind")
  const autostart = params.get("autostart") === "1"
  // ✅ ローカルで quizType を切替できるようにする（UIのレベル切替用）
  const [qt, setQt] = useState<QuizType>(quizType)
  useEffect(() => {
    setQt(quizType)
  }, [quizType])
const [plateMountKey, setPlateMountKey] = useState(0)
  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")

  const [phase, setPhase] = useState<Phase>("ready")
  const [mode, setMode] = useState<GameMode>(modeParam === "attack" ? "attack" : "normal")

  // ✅ Attack: N4→N3→N2→N4（30問正解で昇格）
  const attackLevels: QuizType[] = ["japanese-n4", "japanese-n3", "japanese-n2"]
  const [attackLevelIndex, setAttackLevelIndex] = useState(0)
  const [, setStageCorrect] = useState(0)
  const [maxLevelReached, setMaxLevelReached] = useState(0)
  const [bestStageAtMax, setBestStageAtMax] = useState(0)
  const isAttack = modeParam === "attack" || mode === "attack"
  const activeQuizType: QuizType = (isAttack && qt.startsWith("japanese-") ? attackLevels[attackLevelIndex] : qt)
  const launchQuizType: QuizType = activeQuizType
  const activeDifficulty = difficultyLabelFromQuizType(activeQuizType)
  const [selectedKind, setSelectedKind] = useState<"tile-drop" | "flash-judge" | "memory-burst">(() => {
    if (hubKindParam === "flash-judge" || hubKindParam === "memory-burst" || hubKindParam === "tile-drop") return hubKindParam
    return "tile-drop"
  })
  const [difficulty, setDifficulty] = useState<GameDifficulty>("N5")

  // ✅ Readyで選べる（カテゴリのみ）
  const [selectedSection] = useState<"all" | "moji-goi" | "bunpo" | "reading">("all")

  // ✅ pool（tile-drop専用）
  // 1) まずは「文字ブレイク専用プール」を最優先（混在事故を防ぐ）
  // 2) まだ用意が無い教材だけ、暫定で quizzes から生成（最後の保険）
  const pool = useMemo(() => {
    const dedicated = getTileDropPool(activeQuizType)
    if (dedicated.length) return dedicated

    const built = buildGamePoolFromQuizzes(activeQuizType)
    if (built.length) {
      const enabled = built.filter((q) => q.enabled)
      const preferTileDrop = enabled.filter((q) => q.kind === "tile-drop")
      if (preferTileDrop.length) return preferTileDrop
      return enabled
    }

    return fallbackQuestions.filter((q) => q.enabled)
  }, [activeQuizType])

  // ✅ カテゴリで文字ブレイク問題を絞る（混在しない）
  const filteredPool = useMemo(() => {
    if (!activeQuizType.startsWith("japanese-")) return pool
    if (selectedSection === "all") return pool
    return pool.filter((q) => q.sectionId === selectedSection)
  }, [pool, activeQuizType, selectedSection])

  useEffect(() => {
    setDifficulty(activeDifficulty)
     
  }, [activeQuizType, activeDifficulty])

  // ✅ 新導線：/game/play?autostart=1 で直接スタート
  const [autoStarted, setAutoStarted] = useState(false)
  useEffect(() => {
    if (!autostart) return
    if (autoStarted) return
    if (phase !== "ready") return
    if (!filteredPool.length) return
    setAutoStarted(true)
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart, autoStarted, phase, filteredPool.length])

useEffect(() => {
    if (phase !== "ready") return
    if (modeParam === "attack") setMode("attack")
    else if (modeParam === "normal") setMode("normal")
     
  }, [modeParam, activeQuizType, phase])

  const [score, setScore] = useState(0)
  const [, setCorrectCount] = useState(0)
  const [, setLife] = useState(3)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)

  // ✅ 必殺：時間停止（TileDrop専用）
  const [timeStopActive, setTimeStopActive] = useState(false)
  const timeStopTimer = useRef<number | null>(null)
  // ✅ 使った後も復活させる（クールダウン制）
  const [timeStopCooldownLeft, setTimeStopCooldownLeft] = useState(0)
  const timeStopCooldownUntilRef = useRef<number>(0)
  const timeStopCooldownTickRef = useRef<number | null>(null)

  // ✅ TIME STOP のタイマー/インターバル掃除
  useEffect(() => {
    return () => {
      if (timeStopTimer.current) window.clearTimeout(timeStopTimer.current)
      if (timeStopCooldownTickRef.current) window.clearInterval(timeStopCooldownTickRef.current)
    }
  }, [])

  const [current, setCurrent] = useState<GameQuestion | null>(null)
  const [inputIndex, setInputIndex] = useState(0)
  const [toast, setToast] = useState<string>("")
  const [myRank, setMyRank] = useState<number | null>(null)
  const [myBestScore, setMyBestScore] = useState<number>(0)

  // ✅ 正解時の「弾ける」演出（対象プレートのみ）
  const [plateFx, setPlateFx] = useState<"none" | "success">("none")
  // ✅ 正解時の文字爆散（promptを文字単位で飛ばす）
  const [burstPieces, setBurstPieces] = useState<BurstPiece[] | null>(null)


  // ✅ コンボポップ
  const [comboPop, setComboPop] = useState<number | null>(null)
  const comboPopTimer = useRef<number | null>(null)

  // ✅ 画面揺れ（framer controls）
  const shakeControls = useAnimationControls()

  // ✅ サウンド
  const [soundOn] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const [bestScore, setBestScore] = useState<number>(0)
  const [leaderboard, setLeaderboard] = useState<{ displayName: string; bestScore: number }[]>([])

  const activeKeyRef = useRef<string>("")
  const resolvedRef = useRef<boolean>(false)

  // ===== Auth（ゲストOK）=====
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUid(null)
        setDisplayName("")
        return
      }

      setUid(u.uid)

      const dn = u.displayName || ""
      if (dn) {
        setDisplayName(dn)
        return
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid))
        const v = snap.exists() ? (snap.data() as any) : null
        if (v?.displayName) setDisplayName(String(v.displayName))
      } catch {
        // ignore
      }
    })
    return () => unsub()
  }, [])

  // ✅ アタック：開始前に自分の順位/ベストを取得して表示
  useEffect(() => {
    if (mode !== "attack") return
    if (!uid) return
    if (phase !== "ready") return
    fetchMyAttackRank({ gameId: selectedKind, uid })
      .then((r) => {
        setMyRank(r.rank)
        // ✅ hub上の「あなたのベスト」を更新
        setMyBestScore(r.bestScore)
      })
      .catch(() => null)
  }, [mode, uid, phase, selectedKind])

  // ✅ 掃除
  useEffect(() => {
    return () => {
      if (comboPopTimer.current) window.clearTimeout(comboPopTimer.current)
      try {
        audioCtxRef.current?.close()
      } catch {
        // ignore
      }
      audioCtxRef.current = null
    }
  }, [])

  // ✅ TypeScript的に null を確実に潰した版
  function ensureAudio(): AudioContext | null {
    if (!soundOn) return null
    if (typeof window === "undefined") return null

    const w = window as any
    const Ctx = w.AudioContext || w.webkitAudioContext
    if (!Ctx) return null

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctx()
    }

    const ctx = audioCtxRef.current
    if (!ctx) return null

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => null)
    }
    return ctx
  }

  function playSfx(type: SfxType) {
    if (!soundOn) return
    const ctx = ensureAudio()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (type === "hit") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(660, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    } else if (type === "miss") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.10)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    } else {
      osc.type = "square"
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.10, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10)
    }

    osc.connect(gain)
    gain.connect(ctx.destination)

    try {
      osc.start(now)
      osc.stop(now + 0.22)
    } catch {
      // ignore
    }
  }

  const poolByDifficulty = useMemo(() => {
    const map = new Map<string, GameQuestion[]>()
    for (const q of pool) {
      const k = q.difficulty
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(q)
    }
    return map
  }, [pool])

  function pickQuestion(nextMode: GameMode, nextDifficulty: GameDifficulty, nextLevel: number) {
    const wantDifficulty = nextMode === "attack" ? difficultyForAttack(nextLevel) : nextDifficulty
    const candidates = poolByDifficulty.get(wantDifficulty) ?? []
    if (candidates.length > 0) return pickOne(candidates)
    if (pool.length > 0) return pickOne(pool)
    return fallbackQuestions[0]
  }

  function resetRound(nextMode: GameMode, nextDifficulty: GameDifficulty, nextLevel: number) {
    const q = pickQuestion(nextMode, nextDifficulty, nextLevel)
    setCurrent(q)
    setInputIndex(0)
    resolvedRef.current = false
    activeKeyRef.current = `${q.id}:${Date.now()}`
    setToast("")
    setPlateFx("none")
    setBurstPieces(null)
  }

function startGame() {
    if (mode === "attack" && !uid) {
      setToast("ランキングはログインが必要です（ノーマルで開始します）")
      setMode("normal")
      setTimeout(() => startGameAs("normal"), 0)
      return
    }
    startGameAs(mode)
  }

  function startGameAs(nextMode: GameMode) {
    setScore(0)
    setCorrectCount(0)
    setCombo(0)
    setLife(3)
    setLevel(1)
    // ✅ TIME STOP をリセット
    setTimeStopActive(false)
    setTimeStopCooldownLeft(0)
    timeStopCooldownUntilRef.current = 0
    if (timeStopCooldownTickRef.current) {
      window.clearInterval(timeStopCooldownTickRef.current)
      timeStopCooldownTickRef.current = null
    }

    if (nextMode === "attack" && qt.startsWith("japanese-")) {
      setAttackLevelIndex(0)
      setStageCorrect(0)
      setMaxLevelReached(0)
      setBestStageAtMax(0)
    }
    setBestScore(0)
    setLeaderboard([])
    setComboPop(null)

    setPhase("playing")
    setTimeout(() => {
      resetRound(nextMode, difficulty, 1)
    }, 0)
  }

  async function endGame() {
    setPhase("over")

    if (mode !== "attack" || !uid) return

    try {
      const res = await submitAttackScore({
        gameId: selectedKind,
        uid,
        displayName: displayName || "匿名",
        score,
        bestLevel: (maxLevelReached === 2 ? "N2" : maxLevelReached === 1 ? "N3" : "N4"),
        bestStage: bestStageAtMax,
      })
      setBestScore(res.bestScore)
    } catch (e: any) {
      console.error(e)
      if (String(e?.message || e).includes('PERMISSION_DENIED')) {
        setToast('⚠️ 記録保存に失敗（Firestoreルールで拒否）')
      } else {
        setToast('⚠️ 記録保存に失敗しました')
      }
    }

    try {
      const lb = await fetchAttackLeaderboard({ gameId: selectedKind, take: 30 })
      setLeaderboard(lb.map((x) => ({ displayName: x.displayName, bestScore: x.bestScore })))
    } catch (e: any) {
      console.error(e)
      if (String(e?.message || e).includes('PERMISSION_DENIED')) {
        setToast('⚠️ 記録保存に失敗（Firestoreルールで拒否）')
      } else {
        setToast('⚠️ 記録保存に失敗しました')
      }
    }
  }

  async function triggerShake() {
    try {
      await shakeControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.18 },
      })
    } catch {
      // ignore
    }
  }

  function miss(reason: "timeout" | "wrong") {
    if (phase !== "playing") return
    if (resolvedRef.current) return

    resolvedRef.current = true
    setCombo(0)
    setComboPop(null)

    // ✅ ミス演出：揺れ + バイブ + 音
    triggerShake()
    vib([40, 20, 40])
    playSfx("miss")

    setLife((prev) => {
      const next = prev - 1
      if (next <= 0) {
        setTimeout(() => endGame(), 50)
        return 0
      }
      setTimeout(() => {
        const nextLevel = mode === "attack" ? level + 1 : level
        if (mode === "attack") setLevel(nextLevel)
        resetRound(mode, difficulty, nextLevel)
      }, 280)
      return next
    })

    setToast(reason === "timeout" ? "時間切れ！" : "ミス！")
  }

  function fireComboPop(nextCombo: number) {
    // ✅ 2以上から出す（うるさくしない）
    if (nextCombo < 2) return

    setComboPop(nextCombo)
    playSfx("combo")

    if (comboPopTimer.current) window.clearTimeout(comboPopTimer.current)
    comboPopTimer.current = window.setTimeout(() => setComboPop(null), 450)
  }

  function activateTimeStop() {
    if (phase !== "playing") return
    if (combo < 5) return
    if (timeStopActive) return
    if (timeStopCooldownLeft > 0) return

    // ✅ 発動
    setTimeStopActive(true)

    // ✅ いまのプレートを「時間停止で延命」：落下アニメをリスタートして+3秒ぶん猶予を作る
    setPlateMountKey((k) => k + 1)

    // ✅ 3秒で解除
    if (timeStopTimer.current) window.clearTimeout(timeStopTimer.current)
    timeStopTimer.current = window.setTimeout(() => {
      setTimeStopActive(false)
    }, 3000)

    // ✅ 15秒クールダウン開始（使った後も復活する）
    const cdSec = 15
    const until = Date.now() + cdSec * 1000
    timeStopCooldownUntilRef.current = until
    setTimeStopCooldownLeft(cdSec)

    if (timeStopCooldownTickRef.current) window.clearInterval(timeStopCooldownTickRef.current)
    timeStopCooldownTickRef.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((timeStopCooldownUntilRef.current - Date.now()) / 1000))
      setTimeStopCooldownLeft(left)
      if (left <= 0 && timeStopCooldownTickRef.current) {
        window.clearInterval(timeStopCooldownTickRef.current)
        timeStopCooldownTickRef.current = null
      }
    }, 250)
  }

  function success() {
    if (phase !== "playing") return
    if (!current) return
    if (resolvedRef.current) return

    resolvedRef.current = true

    const nextCombo = combo + 1

    const base = 10 * current.answer.length
    const comboBonus = Math.min(nextCombo, 20)
    const gained = base + comboBonus

    setScore((s) => s + gained)
    setCorrectCount((c) => c + 1)

    if (mode === "attack" && qt.startsWith("japanese-")) {
      setStageCorrect((prev) => {
        const next = prev + 1
        // update best stage at max level
        setBestStageAtMax((bs) => (attackLevelIndex === maxLevelReached ? Math.max(bs, Math.min(next, 30)) : bs))
        if (next >= 30) {
          // level up
          setAttackLevelIndex((i) => {
            const ni = (i + 1) % 3
            setMaxLevelReached((m) => Math.max(m, ni))
            if (ni > maxLevelReached) setBestStageAtMax(0)
            return ni
          })
          return 0
        }
        return next
      })
    }

    // ✅ 正解音（軽く）
    playSfx("hit")

    setCombo(nextCombo)
    fireComboPop(nextCombo)

    setToast(`+${gained}`)

    // ✅ 正解演出：プレート文字爆散（既存ロジックは維持）
    const burstText = (current.answer?.join?.("") || current.prompt || "").trim()
    if (burstText) {
      const seed = hashSeed(String(activeKeyRef.current) + "|" + burstText)
      const rnd = seededRand(seed)
      const chars = Array.from(burstText)
      const pieces: BurstPiece[] = chars.map((ch) => {
        const ang = rnd() * Math.PI * 2
        const dist = 70 + rnd() * 120
        const x = Math.cos(ang) * dist
        const y = Math.sin(ang) * dist - (20 + rnd() * 40)
        const r = (rnd() * 2 - 1) * 28
        const d = rnd() * 0.06
        return { ch, x, y, r, d }
      })
      setBurstPieces(pieces)
    } else {
      setBurstPieces(null)
    }

    // ✅ 正解演出：scale 1 → 1.08 → 0.95 → fade
    setPlateFx("success")

    // ✅ 爆散演出が見えるように、次の問題へ進むまで少し待つ
    setTimeout(() => {
      const nextLevel = mode === "attack" ? level + 1 : level
      if (mode === "attack") setLevel(nextLevel)
      resetRound(mode, difficulty, nextLevel)
    }, 780)
  }

  function onTilePress(label: string) {
    // ✅ iOS等に備えて、最初のタップでAudioContextを起こす
    ensureAudio()

    if (phase !== "playing") return
    if (!current) return
    if (resolvedRef.current) return

    const expected = current.answer[inputIndex]
    if (label !== expected) {
      miss("wrong")
      return
    }

    const next = inputIndex + 1
    setInputIndex(next)
    if (next >= current.answer.length) success()
  }

  const speedSec = useMemo(() => speedFor(mode, level), [mode, level])
  const fallY = 420
  // ✅ 外国人ユーザー向け：真ん中で約1秒止める
  const PAUSE_SEC = 1.5
  const STOP_RATIO = 0.35
  const fallMidY = Math.round(fallY * STOP_RATIO)
  const fallTotalSec = speedSec + PAUSE_SEC
  const fallT1 = (speedSec / 2) / fallTotalSec
  const fallT2 = (speedSec / 2 + PAUSE_SEC) / fallTotalSec
  const plateKey = current ? activeKeyRef.current : "none"

  const shuffledChoices = useMemo(() => {
    const base = current?.choices ?? []
    // ✅ 同じ問題で毎レンダーごとに並びが変わらないように、IDでseedを固定
    const seed = current?.id ?? "seed"
    const h = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0)
    const arr = [...base]
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (h + i * 9301 + 49297) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [current?.id, current?.choices])


  // ✅ 下の中断を消した分、広く
  const playAreaHeight = "calc(100svh - 96px)"

  return (
    <main style={styles.page} className="game-root mainPad">
      <div style={styles.shell}>
        {/* Header */}
        {/* ✅ /game/play 側で AppHeader を表示しているため二重を防ぐ */}

        <section style={styles.panel}>
{/* Ready */}
        <div style={{ display: phase === "ready" ? "block" : "none", padding: 16 }} className="readyWrap">

          <div className="mobileOnly">
            <div className="hubGrid">
              <div className="hubMain">
            <div className="mobileSection">
              <div className="mobileTitle">ゲーム</div>
              <div className="mobileScroll">
                <button
                  type="button"
                  className={`mobilePill ${selectedKind === "tile-drop" ? "isActive" : ""}`}
                  onClick={() => setSelectedKind("tile-drop")}
                >
                  <span className="ic">🔨</span> 文字ブレイク
                </button>
                <button
                  type="button"
                  className={`mobilePill ${selectedKind === "flash-judge" ? "isActive" : ""}`}
                  onClick={() => setSelectedKind("flash-judge")}
                >
                  <span className="ic">⚡</span> 瞬判ジャッジ
                </button>
                <button
                  type="button"
                  className={`mobilePill ${selectedKind === "memory-burst" ? "isActive" : ""}`}
                  onClick={() => setSelectedKind("memory-burst")}
                >
                  <span className="ic">🧠</span> フラッシュ記憶
                </button>
              </div>

              <details className="mobileDetails" open>
                <summary>ルール</summary>
                <div className="mobileRule">
                  {selectedKind === "tile-drop" ? (
                    <div>下のタイルを<b>正しい順</b>でタップして壊す（穴埋め/漢字読み）。</div>
                  ) : selectedKind === "flash-judge" ? (
                    <div>文が正しければ<b>○</b>、間違いなら<b>×</b>。</div>
                  ) : (
                    <div>一瞬表示→消えたあとに<b>4択</b>で答える。</div>
                  )}
                  <div style={{ marginTop: 6, opacity: 0.8 }}>共通：<b>3ミスで終了</b>（時間制限なし）</div>
                </div>
              </details>
            </div>

{modeParam === "attack" ? (
  <div style={{ marginTop: 12, padding: 12, borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", background: "white" }}>
    <div style={{ fontSize: 12, opacity: 0.7 }}>あなたの順位（{selectedKind === "tile-drop" ? "文字ブレイク" : selectedKind === "flash-judge" ? "瞬判ジャッジ" : "フラッシュ記憶"}）</div>
    <div style={{ marginTop: 6, fontWeight: 900, fontSize: 16 }}>
      順位：{myRank ?? "-"} ／ ベスト：{myBestScore}
    </div>
    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
      ※ 記録は「攻撃（ランキング）」で3ミス終了時に保存
    </div>
  </div>
) : null}

            </div>

            <div className="mobileSection">
              <div className="mobileTitle">モード</div>
              <div className="mobileRow2">
                <button
                  type="button"
                  className={`mobilePill ${mode === "normal" ? "isActive" : ""}`}
                  onClick={() => setMode("normal")}
                >
                  普通（学習）
                </button>
                <button
                  type="button"
                  className={`mobilePill ${mode === "attack" ? "isActive" : ""}`}
                  onClick={() => setMode("attack")}
                >
                  攻撃（ランキング）
                </button>
              </div>

              {mode === "normal" && qt.startsWith("japanese-") ? (
                <div style={{ marginTop: 12 }}>
                  <div className="mobileTitle" style={{ fontSize: 12, opacity: 0.8 }}>
                    レベル
                  </div>
                  <div className="mobileRow3" style={{ marginTop: 8 }}>
                    {(["japanese-n4", "japanese-n3", "japanese-n2"] as QuizType[]).map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        className={`mobilePill ${qt === lv ? "isActive" : ""}`}
                        onClick={() => setQt(lv)}
                      >
                        {lv === "japanese-n4" ? "N4" : lv === "japanese-n3" ? "N3" : "N2"}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                    ※ アタックは<b>N4スタート</b>で自動的に昇格
                  </div>
                </div>
              ) : null}
            </div>

            </div>
              <div className="hubSide">
                <div className="mobileMeta">
              問題数：<b>{filteredPool.length}</b>
            </div>

            <div className="mobileStartBar">
              <button
                type="button"
                className="mobileStartBtn"
                onClick={() => {
                  if (selectedKind === "tile-drop") {
                    startGame()
                  } else {
                    router.push(`/game/play?type=${launchQuizType}&kind=${selectedKind}&mode=${mode}&autostart=1`)
                  }
                }}
                disabled={selectedKind === "tile-drop" && filteredPool.length === 0}
              >
                ゲーム開始
              </button>
            </div>
              </div>
            </div>

          </div>

          <div className="desktopOnly">
          <div style={styles.row} className="row2">
            <div style={styles.field}>
              <div style={styles.label}>ゲーム</div>
              <div style={styles.seg} className="gameSeg">
                <button
                  style={{ ...styles.segBtn, ...(selectedKind === "tile-drop" ? styles.segActive : {}) }}
                  onClick={() => setSelectedKind("tile-drop")}
                >
                  文字ブレイク
                </button>
                <button
                  style={{ ...styles.segBtn, ...(selectedKind === "flash-judge" ? styles.segActive : {}) }}
                  onClick={() => setSelectedKind("flash-judge")}
                >
                  ○×（文法）
                </button>
                <button
                  style={{ ...styles.segBtn, ...(selectedKind === "memory-burst" ? styles.segActive : {}) }}
                  onClick={() => setSelectedKind("memory-burst")}
                >
                  フラッシュ記憶
                </button>
              </div>
              <div style={styles.help}>※ ここで3つのゲームを切り替えできます</div>
              <div style={{ marginTop: 8, opacity: 0.9, lineHeight: 1.6 }}>
                <b><span className="labelLong">文字ブレイク</span><span className="labelShort">🔨</span></b>：下のタイルを正しい順でタップして壊します（穴埋め/漢字読み）。
                <br />
                <b>○×</b>：文が正しいなら○、間違いなら×。
                <br />
                <b><span className="labelLong">フラッシュ記憶</span><span className="labelShort">🧠</span></b>：一瞬表示→消えたあとに答える。
              </div>
            </div>
          </div>

<div style={styles.row}>
              <div style={styles.field} className="modeCard">
                <div style={styles.label}>モード</div>
                <div style={styles.seg} className="modeSeg">
                  <button
                    style={{ ...styles.segBtn, ...(mode === "normal" ? styles.segActive : {}) }}
                    onClick={() => setMode("normal")}
                  >
                    ノーマル（学習）
                  </button>
                  <button
                    style={{ ...styles.segBtn, ...(mode === "attack" ? styles.segActive : {}) }}
                    onClick={() => {
                      if (!uid) {
                        setToast("ランキングはログインが必要です（ノーマル推奨）")
                        setMode("normal")
                        return
                      }
                      setMode("attack")
                    }}
                  >
                    アタック（ランキング）
                  </button>
                </div>

                <div style={styles.help}>
                  ノーマル：難易度固定 / アタック：速度UP + 難易度が徐々に上がる
                </div>

                
                {mode === "normal" && qt.startsWith("japanese-") ? (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                      ノーマルの級（N4 / N3 / N2）
                    </div>
                    <div style={styles.seg} className="levelSeg">
                      {(["japanese-n4", "japanese-n3", "japanese-n2"] as QuizType[]).map((lv) => (
                        <button
                          key={lv}
                          style={{ ...styles.segBtn, ...(qt === lv ? styles.segActive : {}) }}
                          onClick={() => {
                            // クイズ級だけ切り替え（画面はそのまま）
                            setQt(lv)
                          }}
                        >
                          {lv === "japanese-n4" ? "N4" : lv === "japanese-n3" ? "N3" : "N2"}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
                      ※ アタックは常に <b>N4スタート</b> で自動的に昇格します
                    </div>
                  </div>
                ) : null}
{!uid ? (
                  <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>
                    ※ ゲストはノーマルのみ。ランキング参加は
                    <button onClick={() => router.push("/login")} style={styles.inlineLinkBtn}>
                      ログイン
                    </button>
                    が必要です。
                  </div>
                ) : null}
              </div>

              <div style={styles.field} className="difficultyCard">
                <div style={styles.label}>難易度</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ ...styles.pill, ...styles.pillActive, cursor: "default" }}>
                    {pool[0]?.difficulty ?? difficulty}
                  </span>
                </div>
                <div style={styles.help}>※ 教材ごとに難易度は固定。アタックは速度UPで難しくなります。</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  if (selectedKind === "tile-drop") {
                    startGame()
                  } else {
                    router.push(`/game/play?type=${launchQuizType}&kind=${selectedKind}&mode=${mode}&autostart=1`)
                  }
                }}
                disabled={selectedKind === "tile-drop" && filteredPool.length === 0}
                style={{ ...styles.btn, ...styles.btnMain }}
              >
                ゲーム開始
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              問題数：<b>{filteredPool.length}</b>
            </div>

            {toast ? (
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 900, color: "#b91c1c" }}>{toast}</div>
            ) : null}
          </div>

          {/* Playing */}
          <div style={{ display: phase === "playing" ? "block" : "none" }}>
            <motion.div
              style={{ position: "relative", height: playAreaHeight, overflow: "hidden" }}
              animate={shakeControls}
            >
              <div style={styles.dangerLine} />

              <AnimatePresence>
                {timeStopActive ? (
                  <motion.div
                    key="timestop-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={styles.timeStopOverlay}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.06, y: -8 }}
                      transition={{ duration: 0.18 }}
                      style={styles.timeStopBanner}
                    >
                      TIME STOP!!
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>


              {/* Overlay chips */}
              <div style={styles.overlayChips}>
                <span style={styles.chip}>Lv {level}</span>
                <span style={styles.chip}>Combo {combo}</span>
                {mode === "attack" ? <span style={styles.chip}>Attack</span> : null}
                <button
                  onClick={activateTimeStop}
                  disabled={phase !== "playing" || timeStopActive || timeStopCooldownLeft > 0 || combo < 5}
                  style={{
                    ...styles.chipButton,
                    opacity:
                      phase !== "playing" || timeStopActive || timeStopCooldownLeft > 0 || combo < 5 ? 0.5 : 1,
                    borderColor: timeStopActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                    boxShadow:
                      !timeStopActive && timeStopCooldownLeft === 0 && combo >= 5 ? "0 0 18px rgba(56,189,248,0.55)" : undefined,
                    transform: timeStopActive ? "scale(1.03)" : undefined,
                  }}
                >
                  {timeStopActive
                    ? "TIME STOP!! ⏸"
                    : timeStopCooldownLeft > 0
                      ? `TIME STOP ${timeStopCooldownLeft}s`
                      : "TIME STOP"}
                </button>
              </div>

              {/* Combo Pop */}
              <AnimatePresence>
                {comboPop ? (
                  <motion.div
                    key={`combo-${comboPop}`}
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.06, y: -8 }}
                    transition={{ duration: 0.18 }}
                    style={styles.comboPop}
                  >
                    COMBO <span style={{ fontSize: 30, marginLeft: 6 }}>{comboPop}</span>!
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Toast */}
              <AnimatePresence>
                {toast ? (
                  <motion.div
                    key={toast}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    style={styles.toast}
                  >
                    {toast}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Falling plate */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
                <AnimatePresence>
                  {current ? (
                    <motion.div
                      key={`${plateKey}:${plateMountKey}`}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={
                        plateFx === "success"
                          ? { opacity: [1, 1, 0], scale: [1, 1.08, 0.95] }
                          : { opacity: 1, scale: 1 }
                      }
                      transition={plateFx === "success" ? { duration: 0.32, ease: "easeOut" } : { duration: 0.05 }}
                      style={{ transformOrigin: "center" }}
                    >
                      <motion.div
                        initial={{ y: -120, opacity: 1 }}
                        // ✅ 上から落ちてきて → 途中で停止 → 再落下
                        // 先頭に -120 を入れないと「真ん中から出現」に見えるので必ず入れる
                        animate={{ y: [-120, fallMidY, fallMidY, fallY], opacity: 1 }}
                        transition={{ duration: fallTotalSec + (timeStopActive ? 3 : 0), ease: "linear", times: [0, fallT1, fallT2, 1] }}
                        onAnimationComplete={() => {
                          if (resolvedRef.current) return
                          miss("timeout")
                        }}
                        style={styles.plate}
                      >
                        <div style={styles.plateBadge}>{current.type.toUpperCase()}</div>
                        <div style={{ ...styles.prompt, position: "relative" }}>
                          <span style={{ display: "inline-block", opacity: plateFx === "success" ? 0 : 1 }}>
                            {current.prompt}
                          </span>
                          {plateFx === "success" && burstPieces ? (
                            <div style={styles.burstLayer} aria-hidden>
                              {burstPieces.map((p, i) => (
                                <motion.span
                                  key={`${p.ch}-${i}`}
                                  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.92, rotate: p.r }}
                                  transition={{ duration: 0.56, ease: "easeOut", delay: p.d }}
                                  style={styles.burstChar}
                                >
                                  {p.ch}
                                </motion.span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div style={styles.progress}>
                          {current.answer.map((a, i) => (
                            <span key={`${a}-${i}`} style={{ ...styles.dot, opacity: i < inputIndex ? 1 : 0.25 }} />
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Tiles */}
              <div style={styles.tilesArea}>
                <div style={styles.tilesTitle}>タイルを順番に押せ</div>
                <div style={styles.tilesGrid}>
                  {shuffledChoices.map((c, idx) => (
                    <button key={`${c}-${idx}`} onClick={() => onTilePress(c)} style={styles.tileBtn}>
                      {c}
                    </button>
                  ))}
                </div>
                {/* ✅ 中断ボタンは撤去（左上矢印で十分） */}
              </div>
            </motion.div>
          </div>

          {/* Over */}
          <div style={{ display: phase === "over" ? "block" : "none" }}>
            <div style={styles.panelTitle}>ゲームオーバー</div>
            <div style={{ marginTop: 8, fontSize: 14 }}>
              スコア：<b style={{ fontSize: 22 }}>{score}</b>
            </div>

            {mode === "attack" ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  あなたのベスト：<b>{bestScore}</b>
                </div>

                <div style={{ marginTop: 12, ...styles.lbBox }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>ランキング（全期間 / 上位30）</div>
                  {leaderboard.length === 0 ? (
                    <div style={{ fontSize: 13, opacity: 0.7 }}>読み込み中 / まだデータがありません</div>
                  ) : (
                    <ol style={{ margin: 0, paddingLeft: 18 }}>
                      {leaderboard.map((x, i) => (
                        <li key={`${x.displayName}-${i}`} style={{ marginBottom: 6, fontSize: 13 }}>
                          <span style={{ fontWeight: 900 }}>{i + 1}.</span> {x.displayName} — <b>{x.bestScore}</b>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>ノーマルはランキング保存しません（学習用）</div>
            )}

            <GameEndActions
              onRetry={() => {
                setPhase("ready")
                setCurrent(null)
                setToast("")
              }}
            >
              <Link href="/select-mode" style={{ ...styles.btn, ...styles.btnGhost, textDecoration: "none" }}>
                学習メニューへ
              </Link>
            </GameEndActions>
          </div>
        </section>
      </div>
    
      <style jsx>{`
        .readyWrap { width: 100%; max-width: 520px; margin: 0 auto; padding: 16px; box-sizing: border-box; }
        @media (min-width: 1024px) {
          .readyWrap { max-width: 1100px; padding: 28px; }
          .hubGrid {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 24px;
            align-items: start;
          }
          .hubSide {
            position: sticky;
            top: 16px;
          }
        }

        @media (max-width: 640px) {
          .mainPad { padding-bottom: 92px; }
          .row2 { flex-direction: column !important; gap: 12px !important; }
          .difficultyCard { display: none !important; }
          .modeCard { width: 100% !important; }
          .readyWrap { padding: 12px !important; }
          /* stack fields */
          .readyWrap :global(div[style*="styles.row"]) { }
          /* game buttons */
          .gameSeg, .modeSeg, .levelSeg {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px !important;
          
          /* game pills: show 3 tabs without horizontal scroll */
          .mobileScroll{
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            overflow: visible !important;
            padding-bottom: 0 !important;
          }
          .mobilePill{
            padding: 10px 6px !important;
            font-size: 13px !important;
            gap: 0 !important;
          }
          .mobilePill .ic{ display: none !important; }

        }
          .modeSeg { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          /* make buttons finger-friendly */
          .gameSeg :global(button), .modeSeg :global(button), .levelSeg :global(button) {
            padding: 12px 10px !important;
            font-size: 16px !important;
            border-radius: 14px !important;
          }
          /* start button fixed bottom */
          .startBar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 0 !important;
            padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0,0,0,0.08);
            z-index: 50;
          }
          .startBar :global(button) {
            width: 100% !important;
            padding: 14px 14px !important;
            font-size: 18px !important;
          }
        }

        .labelShort { display: none; }
        @media (max-width: 640px) {
          .labelLong { display: none; }
          .labelShort { display: inline; }
          .gameSeg :global(button), .modeSeg :global(button), .levelSeg :global(button) {
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
            min-height: 52px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px;
          }
          .labelShort { font-size: 20px; }
        }

        .mobileOnly { display: block; }
        .desktopOnly { display: none; }

        @media (max-width: 640px) {
          .desktopOnly { display: none !important; }
          .mobileOnly { display: block !important; }

          .readyWrap { max-width: 560px; padding: 12px !important; }
          .mobileSection {
            background: rgba(255,255,255,0.75);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 18px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          }
          .mobileTitle { font-weight: 900; font-size: 14px; margin-bottom: 10px; }
          .mobileScroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .mobileRow2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .mobileRow3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

          .mobilePill{
            border: 1px solid rgba(0,0,0,0.10);
            background: rgba(255,255,255,0.90);
            border-radius: 16px;
            padding: 12px 12px;
            font-weight: 900;
            font-size: 14px;
            color: #0f172a;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 46px;
            white-space: nowrap;
          }
          .mobilePill .ic{ font-size: 18px; }
          .mobilePill.isActive{
            border-color: rgba(37,99,235,0.55);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
          }

          .mobileDetails summary{
            cursor: pointer;
            font-weight: 900;
            margin-top: 10px;
            outline: none;
          }
          .mobileRule{ margin-top: 8px; font-size: 14px; line-height: 1.65; color: #0f172a; }
          .mobileMeta{ margin-top: 6px; font-size: 12px; opacity: 0.75; padding: 0 2px; }

          .mobileStartBar{
            position: fixed;
            left: 0; right: 0; bottom: 0;
            padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0,0,0,0.08);
            z-index: 50;
          }
          .mobileStartBtn{
            width: 100%;
            padding: 14px 14px;
            border-radius: 16px;
            font-weight: 900;
            font-size: 18px;
          }
        }

      `}</style>

</main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100svh",
    background: "#f6f7fb",
    padding: "clamp(10px, 3vw, 18px)" as any,
  },
  shell: { maxWidth: 980, margin: "0 auto" },

  compactBar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    height: 52,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "rgba(246,247,251,0.92)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
    marginBottom: 10,
  },
  compactBack: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#111827",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },
  compactCenter: { flex: 1, minWidth: 0 },
  compactTitle: { fontSize: 14, fontWeight: 900, lineHeight: 1.1 },
  compactSub: { fontSize: 12, opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  soundBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
    fontSize: 16,
  },

  compactStats: { display: "flex", gap: 8, alignItems: "center" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    borderRadius: 999,
    background: "#111827",
    color: "#fff",
    fontWeight: 900,
    fontSize: 12,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },

  panelTitle: { fontWeight: 900, fontSize: 16 },

  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 },
  field: { background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 },
  label: { fontWeight: 900, fontSize: 12, opacity: 0.75 },
  help: { marginTop: 8, fontSize: 12, opacity: 0.7, lineHeight: 1.5 },

  seg: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
  segBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  segActive: { border: "1px solid #2563eb", boxShadow: "0 0 0 3px rgba(37,99,235,0.12)" },

  pill: { padding: "8px 12px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 900, cursor: "pointer" },
  pillActive: { border: "1px solid #16a34a", boxShadow: "0 0 0 3px rgba(22,163,74,0.12)" },

  inlineLinkBtn: {
    marginLeft: 6,
    border: "none",
    background: "transparent",
    padding: 0,
    color: "#2563eb",
    fontWeight: 900,
    cursor: "pointer",
    textDecoration: "underline",
  },

  btn: { padding: "10px 14px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 900 },
  btnMain: { background: "#2563eb", color: "#fff" },
  btnGhost: { background: "#111827", color: "#fff" },

  dangerLine: { position: "absolute", left: 0, right: 0, top: "58%" as any, height: 2, background: "rgba(239,68,68,0.6)" },

  overlayChips: { position: "absolute", top: 10, right: 12, display: "flex", gap: 8, zIndex: 20 },
  chip: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "#fff",
    border: "1px solid #e5e7eb",
    fontWeight: 900,
    fontSize: 12,
    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
  },

  chipButton: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "radial-gradient(circle at 30% 30%, rgba(125,211,252,0.95), rgba(37,99,235,0.95))",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#fff",
    fontWeight: 1000 as any,
    fontSize: 12,
    letterSpacing: 0.4,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37,99,235,0.18)",
    textShadow: "0 1px 0 rgba(0,0,0,0.18)",
  },

  timeStopOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 30,
    pointerEvents: "none",
    background: "radial-gradient(circle at 50% 45%, rgba(56,189,248,0.28), rgba(59,130,246,0.00) 65%)",
  },
  timeStopBanner: {
    position: "absolute",
    left: "50%",
    top: "36%",
    transform: "translate(-50%, -50%)",
    padding: "10px 14px",
    borderRadius: 999,
    background: "linear-gradient(135deg, rgba(14,165,233,0.92), rgba(37,99,235,0.92))",
    color: "#fff",
    fontWeight: 1000 as any,
    letterSpacing: 1.2,
    boxShadow: "0 20px 45px rgba(37,99,235,0.28)",
    border: "1px solid rgba(255,255,255,0.18)",
    whiteSpace: "nowrap",
  },

  comboPop: {
    position: "absolute",
    left: "50%",
    top: "44%",
    transform: "translate(-50%, -50%)",
    zIndex: 35,
    padding: "10px 14px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
    color: "#fff",
    fontWeight: 1000 as any,
    letterSpacing: 0.4,
    boxShadow: "0 18px 36px rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    whiteSpace: "nowrap",
  },

  plate: {
    width: "min(640px, 92%)",
    margin: "0 auto",
    background: "#111827",
    color: "#fff",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
    position: "relative",
  },
  plateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 11,
    fontWeight: 900,
    opacity: 0.75,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
  },
  prompt: { fontSize: "clamp(18px, 5vw, 22px)" as any, fontWeight: 900, textAlign: "center", padding: "14px 0 8px" },
  progress: { display: "flex", justifyContent: "center", gap: 6, paddingBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 999, background: "#fff", display: "inline-block" },

  toast: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: "8px 12px",
    borderRadius: 14,
    background: "#fff",
    border: "1px solid #e5e7eb",
    fontWeight: 900,
    boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
    zIndex: 30,
  },

  tilesArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "10px 12px calc(10px + env(safe-area-inset-bottom))" as any,
    background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.8))",
    borderTop: "1px solid #e5e7eb",
  },
  tilesTitle: { fontWeight: 900, marginBottom: 8 },
  tilesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: 10 },
  tileBtn: {
    padding: "clamp(10px, 2.6vw, 14px) clamp(8px, 2.2vw, 10px)" as any,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 900,
    fontSize: "clamp(14px, 4.2vw, 18px)" as any,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },

  lbBox: { background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 },
}
