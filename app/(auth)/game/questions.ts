// app/(auth)/game/questions.ts
import type { GameQuestion } from "./types"

// Fallback questions (used if Firestore is empty or offline)
export const fallbackQuestions: GameQuestion[] = [
  {
    id: "fb-n5-1",
    kind: "tile-drop",
    type: "reading",
    prompt: "現場",
    answer: ["げ", "ん", "ば"],
    choices: ["げ", "ん", "ば", "け", "ん", "ぱ"],
    difficulty: "N5",
    enabled: true,
  },
  {
    id: "fb-n5-2",
    kind: "tile-drop",
    type: "fill",
    prompt: "安全（ ）で行こう",
    answer: ["第一"],
    choices: ["第一", "最初", "前", "上", "右", "左"],
    difficulty: "N5",
    enabled: true,
  },

  {
    id: "fb-n5-3",
    kind: "tile-drop",
    type: "fill",
    prompt: "3階（ ）行って",
    answer: ["に"],
    choices: ["に", "へ", "を", "で"],
    difficulty: "N4",
    enabled: true,
  },
  {
     id: "fb-n5-4",
    kind: "tile-drop",
    type: "fill",
    prompt: "工事",
    answer: ["こ", "う", "じ"],
    choices: ["こ", "う", "じ", "き", "さ", "し"],
    difficulty: "N4",
    enabled: true,
  },
  {
    id: "fb-n5-5",
    kind: "tile-drop",
    type: "fill",
    prompt: "日本（ ）来ました",
    answer: ["に"],
    choices: ["に", "を", "で", "から"],
    difficulty: "N3",
    enabled: true,
  },
]

