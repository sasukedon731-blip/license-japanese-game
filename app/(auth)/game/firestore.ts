import {
  collection,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore"

import { db } from "@/app/lib/firebase"
import type { GameDifficulty, GameMode, GameQuestion, LeaderboardEntry } from "./types"

// ===== Questions =====
// Firestore recommended structure:
// gameQuestions/{questionId}
//  - enabled: boolean
//  - type: "reading"|"fill"|"particle"
//  - prompt: string
//  - answer: string[]
//  - choices: string[]
//  - difficulty: "N5"|"N4"|"N3"|"N2"|"N1"
//  - updatedAt: timestamp

export async function fetchGameQuestions(params: {
  difficulty?: GameDifficulty
  mode: GameMode
  take?: number
}): Promise<GameQuestion[]> {
  const take = params.take ?? 60
  const col = collection(db, "gameQuestions")

  // Normal: filter by selected difficulty.
  // Attack: we usually fetch a wider pool (all difficulties) and pick based on level.
  const q = params.mode === "normal" && params.difficulty
    ? query(col, where("enabled", "==", true), where("difficulty", "==", params.difficulty), limit(take))
    : query(col, where("enabled", "==", true), limit(take))

  const snap = await getDocs(q)
  const items: GameQuestion[] = []
  snap.forEach((d) => {
    const v = d.data() as any
    if (!v) return
    // Basic validation (avoid runtime crashes)
    if (!v.prompt || !Array.isArray(v.answer) || !Array.isArray(v.choices) || !v.difficulty || !v.type) return
   items.push({
  id: d.id,

  // ✅ 追加：Firestoreにkindが無い古いデータでも動くように推定
  kind:
    (v.kind as any) ??
    (/漢字|読み|よみ|ひらがな|カタカナ/.test(String(v.prompt ?? "")) ? "speed-choice" : "tile-drop"),

  type: v.type,
  prompt: v.prompt,
  answer: v.answer,
  choices: v.choices,
  difficulty: v.difficulty,
  enabled: Boolean(v.enabled),
  quizType: v.quizType,
})
  })
  return items
}

// ===== Leaderboard =====
// Recommended structure:
// attackLeaderboard/{uid}
//  - uid
//  - displayName
//  - bestScore
//  - lastScore
//  - updatedAt

export async function submitAttackScore(params: {
  gameId: "tile-drop" | "flash-judge" | "memory-burst" | "speed-choice" | "sentence-build"
  uid: string
  displayName: string
  score: number
  bestLevel?: "N4" | "N3" | "N2"
  bestStage?: number
}): Promise<{ bestScore: number }> {
  // ✅ per-game leaderboard (Attack only)
  const ref = doc(db, "attackLeaderboards", params.gameId, "entries", params.uid)

  // Merge update: keep bestScore (do not decrease)
  let prevBest = 0
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const v = snap.data() as any
      prevBest = Number(v?.bestScore ?? 0) || 0
    }
  } catch {
    // ignore
  }

  const score = Number(params.score ?? 0) || 0
  const bestScore = Math.max(prevBest, score)

  try {
    await setDoc(
    ref,
    {
      uid: params.uid,
      displayName: params.displayName || "匿名",
      bestScore,
      lastScore: score,
      bestLevel: params.bestLevel ?? "N4",
      bestStage: params.bestStage ?? 0,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
  } catch (e: any) {
    // Useful surface for UI
    const msg = String(e?.code || e?.message || e)
    if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
      throw new Error('PERMISSION_DENIED')
    }
    throw e
  }

  return { bestScore }
}


export async function fetchAttackLeaderboard(params: {
  gameId: "tile-drop" | "flash-judge" | "memory-burst" | "speed-choice" | "sentence-build"
  take?: number
}): Promise<LeaderboardEntry[]> {
  const take = params.take ?? 50
  const col = collection(db, "attackLeaderboards", params.gameId, "entries")
  const q = query(col, orderBy("bestScore", "desc"), limit(take))
  const snap = await getDocs(q)
  const items: LeaderboardEntry[] = []
  snap.forEach((d) => {
    const v = d.data() as any
    if (!v) return
    items.push({
      uid: v.uid || d.id,
      displayName: v.displayName || "匿名",
      bestScore: Number(v.bestScore ?? 0),
      bestLevel: v.bestLevel,
      bestStage: Number(v.bestStage ?? 0),
      updatedAt: v.updatedAt,
    })
  })
  return items
}


export async function fetchMyAttackRank(params: {
  gameId: "tile-drop" | "flash-judge" | "memory-burst" | "speed-choice" | "sentence-build"
  uid: string
}): Promise<{ rank: number | null; entry: LeaderboardEntry | null; bestScore: number }> {
  // get my entry
  const ref = doc(db, "attackLeaderboards", params.gameId, "entries", params.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return { rank: null, entry: null, bestScore: 0 }
  const v = snap.data() as any
  const bestScore = Number(v?.bestScore ?? 0) || 0

  // rank by bestScore only (ties share same rank-ish)
  // rank = count( bestScore > mine ) + 1
  const col = collection(db, "attackLeaderboards", params.gameId, "entries")
  const q = query(col, where("bestScore", ">", bestScore))
  const cnt = await getCountFromServer(q)

  const entry: LeaderboardEntry = {
    uid: v?.uid ?? params.uid,
    displayName: v?.displayName ?? "匿名",
    bestScore,
    bestLevel: v?.bestLevel ?? "N4",
    bestStage: v?.bestStage ?? 0,
    updatedAt: v?.updatedAt ?? null,
  }

  return { rank: Number(cnt.data().count) + 1, entry, bestScore }
}
