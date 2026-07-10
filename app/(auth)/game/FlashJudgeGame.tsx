"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/lib/firebase"
import { fetchAttackLeaderboard, fetchMyAttackRank, submitAttackScore } from "./firestore"
import GameEndActions from "./ui/GameEndActions"

import type { QuizType } from "@/app/data/types"
import type { FlashJudgeQuestion, GameMode } from "./types"
import { getFlashJudgePool } from "./pools/flashJudgePools"

const ATTACK_LEVELS: QuizType[] = ["japanese-n4", "japanese-n3", "japanese-n2"]

function levelLabel(i: number): "N4" | "N3" | "N2" {
  return i === 2 ? "N2" : i === 1 ? "N3" : "N4"
}

type Phase = "ready" | "playing" | "over"

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function FlashJudgeGame({
  quizType,
  modeParam,
}: {
  quizType: QuizType
  modeParam: string | null
}) {
  const params = useSearchParams()
  const autostart = params.get("autostart") === "1"

  const phaseSection = params.get("section")
  const mode: GameMode = modeParam === "attack" ? "attack" : "normal"

  const [phase, setPhase] = useState<Phase>("ready")

  const [lbLoading, setLbLoading] = useState(false)
  const [lbItems, setLbItems] = useState<{ displayName: string; bestScore: number }[]>([])
  const [myRank, setMyRank] = useState<number | null>(null)
  const [myBestScore, setMyBestScore] = useState<number>(0)

  const [score, setScore] = useState<number>(0)
  const [life, setLife] = useState<number>(3)

  // ✅ ライフが0になったら確実に終了（state更新順のズレ対策）
  useEffect(() => {
    if (phase === "playing" && life <= 0) {
      setPhase("over")
    }
  }, [life, phase])

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [toast, setToast] = useState<string>("")

  const isAttack = mode === "attack" && quizType.startsWith("japanese-")
  const [attackLevelIndex, setAttackLevelIndex] = useState(0)
  const [stageCorrect, setStageCorrect] = useState(0)
  const activeQuizType: QuizType = isAttack ? ATTACK_LEVELS[attackLevelIndex] : quizType

  const pool = useMemo(() => {
    let list = getFlashJudgePool(activeQuizType)
    if (quizType === "japanese-n4") {
      const section = phaseSection
      if (section && section !== "all") {
        list = list.filter((q) => q.sectionId === section)
      }
    }
    return list
  }, [activeQuizType, phaseSection, quizType])

  const [maxLevelReached, setMaxLevelReached] = useState(0)
  const [bestStageAtMax, setBestStageAtMax] = useState(0)

  const [combo, setCombo] = useState<number>(0)
  const [current, setCurrent] = useState<FlashJudgeQuestion | null>(null)
  const [lastMsg, setLastMsg] = useState<string>("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null)
      setDisplayName(u?.displayName ?? "")
    })
    return () => unsub()
  }, [])

  // ✅ アタック：自分の順位/ベストを表示（開始前）
  useEffect(() => {
    if (!isAttack) return
    if (!uid) return
    if (phase !== "ready") return
    fetchMyAttackRank({ gameId: "flash-judge", uid })
      .then((r) => {
        setMyRank(r.rank)
        setMyBestScore(r.bestScore)
      })
      .catch(() => null)
  }, [isAttack, uid, phase])

  // ✅ アタック：ゲームオーバー時に記録保存 & ランキング取得
  useEffect(() => {
    if (!isAttack) return
    if (!uid) return
    if (phase !== "over") return

    let cancelled = false
    ;(async () => {
      setLbLoading(true)

      // ✅ 先にスコア保存（失敗してもランキング表示は継続）
      try {
        await submitAttackScore({
          gameId: "flash-judge",
          uid,
          displayName: displayName || "匿名",
          score,
          bestLevel:
            maxLevelReached === 2 ? "N2" : maxLevelReached === 1 ? "N3" : "N4",
          bestStage: bestStageAtMax,
        })
      } catch (e: any) {
        console.error(e)
        const msg = String(e?.message || e)
        setToast(
          msg.includes("PERMISSION_DENIED")
            ? "⚠️ 記録保存に失敗（Firestoreルール）"
            : "⚠️ 記録保存に失敗"
        )
      }

      try {
        const my = await fetchMyAttackRank({ gameId: "flash-judge", uid })
        const lb = await fetchAttackLeaderboard({ gameId: "flash-judge", take: 30 })
        if (!cancelled) {
          setMyRank(my.rank)
          setMyBestScore(my.bestScore)
          setLbItems(lb.map((x) => ({ displayName: x.displayName, bestScore: x.bestScore })))
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!cancelled) setLbLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isAttack, uid, phase, displayName, score, maxLevelReached, bestStageAtMax])

  useEffect(() => {
    if (autostart) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart])

  function nextQuestion() {
    if (!pool.length) {
      setCurrent(null)
      return
    }
    setCurrent(pickRandom(pool))
  }

  function start() {
    setScore(0)
    setCombo(0)
    setLastMsg("")
    setLife(3)
    if (isAttack) {
      setAttackLevelIndex(0)
      setStageCorrect(0)
      setMaxLevelReached(0)
      setBestStageAtMax(0)
    }
    setPhase("playing")
    nextQuestion()
  }

  function answer(user: boolean) {
    if (!current) return

    const ok = user === current.answer
    if (ok) {
      const newCombo = combo + 1
      setCombo(newCombo)
      const bonus = newCombo >= 5 ? 2 : 1
      setScore((s) => s + 10 * bonus)
      setLastMsg(newCombo >= 5 ? `✅ 正解！(x${bonus})` : "✅ 正解！")

      if (isAttack) {
        setStageCorrect((prev) => {
          const next = prev + 1
          setBestStageAtMax((bs) =>
            attackLevelIndex === maxLevelReached ? Math.max(bs, Math.min(next, 30)) : bs
          )
          if (next >= 30) {
            setAttackLevelIndex((i) => {
              const ni = (i + 1) % 3
              setMaxLevelReached((m) => Math.max(m, ni))
              return ni
            })
            return 0
          }
          return next
        })
      }
    } else {
      setCombo(0)
      setScore((s) => Math.max(0, s - 5))
      setLastMsg("❌ ミス！")
      setLife((prev) => {
        const next = prev - 1
        return next < 0 ? 0 : next
      })
    }

    nextQuestion()
  }

  return (
    <div className="withFixedCta" style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      {/* ✅ /game/play 側で AppHeader を表示しているため二重を防ぐ */}

      {/* readyは基本ハブへ飛ぶが、念のため残す（autostart時や将来拡張） */}
      {phase === "ready" && (
        <div style={{ marginTop: 18, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>瞬判ジャッジ（○ / ×）</div>
          <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
            文が正しいなら <b>○</b>、間違いなら <b>×</b>。
            <br />
            コンボで加点アップ。
          </div>
          <div style={{ marginTop: 12, opacity: 0.85 }}>
            問題数：{pool.length}問（この画面はサンプル同梱。増やしてOK）
          </div>

          {/* PC用（スマホは固定CTAに） */}
          <button
            onClick={start}
            disabled={!pool.length}
            className="hideOnMobile"
            style={{ marginTop: 14, width: "100%", padding: "12px 14px", borderRadius: 12, fontWeight: 800 }}
          >
            {pool.length ? "スタート" : "問題がありません（テンプレから追加してね）"}
          </button>

          {/* スマホ用：下部固定CTA */}
          <div className="mobileFixedBar">
            <button
              type="button"
              onClick={start}
              disabled={!pool.length}
              className="mobileFixedBtn"
            >
              {pool.length ? "スタート" : "問題がありません"}
            </button>
          </div>
        </div>
      )}

      {phase === "playing" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
              ❤️ {life}
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
              🧠 score {score}
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)" }}>
              🔥 combo {combo}
            </div>
          </div>

          <div style={{ marginTop: 14, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {current?.prompt ?? ""}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                onClick={() => answer(true)}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 14, fontWeight: 900, fontSize: 18 }}
              >
                ○ 正しい
              </button>
              <button
                onClick={() => answer(false)}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 14, fontWeight: 900, fontSize: 18 }}
              >
                × 間違い
              </button>
            </div>
            {lastMsg && <div style={{ marginTop: 10, fontWeight: 800 }}>{lastMsg}</div>}
          </div>

          {toast && <div style={{ marginTop: 10, fontWeight: 900 }}>{toast}</div>}
          {isAttack && (
            <div style={{ marginTop: 8, opacity: 0.9 }}>
              Lv: {levelLabel(attackLevelIndex)} / Stage: {stageCorrect}/30
              {myRank != null && (
                <span style={{ marginLeft: 10 }}>
                  あなた：#{myRank}（best {myBestScore}）
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {phase === "over" && (
        <div style={{ marginTop: 18, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>終了！</div>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>score: {score}</div>

          {isAttack && (
            <div style={{ marginTop: 10, opacity: 0.9 }}>
              {lbLoading ? (
                <div>ランキング更新中…</div>
              ) : (
                <>
                  {myRank != null && (
                    <div style={{ fontWeight: 900 }}>
                      あなた：#{myRank} / best {myBestScore}
                    </div>
                  )}
                  {lbItems.length > 0 && (
                    <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>上位</div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {lbItems.slice(0, 10).map((x, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ opacity: 0.95 }}>{i + 1}. {x.displayName}</div>
                            <div style={{ fontWeight: 900 }}>{x.bestScore}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <GameEndActions onRetry={() => setPhase("ready")} />
        </div>
      )}
    </div>
  )
}
