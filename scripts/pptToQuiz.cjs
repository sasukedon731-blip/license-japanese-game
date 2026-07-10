const fs = require("fs")
const path = require("path")
const pptx = require("pptx-parser")

async function convert(file, sectionId) {
  const slides = await pptx.parse(file)

  const questions = []

  let q = null

  slides.forEach((slide) => {
    const text = slide.text.join("\n")

    if (text.includes("Q")) {
      q = {
        question: "",
        choices: [],
        answer: null,
        explanation: "",
      }
    }

    if (!q) return

    if (text.includes("次の説明")) {
      q.question = text
    }

    if (text.match(/^A\s/)) q.choices.push(text.replace(/^A\s/, ""))
    if (text.match(/^B\s/)) q.choices.push(text.replace(/^B\s/, ""))
    if (text.match(/^C\s/)) q.choices.push(text.replace(/^C\s/, ""))
    if (text.match(/^D\s/)) q.choices.push(text.replace(/^D\s/, ""))

    if (text.includes("✓ 正解")) {
      const letter = text.match(/[A-D]/)[0]
      q.answer = ["A", "B", "C", "D"].indexOf(letter)
    }

    if (text.includes("📋 解説")) {
      q.explanation = text
      questions.push(q)
      q = null
    }
  })

  return questions
}

async function run() {
  const file = process.argv[2]
  const section = process.argv[3]

  const questions = await convert(file, section)

  const out = {
    id: section,
    title: section,
    questions: questions.map((q, i) => ({
      id: i + 1,
      sectionId: "all",
      question: q.question,
      choices: q.choices,
      correctIndex: q.answer,
      explanation: q.explanation,
    })),
  }

  fs.writeFileSync(
    `output-${section}.ts`,
    "export const quiz=" + JSON.stringify(out, null, 2)
  )

  console.log("完了")
}

run()