import type { Question } from "@/app/data/types"

export function getCorrectIndexes(q: Question): number[] {
  if (Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0) {
    return [...q.correctIndexes].sort((a, b) => a - b)
  }
  if (typeof q.correctIndex === "number") return [q.correctIndex]
  return []
}

export function isMultiAnswerQuestion(q: Question): boolean {
  return getCorrectIndexes(q).length > 1
}

export function requiredAnswerCount(q: Question): number {
  return Math.max(1, getCorrectIndexes(q).length)
}

export function isSelectionComplete(q: Question, selected: number[]): boolean {
  const required = requiredAnswerCount(q)
  return selected.length === required
}

export function isCorrectSelection(q: Question, selected: number[]): boolean {
  const correct = getCorrectIndexes(q)
  if (selected.length !== correct.length) return false
  const a = [...selected].sort((x, y) => x - y)
  return a.every((value, index) => value === correct[index])
}

export function shuffleQuestionChoices(
  q: Question,
  shuffleArray: <T>(arr: T[]) => T[]
): Question {
  if (!Array.isArray(q.choices) || q.choices.length <= 1) return q

  const pairs = q.choices.map((choice, index) => ({ choice, originalIndex: index }))
  const shuffled = shuffleArray(pairs)

  const originalCorrect = getCorrectIndexes(q)
  const nextCorrect = shuffled
    .map((pair, newIndex) => ({ ...pair, newIndex }))
    .filter((pair) => originalCorrect.includes(pair.originalIndex))
    .map((pair) => pair.newIndex)
    .sort((a, b) => a - b)

  return {
    ...q,
    choices: shuffled.map((pair) => pair.choice),
    correctIndex: nextCorrect[0] ?? q.correctIndex,
    correctIndexes: nextCorrect.length > 1 ? nextCorrect : undefined,
  }
}

export function formatCorrectAnswerLabels(q: Question): string {
  const labels = getCorrectIndexes(q).map((index) => index + 1)
  return labels.join('・')
}

export function stripLeadingAnswerLabel(text?: string): string {
  if (!text) return ""
  return text
    .replace(/^\s*正解は?[：:\s]*[①-⑩\d（()）・,、\s]+[。.]?\s*/u, "")
    .replace(/^\s*【?正解】?[：:\s]*[①-⑩\d（()）・,、\s]+[。.]?\s*/u, "")
    .trim()
}
