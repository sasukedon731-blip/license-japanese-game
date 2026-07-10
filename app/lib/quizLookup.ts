import { quizzes } from "@/app/data/quizzes"
import type { Quiz, QuizType } from "@/app/data/types"
import { attachAudioUrls } from "@/app/lib/audio"

export function getQuizFromType(typeRaw: string | null): { quizType: QuizType; quiz: Quiz } | null {
  if (!typeRaw) return null
  const t = typeRaw as QuizType
  const raw = (quizzes as any)[t] as Quiz | undefined
  if (!raw) return null

  const quiz = attachAudioUrls(raw)
  return { quizType: t, quiz }
}