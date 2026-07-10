import fs from "node:fs"
import path from "node:path"
const outDir = path.resolve(process.cwd(), "public/badges/generated")
fs.mkdirSync(outDir, { recursive: true })
console.log("badge asset script ready:", outDir)
