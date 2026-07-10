// scripts/checkExplanationReferences.cjs
// 施工管理問題の explanation / point / trap に
// 番号依存表現（①, (3), 正解は② など）が残っていないかを検出する

const fs = require("fs")
const path = require("path")

const TARGET_FILES = [
  "app/data/quizzes/kenchiku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/doboku-sekou-2kyu-1ji.ts",
  "app/data/quizzes/denki-sekou-2kyu-1ji.ts",
  "app/data/quizzes/kanko-sekou-2kyu-1ji.ts",
]

// 検出したい危険表現
const RULES = [
  { name: "丸数字", re: /[①②③④⑤⑥⑦⑧⑨⑩]/g },
  { name: "半角カッコ番号", re: /\([1-9][0-9]?\)/g },
  { name: "全角カッコ番号", re: /（[1-9][0-9]?）/g },
  { name: "正解は番号", re: /正解は\s*[①②③④1-4１-４]/g },
  { name: "誤りは番号", re: /誤りは\s*[①②③④1-4１-４]/g },
  { name: "記述番号参照", re: /[①②③④]の記述|\([1-4]\)の記述|（[1-4]）の記述/g },
  { name: "選択肢番号参照", re: /第\s*[1-4１-４]\s*選択肢/g },
]

// 文字列プロパティだけ抜きたい
const FIELD_PATTERNS = [
  { field: "explanation", re: /"explanation"\s*:\s*"([\s\S]*?)"/g },
  { field: "point", re: /"point"\s*:\s*"([\s\S]*?)"/g },
  { field: "trap", re: /"trap"\s*:\s*"([\s\S]*?)"/g },
  { field: "explanation", re: /explanation\s*:\s*"([\s\S]*?)"/g },
  { field: "point", re: /point\s*:\s*"([\s\S]*?)"/g },
  { field: "trap", re: /trap\s*:\s*"([\s\S]*?)"/g },
]

function getLineNumber(text, index) {
  return text.slice(0, index).split("\n").length
}

function collectFindings(filePath, source) {
  const findings = []

  for (const { field, re } of FIELD_PATTERNS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(source)) !== null) {
      const raw = m[1]
      const fieldStart = m.index
      const line = getLineNumber(source, fieldStart)

      for (const rule of RULES) {
        rule.re.lastIndex = 0
        let hit
        while ((hit = rule.re.exec(raw)) !== null) {
          findings.push({
            filePath,
            field,
            rule: rule.name,
            line,
            match: hit[0],
            preview: raw.slice(Math.max(0, hit.index - 20), Math.min(raw.length, hit.index + 40)),
          })
        }
      }
    }
  }

  return findings
}

function main() {
  let total = 0
  let allFindings = []

  for (const rel of TARGET_FILES) {
    const full = path.resolve(rel)
    if (!fs.existsSync(full)) {
      console.log(`⚠️ ファイルなし: ${rel}`)
      continue
    }

    const source = fs.readFileSync(full, "utf8")
    const findings = collectFindings(rel, source)
    allFindings = allFindings.concat(findings)

    console.log("\n======================")
    console.log(rel)
    console.log("======================")

    if (findings.length === 0) {
      console.log("✅ 番号依存表現は見つかりませんでした")
    } else {
      console.log(`⚠️ ${findings.length} 件の要確認表現`)
      findings.slice(0, 50).forEach((f) => {
        console.log(
          `- line ${f.line} [${f.field}] [${f.rule}] "${f.match}" ... ${f.preview}`
        )
      })
      if (findings.length > 50) {
        console.log(`... 他 ${findings.length - 50} 件`)
      }
    }

    total += findings.length
  }

  console.log("\n======================")
  console.log("合計")
  console.log("======================")
  if (total === 0) {
    console.log("✅ 4ファイルとも番号依存表現なし")
  } else {
    console.log(`⚠️ 合計 ${total} 件の要確認表現が見つかりました`)
  }
}

main()