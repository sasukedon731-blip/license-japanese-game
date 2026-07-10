"use client"

import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export type StudyProgress = {
  totalSessions: number
  todaySessions: number
  lastStudyDate: string // YYYY-MM-DD (JST)
  streak: number
  streakUpdatedDate: string // YYYY-MM-DD (JST)
  bestStreak: number
}

/** JSTで YYYY-MM-DD を作る（UTCズレ対策） */
function jstDayKey(d = new Date()) {
  try {
    // "sv-SE" は YYYY-MM-DD 形式になる
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d)
  } catch {
    // フォールバック
    const local = new Date(d.getTime() + 9 * 60 * 60 * 1000)
    return local.toISOString().slice(0, 10)
  }
}

function jstYesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return jstDayKey(d)
}

const baseProgress = (): StudyProgress => {
  const today = jstDayKey()
  return {
    totalSessions: 0,
    todaySessions: 0,
    lastStudyDate: today,
    streak: 0,
    streakUpdatedDate: "",
    bestStreak: 0,
  }
}

export function readLocalProgress(quizType: string): StudyProgress {
  const today = jstDayKey()
  const base = baseProgress()

  try {
    const raw = localStorage.getItem(`study-progress-${quizType}`)
    if (!raw) return base

    const d = JSON.parse(raw) as Partial<StudyProgress>
    const p: StudyProgress = {
      totalSessions: typeof d.totalSessions === "number" ? d.totalSessions : 0,
      todaySessions: typeof d.todaySessions === "number" ? d.todaySessions : 0,
      lastStudyDate: typeof d.lastStudyDate === "string" ? d.lastStudyDate : today,
      streak: typeof d.streak === "number" ? d.streak : 0,
      streakUpdatedDate: typeof d.streakUpdatedDate === "string" ? d.streakUpdatedDate : "",
      bestStreak: typeof d.bestStreak === "number" ? d.bestStreak : 0,
    }

    // 日付が違えば、表示上の todaySessions は 0 扱い
    if (p.lastStudyDate !== today) return { ...p, todaySessions: 0 }
    return p
  } catch {
    return base
  }
}

function writeLocalProgress(quizType: string, p: StudyProgress) {
  localStorage.setItem(`study-progress-${quizType}`, JSON.stringify(p))
}

/**
 * ✅ 標準問題（Normal）を「最後まで完了」したときだけ呼ぶ
 * - localStorage を更新
 * - Firestore(users/{uid}/progress/{quizType}) にも保存（管理画面で見られる）
 */
export async function recordNormalCompletion(params: {
  uid: string
  quizType: string
}) {
  const { uid, quizType } = params
  const today = jstDayKey()
  const yesterday = jstYesterdayKey()

  const current = readLocalProgress(quizType)

  const sameDay = current.lastStudyDate === today
  const nextToday = sameDay ? (current.todaySessions ?? 0) + 1 : 1
  const nextTotal = (current.totalSessions ?? 0) + 1

  // streak：その日の初回完了時だけ更新（1日に何回完了しても+1しない）
  let nextStreak = current.streak ?? 0
  let nextBest = current.bestStreak ?? 0
  let nextStreakUpdatedDate = current.streakUpdatedDate ?? ""
  const alreadyUpdatedToday = nextStreakUpdatedDate === today

  if (!alreadyUpdatedToday) {
    if (current.lastStudyDate === yesterday) nextStreak = (current.streak ?? 0) + 1
    else nextStreak = 1

    nextStreakUpdatedDate = today
    nextBest = Math.max(nextBest, nextStreak)
  }

  const next: StudyProgress = {
    totalSessions: nextTotal,
    todaySessions: nextToday,
    lastStudyDate: today,
    streak: nextStreak,
    streakUpdatedDate: nextStreakUpdatedDate,
    bestStreak: nextBest,
  }

  // ① localStorage
  writeLocalProgress(quizType, next)

  // ② Firestore（adminが見れる）
  const ref = doc(db, "users", uid, "progress", quizType)
  await setDoc(
    ref,
    {
      ...next,
      uid,
      quizType,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return next
}
