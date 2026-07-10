// app/(auth)/game/types.ts
export type GameMode = "normal" | "attack"

export type GameDifficulty = "N5" | "N4" | "N3" | "N2" | "N1"

export type GameKind =
  | "tile-drop"
  | "speed-choice"
  | "flash-judge"
  | "memory-burst"
  | "sentence-build"

export type GameQuestionType = "reading" | "fill" | "particle"

export type GameQuestion = {
  id: string
  kind: GameKind
  type: GameQuestionType

  prompt: string
  answer: string[]
  choices: string[]

  difficulty: GameDifficulty
  enabled: boolean

  quizType?: string

  // ✅ N4のカテゴリ絞り込みに使う（moji-goi / bunpo / reading / listening）
  sectionId?: string
}

// ===== flash-judge =====
export type FlashJudgeQuestion = {
  id: string
  kind: "flash-judge"
  prompt: string
  answer: boolean
  explanation?: string
  difficulty: GameDifficulty
  enabled: boolean
  quizType?: string
  sectionId?: string
}

// ===== memory-burst =====
export type MemoryBurstQuestion = {
  id: string
  kind: "memory-burst"
  displayText: string
  question: string
  choices: string[]
  correctIndex: number
  explanation?: string
  difficulty: GameDifficulty
  enabled: boolean
  quizType?: string
  sectionId?: string
}
// ✅ Attackランキング用（firestore.ts が参照）
export type LeaderboardEntry = {
  uid: string
  displayName: string
  bestScore: number
  bestLevel?: "N4" | "N3" | "N2"
  bestStage?: number
  updatedAt?: any
}