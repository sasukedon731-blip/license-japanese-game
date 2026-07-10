import { quizzes } from "../app/data/quizzes"

type Question = any

function getCorrectIndexes(q: Question): number[] {
  if (Array.isArray(q.correctIndexes)) return q.correctIndexes
  if (typeof q.correctIndex === "number") return [q.correctIndex]
  return []
}

function checkQuiz(quizId: keyof typeof quizzes) {
  const quiz = quizzes[quizId]

  console.log(`\n======================`)
  console.log(`QUIZ: ${quizId}`)
  console.log(`======================`)

  quiz.questions.forEach((q: Question) => {
    const correct = getCorrectIndexes(q)
    const choiceCount = q.choices?.length ?? 0

    // 正解index範囲チェック
    correct.forEach((i) => {
      if (i >= choiceCount) {
        console.log(
          `⚠ 正解index範囲外 Q${q.id} index=${i} choices=${choiceCount}`
        )
      }
    })

    // 複数選択チェック
    if (q.correctIndexes && q.correctIndexes.length < 2) {
      console.log(`⚠ 複数選択なのに1つ Q${q.id}`)
    }

    // choice不足
    if (choiceCount < 2) {
      console.log(`⚠ choice不足 Q${q.id}`)
    }

    // 解説なし
    if (!q.explanation) {
      console.log(`⚠ 解説なし Q${q.id}`)
    }

    // 解説番号矛盾
    if (q.explanation) {
      const text = q.explanation

      correct.forEach((i) => {
        const label = (i + 1).toString()

        if (text.includes("正解") && !text.includes(label)) {
          console.log(`⚠ 解説番号ズレ Q${q.id}`)
        }
      })
    }

    // choices重複
    const uniqueChoices = new Set(q.choices)
    if (uniqueChoices.size !== q.choices.length) {
      console.log(`⚠ choices重複 Q${q.id}`)
    }
  })
}

;(Object.keys(quizzes) as (keyof typeof quizzes)[]).forEach(checkQuiz)

console.log("\nチェック完了")