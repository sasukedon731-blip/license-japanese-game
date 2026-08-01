import type { Question } from '@/app/data/types'

export type QuestionImagePurpose = 'question' | 'choice' | 'explanation'

type ImageSourceQuestion = Pick<
  Question,
  'imageUrl' | 'signId' | 'choiceImageUrl' | 'explanationImageUrl'
>

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

export function resolveQuestionImageSource(
  q: ImageSourceQuestion,
  purpose: QuestionImagePurpose = 'question',
): string | null {
  if (purpose === 'choice') return nonEmptyString(q.choiceImageUrl)
  if (purpose === 'explanation') return nonEmptyString(q.explanationImageUrl)

  const explicitImageUrl = nonEmptyString(q.imageUrl)
  if (explicitImageUrl) return explicitImageUrl

  const signId = nonEmptyString(q.signId)
  return signId ? `/signs/512/${signId}.png` : null
}
