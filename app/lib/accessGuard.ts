import type { QuizType } from "@/app/data/types"

export type GuardResult =
  | { ok: true }
  | { ok: false; redirect: string }

export function guardQuizAccess(params: {
  type: string | null
  selected: QuizType[]
}): GuardResult {
  void params.selected

  if (!params.type) {
    return { ok: false, redirect: "/select-mode" }
  }

  return { ok: true }
}
