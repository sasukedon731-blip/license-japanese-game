import type { Quiz } from "@/app/data/types"

export const genbaPhrasebook: Quiz = {
  id: "genba-phrasebook",
  title: "現場で使える用語集（ヒアリング・スピーキング）",
  description: "現場フレーズの聞き取り＆言える化",
  questions: [
    {
      id: 1,
      question: "【聴解】読み上げを聞いて、意味に合うものを選んでください。",
      listeningText: "ヘルメットと安全帯、忘れずに着けてください。",
      choices: [
        "ヘルメットと安全帯を外してください",
        "ヘルメットと安全帯を必ず着けてください",
        "ヘルメットは要りません",
        "安全帯は危ないです",
      ],
      correctIndex: 1,
      explanation: "安全装備の着用指示。『忘れずに着けて』＝“必ず着けて”。",
    },
    {
      id: 2,
      question: "『足元注意』に近い意味はどれ？",
      choices: ["手を洗って", "足をよく見て気をつけて", "早く走って", "声を小さくして"],
      correctIndex: 1,
      explanation: "つまずき・転倒を防ぐ注意喚起です。",
    },
    {
      id: 3,
      question: "次のうち、現場で『止まってください』を丁寧に言うと？",
      choices: ["止まれ", "ストップ", "止まってください", "走ってください"],
      correctIndex: 2,
      explanation: "基本は『止まってください』。状況によって『一旦止まってください』もよく使います。",
    },
    {
      id: 4,
      question: "『資材を運ぶ』の意味として正しいものはどれ？",
      choices: ["資材を捨てる", "資材を移動させる", "資材を壊す", "資材を濡らす"],
      correctIndex: 1,
      explanation: "『運ぶ』＝“移動させる/持っていく”。",
    },
    {
      id: 5,
      question: "【スピーキング】読み上げて練習しましょう。内容に合うものを選んでください。",
      listeningText: "すみません、もう一度確認してもいいですか。",
      choices: [
        "確認していいか聞いている",
        "確認は不要だと言っている",
        "確認したくないと言っている",
        "確認は終わったと言っている",
      ],
      correctIndex: 0,
      explanation: "『確認してもいいですか』＝確認の許可を求めています。",
    },
  ],
}
