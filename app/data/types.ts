// app/data/types.ts

export type QuizType =
  | "gaikoku-license"
  | "road-signs"
  | "japanese-n4"
  | "japanese-n3"
  | "japanese-n2"
  | "genba-listening"
  | "genba-phrasebook"
  | "dialect-listening"
  | "kansai-listening"
  | "dialect-meaning"
  | "confusing-japanese"

export type QuizSection = {
  id: string
  label: string
}

export type Question = {
  id: number
  question: string
  choices: string[]
  correctIndex?: number
  correctIndexes?: number[]
  explanation: string
  explanationEn?: string
  point?: string
  trap?: string
  signId?: string
  audioUrl?: string
  listeningText?: string
  imageUrl?: string
  imageAlt?: string
  choiceImageUrl?: string
  choiceImageAlt?: string
  explanationImageUrl?: string
  explanationImageAlt?: string
  sectionId?: string
  kind?: "description" | "term" | "image"
  hint?: string
}

export type Quiz = {
  id: QuizType
  title: string
  description?: string
  sections?: QuizSection[]
  questions: Question[]
}
