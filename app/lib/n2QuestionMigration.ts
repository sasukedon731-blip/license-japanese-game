import type { Question, QuizType } from '../data/types'
import { japaneseN2Quiz } from '../data/quizzes/japanese-n2'

const VERSION_KEY = 'n2-question-content-migration-v1'
const STORAGE_KEYS = ['wrong-japanese-n2','normal-session-japanese-n2','exam-session-japanese-n2'] as const
const legacy = [{"id":10,"question":"会議で意見を（ ）に伝える。\n\n空欄に入る言葉は？","choices":["的確","適当","適切","適宜"],"correctIndex":0,"sectionId":"vocab"},{"id":11,"question":"トラブルに（ ）対応した。\n\n空欄に入る言葉は？","choices":["迅速に","性急に","早急に","急速に"],"correctIndex":0,"sectionId":"vocab"},{"id":14,"question":"景気が（ ）している。\n\n空欄に入る言葉は？","choices":["低迷","停電","停止","停滞"],"correctIndex":0,"sectionId":"vocab"},{"id":17,"question":"彼の話は（ ）だ。\n\n空欄に入る言葉は？","choices":["抽象的","本格的","積極的","消極的"],"correctIndex":0,"sectionId":"vocab"},{"id":18,"question":"予算の（ ）を立てる。\n\n空欄に入る言葉は？","choices":["目処","目印","目安","目標"],"correctIndex":0,"sectionId":"vocab"},{"id":20,"question":"（ ）電話に出る。\n\n空欄に入る言葉は？","choices":["頻繁に","律儀に","まともに","無難に"],"correctIndex":0,"sectionId":"vocab"},{"id":21,"question":"事情を（ ）話さない。\n\n空欄に入る言葉は？","choices":["話そうにも","話すまいと","話しがてら","話しつつも"],"correctIndex":0,"sectionId":"grammar"},{"id":22,"question":"彼はプロ（ ）の料理を作る。\n\n空欄に入る言葉は？","choices":["はだし","まがい","めいた","じみた"],"correctIndex":0,"sectionId":"grammar"},{"id":24,"question":"今回の失敗はリーダーである私にある（ ）。\n\n空欄に入る言葉は？","choices":["にほかならない","にすぎない","にこしたことはない","に相違ない"],"correctIndex":0,"sectionId":"grammar"},{"id":26,"question":"驚く（ ）速さで計算を終えた。\n\n空欄に入る言葉は？","choices":["ばかりの","ついでに","がてら","なりに"],"correctIndex":0,"sectionId":"grammar"},{"id":28,"question":"優勝（ ）喜びで胸がいっぱいだ。\n\n空欄に入る言葉は？","choices":["に至った","に足る","に沿った","を抜きにして"],"correctIndex":0,"sectionId":"grammar"},{"id":31,"question":"先生（ ）そんなことは言わないはずだ。\n\n空欄に入る言葉は？","choices":["ともあろう者が","に際して","からといって","といえば"],"correctIndex":0,"sectionId":"grammar"},{"id":33,"question":"試験（ ）合格してみせる。\n\n空欄に入る言葉は？","choices":["こそ","さえ","まで","ほど"],"correctIndex":0,"sectionId":"grammar"},{"id":34,"question":"彼は怒り（ ）部屋を出た。\n\n空欄に入る言葉は？","choices":["まじき","めいた","じみた","むき出しに"],"correctIndex":3,"sectionId":"grammar"},{"id":35,"question":"努力（ ）結果だ。\n\n空欄に入る言葉は？","choices":["次第の","ゆえの","抜きの","限定の"],"correctIndex":1,"sectionId":"grammar"},{"id":37,"question":"彼は学生（ ）よく勉強する。\n\n空欄に入る言葉は？","choices":["ながらも","とはいえ","だけに","なりに"],"correctIndex":0,"sectionId":"grammar"},{"id":40,"question":"見（ ）見ぬふりをする。\n\n空欄に入る言葉は？","choices":["つ","か","ぬ","ず"],"correctIndex":0,"sectionId":"grammar"},{"id":41,"question":"彼は正直（ ）人だ。\n\n空欄に入る言葉は？","choices":["極まりない","限りだ","この上ない","といった"],"correctIndex":0,"sectionId":"grammar"},{"id":48,"question":"旅行（ ）に買う。\n\n空欄に入る言葉は？","choices":["ついで","折り","際","弾み"],"correctIndex":0,"sectionId":"grammar"},{"id":49,"question":"彼は怒る（ ）だ。\n\n空欄に入る言葉は？","choices":["一方","ばかり","ほど","くらい"],"correctIndex":0,"sectionId":"grammar"},{"id":53,"question":"私（ ）解決できる。\n\n空欄に入る言葉は？","choices":["なりに","なりに","は","こそ"],"correctIndex":0,"sectionId":"grammar"},{"id":56,"question":"彼は帰る（ ）だ。\n\n空欄に入る言葉は？","choices":["ところ","ばかり","ほど","くらい"],"correctIndex":0,"sectionId":"grammar"},{"id":57,"question":"彼女は歌（ ）上手だ。\n\n空欄に入る言葉は？","choices":["さえ","まで","ほど","こそ"],"correctIndex":0,"sectionId":"grammar"},{"id":58,"question":"忙しい（ ）手伝う。\n\n空欄に入る言葉は？","choices":["ながらも","とはいえ","だけに","なりに"],"correctIndex":0,"sectionId":"grammar"},{"id":60,"question":"彼は走る（ ）速い。\n\n空欄に入る言葉は？","choices":["ほど","くらい","まで","ばかり"],"correctIndex":0,"sectionId":"grammar"},{"id":63,"question":"これ（ ）十分だ。\n\n空欄に入る言葉は？","choices":["で","に","を","も"],"correctIndex":0,"sectionId":"grammar"},{"id":66,"question":"1.仕事の 2.忙しさ 3.ゆえに 4.連絡が遅れた。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["仕事の","忙しさ","ゆえに","連絡が遅れた"],"correctIndex":2,"sectionId":"grammar"},{"id":67,"question":"1.彼を 2.抜きにしては 3.この計画は 4.語れない。\n\n★に入る番号は？ [1 ★ 3 4]","choices":["彼を","抜きにしては","この計画は","語れない"],"correctIndex":1,"sectionId":"grammar"},{"id":68,"question":"1.やる 2.べき 3.ことは 4.やった。\n\n★に入る番号は？ [1 ★ 3 4]","choices":["やる","べき","ことは","やった"],"correctIndex":1,"sectionId":"grammar"},{"id":69,"question":"1.雨が 2.降ろうが 3.槍が 4.降ろうが 行く。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["雨が","降ろうが","槍が","降ろうが"],"correctIndex":2,"sectionId":"grammar"},{"id":70,"question":"1.もっと 2.早く 3.来れば 4.よかった。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["もっと","早く","来れば","よかった"],"correctIndex":2,"sectionId":"grammar"},{"id":71,"question":"1.先生に 2.教えて 3.いただいた 4.本を読む。\n\n★に入る番号は？ [1 ★ 3 4]","choices":["先生に","教えて","いただいた","本を読む"],"correctIndex":1,"sectionId":"grammar"},{"id":72,"question":"1.やる 2.からには 3.最後まで 4.やりなさい。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["やる","からには","最後まで","やりなさい"],"correctIndex":2,"sectionId":"grammar"},{"id":73,"question":"1.あきらめ 2.ない 3.こと 4.が大切だ。\n\n★に入る番号は？ [1 ★ 3 4]","choices":["あきらめ","ない","こと","が大切だ"],"correctIndex":1,"sectionId":"grammar"},{"id":74,"question":"1.そんなに 2.食べたら 3.お腹が 4.痛くなる。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["そんなに","食べたら","お腹が","痛くなる"],"correctIndex":2,"sectionId":"grammar"},{"id":75,"question":"1.昨日 2.買った 3.ばかりの 4.靴。\n\n★に入る番号は？ [1 2 ★ 4]","choices":["昨日","買った","ばかりの","靴"],"correctIndex":2,"sectionId":"grammar"},{"id":76,"question":"科学の発展（76）人々の生活は便利になったが、環境問題も深刻化している。\n\n76に入る言葉は？","choices":["に伴って","に際して","を通じて","により"],"correctIndex":0,"sectionId":"grammar"},{"id":78,"question":"自分のミス（78）会社に損害を与えてしまった。\n\n78に入る言葉は？","choices":["のせいで","により","おかげで","次第で"],"correctIndex":0,"sectionId":"grammar"},{"id":82,"question":"言葉の意味は時代（82）変わる。\n\n82に入る言葉は？","choices":["とともに","に際して","に伴い","により"],"correctIndex":0,"sectionId":"grammar"},{"id":84,"question":"彼は怒る（84）出ていった。\n\n84に入る言葉は？","choices":["ばかりに","ほどに","くらいに","までに"],"correctIndex":0,"sectionId":"grammar"},{"id":110,"question":"女：この服、どう？男：似合ってるけど、ちょっと派手じゃない？女：そうかな。パーティー用だからいいと思って。男：それならいいかもね。\n\n男の人は服についてどう思っていますか。","choices":["似合わない","派手すぎる","パーティーに合う","安っぽい"],"correctIndex":1,"sectionId":"listening"},{"id":112,"question":"女：お腹空いたね。ラーメンにする？男：昨日の夜もラーメンだったんだ。今日は和食がいいな。女：じゃあ、あそこの定食屋さんは？男：賛成。\n\n二人はこれから何を何を食べますか。","choices":["ラーメン","和食（定食）","イタリアン","中華"],"correctIndex":1,"sectionId":"listening"}] as const
const canonical = new Map(japaneseN2Quiz.questions.map((q) => [Number(q.id), q]))
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
function isLegacyQuestion(value: unknown, item: (typeof legacy)[number]): value is Question {
  if (!value || typeof value !== 'object') return false
  const q = value as Partial<Question>
  return Number(q.id) === item.id && q.question === item.question && same(q.choices, item.choices) && q.correctIndex === item.correctIndex && q.sectionId === item.sectionId
}
function migrateQuestion(value: unknown): unknown {
  const item = legacy.find((candidate) => isLegacyQuestion(value, candidate))
  if (!item || !value || typeof value !== 'object') return value
  const current = canonical.get(item.id)
  return current ? { ...(value as Record<string, unknown>), ...current } : value
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
export function migrateN2StoredValue(value: unknown): unknown {
  if (Array.isArray(value)) return migrateArray(value)
  if (!value || typeof value !== 'object') return value
  const record = { ...(value as Record<string, unknown>) }
  if (Array.isArray(record.questions)) record.questions = migrateArray(record.questions)
  return record
}
export function migrateN2QuestionStorage(storage?: StorageLike): void {
  if (!storage) { if (typeof window === 'undefined') return; storage = window.localStorage }
  try { if (storage.getItem(VERSION_KEY) === '1') return } catch { return }
  for (const key of STORAGE_KEYS) {
    try {
      const raw = storage.getItem(key); if (!raw) continue
      const parsed = JSON.parse(raw); const migrated = migrateN2StoredValue(parsed)
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
export function buildN2QuizContentSignature(quizType: QuizType, questions: readonly Question[]): string {
  if (quizType !== 'japanese-n2') return `${quizType}:unchanged`
  const content = questions.map(q=>JSON.stringify([q.id,q.question,q.choices,q.correctIndex,q.sectionId])).join('|')
  return `japanese-n2:v1:${questions.length}:${hashText(content)}`
}
