"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"

import { auth, db } from "@/app/lib/firebase"
import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"
import type { GameDifficulty, GameMode, GameQuestion } from "./types"
import { fallbackQuestions } from "./questions"
import { fetchAttackLeaderboard, submitAttackScore } from "./firestore"
import { buildGamePoolFromQuizzes } from "./fromQuizzes"

type Phase = "ready" | "playing" | "over"
type SfxType = "hit" | "miss" | "combo"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function difficultyForAttack(level: number): GameDifficulty {
  if (level <= 3) return "N4"
  if (level <= 7) return "N3"
  if (level <= 12) return "N2"
  return "N1"
}

function secPerQuestion(mode: GameMode, level: number) {
  if (mode === "normal") return 6.5
  return clamp(6 - (level - 1) * 0.25, 3.0, 6.0)
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

export default function SpeedChoiceGame({
  quizType,
  modeParam,
}: {
  quizType: QuizType
  modeParam: string | null
}) {
  const router = useRouter()

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")

  const [phase, setPhase] = useState<Phase>("ready")
  const [mode, setMode] = useState<GameMode>(modeParam === "attack" ? "attack" : "normal")
  const [difficulty, setDifficulty] = useState<GameDifficulty>("N4")

  const pool = useMemo(() => {
  const opts =
  quizType === "japanese-n4"
    ? ({
        difficulty: "N4",
        maxPromptChars: 42,
        maxChoices: 4,
        minChoices: 4,
        maxChoiceChars: 14,
        allowAutoTrimChoice: true,
      } as const)
    : ({
        difficulty: "N3",
        maxPromptChars: 42,
        maxChoices: 4,
        minChoices: 4,
        maxChoiceChars: 14,
        allowAutoTrimChoice: true,
      } as const)

  const built = buildGamePoolFromQuizzes(quizType, opts)

  let filtered = built.filter(
    (q) => q.enabled && q.kind === "speed-choice"
  )

  // ✅ N4のみカテゴリ絞り込み
  if (quizType === "japanese-n4") {
    const section =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("section")
        : null

    if (section && section !== "all") {
      filtered = filtered.filter((q) => q.sectionId === section)
    }
  }

  if (filtered.length) return filtered

  return fallbackQuestions.filter(
    (q) => q.enabled && q.kind === "speed-choice"
  )
}, [quizType])

  useEffect(() => {
    const d = pool[0]?.difficulty
    if (d) setDifficulty(d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizType])

  useEffect(() => {
    if (phase !== "ready") return
    if (modeParam === "attack") setMode("attack")
    else if (modeParam === "normal") setMode("normal")
     
  }, [modeParam, quizType, phase])

  const [score, setScore] = useState(0)
  const [life, setLife] = useState(3)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)

  const [current, setCurrent] = useState<GameQuestion | null>(null)
  const [toast, setToast] = useState<string>("")

  // ✅ コンボポップ
  const [comboPop, setComboPop] = useState<number | null>(null)
  const comboPopTimer = useRef<number | null>(null)

  // ✅ 画面揺れ
  const shakeControls = useAnimationControls()

  // ✅ タイマー
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<number | null>(null)
  const resolvedRef = useRef<boolean>(false)

  // ✅ サウンド
  const [soundOn, setSoundOn] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const [bestScore, setBestScore] = useState<number>(0)
  const [leaderboard, setLeaderboard] = useState<{ displayName: string; bestScore: number }[]>([])

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

  // ✅ 掃除
  useEffect(() => {
    return () => {
      if (comboPopTimer.current) window.clearTimeout(comboPopTimer.current)
      if (timerRef.current) window.clearInterval(timerRef.current)
      try {
        audioCtxRef.current?.close()
      } catch {
        // ignore
      }
      audioCtxRef.current = null
    }
  }, [])

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
    if (ctx.state === "suspended") ctx.resume().catch(() => null)
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
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.05)
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
    if (candidates.length > 0) return pickRandom(candidates)
    if (pool.length > 0) return pickRandom(pool)
    return null
  }

  function clearTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  function startTimer(sec: number) {
    clearTimer()
    setTimeLeft(sec)
    const startedAt = Date.now()
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      const left = Math.max(0, sec - elapsed)
      setTimeLeft(left)
      if (left <= 0) {
        clearTimer()
        onTimeout()
      }
    }, 50)
  }

  function resetRound(nextMode: GameMode, nextDifficulty: GameDifficulty, nextLevel: number) {
    const q = pickQuestion(nextMode, nextDifficulty, nextLevel)
    if (!q) {
      setToast("スピード問題がありません（まずN4データを増やします）")
      setPhase("ready")
      setCurrent(null)
      return
    }

    setCurrent(q)
    setToast("")
    resolvedRef.current = false
    startTimer(secPerQuestion(nextMode, nextLevel))
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
    setCombo(0)
    setLife(3)
    setLevel(1)
    setBestScore(0)
    setLeaderboard([])
    setComboPop(null)

    setPhase("playing")
    setTimeout(() => resetRound(nextMode, difficulty, 1), 0)
  }

  async function endGame() {
    clearTimer()
    setPhase("over")

    if (mode !== "attack" || !uid) return

    try {
      const res = await submitAttackScore({
        gameId: "speed-choice",
        uid,
        displayName: displayName || "匿名",
        score,
        bestLevel: "N4",
        bestStage: 0,
      })
      setBestScore(res.bestScore)
    } catch (e) {
      console.error(e)
    }

    try {
      const lb = await fetchAttackLeaderboard({ gameId: "speed-choice", take: 30 })
      setLeaderboard(lb.map((x) => ({ displayName: x.displayName, bestScore: x.bestScore })))
    } catch (e) {
      console.error(e)
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

  function fireComboPop(nextCombo: number) {
    if (nextCombo < 2) return
    setComboPop(nextCombo)
    playSfx("combo")
    if (comboPopTimer.current) window.clearTimeout(comboPopTimer.current)
    comboPopTimer.current = window.setTimeout(() => setComboPop(null), 450)
  }

  function miss(reason: "timeout" | "wrong") {
    if (phase !== "playing") return
    if (resolvedRef.current) return

    resolvedRef.current = true
    clearTimer()

    setCombo(0)
    setComboPop(null)

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
      }, 240)
      return next
    })

    setToast(reason === "timeout" ? "時間切れ！" : "ミス！")
  }

  function success() {
    if (phase !== "playing") return
    if (!current) return
    if (resolvedRef.current) return

    resolvedRef.current = true
    clearTimer()

    const base = 12
    const comboBonus = Math.min(combo, 20)
    const gained = base + comboBonus

    setScore((s) => s + gained)

    playSfx("hit")

    const nextCombo = combo + 1
    setCombo(nextCombo)
    fireComboPop(nextCombo)

    setToast(`+${gained}`)

    setTimeout(() => {
      const nextLevel = mode === "attack" ? level + 1 : level
      if (mode === "attack") setLevel(nextLevel)
      resetRound(mode, difficulty, nextLevel)
    }, 220)
  }

  function onTimeout() {
    miss("timeout")
  }

  function onPick(choice: string) {
    ensureAudio()
    if (phase !== "playing") return
    if (!current) return
    if (resolvedRef.current) return

    const correct = current.answer[0]
    if (choice !== correct) {
      miss("wrong")
      return
    }
    success()
  }

  const quizTitle = (quizzes as any)[quizType]?.title || quizType

  return (
    <main style={styles.page} className="game-root">
      <div style={styles.shell}>
        <div style={styles.compactBar}>
          <button
            type="button"
            onClick={() => {
                if (phase === "ready") {
                  router.push("/select-mode")
                  return
                }
                setPhase("ready")
                setToast("")
              }}
            style={{ ...styles.compactBack, background: "transparent", border: "none", cursor: "pointer" }}
          >
            ←
          </button>

          <div style={styles.compactCenter}>
            <div style={styles.compactTitle}>日本語バトル（4択スピード）</div>
            <div style={styles.compactSub}>{quizTitle}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSoundOn((v) => !v)
              setTimeout(() => ensureAudio(), 0)
            }}
            style={styles.soundBtn}
            aria-label="toggle sound"
            title="Sound"
          >
            {soundOn ? "🔊" : "🔇"}
          </button>

          <div style={styles.compactStats}>
            <span style={styles.badge}>S {score}</span>
            <span style={styles.badge}>❤ {life}</span>
          </div>
        </div>

        <section style={styles.card}>
          {/* Ready */}
          <div style={{ display: phase === "ready" ? "block" : "none" }}>
            <div style={styles.panelTitle}>スタート設定</div>

            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
              教材：<b>{quizTitle}</b>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <div style={styles.label}>モード</div>
                <div style={styles.seg}>
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

                <div style={styles.help}>4択をテンポよく解くモード。N4（漢字/読み）と相性抜群。</div>

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

              <div style={styles.field}>
                <div style={styles.label}>難易度</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ ...styles.pill, ...styles.pillActive, cursor: "default" }}>
                    {pool[0]?.difficulty ?? difficulty}
                  </span>
                </div>
                <div style={styles.help}>※ 教材ごとに難易度は固定。アタックは自動で上がります。</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button onClick={startGame} disabled={pool.length === 0} style={{ ...styles.btn, ...styles.btnMain }}>
                ゲーム開始
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              問題数：<b>{pool.length}</b>
            </div>
          </div>

          {/* Playing */}
          <div style={{ display: phase === "playing" ? "block" : "none" }}>
            <motion.div style={{ position: "relative", overflow: "hidden" }} animate={shakeControls}>
              <div style={styles.topInfoRow}>
                <span style={styles.chip}>Lv {level}</span>
                <span style={styles.chip}>Combo {combo}</span>
                <span style={styles.timerChip}>{timeLeft.toFixed(1)}s</span>
                {mode === "attack" ? <span style={styles.chip}>Attack</span> : null}
              </div>

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

              <div style={styles.questionBox}>
                <div style={styles.qBadge}>SPEED</div>
                <div style={styles.prompt}>{current?.prompt ?? "…"}</div>
              </div>

              <div style={styles.choicesGrid}>
                {(current?.choices ?? []).slice(0, 4).map((c, idx) => (
                  <button key={`${c}-${idx}`} onClick={() => onPick(c)} style={styles.choiceBtn}>
                    {c}
                  </button>
                ))}
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

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  setPhase("ready")
                  setCurrent(null)
                  setToast("")
                }}
                style={{ ...styles.btn, ...styles.btnMain }}
              >
                もう一回
              </button>
              <Link href="/select-mode" style={{ ...styles.btn, ...styles.btnGhost, textDecoration: "none" }}>
                学習メニューへ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100svh", background: "#f6f7fb", padding: "clamp(10px, 3vw, 18px)" as any },
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

  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, boxShadow: "0 10px 24px rgba(0,0,0,0.06)" },
  panelTitle: { fontWeight: 900, fontSize: 16 },

  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 },
  field: { background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 },
  label: { fontWeight: 900, fontSize: 12, opacity: 0.75 },
  help: { marginTop: 8, fontSize: 12, opacity: 0.7, lineHeight: 1.5 },

  seg: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
  segBtn: { padding: "10px 12px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 900, cursor: "pointer" },
  segActive: { border: "1px solid #2563eb", boxShadow: "0 0 0 3px rgba(37,99,235,0.12)" },

  pill: { padding: "8px 12px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 900 },
  pillActive: { border: "1px solid #16a34a", boxShadow: "0 0 0 3px rgba(22,163,74,0.12)" },

  inlineLinkBtn: { marginLeft: 6, border: "none", background: "transparent", padding: 0, color: "#2563eb", fontWeight: 900, cursor: "pointer", textDecoration: "underline" },

  btn: { padding: "10px 14px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 900 },
  btnMain: { background: "#2563eb", color: "#fff" },
  btnGhost: { background: "#111827", color: "#fff" },

  topInfoRow: { display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 10, flexWrap: "wrap" },
  chip: { padding: "8px 10px", borderRadius: 999, background: "#fff", border: "1px solid #e5e7eb", fontWeight: 900, fontSize: 12, boxShadow: "0 10px 20px rgba(0,0,0,0.06)" },
  timerChip: { padding: "8px 10px", borderRadius: 999, background: "#111827", color: "#fff", fontWeight: 900, fontSize: 12 },

  comboPop: {
    position: "absolute",
    left: "50%",
    top: 120,
    transform: "translateX(-50%)",
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

  toast: { position: "absolute", top: 12, left: 12, padding: "8px 12px", borderRadius: 14, background: "#fff", border: "1px solid #e5e7eb", fontWeight: 900, boxShadow: "0 10px 22px rgba(0,0,0,0.08)", zIndex: 30 },

  questionBox: { position: "relative", background: "#111827", color: "#fff", borderRadius: 18, padding: 16, border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 18px 34px rgba(0,0,0,0.22)" },
  qBadge: { position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 900, opacity: 0.75, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" },
  prompt: { fontSize: "clamp(18px, 5vw, 24px)" as any, fontWeight: 900, textAlign: "center", padding: "18px 0 8px" },

  choicesGrid: { marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  choiceBtn: {
    padding: "clamp(12px, 3.2vw, 16px)" as any,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 900,
    fontSize: "clamp(16px, 4.8vw, 20px)" as any,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },

  lbBox: { background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 16, padding: 12 },
}
