"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/lib/firebase"
import { submitAttackScore } from "./firestore"
import GameEndActions from "./ui/GameEndActions"

import type { QuizType } from "@/app/data/types"
import type { GameMode, MemoryBurstQuestion } from "./types"
import { getMemoryBurstPool } from "./pools/memoryBurstPools"
import { addJlptBattleXp, comboMultiplier } from "./battleProgress"

const ATTACK_LEVELS: QuizType[] = ["japanese-n4", "japanese-n3", "japanese-n2"]

function levelLabel(i: number): "N4" | "N3" | "N2" {
  return i === 2 ? "N2" : i === 1 ? "N3" : "N4"
}

type Phase = "ready" | "show" | "question" | "over"

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function MemoryBurstGame({
  quizType,
  modeParam,
}: {
  quizType: QuizType
  modeParam: string | null
}) {
  const params = useSearchParams()
  const autostart = params.get("autostart") === "1"
  const mode: GameMode = modeParam === "attack" ? "attack" : "normal"
  const isAttack = mode === "attack" && quizType.startsWith("japanese-")

  const [attackLevelIndex, setAttackLevelIndex] = useState(0)
  const [stageCorrect, setStageCorrect] = useState(0)
  const [maxLevelReached, setMaxLevelReached] = useState(0)
  const [bestStageAtMax, setBestStageAtMax] = useState(0)

  const activeQuizType: QuizType = isAttack ? ATTACK_LEVELS[attackLevelIndex] : quizType
  const section = params.get("section") // 将来拡張用

  const pool = useMemo(() => {
    let list = getMemoryBurstPool(activeQuizType)
    void section
    return list.filter((q) => q.enabled)
  }, [activeQuizType, section])

  const [phase, setPhase] = useState<Phase>("ready")
  const [combo, setCombo] = useState(0)

  const [life, setLife] = useState(3)

  // ✅ ライフが0になったら確実に終了（state更新順のズレ対策）
  useEffect(() => {
    if (phase !== "ready" && phase !== "over" && life <= 0) {
      setPhase("over")
    }
  }, [life, phase])

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [toast, setToast] = useState<string>("")

  const [score, setScore] = useState(0)
  const [current, setCurrent] = useState<MemoryBurstQuestion | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [showMs] = useState<number>(2500)
  // ✅ バトルXP（JLPTのみ）
useEffect(() => {
  if (phase !== "over") return
  if (!uid) return
  if (!quizType.startsWith("japanese-")) return
  addJlptBattleXp(uid, Math.floor(score / 10)).catch(() => null)
}, [phase, uid, quizType, score])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null)
      setDisplayName(u?.displayName ?? "")
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!isAttack) return
    if (phase !== "over") return
    if (!uid) return
    submitAttackScore({
      gameId: "memory-burst",
      uid,
      displayName: displayName || "匿名",
      score,
      bestLevel: levelLabel(maxLevelReached),
      bestStage: bestStageAtMax,
    }).catch((e: any) => {
      console.error(e)
      setToast(
        String(e?.message || e).includes("PERMISSION_DENIED")
          ? "⚠️ 記録保存に失敗（Firestoreルール）"
          : "⚠️ 記録保存に失敗"
      )
    })
  }, [isAttack, phase, uid, displayName, score, maxLevelReached, bestStageAtMax])

  useEffect(() => {
    if (autostart) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart])

  function start() {
    setScore(0)
    setFeedback("")
    setLife(3)
    if (isAttack) {
      setAttackLevelIndex(0)
      setStageCorrect(0)
      setMaxLevelReached(0)
      setBestStageAtMax(0)
    }
    const q = pickRandom(pool)
    setCurrent(q || null)
    setPhase("show")
    window.setTimeout(() => {
      setPhase("question")
    }, showMs)
  }

  function next() {
    const q = pickRandom(pool)
    setCurrent(q || null)
    setFeedback("")
    setPhase("show")
    window.setTimeout(() => {
      setPhase("question")
    }, showMs)
  }

  function choose(i: number) {
    if (!current) return
    const ok = i === current.correctIndex
    if (ok) {
      const newCombo = combo + 1
      setCombo(newCombo)
      const mult = comboMultiplier(newCombo)
      setScore((s) => s + Math.round(15 * mult))
      setFeedback(mult > 1 ? `✅ 正解！(x${mult.toFixed(1)})` : "✅ 正解！")
      if (isAttack) {
        setStageCorrect((prev) => {
          const nextC = prev + 1
          setBestStageAtMax((bs) =>
            attackLevelIndex === maxLevelReached ? Math.max(bs, Math.min(nextC, 30)) : bs
          )
          if (nextC >= 30) {
            setAttackLevelIndex((idx) => {
              const ni = (idx + 1) % 3
              setMaxLevelReached((m) => Math.max(m, ni))
              return ni
            })
            return 0
          }
          return nextC
        })
      }
    } else {
      setCombo(0)
      setScore((s) => Math.max(0, s - 5))
      setFeedback("❌ ちがう")
      setLife((prev) => {
        const nextL = prev - 1
        return nextL < 0 ? 0 : nextL
      })
    }
    window.setTimeout(() => {
      next()
    }, 600)
  }

  const choiceStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.06)",
    fontWeight: 900,
    fontSize: "clamp(16px, 4.8vw, 20px)",
    lineHeight: 1.2,
    textAlign: "left",
    whiteSpace: "normal",
    wordBreak: "break-word",
  }

  return (
    <div className="withFixedCta" style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      {/* ✅ /game/play 側で AppHeader を表示しているため二重を防ぐ */}

      {/* readyは基本ハブへ飛ぶが、念のため残す */}
      {phase === "ready" && !autostart && (
        <div style={{ marginTop: 18, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>一瞬表示 → 記憶で答える</div>
          <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
            文章が一瞬だけ表示されます。
            <br />
            消えたあとに質問に答えてください。
          </div>
          <div style={{ marginTop: 12, opacity: 0.85 }}>問題数：{pool.length}問</div>

          {/* PC用（スマホは固定CTAに） */}
          <button
            onClick={start}
            className="hideOnMobile"
            style={{ marginTop: 14, width: "100%", padding: "12px 14px", borderRadius: 12, fontWeight: 900 }}
          >
            ゲーム開始
          </button>

          {/* スマホ用：下部固定CTA */}
          <div className="mobileFixedBar">
            <button type="button" onClick={start} className="mobileFixedBtn">
              ゲーム開始
            </button>
          </div>
        </div>
      )}

      {(phase === "show" || phase === "question") && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>❤️ {life}</div>
            <div style={{ fontWeight: 900 }}>score {score}</div>
          </div>

          <div style={{ marginTop: 14, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
            {phase === "show" ? (
              <div style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 900, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {current?.displayText ?? ""}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "clamp(16px, 4.6vw, 22px)", fontWeight: 900, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {current?.question ?? ""}
                </div>
                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {(current?.choices ?? []).map((c, i) => (
                    <button key={i} onClick={() => choose(i)} style={choiceStyle}>
                      {c}
                    </button>
                  ))}
                </div>
                {feedback && <div style={{ marginTop: 10, fontWeight: 900 }}>{feedback}</div>}
              </div>
            )}
          </div>

          {toast && <div style={{ marginTop: 10, fontWeight: 900 }}>{toast}</div>}
          {isAttack && (
            <div style={{ marginTop: 8, opacity: 0.9 }}>
              Lv: {levelLabel(attackLevelIndex)} / Stage: {stageCorrect}/30
            </div>
          )}
        </div>
      )}

      {phase === "over" && (
        <div style={{ marginTop: 18, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>終了！</div>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>score: {score}</div>
          <GameEndActions onRetry={() => setPhase("ready")} />
        </div>
      )}
    </div>
  )
}