import type { Question, Quiz, QuizType } from "@/app/data/types"

function getAudioUrl(quizType: QuizType, question: Question): string | undefined {
  if (!question.listeningText?.trim()) return undefined

  switch (quizType) {
    case "japanese-n4":
      return question.sectionId === "listening"
        ? `/audio/jlpt/n4/japanese-n4_${question.id}.mp3`
        : undefined

    case "japanese-n3":
      return question.sectionId === "listening"
        ? `/audio/jlpt/n3/jlpt-n3-listening_${question.id}.mp3`
        : undefined

    case "japanese-n2":
      return question.sectionId === "listening"
        ? `/audio/jlpt/n2/jlpt-n2-listening_${question.id}.mp3`
        : undefined

    case "kansai-listening":
      return `/audio/kansai-listening/kansai_${String(question.id).padStart(3, "0")}.mp3`

    default:
      return undefined
  }
}

export function attachAudioUrls(quiz: Quiz): Quiz {
  return {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      ...q,
      audioUrl: q.audioUrl ?? getAudioUrl(quiz.id, q),
    })),
  }
}
