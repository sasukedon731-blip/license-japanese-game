// app/lib/wrongStorage.ts
"use client"

import type { QuizType } from "@/app/data/types"

/** 間違えた問題IDを保存（重複なし） */
export function addWrongId(quizType: QuizType, questionId: number) {
  const key = `wrong-${quizType}`

  let ids: number[] = []
  try {
    ids = JSON.parse(localStorage.getItem(key) || "[]")
    if (!Array.isArray(ids)) ids = []
  } catch {
    ids = []
  }

  if (!ids.includes(questionId)) {
    ids.push(questionId)
    localStorage.setItem(key, JSON.stringify(ids))
  }
}

/** 間違いID一覧を読む（デバッグや表示用） */
export function getWrongIds(quizType: QuizType): number[] {
  const key = `wrong-${quizType}`
  try {
    const ids = JSON.parse(localStorage.getItem(key) || "[]")
    if (!Array.isArray(ids)) return []
    return ids.filter((x: any) => typeof x === "number")
  } catch {
    return []
  }
}

/** 全削除 */
export function clearWrongIds(quizType: QuizType) {
  localStorage.removeItem(`wrong-${quizType}`)
}
