import type { Question, QuizType } from '../data/types'
import { japaneseN3Quiz } from '../data/quizzes/japanese-n3'

const VERSION_KEY = 'n3-question-id-migration-v1'
const STORAGE_KEYS = ['wrong-japanese-n3','normal-session-japanese-n3','exam-session-japanese-n3'] as const
const legacy = [{"oldId":1,"newId":101,"question":"男：雨だ！洗濯物取り込まなきゃ。女：お願い、私は窓を閉めるから。男：あ、その前に自転車にカバーを…。女：洗濯物が先よ！自転車は後。男：わかった。\n\n男の人はまず何をしますか。","choices":["洗濯物を取り込む","窓を閉める","カバーをかける","庭に出る"],"correctIndex":0,"sectionId":"listening"},{"oldId":2,"newId":102,"question":"自分の（のうりょく）を最大限に発揮したい。\n\n（のうりょく）の漢字は？","choices":["能率","能力","農力","脳力"],"correctIndex":1,"sectionId":"vocab"},{"oldId":3,"newId":103,"question":"佐藤です。明日の10時からの会議ですが、部長の都合で1時間遅らせることになりました。場所は第3会議室で変わりません。\n\n会議は何時に始まりますか。","choices":["11時","10時","9時","12時"],"correctIndex":0,"sectionId":"listening"},{"oldId":4,"newId":104,"question":"男：セミナーに何がいる？女：学生証が必要って。履歴書は？男：それは来週の面接でいいみたい。女：お茶は出るらしいから飲み物はいらないよ。\n\n何を持っていきますか。","choices":["学生証","履歴書","飲み物","パソコン"],"correctIndex":0,"sectionId":"listening"},{"oldId":5,"newId":105,"question":"ただいまタイムセール中です。野菜コーナーのトマトとキュウリが20％引きです！肉と魚のセールは明日行います。\n\n今日安くなるのはどれですか。","choices":["トマトとキュウリ","お肉","お魚","すべての野菜"],"correctIndex":0,"sectionId":"listening"},{"oldId":6,"newId":106,"question":"試験の（けっか）をインターネットで確認した。\n\n（けっか）の漢字は？","choices":["結果","結過","結価","決果"],"correctIndex":0,"sectionId":"vocab"},{"oldId":7,"newId":107,"question":"資料を（ほぞん）するのを忘れてしまった。\n\n（ほぞん）の漢字は？","choices":["捕存","保在","保存","保持"],"correctIndex":2,"sectionId":"vocab"},{"oldId":8,"newId":108,"question":"彼は（きよう）に道具を使いこなしている。\n\n（きよう）の漢字は？","choices":["器用","器様","希用","貴用"],"correctIndex":0,"sectionId":"vocab"},{"oldId":9,"newId":109,"question":"太平洋の（えんがん）に沿って走る。\n\n（えんがん）の漢字は？","choices":["遠岸","沿岸","円岸","延岸"],"correctIndex":1,"sectionId":"vocab"},{"oldId":10,"newId":110,"question":"恵まれない子供たちのために（きふ）をした。\n\n（きふ）の漢字は？","choices":["寄付","記付","喜付","基付"],"correctIndex":0,"sectionId":"vocab"},{"oldId":11,"newId":111,"question":"この地域は一年中温暖な気候です。\n\n温暖の読み方は？","choices":["おんたん","おんだん","おんらん","おんぬん"],"correctIndex":1,"sectionId":"vocab"},{"oldId":12,"newId":112,"question":"明日の朝は晴れますが、お昼から雲が広がるでしょう。午後は雨が降り出し、夜には激しく降る見込みです。\n\n明日の午後の天気は？","choices":["雨","晴れ","曇り","雪"],"correctIndex":0,"sectionId":"listening"},{"oldId":13,"newId":113,"question":"将来の計画について具体的に話す。\n\n具体的の読み方は？","choices":["ぐてき","ぐていてき","ぐたいてき","ぐたいしき"],"correctIndex":2,"sectionId":"vocab"},{"oldId":14,"newId":114,"question":"男：カレーパン2つとアンパン1つ。店員：アンパンは売り切れで、代わりにクリームパンはどうですか？男：じゃあ、それを2つ。カレーパンはやめます。\n\nどのパンを買いますか。","choices":["クリームパン2つ","カレーパン2つ","アンパン1つ","全部"],"correctIndex":0,"sectionId":"listening"},{"oldId":15,"newId":115,"question":"女：昨日電話出なかったね。男：ごめん、映画館にいてマナーモードにしてたんだ。寝てたわけじゃないよ。昨日は休みだったし。\n\nなぜ電話に出なかった？","choices":["映画を見ていた","寝ていた","仕事が忙しかった","携帯を失くした"],"correctIndex":0,"sectionId":"listening"},{"oldId":16,"newId":116,"question":"出かける支度をするのに時間がかかる。\n\n支度の読み方は？","choices":["したく","しど","したび","さたく"],"correctIndex":0,"sectionId":"vocab"},{"oldId":17,"newId":117,"question":"女：今日買い物行こう。男：今日は残業。明日は？女：明日は友達と会うの。あさってなら暇だけど。男：よし、じゃあそうしよう。\n\nいつ買い物に行きますか。","choices":["あさって","今日","明日","来週"],"correctIndex":0,"sectionId":"listening"},{"oldId":18,"newId":118,"question":"畑を耕すのは大変な重労働だ。\n\n耕すの読み方は？","choices":["たがやす","とかす","ぬらす","たやす"],"correctIndex":0,"sectionId":"vocab"},{"oldId":19,"newId":119,"question":"女：木村さん、部長が応接室で呼んでるわよ。男：コピー機直さなくていい？女：田中さんが修理を呼んだから大丈夫。早く行って。\n\nどこへ行きますか。","choices":["応接室","コピー機の前","田中さんの席","部長の席"],"correctIndex":0,"sectionId":"listening"},{"oldId":20,"newId":120,"question":"事態がさらに悪化する恐れがある。\n\n悪化の読み方は？","choices":["あくか","あっか","あくげ","あつか"],"correctIndex":1,"sectionId":"vocab"}] as const
const canonical = new Map(japaneseN3Quiz.questions.map((q) => [Number(q.id), q]))

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
function isLegacyQuestion(value: unknown, item: (typeof legacy)[number]): value is Question {
  if (!value || typeof value !== 'object') return false
  const q = value as Partial<Question>
  return Number(q.id) === item.oldId && q.question === item.question && same(q.choices, item.choices) && q.correctIndex === item.correctIndex && q.sectionId === item.sectionId
}
function migrateQuestion(value: unknown): unknown {
  const item = legacy.find((candidate) => isLegacyQuestion(value, candidate))
  if (!item) return value
  return canonical.get(item.newId) ?? value
}
function migrateArray(values: unknown[]): unknown[] {
  const migrated = values.map(migrateQuestion)
  const seen = new Set<string>()
  return migrated.filter((value) => {
    if (!value || typeof value !== 'object' || !('id' in value)) return true
    const q = value as Partial<Question>
    const key = JSON.stringify([q.id,q.question,q.choices,q.correctIndex,q.sectionId])
    if (seen.has(key)) return false
    seen.add(key); return true
  })
}
function migrateStored(value: unknown): unknown {
  if (Array.isArray(value)) return migrateArray(value)
  if (!value || typeof value !== 'object') return value
  const record = { ...(value as Record<string, unknown>) }
  if (Array.isArray(record.questions)) {
    const before = record.questions
    record.questions = migrateArray(before)
    if (Array.isArray(record.answers)) {
      record.answers = record.answers.map((answer, index) => {
        if (!answer || typeof answer !== 'object') return answer
        const oldQuestion = before[index]
        const migratedQuestion = migrateQuestion(oldQuestion)
        if (oldQuestion === migratedQuestion || !migratedQuestion || typeof migratedQuestion !== 'object') return answer
        return { ...(answer as Record<string, unknown>), questionId: (migratedQuestion as Question).id }
      })
    }
  }
  return record
}
export function migrateN3QuestionStorage(storage?: StorageLike): void {
  if (!storage) { if (typeof window === 'undefined') return; storage = window.localStorage }
  try { if (storage.getItem(VERSION_KEY) === '1') return } catch { return }
  for (const key of STORAGE_KEYS) {
    try {
      const raw = storage.getItem(key); if (!raw) continue
      const parsed = JSON.parse(raw); const migrated = migrateStored(parsed)
      if (!same(parsed, migrated)) storage.setItem(key, JSON.stringify(migrated))
    } catch { /* Invalid or inaccessible storage is left untouched. */ }
  }
  try { storage.setItem(VERSION_KEY, '1') } catch { /* The app remains usable without persistence. */ }
}
function hashText(text: string): string {
  let hash = 2166136261
  for (let i=0;i<text.length;i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash,16777619) }
  return (hash >>> 0).toString(16).padStart(8,'0')
}
export function buildQuizContentSignature(quizType: QuizType, questions: readonly Question[]): string {
  if (quizType !== 'japanese-n3') return `${quizType}:${questions.length}:${questions[0]?.id ?? 0}:${questions[questions.length - 1]?.id ?? 0}`
  const content = questions.map(q=>JSON.stringify([q.id,q.question,q.choices,q.correctIndex])).join('|')
  return `japanese-n3:v2:${questions.length}:${hashText(content)}`
}
