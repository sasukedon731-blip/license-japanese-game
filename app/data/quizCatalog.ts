// app/data/quizCatalog.ts

export type QuizMode = "normal" | "exam" | "review"
export type IndustryId = "driver" | "japanese" | "game" | "undecided"

export type QuizSectionDef = {
  id: string
  title: string
  description?: string
  enabled: boolean
  order: number
}

export type QuizDef = {
  id: string
  title: string
  description?: string
  enabled: boolean
  order: number
  modes: QuizMode[]
  sections: QuizSectionDef[]
  industries?: IndustryId[] | "all"
}

const allSection = [{ id: "all", title: "すべて", enabled: true, order: 1 }]

export const quizCatalog: QuizDef[] = [
  {
    id: "gaikoku-license",
    title: "外国免許切替",
    description: "日本の交通ルール、優先関係、標識、運転場面を学びます。",
    enabled: true,
    order: 1,
    industries: ["driver"],
    modes: ["normal", "exam", "review"],
    sections: allSection,
  },
  {
    id: "road-signs",
    title: "道路標識マスター",
    description: "警戒標識、規制標識などを画像つきで確認します。",
    enabled: true,
    order: 2,
    industries: ["driver"],
    modes: ["normal", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "warning", title: "警戒標識", enabled: true, order: 2 },
      { id: "regulation", title: "規制標識", enabled: true, order: 3 },
    ],
  },
  {
    id: "japanese-n4",
    title: "日本語能力試験 N4",
    description: "文字、語彙、文法、読解、聴解の基礎を確認します。",
    enabled: true,
    order: 10,
    industries: ["japanese", "driver"],
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },
  {
    id: "japanese-n3",
    title: "日本語能力試験 N3",
    description: "日常生活で使う日本語を、試験形式で練習します。",
    enabled: true,
    order: 11,
    industries: ["japanese", "driver"],
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },
  {
    id: "japanese-n2",
    title: "日本語能力試験 N2",
    description: "より自然な表現、読解、聴解を重点的に練習します。",
    enabled: true,
    order: 12,
    industries: ["japanese"],
    modes: ["normal", "exam", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "vocab", title: "文字・語彙", enabled: true, order: 2 },
      { id: "grammar", title: "文法", enabled: true, order: 3 },
      { id: "reading", title: "読解", enabled: true, order: 4 },
      { id: "listening", title: "聴解", enabled: true, order: 5 },
    ],
  },
  {
    id: "genba-listening",
    title: "生活・現場リスニング",
    description: "指示や会話を聞いて、日本語の意味を選びます。",
    enabled: true,
    order: 13,
    industries: ["japanese", "driver"],
    modes: ["normal", "review"],
    sections: allSection,
  },
  {
    id: "genba-phrasebook",
    title: "よく使う日本語フレーズ",
    description: "生活や仕事で使う短い表現を確認します。",
    enabled: true,
    order: 14,
    industries: ["japanese", "driver"],
    modes: ["normal", "review"],
    sections: allSection,
  },
  {
    id: "confusing-japanese",
    title: "まぎらわしい日本語",
    description: "似ている表現や間違えやすい言葉を練習します。",
    enabled: true,
    order: 15,
    industries: ["japanese"],
    modes: ["normal", "review"],
    sections: allSection,
  },
  {
    id: "kansai-listening",
    title: "関西弁リスニング",
    description: "地域の表現を音声で聞いて理解します。",
    enabled: true,
    order: 16,
    industries: ["japanese"],
    modes: ["normal", "review"],
    sections: allSection,
  },
  {
    id: "dialect-listening",
    title: "方言リスニング",
    description: "地域ごとの言い方を聞き取りで練習します。",
    enabled: true,
    order: 17,
    industries: ["japanese"],
    modes: ["normal", "review"],
    sections: allSection,
  },
  {
    id: "dialect-meaning",
    title: "全国方言 意味あて",
    description: "方言の意味を選んで覚えます。",
    enabled: true,
    order: 18,
    industries: ["japanese"],
    modes: ["normal", "review"],
    sections: [
      { id: "all", title: "すべて", enabled: true, order: 1 },
      { id: "hokkaido-tohoku", title: "北海道・東北", enabled: true, order: 2 },
      { id: "kanto", title: "関東", enabled: true, order: 3 },
      { id: "chubu-hokuriku", title: "中部・北陸", enabled: true, order: 4 },
      { id: "chugoku-shikoku", title: "中国・四国", enabled: true, order: 5 },
      { id: "kyushu-okinawa", title: "九州・沖縄", enabled: true, order: 6 },
      { id: "nationwide", title: "全国共通", enabled: true, order: 7 },
    ],
  },
]

export function getQuizDef(quizType: string): QuizDef | undefined {
  return quizCatalog.find((q) => q.id === quizType && q.enabled)
}

export function resolveSection(
  quiz: QuizDef,
  sectionId?: string | null
): QuizSectionDef {
  const enabledSections = (quiz.sections ?? [])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  const fallback: QuizSectionDef =
    enabledSections[0] ?? { id: "all", title: "すべて", enabled: true, order: 1 }

  if (!sectionId) return fallback
  return enabledSections.find((s) => s.id === sectionId) ?? fallback
}
