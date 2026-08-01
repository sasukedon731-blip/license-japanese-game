import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import crypto from "node:crypto"
import path from "node:path"
import vm from "node:vm"
import ts from "typescript"

const repo = path.resolve(import.meta.dirname, "..")

function loadTsModule(relativePath, requireMap = {}) {
  const filename = path.join(repo, relativePath)
  const source = fs.readFileSync(filename, "utf8")
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  const loadedModule = { exports: {} }
  const localRequire = (id) => {
    if (id in requireMap) return requireMap[id]
    throw new Error(`Unexpected import ${id} in ${relativePath}`)
  }
  vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, require: localRequire }, { filename })
  return loadedModule.exports
}

const { gaikokuQuiz } = loadTsModule("app/data/quizzes/gaikoku-license.ts")
const { roadSignsQuiz } = loadTsModule("app/data/quizzes/road-signs.ts")
const { resolveQuestionImageSource } = loadTsModule("app/components/questionImageSource.ts")
const byId = (quiz, id) => quiz.questions.find((question) => question.id === id)

test("QuestionImageは明示imageUrlを優先し、未登録時だけsignIdへフォールバックする", () => {
  assert.equal(
    resolveQuestionImageSource({ imageUrl: "/signs/512/317.png", signId: "330-A" }),
    "/signs/512/317.png",
  )
  assert.equal(
    resolveQuestionImageSource({ imageUrl: "", signId: "330-A" }),
    "/signs/512/330-A.png",
  )
  assert.equal(resolveQuestionImageSource({ imageUrl: undefined, signId: undefined }), null)
  assert.equal(
    resolveQuestionImageSource({ choiceImageUrl: "/choice.png", signId: "330-A" }, "choice"),
    "/choice.png",
  )
})

test("Phase 16の外免問題修正とID 91削除が確定案に一致する", () => {
  assert.equal(gaikokuQuiz.questions.length, 99)
  assert.equal(byId(gaikokuQuiz, 91), undefined)

  const expected = {
    1: ["信号機のない横断歩道", "一時停止", 0],
    3: ["同程度の幅員", "左方から進行してくる車両", 0],
    4: ["追越しが禁止", "道路交通法で追越しが禁止", 1],
    17: ["信号機の表示に従って進行する場合を除き", "停止せず進行できます", 0],
    18: ["交差点またはその付近以外", "道路の左側に寄って進路を譲", 0],
    22: ["その前方へ出ようとするとき", "前方へ出る前に、一時停止", 0],
    26: ["通行止め", "歩行者、車両および路面電車", 0],
    30: ["方向指示器", "30m手前", 0],
    37: ["いないことが明らかでない", "停止できる速度", 0],
    44: ["優先道路を通行している場合を除き", "手前30m以内", 0],
    48: ["加速車線から本線車道", "進行を妨げてはなりません", 0],
    69: ["鳴らす義務がある場合を除き", "危険を防止するためやむを得ない", 0],
    86: ["片側に3以上の車両通行帯", "小回り指定がなければ", 0],
    96: ["二段階右折が必要な交差点", "交差点の側端に沿って徐行", 0],
  }

  for (const [idText, [questionText, explanationText, correctIndex]] of Object.entries(expected)) {
    const question = byId(gaikokuQuiz, Number(idText))
    assert.ok(question, `ID ${idText}`)
    assert.match(question.question, new RegExp(questionText))
    assert.match(`${question.choices.join(" ")} ${question.explanation}`, new RegExp(explanationText))
    assert.equal(question.correctIndex, correctIndex)
  }

  const id3 = byId(gaikokuQuiz, 3)
  for (const condition of ["交通整理が行われておらず", "優先道路ではなく", "明らかに広くない", "一時停止等の規制もない", "同程度の幅員"]) {
    assert.match(id3.question, new RegExp(condition))
  }
  assert.equal(id3.choices[id3.correctIndex], "左方の車が優先")
  assert.match(byId(gaikokuQuiz, 22).choices[0], /一時停止/)
  assert.doesNotMatch(byId(gaikokuQuiz, 22).choices.join(" "), /停止\/徐行/)
  assert.match(byId(gaikokuQuiz, 26).choices[0], /歩行者、車両および路面電車/)
  assert.match(`${byId(gaikokuQuiz, 30).choices[0]} ${byId(gaikokuQuiz, 30).explanation}`, /30m手前/)
})

test("標識317・327が現画像と正解へ一貫して修正されている", () => {
  assert.equal(roadSignsQuiz.questions.length, 49)
  const sign317 = byId(roadSignsQuiz, 1317)
  assert.equal(sign317.signId, "330-A")
  assert.equal(sign317.imageUrl, "/signs/512/317.png")
  assert.equal(sign317.choices[sign317.correctIndex], "一時停止")
  assert.doesNotMatch(JSON.stringify(sign317), /駐車余地/)

  const sign327 = byId(roadSignsQuiz, 1325)
  assert.equal(sign327.signId, "327の8")
  assert.equal(sign327.imageUrl, "/signs/512/327.png")
  assert.equal(sign327.choices[sign327.correctIndex], "一般原付の二段階右折")
  assert.match(sign327.explanation, /一般原動機付自転車.*二段階右折/)
  assert.doesNotMatch(JSON.stringify(sign327), /車両通行区分/)

  assert.equal(roadSignsQuiz.questions.filter((q) => q.choices[q.correctIndex] === "一時停止").length, 1)
  assert.equal(roadSignsQuiz.questions.filter((q) => /一般原付の二段階右折/.test(q.choices[q.correctIndex])).length, 1)
})

test("全問題のIDとcorrectIndexが有効で、標識49問の実画面画像が一意に実在する", () => {
  for (const quiz of [gaikokuQuiz, roadSignsQuiz]) {
    const ids = quiz.questions.map((q) => q.id)
    assert.equal(new Set(ids).size, ids.length)
    for (const question of quiz.questions) {
      assert.ok(Number.isInteger(question.correctIndex))
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.choices.length)
      assert.equal(new Set(question.choices).size, question.choices.length, `duplicate choice ${quiz.id}:${question.id}`)
      assert.ok(question.choices[question.correctIndex].trim(), `empty answer ${quiz.id}:${question.id}`)
    }
  }
  const resolvedUrls = new Set()
  const imageHashes = new Set()
  for (const question of roadSignsQuiz.questions) {
    const resolvedUrl = resolveQuestionImageSource(question)
    assert.equal(resolvedUrl, question.imageUrl, `explicit imageUrl must win for ${question.id}`)
    assert.ok(resolvedUrl?.startsWith("/"), `invalid URL ${question.id}`)

    const imagePath = path.join(repo, "public", resolvedUrl.slice(1))
    assert.ok(fs.existsSync(imagePath), resolvedUrl)
    const image = fs.readFileSync(imagePath)
    assert.ok(image.length > 0, `empty image ${resolvedUrl}`)
    assert.equal(resolvedUrls.has(resolvedUrl), false, `duplicate URL ${resolvedUrl}`)

    const hash = crypto.createHash("sha256").update(image).digest("hex")
    assert.equal(imageHashes.has(hash), false, `duplicate image hash ${resolvedUrl}`)
    resolvedUrls.add(resolvedUrl)
    imageHashes.add(hash)
  }
  assert.equal(resolvedUrls.size, 49)
  assert.equal(imageHashes.size, 49)

  assert.equal(resolveQuestionImageSource(byId(roadSignsQuiz, 1317)), "/signs/512/317.png")
  assert.equal(resolveQuestionImageSource(byId(roadSignsQuiz, 1325)), "/signs/512/327.png")
})

test("既知の標識301・303修正と312正常状態を維持する", () => {
  assert.match(byId(roadSignsQuiz, 1301).explanation, /斜線が交差する「×」/)
  assert.match(byId(roadSignsQuiz, 1303).explanation, /白い横棒/)
  const sign312 = byId(roadSignsQuiz, 1312)
  assert.equal(sign312.imageUrl, "/signs/512/312.png")
  assert.ok(sign312.choices[sign312.correctIndex])
})
