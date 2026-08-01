import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { japaneseN4Quiz } from "../app/data/quizzes/japanese-n4.ts"

const questions = japaneseN4Quiz.questions
const byId = (id) => {
  const question = questions.find((item) => item.id === id)
  assert.ok(question, `missing N4 question: ${id}`)
  return question
}

test("Phase 30 N4 canonical dataset", () => {
  assert.equal(questions.length, 150)
  assert.equal(new Set(questions.map((q) => q.id)).size, 150)
  const contentKeys = questions.map((q) => JSON.stringify([q.sectionId, q.question, q.choices, q.correctIndex, q.explanation, q.listeningText ?? null]))
  assert.equal(new Set(contentKeys).size, 150)
  for (const q of questions) {
    assert.equal(q.choices.length, 4, `choices length: ${q.id}`)
    assert.equal(new Set(q.choices).size, 4, `duplicate choice: ${q.id}`)
    assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4, `correctIndex: ${q.id}`)
    assert.ok(q.question.trim(), `empty question: ${q.id}`)
    assert.ok(q.choices.every((choice) => choice.trim()), `empty choice: ${q.id}`)
    assert.ok(q.explanation.trim(), `empty explanation: ${q.id}`)
    assert.ok(q.explanation.includes(q.choices[q.correctIndex]), `explanation mismatch: ${q.id}`)
  }
  assert.equal(byId(71).choices[byId(71).correctIndex], "を")
  assert.equal(byId(71).correctIndex, 3)
  assert.equal(byId(79).choices[byId(79).correctIndex], "上手に")
  assert.equal(byId(79).correctIndex, 1)
  assert.equal(byId(97).choices[byId(97).correctIndex], "朝8時までに出す")
  assert.match(byId(40).question, /二つの長所/)
  assert.ok(byId(40).choices.includes("のに"))
  assert.ok(byId(77).choices.includes("空いた"))
  assert.ok(!byId(77).choices.includes("混んだ"))
  assert.equal(byId(77).choices[byId(77).correctIndex], "混んでいた")
  assert.ok(byId(101).choices.includes("ないで"))
  assert.equal(byId(101).choices[byId(101).correctIndex], "なくても")
  for (const id of [55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 75]) {
    assert.match(byId(id).question, /★に入る語句は？/)
    assert.doesNotMatch(byId(id).question, /★に入る番号は？/)
  }
  assert.equal(byId(5).choices[byId(5).correctIndex], "公務員")
  assert.equal(byId(10).choices[byId(10).correctIndex], "休憩")
  assert.equal(byId(51).choices[byId(51).correctIndex], "へ")
  assert.equal(byId(51).correctIndex, 2)
  assert.deepEqual(byId(53).choices, ["も", "に", "で", "を"])
  assert.match(byId(64).question, /足元に/)
  assert.equal(byId(64).choices[byId(64).correctIndex], "注意")
  assert.deepEqual(byId(116).choices, ["し", "き", "する", "した"])
  assert.deepEqual(byId(11006).choices, ["そうですね。", "寒いですか。", "いいえ、昨日です。", "学校です。"])
  const normalized = questions.map((q) => ({ id:q.id, sectionId:q.sectionId, question:q.question, choices:q.choices, correctIndex:q.correctIndex, explanation:q.explanation, listeningText:q.listeningText ?? null }))
  assert.equal(createHash("sha256").update(JSON.stringify(normalized)).digest("hex"), "52189d1a0a919119a524a173041ee62ca2c490c19860472b8734c5bc6aff8526")
})
