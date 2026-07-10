import { quizCatalog } from "@/app/data/quizCatalog"
import type { QuizType } from "@/app/data/types"

/**
 * URLなどから来た string を QuizType に安全変換する
 */
export function parseQuizType(value: string | null): QuizType | null {
  if (!value) return null

  const exists = quizCatalog.some(q => q.id === value)
  return exists ? (value as QuizType) : null
}
