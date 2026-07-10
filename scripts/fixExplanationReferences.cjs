// scripts/fixExplanationReferences.cjs
const fs = require("fs")
const path = require("path")

const TARGET_FILES = [
  "app/data/quizzes/kenchiku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/doboku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/denki-sekou-2kyu-1ji.ts",
  "app/data/quizzes/kanko-sekou-2kyu-1ji.ts",
]

function backupFile(filePath) {
  const backupPath = `${filePath}.bak`
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath)
  }
}

function fixText(text) {
  let s = text

  // 正解は① / 正解は 2 です など
  s = s.replace(/正解は\s*[①②③④1-4１-４]\s*です。?/g, "")
  s = s.replace(/誤りは\s*[①②③④1-4１-４]\s*です。?/g, "")
  s = s.replace(/適当なのは\s*[①②③④1-4１-４]\s*です。?/g, "")
  s = s.replace(/不適当なのは\s*[①②③④1-4１-４]\s*です。?/g, "")

  // 「という(3)の記述は誤り」系
  s = s.replace(/という\s*[（(][1-9][0-9]?[)）]\s*の記述は誤りです。?/g, "という記述は誤りです。")
  s = s.replace(/という\s*[（(][1-9][0-9]?[)）]\s*の記述は適当です。?/g, "という記述は適当です。")

  // 「(3)が誤り」「(2)が適当」系
  s = s.replace(/したがって、?\s*[（(][1-9][0-9]?[)）]\s*が誤り(?:である|です)?。?/g, "したがって、この記述が誤りである。")
  s = s.replace(/したがって、?\s*[（(][1-9][0-9]?[)）]\s*が適当(?:である|です)?。?/g, "したがって、この記述が適当である。")
  s = s.replace(/[（(][1-9][0-9]?[)）]\s*が誤り(?:である|です)?。?/g, "この記述が誤りである。")
  s = s.replace(/[（(][1-9][0-9]?[)）]\s*が適当(?:である|です)?。?/g, "この記述が適当である。")

  // 選択肢(2)の〜
  s = s.replace(/選択肢\s*[（(][1-9][0-9]?[)）]\s*の/g, "選択肢の")

  // 箇条書きの冒頭番号
  s = s.replace(/(^|\n)\s*•\s*[（(][1-9][0-9]?[)）]\s*/g, "$1")
  s = s.replace(/(^|\n)\s*[（(][1-9][0-9]?[)）]\s*/g, "$1")

  // 複数番号列挙
  s = s.replace(/[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*いずれも/g, "いずれも")
  s = s.replace(/[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*いずれも/g, "いずれも")
  s = s.replace(/[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*[（(][1-9][0-9]?[)）]\s*いずれも/g, "いずれも")

  // 余分な空白整理
  s = s.replace(/[ \t]{2,}/g, " ")
  s = s.replace(/\n{3,}/g, "\n\n")
  s = s.replace(/。{2,}/g, "。")

  return s.trim()
}

function fixFieldBlocks(source) {
  return source.replace(
    /((?:"(?:explanation|point|trap)"|(?:explanation|point|trap))\s*:\s*")([\s\S]*?)(")/g,
    (_, prefix, body, suffix) => {
      const fixed = fixText(body)
      return prefix + fixed + suffix
    }
  )
}

function main() {
  for (const rel of TARGET_FILES) {
    const full = path.resolve(rel)
    if (!fs.existsSync(full)) {
      console.log(`⚠️ ファイルなし: ${rel}`)
      continue
    }

    backupFile(full)

    const before = fs.readFileSync(full, "utf8")
    const after = fixFieldBlocks(before)

    fs.writeFileSync(full, after, "utf8")
    console.log(`✅ 修正完了: ${rel}`)
  }

  console.log("\n完了。必要なら .bak から戻せます。")
}

main()