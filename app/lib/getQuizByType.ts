import { quizzes } from "@/app/data/quizzes"
import type { Quiz, QuizType, QuizSection } from "@/app/data/types"
import { getQuizDef } from "@/app/data/quizCatalog"
import { attachAudioUrls } from "@/app/lib/audio"

/**
 * QuizType → 実体 Quiz（questions 含む）を取得
 * quiz.sections が無い教材は quizCatalog の sections を注入して分野タブ対応
 * listeningText がある問題には audioUrl を自動付与
 */
export function getQuizByType(type: QuizType): Quiz | null {
  const raw = quizzes[type] ?? null
  if (!raw) return null

  const base = attachAudioUrls(raw)

  // 既に sections がある教材はそのまま
  if (Array.isArray((base as any).sections) && (base as any).sections.length > 0) {
    return base
  }

  const def = getQuizDef(type)

  const injected: QuizSection[] =
    def?.sections
      ?.filter((s) => s.enabled && s.id !== "all")
      ?.sort((a, b) => a.order - b.order)
      ?.map((s) => ({ id: s.id, label: s.title })) ?? []

  return {
    ...base,
    sections: injected.length ? injected : undefined,
  }
}