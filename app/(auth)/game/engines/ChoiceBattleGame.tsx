"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { QuizType } from "@/app/data/types"
import { quizzes } from "@/app/data/quizzes"

type Props = {
  quizType: QuizType
  mode: "normal" | "attack"
}

type Phase = "ready" | "playing" | "over"

const BASE_LIFE = 3
const BASE_TIME_SEC = 6

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function computeTimeLimit(mode: "normal" | "attack", level: number) {
  // attack は少しずつ短く（下限2.5秒）
  if (mode === "attack") return clamp(BASE_TIME_SEC - (level - 1) * 0.35, 2.5, BASE_TIME_SEC)
  return BASE_TIME_SEC
}

export default function ChoiceBattleGame({ quizType, mode }: Props) {
  const quiz = quizzes[quizType]
  const questions = useMemo(() => quiz?.questions ?? [], [quiz?.questions])

  const [phase, setPhase] = useState<Phase>("ready")
  const [idx, setIdx] = useState(0)

  const [score, setScore] = useState(0)
  const [life, setLife] = useState(BASE_LIFE)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)

  const [timeKey, setTimeKey] = useState(0)
  const [flashWrong, setFlashWrong] = useState(false)
  const [shake, setShake] = useState(0)
  const [toast, setToast] = useState<string>("")

  const [flying, setFlying] = useState<string | null>(null)
  const [bounce, setBounce] = useState<string | null>(null)
  const [explosion, setExplosion] = useState(false)

  const lockedRef = useRef(false)

  const q = questions[idx % (questions.length || 1)]

const correct =
  q && typeof q.correctIndex === "number"
    ? q.choices[q.correctIndex]
    : undefined

const timeLimitSec = computeTimeLimit(mode, level)

  useEffect(() => {
    if (phase !== "playing") return
    if (life <= 0) {
      setPhase("over")
      setToast("GAME OVER")
    }
  }, [life, phase])

  function start() {
    if (!questions.length) return
    setPhase("playing")
    setIdx(0)
    setScore(0)
    setLife(BASE_LIFE)
    setLevel(1)
    setCombo(0)
    setToast("")
    setTimeKey((k) => k + 1)
    lockedRef.current = false
  }

  function nextQuestion(nextLife: number, wasCorrect: boolean) {
    // レベル進行：5問ごと
    const nextIdx = idx + 1
    const nextLevel = 1 + Math.floor(nextIdx / 5)
    setIdx(nextIdx)
    setLevel(nextLevel)
    setTimeKey((k) => k + 1)
    setFlashWrong(false)
    setShake(0)
    setFlying(null)
    setBounce(null)
    setExplosion(false)
    setToast(wasCorrect ? "OK!" : nextLife <= 0 ? "GAME OVER" : "MISS")
    lockedRef.current = false
  }

  function handleTimeout() {
    if (phase !== "playing") return
    if (lockedRef.current) return
    lockedRef.current = true

    const nextLife = life - 1
    setLife(nextLife)
    setCombo(0)
    setFlashWrong(true)
    setShake((s) => s + 1)

    // 少し見せてから次へ
    setTimeout(() => nextQuestion(nextLife, false), 300)
  }

  function handleSelect(choice: string) {
    if (phase !== "playing") return
    if (lockedRef.current) return
    lockedRef.current = true

    const isCorrect = choice === correct

    if (isCorrect) {
      setFlying(choice)
      const nextCombo = combo + 1
      setCombo(nextCombo)

      // コンボ倍率（軽め）
      const add = 100 + Math.min(400, nextCombo * 20)
      setScore((s) => s + add)

      // 少し演出
      setTimeout(() => {
        setExplosion(true)
        setTimeout(() => {
          setExplosion(false)
          nextQuestion(life, true)
        }, 240)
      }, 260)
      return
    }

    // wrong
    const nextLife = life - 1
    setLife(nextLife)
    setCombo(0)
    setBounce(choice)
    setFlashWrong(true)
    setShake((s) => s + 1)

    setTimeout(() => nextQuestion(nextLife, false), 320)
  }

  if (!q) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.topRow}>
            <Link href={`/game/play?type=${quizType}&kind=speed-choice&mode=normal&autostart=1`} style={styles.link}>
              ← もどる
            </Link>
          </div>
          <header style={styles.header}>
            <h1 style={styles.h1}>スピード4択バトル（{quiz?.title ?? quizType}）</h1>
          </header>
          <div style={{ padding: 16, opacity: 0.8 }}>問題がありません</div>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        {/* Top nav */}
        <div style={styles.topRow}>
          <Link href={`/game/play?type=${quizType}&kind=speed-choice&mode=normal&autostart=1`} style={styles.link}>
              ← もどる
            </Link>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {mode === "attack" ? "ATTACK" : "NORMAL"} / type: {quizType}
          </div>
        </div>

        {/* Header（落ち物と同じ雰囲気） */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>スピード4択バトル（{quiz?.title ?? quizType}）</h1>
            <div style={styles.sub}>文章4択をテンポ良く判断していくモード</div>
          </div>

          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>SCORE</div>
              <div style={styles.statValue}>{score}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>LIFE</div>
              <div style={styles.statValue}>{"❤".repeat(life)}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>LEVEL</div>
              <div style={styles.statValue}>{level}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>COMBO</div>
              <div style={styles.statValue}>{combo}</div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div style={styles.body}>
          {/* overlay flash */}
          <AnimatePresence>
            {flashWrong && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.16 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={styles.flash}
              />
            )}
          </AnimatePresence>

          {/* main field */}
          <div style={styles.field}>
            {/* time bar */}
            {phase === "playing" && (
              <div style={styles.timeWrap}>
                <div style={styles.timeBg}>
                  <motion.div
                    key={timeKey}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: timeLimitSec, ease: "linear" }}
                    onAnimationComplete={handleTimeout}
                    style={styles.timeBar}
                  />
                </div>
                <div style={styles.timeHint}>Time</div>
              </div>
            )}

            <motion.div
              key={shake}
              animate={{ x: flashWrong ? [0, -8, 8, -8, 8, 0] : 0 }}
              transition={{ duration: 0.35 }}
              style={styles.questionCard}
            >
              <div style={styles.qLabel}>問題</div>
              <div style={styles.qText}>{q.question}</div>

              <AnimatePresence>
                {explosion && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={styles.explosion}
                  >
                    💥
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {toast && phase !== "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    style={styles.toast}
                  >
                    {toast}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* bottom panel (2x2 tiles) */}
          <div style={styles.bottom}>
            {phase === "ready" ? (
              <button style={styles.primaryBtn} onClick={start}>
                スタート
              </button>
            ) : phase === "over" ? (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 14, opacity: 0.8, textAlign: "center" }}>
                  最終スコア：<b>{score}</b>
                </div>
                <button style={styles.primaryBtn} onClick={start}>
                  もう一度
                </button>
              </div>
            ) : (
              <div style={styles.choiceGrid}>
                {q.choices.map((c, i) => (
                  <button key={i} style={styles.choiceBtn} onClick={() => handleSelect(c)}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div style={styles.footerNav}>
              <Link href="/select-mode" style={styles.secondaryBtn as any}>
                戻る
              </Link>
              <button
                style={styles.secondaryBtn}
                onClick={() => {
                  setPhase("ready")
                  setToast("")
                }}
              >
                終了
              </button>
            </div>
          </div>

          {/* flying copy */}
          <AnimatePresence>
            {flying && (
              <motion.div
                initial={{ opacity: 1, y: 220, scale: 1 }}
                animate={{ opacity: 0, y: -40, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={styles.flying}
              >
                {flying}
              </motion.div>
            )}
          </AnimatePresence>

          {/* bounce copy (wrong) */}
          <AnimatePresence>
            {bounce && (
              <motion.div
                initial={{ opacity: 1, y: 220, scale: 1 }}
                animate={{ x: [0, -18, 18, -12, 12, 0], y: [220, 220, 220, 220, 220, 220] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={styles.bounce}
              >
                {bounce}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    color: "#111827",
  },
  shell: {
    maxWidth: 860,
    margin: "0 auto",
    padding: 16,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  link: {
    fontSize: 13,
    textDecoration: "none",
    color: "#2563eb",
  },
  header: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    justifyContent: "space-between",
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  h1: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },
  sub: {
    marginTop: 6,
    fontSize: 12,
    opacity: 0.7,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(80px, 1fr))",
    gap: 10,
  },
  stat: {
    background: "#f3f4f6",
    borderRadius: 12,
    padding: "10px 12px",
    textAlign: "center",
    minWidth: 86,
  },
  statLabel: { fontSize: 10, opacity: 0.65, marginBottom: 4, letterSpacing: 0.6 },
  statValue: { fontSize: 16, fontWeight: 800 },

  body: {
    position: "relative",
    marginTop: 14,
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    minHeight: 520,
    overflow: "hidden",
  },
  flash: {
    position: "absolute",
    inset: 0,
    background: "#ef4444",
    pointerEvents: "none",
  },
  field: {
    display: "grid",
    gap: 12,
    alignContent: "start",
    minHeight: 260,
  },
  timeWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  timeBg: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    background: "#e5e7eb",
  },
  timeBar: {
    height: "100%",
    background: "#ef4444",
  },
  timeHint: { fontSize: 11, opacity: 0.7 },

  questionCard: {
    position: "relative",
    borderRadius: 16,
    background: "#f9fafb",
    padding: 16,
    border: "1px solid #e5e7eb",
  },
  qLabel: { fontSize: 11, opacity: 0.7, marginBottom: 8 },
  qText: { fontSize: 16, fontWeight: 700, lineHeight: 1.5 },
  explosion: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 52,
    pointerEvents: "none",
  },
  toast: {
    position: "absolute",
    top: -10,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111827",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 11,
    letterSpacing: 0.5,
    pointerEvents: "none",
  },

  bottom: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    display: "grid",
    gap: 12,
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
  },
  choiceBtn: {
    height: 56,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(37,99,235,0.18)",
  },

  footerNav: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 14,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryBtn: {
    height: 44,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#f3f4f6",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },

  flying: {
    position: "absolute",
    left: "50%",
    bottom: 130,
    transform: "translateX(-50%)",
    background: "#2563eb",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 14,
    fontWeight: 800,
    pointerEvents: "none",
    boxShadow: "0 18px 30px rgba(0,0,0,0.15)",
    maxWidth: "90%",
    textAlign: "center",
  },
  bounce: {
    position: "absolute",
    left: "50%",
    bottom: 130,
    transform: "translateX(-50%)",
    background: "#ef4444",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 14,
    fontWeight: 800,
    pointerEvents: "none",
    boxShadow: "0 18px 30px rgba(0,0,0,0.15)",
    maxWidth: "90%",
    textAlign: "center",
  },
}
