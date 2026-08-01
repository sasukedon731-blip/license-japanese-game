import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { japaneseN3Quiz } from '../app/data/quizzes/japanese-n3.ts'
globalThis.__phase34Quiz=japaneseN3Quiz
const migrationSource=(await readFile(new URL('../app/lib/n3QuestionMigration.ts',import.meta.url),'utf8')).replace(/^import type.*$/m,'').replace(/^import \{ japaneseN3Quiz \}.*$/m,'const japaneseN3Quiz=globalThis.__phase34Quiz')
const migrationModule=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(migrationSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'))
const { buildQuizContentSignature, migrateN3QuestionStorage }=migrationModule

const qs=japaneseN3Quiz.questions
const normalized=qs.map(q=>({id:q.id,question:q.question,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,sectionId:q.sectionId}))
class MemoryStorage { constructor(data={}){this.data={...data};this.writes=[]} getItem(k){return this.data[k]??null} setItem(k,v){this.data[k]=v;this.writes.push([k,v])} }
const old=[{"oldId":1,"newId":101,"question":"男：雨だ！洗濯物取り込まなきゃ。女：お願い、私は窓を閉めるから。男：あ、その前に自転車にカバーを…。女：洗濯物が先よ！自転車は後。男：わかった。\n\n男の人はまず何をしますか。","choices":["洗濯物を取り込む","窓を閉める","カバーをかける","庭に出る"],"correctIndex":0,"sectionId":"listening"},{"oldId":2,"newId":102,"question":"自分の（のうりょく）を最大限に発揮したい。\n\n（のうりょく）の漢字は？","choices":["能率","能力","農力","脳力"],"correctIndex":1,"sectionId":"vocab"},{"oldId":3,"newId":103,"question":"佐藤です。明日の10時からの会議ですが、部長の都合で1時間遅らせることになりました。場所は第3会議室で変わりません。\n\n会議は何時に始まりますか。","choices":["11時","10時","9時","12時"],"correctIndex":0,"sectionId":"listening"},{"oldId":4,"newId":104,"question":"男：セミナーに何がいる？女：学生証が必要って。履歴書は？男：それは来週の面接でいいみたい。女：お茶は出るらしいから飲み物はいらないよ。\n\n何を持っていきますか。","choices":["学生証","履歴書","飲み物","パソコン"],"correctIndex":0,"sectionId":"listening"},{"oldId":5,"newId":105,"question":"ただいまタイムセール中です。野菜コーナーのトマトとキュウリが20％引きです！肉と魚のセールは明日行います。\n\n今日安くなるのはどれですか。","choices":["トマトとキュウリ","お肉","お魚","すべての野菜"],"correctIndex":0,"sectionId":"listening"},{"oldId":6,"newId":106,"question":"試験の（けっか）をインターネットで確認した。\n\n（けっか）の漢字は？","choices":["結果","結過","結価","決果"],"correctIndex":0,"sectionId":"vocab"},{"oldId":7,"newId":107,"question":"資料を（ほぞん）するのを忘れてしまった。\n\n（ほぞん）の漢字は？","choices":["捕存","保在","保存","保持"],"correctIndex":2,"sectionId":"vocab"},{"oldId":8,"newId":108,"question":"彼は（きよう）に道具を使いこなしている。\n\n（きよう）の漢字は？","choices":["器用","器様","希用","貴用"],"correctIndex":0,"sectionId":"vocab"},{"oldId":9,"newId":109,"question":"太平洋の（えんがん）に沿って走る。\n\n（えんがん）の漢字は？","choices":["遠岸","沿岸","円岸","延岸"],"correctIndex":1,"sectionId":"vocab"},{"oldId":10,"newId":110,"question":"恵まれない子供たちのために（きふ）をした。\n\n（きふ）の漢字は？","choices":["寄付","記付","喜付","基付"],"correctIndex":0,"sectionId":"vocab"},{"oldId":11,"newId":111,"question":"この地域は一年中温暖な気候です。\n\n温暖の読み方は？","choices":["おんたん","おんだん","おんらん","おんぬん"],"correctIndex":1,"sectionId":"vocab"},{"oldId":12,"newId":112,"question":"明日の朝は晴れますが、お昼から雲が広がるでしょう。午後は雨が降り出し、夜には激しく降る見込みです。\n\n明日の午後の天気は？","choices":["雨","晴れ","曇り","雪"],"correctIndex":0,"sectionId":"listening"},{"oldId":13,"newId":113,"question":"将来の計画について具体的に話す。\n\n具体的の読み方は？","choices":["ぐてき","ぐていてき","ぐたいてき","ぐたいしき"],"correctIndex":2,"sectionId":"vocab"},{"oldId":14,"newId":114,"question":"男：カレーパン2つとアンパン1つ。店員：アンパンは売り切れで、代わりにクリームパンはどうですか？男：じゃあ、それを2つ。カレーパンはやめます。\n\nどのパンを買いますか。","choices":["クリームパン2つ","カレーパン2つ","アンパン1つ","全部"],"correctIndex":0,"sectionId":"listening"},{"oldId":15,"newId":115,"question":"女：昨日電話出なかったね。男：ごめん、映画館にいてマナーモードにしてたんだ。寝てたわけじゃないよ。昨日は休みだったし。\n\nなぜ電話に出なかった？","choices":["映画を見ていた","寝ていた","仕事が忙しかった","携帯を失くした"],"correctIndex":0,"sectionId":"listening"},{"oldId":16,"newId":116,"question":"出かける支度をするのに時間がかかる。\n\n支度の読み方は？","choices":["したく","しど","したび","さたく"],"correctIndex":0,"sectionId":"vocab"},{"oldId":17,"newId":117,"question":"女：今日買い物行こう。男：今日は残業。明日は？女：明日は友達と会うの。あさってなら暇だけど。男：よし、じゃあそうしよう。\n\nいつ買い物に行きますか。","choices":["あさって","今日","明日","来週"],"correctIndex":0,"sectionId":"listening"},{"oldId":18,"newId":118,"question":"畑を耕すのは大変な重労働だ。\n\n耕すの読み方は？","choices":["たがやす","とかす","ぬらす","たやす"],"correctIndex":0,"sectionId":"vocab"},{"oldId":19,"newId":119,"question":"女：木村さん、部長が応接室で呼んでるわよ。男：コピー機直さなくていい？女：田中さんが修理を呼んだから大丈夫。早く行って。\n\nどこへ行きますか。","choices":["応接室","コピー機の前","田中さんの席","部長の席"],"correctIndex":0,"sectionId":"listening"},{"oldId":20,"newId":120,"question":"事態がさらに悪化する恐れがある。\n\n悪化の読み方は？","choices":["あくか","あっか","あくげ","あつか"],"correctIndex":1,"sectionId":"vocab"}]
const oldQuestion=(id)=>{const x=old.find(x=>x.oldId===id);return {...x,id:x.oldId}}

test('Phase 34 N3 canonical data',()=>{
 assert.equal(qs.length,120); assert.deepEqual([...qs.map(q=>q.id)].sort((a,b)=>a-b),Array.from({length:120},(_,i)=>i+1));
 assert.equal(new Set(qs.map(q=>JSON.stringify([q.sectionId,q.question,q.choices,q.correctIndex]))).size,120)
 for(const q of qs){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.correctIndex>=0&&q.correctIndex<4);assert.ok(q.question.trim()&&q.explanation.trim());assert.ok(q.explanation.includes(q.choices[q.correctIndex]))}
 assert.equal(createHash('sha256').update(JSON.stringify(normalized)).digest('hex'),'ea171ad15bde35952f98fbfb8b0778fb28f17cd94236c466474238c1ee4879fa')
 assert.equal(qs.find(q=>q.id===81).choices[qs.find(q=>q.id===81).correctIndex],'の際'); assert.equal(qs.find(q=>q.id===85).choices[1],'走る')
 for(const id of [66,67,68,69,70,71,72,73,74,75]) assert.match(qs.find(q=>q.id===id).question,/★に入る最も適切な語句/)
 for(const id of [93,95,97,99]) assert.ok(qs.find(q=>q.id===id).question.length>60)
 assert.notEqual(buildQuizContentSignature('japanese-n3',qs),buildQuizContentSignature('japanese-n3',qs.map((q,i)=>i===40?{...q,id:999}:q)))
})

test('Phase 34 localStorage migration',()=>{
 const first=qs.find(q=>q.id===1), later=oldQuestion(1), other={...later,question:'different'}
 const storage=new MemoryStorage({'wrong-japanese-n3':JSON.stringify([first,later,later,other]),'wrong-japanese-n4':JSON.stringify([later]),'normal-session-japanese-n3':JSON.stringify({questions:[later]}),'exam-session-japanese-n3':JSON.stringify({questions:[later],answers:[{questionId:1,isCorrect:false}]})})
 migrateN3QuestionStorage(storage); migrateN3QuestionStorage(storage)
 const wrong=JSON.parse(storage.data['wrong-japanese-n3']); assert.deepEqual(wrong.map(q=>q.id),[1,101,1]); assert.equal(wrong[2].question,'different')
 assert.equal(JSON.parse(storage.data['normal-session-japanese-n3']).questions[0].id,101)
 const exam=JSON.parse(storage.data['exam-session-japanese-n3']); assert.equal(exam.questions[0].id,101);assert.equal(exam.answers[0].questionId,101)
 assert.equal(JSON.parse(storage.data['wrong-japanese-n4'])[0].id,1); assert.equal(storage.data['n3-question-id-migration-v1'],'1')
})

test('Phase 34 migration safety cases',()=>{
 assert.doesNotThrow(()=>migrateN3QuestionStorage(undefined))
 assert.doesNotThrow(()=>migrateN3QuestionStorage({getItem(){throw Error('read')},setItem(){throw Error('write')}}))
 assert.doesNotThrow(()=>migrateN3QuestionStorage({getItem(k){return k==='n3-question-id-migration-v1'?null:'{bad'},setItem(){throw Error('write')}}))
 for(const raw of ['null','{}','[]','42','"text"']) {const s=new MemoryStorage({'wrong-japanese-n3':raw});assert.doesNotThrow(()=>migrateN3QuestionStorage(s))}
 const done=new MemoryStorage({'n3-question-id-migration-v1':'1','wrong-japanese-n3':JSON.stringify([oldQuestion(20)])});migrateN3QuestionStorage(done);assert.equal(JSON.parse(done.data['wrong-japanese-n3'])[0].id,20)
 for(let id=1;id<=20;id++){const s=new MemoryStorage({'wrong-japanese-n3':JSON.stringify([oldQuestion(id)])});migrateN3QuestionStorage(s);assert.equal(JSON.parse(s.data['wrong-japanese-n3'])[0].id,100+id)}
})
