const fs = require("fs")
const path = require("path")

const quizFiles = [
  "app/data/quizzes/kenchiku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/doboku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/denki-sekou-2kyu-1ji.ts",
  "app/data/quizzes/kanko-sekou-2kyu-1ji.ts",
]

function extractQuestionsArray(text) {
  const key = /["']?questions["']?\s*:\s*\[/m
  const m = key.exec(text)
  if (!m) return null

  let i = m.index + m[0].length
  let depth = 1
  let inString = false
  let stringChar = ""
  let escaped = false

  for (; i < text.length; i++) {
    const ch = text[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === "\\") {
        escaped = true
      } else if (ch === stringChar) {
        inString = false
        stringChar = ""
      }
      continue
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true
      stringChar = ch
      continue
    }

    if (ch === "[") depth++
    if (ch === "]") {
      depth--
      if (depth === 0) {
        return text.slice(m.index + m[0].length, i)
      }
    }
  }

  return null
}

function extractQuestionBlocks(text) {
  const arrText = extractQuestionsArray(text)
  if (!arrText) return []

  const blocks = []
  let i = 0

  while (i < arrText.length) {
    if (arrText[i] !== "{") {
      i++
      continue
    }

    const start = i
    let depth = 0
    let inString = false
    let stringChar = ""
    let escaped = false

    for (; i < arrText.length; i++) {
      const ch = arrText[i]

      if (inString) {
        if (escaped) {
          escaped = false
        } else if (ch === "\\") {
          escaped = true
        } else if (ch === stringChar) {
          inString = false
          stringChar = ""
        }
        continue
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true
        stringChar = ch
        continue
      }

      if (ch === "{") depth++
      if (ch === "}") {
        depth--
        if (depth === 0) {
          blocks.push(arrText.slice(start, i + 1))
          i++
          break
        }
      }
    }
  }

  return blocks
}

function pickNumber(block, key) {
  const re = new RegExp(`["']?${key}["']?\\s*:\\s*(\\d+)`)
  const m = block.match(re)
  return m ? Number(m[1]) : null
}

function pickNumberArray(block, key) {
  const re = new RegExp(`["']?${key}["']?\\s*:\\s*\\[([^\\]]*)\\]`)
  const m = block.match(re)
  if (!m) return null
  return m[1]
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => Number(v))
}

function pickString(block, key) {
  const re = new RegExp(
    `["']?${key}["']?\\s*:\\s*(?:"([\\s\\S]*?)"|'([\\s\\S]*?)'|\`([\\s\\S]*?)\`)`
  )
  const m = block.match(re)
  return m ? (m[1] ?? m[2] ?? m[3] ?? "") : ""
}

function pickChoices(block) {
  const m = block.match(/["']?choices["']?\s*:\s*\[([\s\S]*?)\]/)
  if (!m) return []
  const inner = m[1]
  const arr = []
  const re = /"([^"]*)"|'([^']*)'|`([\s\S]*?)`/g
  let mm
  while ((mm = re.exec(inner)) !== null) {
    arr.push(mm[1] ?? mm[2] ?? mm[3] ?? "")
  }
  return arr
}

function hasTwoSelectHint(text) {
  return /二つ選|2つ選|二つ選び|2つ選び/.test(text)
}

function answerLabelsFromIndex(n) {
  return [
    String(n + 1),                  // 1,2,3,4
    ["①", "②", "③", "④", "⑤"][n], // 丸数字
    `(${n + 1})`,
    `（${n + 1}）`,
  ].filter(Boolean)
}

function checkFile(relPath) {
  const filePath = path.resolve(relPath)
  const text = fs.readFileSync(filePath, "utf8")
  const blocks = extractQuestionBlocks(text)

  console.log("\n======================")
  console.log(relPath)
  console.log("======================")

  if (blocks.length === 0) {
    console.log("⚠ 問題ブロックを抽出できなかった")
    return
  }

  let issueCount = 0

  for (const block of blocks) {
    const id = pickNumber(block, "id")
    const question = pickString(block, "question")
    const choices = pickChoices(block)
    const explanation = pickString(block, "explanation")
    const correctIndex = pickNumber(block, "correctIndex")
    const correctIndexes = pickNumberArray(block, "correctIndexes")

    const corrects = Array.isArray(correctIndexes)
      ? correctIndexes
      : typeof correctIndex === "number"
      ? [correctIndex]
      : []

    if (choices.length < 2) {
      console.log(`⚠ Q${id} choices不足 (${choices.length})`)
      issueCount++
    }

    if (corrects.length === 0) {
      console.log(`⚠ Q${id} 正解データなし`)
      issueCount++
    }

    for (const idx of corrects) {
      if (!Number.isInteger(idx) || idx < 0 || idx >= choices.length) {
        console.log(`⚠ Q${id} 正解index範囲外 index=${idx} choices=${choices.length}`)
        issueCount++
      }
    }

    if (Array.isArray(correctIndexes) && correctIndexes.length < 2) {
      console.log(`⚠ Q${id} correctIndexesなのに1つしかない`)
      issueCount++
    }

    if (Array.isArray(correctIndexes)) {
      const uniq = new Set(correctIndexes)
      if (uniq.size !== correctIndexes.length) {
        console.log(`⚠ Q${id} correctIndexes重複`)
        issueCount++
      }
    }

    const uniqChoices = new Set(choices)
    if (uniqChoices.size !== choices.length) {
      console.log(`⚠ Q${id} choices重複`)
      issueCount++
    }

    if (!explanation.trim()) {
      console.log(`⚠ Q${id} 解説なし`)
      issueCount++
    }

    if (explanation.includes("正解")) {
      const hit = corrects.some((n) =>
        answerLabelsFromIndex(n).some((label) => explanation.includes(label))
      )
      if (!hit) {
        console.log(`⚠ Q${id} 解説の正解番号とデータがズレている可能性`)
        issueCount++
      }
    }

    if ((hasTwoSelectHint(question) || hasTwoSelectHint(explanation)) && !Array.isArray(correctIndexes)) {
      console.log(`⚠ Q${id} 複数選択っぽいが correctIndexes がない`)
      issueCount++
    }
  }

  if (issueCount === 0) {
    console.log(`✅ 問題ブロック ${blocks.length} 件 / 大きな整合エラーなし`)
  } else {
    console.log(`→ 問題ブロック ${blocks.length} 件 / 要確認 ${issueCount} 件`)
  }
}

for (const file of quizFiles) {
  if (fs.existsSync(path.resolve(file))) {
    checkFile(file)
  } else {
    console.log(`⚠ ファイルが見つからない: ${file}`)
  }
}

console.log("\nチェック完了")