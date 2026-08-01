import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
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

const gameQuizTypes = loadTsModule("app/(auth)/game/gameQuizTypes.ts")
const { GAME_QUIZ_TYPES, isGameQuizType, asGameQuizType } = gameQuizTypes

function makeQuiz(id) {
  return {
    id,
    questions: [{
      id: 1,
      sectionId: "bunpo",
      question: "（　）に入ることばを選んでください。",
      choices: ["は", "が", "を", "に", "で", "と"],
      correctIndex: 0,
    }],
  }
}

function loadBuilder(quizzes) {
  return loadTsModule("app/(auth)/game/fromQuizzes.ts", {
    "@/app/data/quizzes": { quizzes },
    "./gameQuizTypes": gameQuizTypes,
  }).buildGameQuestionsFromQuizzes
}

test("ゲーム対象allowlistはN4・N3・N2の完全一致だけを許可する", () => {
  assert.deepEqual(Array.from(GAME_QUIZ_TYPES), ["japanese-n4", "japanese-n3", "japanese-n2"])
  for (const value of GAME_QUIZ_TYPES) {
    assert.equal(isGameQuizType(value), true)
    assert.equal(asGameQuizType(value), value)
  }

  const rejected = [
    "gaikoku-license",
    "road-signs",
    "japanese-n5",
    "japanese-n4-extra",
    "JAPANESE-N4",
    "",
    undefined,
    null,
    [],
    {},
    4,
    "%72oad-signs",
  ]
  for (const value of rejected) {
    assert.equal(isGameQuizType(value), false, String(value))
    assert.equal(asGameQuizType(value), null, String(value))
  }
})

test("変換入口は対象外quizIdをデータ参照前に拒否する", () => {
  const throwingRegistry = new Proxy({}, {
    get() {
      throw new Error("対象外Quizのデータを参照してはいけない")
    },
  })
  const build = loadBuilder(throwingRegistry)
  for (const value of ["gaikoku-license", "road-signs", "japanese-n5", "japanese-n4-extra", "JAPANESE-N4", "", undefined, [], {}]) {
    assert.deepEqual(Array.from(build(value)), [], String(value))
  }
})

test("N4・N3・N2は従来のゲーム問題形式へ変換できる", () => {
  const quizzes = Object.fromEntries(GAME_QUIZ_TYPES.map((id) => [id, makeQuiz(id)]))
  const build = loadBuilder(quizzes)
  for (const id of GAME_QUIZ_TYPES) {
    const questions = build(id)
    assert.equal(questions.length, 1, id)
    assert.equal(questions[0].quizType, id)
    assert.equal(questions[0].enabled, true)
    assert.ok(["tile-drop", "speed-choice"].includes(questions[0].kind))
    assert.ok(questions[0].answer.length > 0)
    assert.ok(questions[0].choices.length > 0)
  }
})

test("GameKindClientとGameClientは共通allowlistで直URL入力を拒否する", () => {
  const kindSource = fs.readFileSync(path.join(repo, "app/(auth)/game/ui/GameKindClient.tsx"), "utf8")
  const clientSource = fs.readFileSync(path.join(repo, "app/(auth)/game/GameClient.tsx"), "utf8")

  assert.match(kindSource, /isGameQuizType\(rawType\)/)
  assert.match(kindSource, /hasInvalidQuizType/)
  assert.match(kindSource, /router\.replace\("\/game"\)/)
  assert.match(kindSource, /GAME_QUIZ_TYPES\.map/)
  assert.doesNotMatch(kindSource, /v === "gaikoku-license"|v === "road-signs"/)

  assert.match(clientSource, /rawType === null/)
  assert.match(clientSource, /isGameQuizType\(rawType\)/)
  assert.match(clientSource, /quizType === null/)
  assert.match(clientSource, /router\.replace\("\/game"\)/)
  assert.doesNotMatch(clientSource, /v in quizzes/)

  for (const writeCall of ["markGuestPlayedToday", "markUserPlayedToday", "setDoc"]) {
    const callIndex = clientSource.indexOf(`${writeCall}(`)
    assert.ok(callIndex > 0, writeCall)
    const guardIndex = clientSource.lastIndexOf("if (quizType === null) return", callIndex)
    assert.ok(guardIndex >= 0 && guardIndex < callIndex, `${writeCall} must be guarded`)
  }
})

test("Phase 16のゲーム画像型・継承・表示が残っていない", () => {
  const typeSource = fs.readFileSync(path.join(repo, "app/(auth)/game/types.ts"), "utf8")
  const builderSource = fs.readFileSync(path.join(repo, "app/(auth)/game/fromQuizzes.ts"), "utf8")
  const speedSource = fs.readFileSync(path.join(repo, "app/(auth)/game/SpeedChoiceGame.tsx"), "utf8")

  assert.doesNotMatch(typeSource, /imageUrl\??:|imageAlt\??:/)
  assert.doesNotMatch(builderSource, /q\.imageUrl|q\.imageAlt|左方車との優先関係/)
  assert.doesNotMatch(speedSource, /from "next\/image"|current\?\.imageUrl|questionImageFrame|questionImage:/)
})
