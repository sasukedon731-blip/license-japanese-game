import type { QuizType } from "@/app/data/types"

export type GuardResult =
  | { ok: true }
  | { ok: false; redirect: string }

export function guardQuizAccess(params: {
  type: string | null
  selected: QuizType[]
}): GuardResult {
  const { type, selected } = params

  // type 未指定
  if (!type) {
    return { ok: false, redirect: "/select-mode" }
  }

  // selected が空
  if (!selected || selected.length === 0) {
    return { ok: false, redirect: "/select-quizzes" }
  }

  // 未選択教材へアクセス
  if (!selected.includes(type as QuizType)) {
    return { ok: false, redirect: "/select-mode" }
  }

  return { ok: true }
}
