// app/data/quizzes/genba-listening.ts
import type { Quiz } from "@/app/data/types"

export const genbaListening: Quiz = {
    id: "genba-listening", // ✅ 追加
  title: "現場用語リスニング",
  description: "音声（読み上げ）を聞いて、いちばん近い意味を選びます。",
  questions: [
    {
      id: 1,
      question: "音声を聞いて、意味として正しいものを選んでください。",
      listeningText: "あんきょ",
      choices: ["暗い場所", "安全確認", "暗渠（あんきょ）", "合図"],
      correctIndex: 2,
      explanation: "暗渠（あんきょ）は、地中に埋設された水路・排水路のことです。"
    },
    {
      id: 2,
      question: "音声の指示にいちばん近い意味は？",
      listeningText: "あんぜん かくにん",
      choices: ["確認する", "運ぶ", "止める", "片付ける"],
      correctIndex: 0,
      explanation: "現場ではまず安全確認。作業前の基本です。"
    },
    {
      id: 3,
      question: "音声を聞いて、意味として正しいものを選んでください。",
      listeningText: "きけん よし",
      choices: ["危険を避ける", "危険がないことを確認", "急いで作業する", "道を譲る"],
      correctIndex: 1,
      explanation: "「危険よし」は“危険がないことを確認した”という意味で使われます。"
    },
    {
      id: 4,
      question: "音声を聞いて、意味として正しいものを選んでください。",
      listeningText: "めじ ふどう",
      choices: ["目視が大事", "目地（めじ）が動かない", "不動産", "目で見る運動"],
      correctIndex: 1,
      explanation: "「目地（めじ）」は継ぎ目。建材や施工の文脈で出ます。"
    }
  ]
}
