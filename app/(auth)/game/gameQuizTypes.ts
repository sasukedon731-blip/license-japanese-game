import type { QuizType } from "@/app/data/types"

export const GAME_QUIZ_TYPES = ["japanese-n4", "japanese-n3", "japanese-n2"] as const

export type GameQuizType = (typeof GAME_QUIZ_TYPES)[number]

const gameQuizTypeSet: ReadonlySet<string> = new Set(GAME_QUIZ_TYPES)

export function isGameQuizType(value: unknown): value is GameQuizType {
  return typeof value === "string" && gameQuizTypeSet.has(value)
}

export function asGameQuizType(value: QuizType | unknown): GameQuizType | null {
  return isGameQuizType(value) ? value : null
}
