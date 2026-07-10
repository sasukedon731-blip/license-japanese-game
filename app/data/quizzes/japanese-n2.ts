import type { Quiz } from "@/app/data/types"

export const japaneseN2Quiz: Quiz = {
  id: "japanese-n2",
  title: "日本語検定N2",
  description: "文法・語彙・読解・聴解（N2）",
  questions: [
    {
      id: 1,
      question: `新しい事業を（ていけい）して進める。

（ていけい）の漢字は？`,
      choices: ["提携", "締結", "抵抗", "提示"],
      correctIndex: 0,
      explanation: "正解は「提携」です。",
      sectionId: "vocab",
    },
    {
      id: 2,
      question: `事件の（しんそう）を究明する。

（しんそう）の漢字は？`,
      choices: ["真相", "深層", "心身", "真走"],
      correctIndex: 0,
      explanation: "正解は「真相」です。",
      sectionId: "vocab",
    },
    {
      id: 3,
      question: `予算を削減する。

削減の読み方は？`,
      choices: ["さくげん", "けずげん", "しょうげん", "さっげん"],
      correctIndex: 0,
      explanation: "正解は「さくげん」です。",
      sectionId: "vocab",
    },
    {
      id: 4,
      question: `彼は非常に謙虚だ。

謙虚の読み方は？`,
      choices: ["けんきょ", "けんこ", "かねきょ", "げんきょ"],
      correctIndex: 0,
      explanation: "正解は「けんきょ」です。",
      sectionId: "vocab",
    },
    {
      id: 5,
      question: `今の生活に（ ）満足している。

空欄に入る言葉は？`,
      choices: ["おおむね", "あくまで", "せめて", "まさか"],
      correctIndex: 0,
      explanation: "正解は「おおむね」です。",
      sectionId: "vocab",
    },
    {
      id: 6,
      question: `計画を（ ）実行に移す。

空欄に入る言葉は？`,
      choices: ["着々と", "続々と", "刻々と", "転々と"],
      correctIndex: 0,
      explanation: "正解は「着々と」です。",
      sectionId: "vocab",
    },
    {
      id: 7,
      question: `責任を（ ）する。

空欄に入る言葉は？`,
      choices: ["転嫁", "転換", "転送", "転落"],
      correctIndex: 0,
      explanation: "正解は「転嫁」です。",
      sectionId: "vocab",
    },
    {
      id: 8,
      question: `（ ）的な価値を持つ。

空欄に入る言葉は？`,
      choices: ["普遍", "不変", "不偏", "不法"],
      correctIndex: 0,
      explanation: "正解は「普遍」です。",
      sectionId: "vocab",
    },
    {
      id: 9,
      question: `彼は（ ）努力を続けている。

空欄に入る言葉は？`,
      choices: ["たゆまぬ", "はしたない", "もどかしい", "なだらかな"],
      correctIndex: 0,
      explanation: "正解は「たゆまぬ」です。",
      sectionId: "vocab",
    },
    {
      id: 10,
      question: `会議で意見を（ ）に伝える。

空欄に入る言葉は？`,
      choices: ["的確", "適当", "適切", "適宜"],
      correctIndex: 0,
      explanation: "正解は「的確」です。",
      sectionId: "vocab",
    },
    {
      id: 11,
      question: `トラブルに（ ）対応した。

空欄に入る言葉は？`,
      choices: ["迅速に", "性急に", "早急に", "急速に"],
      correctIndex: 0,
      explanation: "正解は「迅速に」です。",
      sectionId: "vocab",
    },
    {
      id: 12,
      question: `彼は（ ）おしゃべりだ。

空欄に入る言葉は？`,
      choices: ["やたらと", "めったに", "まったく", "ろくに"],
      correctIndex: 0,
      explanation: "正解は「やたらと」です。",
      sectionId: "vocab",
    },
    {
      id: 13,
      question: `彼の才能には（ ）を巻く。

空欄に入る言葉は？`,
      choices: ["舌", "首", "腕", "肩"],
      correctIndex: 0,
      explanation: "正解は「舌」です。",
      sectionId: "vocab",
    },
    {
      id: 14,
      question: `景気が（ ）している。

空欄に入る言葉は？`,
      choices: ["低迷", "停電", "停止", "停滞"],
      correctIndex: 0,
      explanation: "正解は「低迷」です。",
      sectionId: "vocab",
    },
    {
      id: 15,
      question: `自分の非を（ ）。

空欄に入る言葉は？`,
      choices: ["認める", "諦める", "諌める", "慰める"],
      correctIndex: 0,
      explanation: "正解は「認める」です。",
      sectionId: "vocab",
    },
    {
      id: 16,
      question: `伝統を（ ）する。

空欄に入る言葉は？`,
      choices: ["継承", "継続", "中継", "形態"],
      correctIndex: 0,
      explanation: "正解は「継承」です。",
      sectionId: "vocab",
    },
    {
      id: 17,
      question: `彼の話は（ ）だ。

空欄に入る言葉は？`,
      choices: ["抽象的", "本格的", "積極的", "消極的"],
      correctIndex: 0,
      explanation: "正解は「抽象的」です。",
      sectionId: "vocab",
    },
    {
      id: 18,
      question: `予算の（ ）を立てる。

空欄に入る言葉は？`,
      choices: ["目処", "目印", "目安", "目標"],
      correctIndex: 0,
      explanation: "正解は「目処」です。",
      sectionId: "vocab",
    },
    {
      id: 19,
      question: `資料を（ ）に分類する。

空欄に入る言葉は？`,
      choices: ["系統的", "意図的", "基本的", "個性的"],
      correctIndex: 0,
      explanation: "正解は「系統的」です。",
      sectionId: "vocab",
    },
    {
      id: 20,
      question: `（ ）電話に出る。

空欄に入る言葉は？`,
      choices: ["頻繁に", "律儀に", "まともに", "無難に"],
      correctIndex: 0,
      explanation: "正解は「頻繁に」です。",
      sectionId: "vocab",
    },
    {
      id: 21,
      question: `事情を（ ）話さない。

空欄に入る言葉は？`,
      choices: ["話そうにも", "話すまいと", "話しがてら", "話しつつも"],
      correctIndex: 0,
      explanation: "正解は「話そうにも」です。",
      sectionId: "grammar",
    },
    {
      id: 22,
      question: `彼はプロ（ ）の料理を作る。

空欄に入る言葉は？`,
      choices: ["はだし", "まがい", "めいた", "じみた"],
      correctIndex: 0,
      explanation: "正解は「はだし」です。",
      sectionId: "grammar",
    },
    {
      id: 23,
      question: `断ら（ ）得ない。

空欄に入る形は？`,
      choices: ["ざる", "ず", "ない", "ぬ"],
      correctIndex: 0,
      explanation: "正解は「ざる」です。",
      sectionId: "grammar",
    },
    {
      id: 24,
      question: `今回の失敗はリーダーである私にある（ ）。

空欄に入る言葉は？`,
      choices: ["にほかならない", "にすぎない", "にこしたことはない", "に相違ない"],
      correctIndex: 0,
      explanation: "正解は「にほかならない」です。",
      sectionId: "grammar",
    },
    {
      id: 25,
      question: `健康（ ）毎日ジョギングをしている。

空欄に入る言葉は？`,
      choices: ["のために", "のわりに", "をきっかけに", "をこめて"],
      correctIndex: 0,
      explanation: "正解は「のために」です。",
      sectionId: "grammar",
    },
    {
      id: 26,
      question: `驚く（ ）速さで計算を終えた。

空欄に入る言葉は？`,
      choices: ["ばかりの", "ついでに", "がてら", "なりに"],
      correctIndex: 0,
      explanation: "正解は「ばかりの」です。",
      sectionId: "grammar",
    },
    {
      id: 27,
      question: `この薬を（ ）ならない。

空欄に入る形は？`,
      choices: ["飲まねば", "飲まずに", "飲まざる", "飲むべく"],
      correctIndex: 0,
      explanation: "正解は「飲まねば」です。",
      sectionId: "grammar",
    },
    {
      id: 28,
      question: `優勝（ ）喜びで胸がいっぱいだ。

空欄に入る言葉は？`,
      choices: ["に至った", "に足る", "に沿った", "を抜きにして"],
      correctIndex: 0,
      explanation: "正解は「に至った」です。",
      sectionId: "grammar",
    },
    {
      id: 29,
      question: `彼は実力がある（ ）期待も大きい。

空欄に入る言葉は？`,
      choices: ["だけに", "わりに", "どころか", "ほど"],
      correctIndex: 0,
      explanation: "正解は「だけに」です。",
      sectionId: "grammar",
    },
    {
      id: 30,
      question: `知っている（ ）教えてくれない。

空欄に入る言葉は？`,
      choices: ["くせに", "かわりに", "おかげで", "せいで"],
      correctIndex: 0,
      explanation: "正解は「くせに」です。",
      sectionId: "grammar",
    },
    {
      id: 31,
      question: `先生（ ）そんなことは言わないはずだ。

空欄に入る言葉は？`,
      choices: ["ともあろう者が", "に際して", "からといって", "といえば"],
      correctIndex: 0,
      explanation: "正解は「ともあろう者が」です。",
      sectionId: "grammar",
    },
    {
      id: 32,
      question: `契約（ ）注意点を説明する。

空欄に入る言葉は？`,
      choices: ["に際して", "につれて", "にしたがって", "に伴って"],
      correctIndex: 0,
      explanation: "正解は「に際して」です。",
      sectionId: "grammar",
    },
    {
      id: 33,
      question: `試験（ ）合格してみせる。

空欄に入る言葉は？`,
      choices: ["こそ", "さえ", "まで", "ほど"],
      correctIndex: 0,
      explanation: "正解は「こそ」です。",
      sectionId: "grammar",
    },
    {
      id: 34,
      question: `彼は怒り（ ）部屋を出た。

空欄に入る言葉は？`,
      choices: ["まじき", "めいた", "じみた", "むき出しに"],
      correctIndex: 3,
      explanation: "正解は「むき出しに」です。",
      sectionId: "grammar",
    },
    {
      id: 35,
      question: `努力（ ）結果だ。

空欄に入る言葉は？`,
      choices: ["次第の", "ゆえの", "抜きの", "限定の"],
      correctIndex: 1,
      explanation: "正解は「ゆえの」です。",
      sectionId: "grammar",
    },
    {
      id: 36,
      question: `泣か（ ）にはいられない。

空欄に入る形は？`,
      choices: ["ず", "ない", "ぬ", "ざる"],
      correctIndex: 0,
      explanation: "正解は「ず」です。",
      sectionId: "grammar",
    },
    {
      id: 37,
      question: `彼は学生（ ）よく勉強する。

空欄に入る言葉は？`,
      choices: ["ながらも", "とはいえ", "だけに", "なりに"],
      correctIndex: 0,
      explanation: "正解は「ながらも」です。",
      sectionId: "grammar",
    },
    {
      id: 38,
      question: `実行（ ）のみだ。

空欄に入る言葉は？`,
      choices: ["ある", "する", "して", "し"],
      correctIndex: 0,
      explanation: "正解は「ある」です。",
      sectionId: "grammar",
    },
    {
      id: 39,
      question: `解決（ ）いない。

空欄に入る形は？`,
      choices: ["しきれて", "しきって", "しすぎて", "しかねて"],
      correctIndex: 0,
      explanation: "正解は「しきれて」です。",
      sectionId: "grammar",
    },
    {
      id: 40,
      question: `見（ ）見ぬふりをする。

空欄に入る言葉は？`,
      choices: ["つ", "か", "ぬ", "ず"],
      correctIndex: 0,
      explanation: "正解は「つ」です。",
      sectionId: "grammar",
    },
    {
      id: 41,
      question: `彼は正直（ ）人だ。

空欄に入る言葉は？`,
      choices: ["極まりない", "限りだ", "この上ない", "といった"],
      correctIndex: 0,
      explanation: "正解は「極まりない」です。",
      sectionId: "grammar",
    },
    {
      id: 42,
      question: `独身（ ）の悩み。

空欄に入る言葉は？`,
      choices: ["ゆえ", "はず", "わけ", "もの"],
      correctIndex: 0,
      explanation: "正解は「ゆえ」です。",
      sectionId: "grammar",
    },
    {
      id: 43,
      question: `聞く（ ）もない。

空欄に入る言葉は？`,
      choices: ["まで", "ほど", "くらい", "ばかり"],
      correctIndex: 0,
      explanation: "正解は「まで」です。",
      sectionId: "grammar",
    },
    {
      id: 44,
      question: `冗談（ ）に。

空欄に入る言葉は？`,
      choices: ["抜き", "通し", "限り", "止め"],
      correctIndex: 0,
      explanation: "正解は「抜き」です。",
      sectionId: "grammar",
    },
    {
      id: 45,
      question: `予想に（ ）結果。

空欄に入る言葉は？`,
      choices: ["反する", "基づく", "沿う", "伴う"],
      correctIndex: 0,
      explanation: "正解は「反する」です。",
      sectionId: "grammar",
    },
    {
      id: 46,
      question: `感謝の気持ち（ ）手紙を書く。

空欄に入る言葉は？`,
      choices: ["を込めて", "に際して", "に伴って", "を通じて"],
      correctIndex: 0,
      explanation: "正解は「を込めて」です。",
      sectionId: "grammar",
    },
    {
      id: 47,
      question: `彼は信じる（ ）人だ。

空欄に入る言葉は？`,
      choices: ["に足る", "に沿う", "に基づく", "に際する"],
      correctIndex: 0,
      explanation: "正解は「に足る」です。",
      sectionId: "grammar",
    },
    {
      id: 48,
      question: `旅行（ ）に買う。

空欄に入る言葉は？`,
      choices: ["ついで", "折り", "際", "弾み"],
      correctIndex: 0,
      explanation: "正解は「ついで」です。",
      sectionId: "grammar",
    },
    {
      id: 49,
      question: `彼は怒る（ ）だ。

空欄に入る言葉は？`,
      choices: ["一方", "ばかり", "ほど", "くらい"],
      correctIndex: 0,
      explanation: "正解は「一方」です。",
      sectionId: "grammar",
    },
    {
      id: 50,
      question: `努力した（ ）がある。

空欄に入る言葉は？`,
      choices: ["かい", "わけ", "はず", "こと"],
      correctIndex: 0,
      explanation: "正解は「かい」です。",
      sectionId: "grammar",
    },
    {
      id: 51,
      question: `プロ（ ）の実力だ。

空欄に入る言葉は？`,
      choices: ["並み", "まがい", "めいた", "じみた"],
      correctIndex: 0,
      explanation: "正解は「並み」です。",
      sectionId: "grammar",
    },
    {
      id: 52,
      question: `天候（ ）は中止だ。

空欄に入る言葉は？`,
      choices: ["次第で", "次第に", "次第は", "次第だ"],
      correctIndex: 0,
      explanation: "正解は「次第で」です。",
      sectionId: "grammar",
    },
    {
      id: 53,
      question: `私（ ）解決できる。

空欄に入る言葉は？`,
      choices: ["なりに", "なりに", "は", "こそ"],
      correctIndex: 0,
      explanation: "正解は「なりに」です。",
      sectionId: "grammar",
    },
    {
      id: 54,
      question: `言う（ ）もない。

空欄に入る言葉は？`,
      choices: ["まで", "ほど", "くらい", "ばかり"],
      correctIndex: 0,
      explanation: "正解は「まで」です。",
      sectionId: "grammar",
    },
    {
      id: 55,
      question: `地震（ ）設計だ。

空欄に入る言葉は？`,
      choices: ["に強い", "に弱い", "に伴う", "に際する"],
      correctIndex: 0,
      explanation: "正解は「に強い」です。",
      sectionId: "grammar",
    },
    {
      id: 56,
      question: `彼は帰る（ ）だ。

空欄に入る言葉は？`,
      choices: ["ところ", "ばかり", "ほど", "くらい"],
      correctIndex: 0,
      explanation: "正解は「ところ」です。",
      sectionId: "grammar",
    },
    {
      id: 57,
      question: `彼女は歌（ ）上手だ。

空欄に入る言葉は？`,
      choices: ["さえ", "まで", "ほど", "こそ"],
      correctIndex: 0,
      explanation: "正解は「さえ」です。",
      sectionId: "grammar",
    },
    {
      id: 58,
      question: `忙しい（ ）手伝う。

空欄に入る言葉は？`,
      choices: ["ながらも", "とはいえ", "だけに", "なりに"],
      correctIndex: 0,
      explanation: "正解は「ながらも」です。",
      sectionId: "grammar",
    },
    {
      id: 59,
      question: `合格（ ）道はない。

空欄に入る言葉は？`,
      choices: ["以外に", "ほかに", "までに", "ために"],
      correctIndex: 0,
      explanation: "正解は「以外に」です。",
      sectionId: "grammar",
    },
    {
      id: 60,
      question: `彼は走る（ ）速い。

空欄に入る言葉は？`,
      choices: ["ほど", "くらい", "まで", "ばかり"],
      correctIndex: 0,
      explanation: "正解は「ほど」です。",
      sectionId: "grammar",
    },
    {
      id: 61,
      question: `明日は雨（ ）だ。

空欄に入る言葉は？`,
      choices: ["だろう", "らしい", "よう", "そう"],
      correctIndex: 0,
      explanation: "正解は「だろう」です。",
      sectionId: "grammar",
    },
    {
      id: 62,
      question: `彼は学生（ ）ない。

空欄に入る言葉は？`,
      choices: ["では", "には", "を", "も"],
      correctIndex: 0,
      explanation: "正解は「では」です。",
      sectionId: "grammar",
    },
    {
      id: 63,
      question: `これ（ ）十分だ。

空欄に入る言葉は？`,
      choices: ["で", "に", "を", "も"],
      correctIndex: 0,
      explanation: "正解は「で」です。",
      sectionId: "grammar",
    },
    {
      id: 64,
      question: `彼は（ ）ながら話す。

空欄に入る形は？`,
      choices: ["笑い", "笑う", "笑って", "笑った"],
      correctIndex: 0,
      explanation: "正解は「笑い」です。",
      sectionId: "grammar",
    },
    {
      id: 65,
      question: `窓が（ ）ままだ。

空欄に入る形は？`,
      choices: ["開いた", "開く", "開いて", "開け"],
      correctIndex: 0,
      explanation: "正解は「開いた」です。",
      sectionId: "grammar",
    },
    {
      id: 66,
      question: `1.仕事の 2.忙しさ 3.ゆえに 4.連絡が遅れた。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["仕事の", "忙しさ", "ゆえに", "連絡が遅れた"],
      correctIndex: 2,
      explanation: "正解は「ゆえに」です。",
      sectionId: "grammar",
    },
    {
      id: 67,
      question: `1.彼を 2.抜きにしては 3.この計画は 4.語れない。

★に入る番号は？ [1 ★ 3 4]`,
      choices: ["彼を", "抜きにしては", "この計画は", "語れない"],
      correctIndex: 1,
      explanation: "正解は「抜きにしては」です。",
      sectionId: "grammar",
    },
    {
      id: 68,
      question: `1.やる 2.べき 3.ことは 4.やった。

★に入る番号は？ [1 ★ 3 4]`,
      choices: ["やる", "べき", "ことは", "やった"],
      correctIndex: 1,
      explanation: "正解は「べき」です。",
      sectionId: "grammar",
    },
    {
      id: 69,
      question: `1.雨が 2.降ろうが 3.槍が 4.降ろうが 行く。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["雨が", "降ろうが", "槍が", "降ろうが"],
      correctIndex: 2,
      explanation: "正解は「槍が」です。",
      sectionId: "grammar",
    },
    {
      id: 70,
      question: `1.もっと 2.早く 3.来れば 4.よかった。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["もっと", "早く", "来れば", "よかった"],
      correctIndex: 2,
      explanation: "正解は「来れば」です。",
      sectionId: "grammar",
    },
    {
      id: 71,
      question: `1.先生に 2.教えて 3.いただいた 4.本を読む。

★に入る番号は？ [1 ★ 3 4]`,
      choices: ["先生に", "教えて", "いただいた", "本を読む"],
      correctIndex: 1,
      explanation: "正解は「教えて」です。",
      sectionId: "grammar",
    },
    {
      id: 72,
      question: `1.やる 2.からには 3.最後まで 4.やりなさい。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["やる", "からには", "最後まで", "やりなさい"],
      correctIndex: 2,
      explanation: "正解は「最後まで」です。",
      sectionId: "grammar",
    },
    {
      id: 73,
      question: `1.あきらめ 2.ない 3.こと 4.が大切だ。

★に入る番号は？ [1 ★ 3 4]`,
      choices: ["あきらめ", "ない", "こと", "が大切だ"],
      correctIndex: 1,
      explanation: "正解は「ない」です。",
      sectionId: "grammar",
    },
    {
      id: 74,
      question: `1.そんなに 2.食べたら 3.お腹が 4.痛くなる。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["そんなに", "食べたら", "お腹が", "痛くなる"],
      correctIndex: 2,
      explanation: "正解は「お腹が」です。",
      sectionId: "grammar",
    },
    {
      id: 75,
      question: `1.昨日 2.買った 3.ばかりの 4.靴。

★に入る番号は？ [1 2 ★ 4]`,
      choices: ["昨日", "買った", "ばかりの", "靴"],
      correctIndex: 2,
      explanation: "正解は「ばかりの」です。",
      sectionId: "grammar",
    },
    {
      id: 76,
      question: `科学の発展（76）人々の生活は便利になったが、環境問題も深刻化している。

76に入る言葉は？`,
      choices: ["に伴って", "に際して", "を通じて", "により"],
      correctIndex: 0,
      explanation: "正解は「に伴って」です。",
      sectionId: "grammar",
    },
    {
      id: 77,
      question: `彼は実力がある（77）周囲からの期待も大きい。

77に入る言葉は？`,
      choices: ["だけに", "わりに", "ほど", "どころか"],
      correctIndex: 0,
      explanation: "正解は「だけに」です。",
      sectionId: "grammar",
    },
    {
      id: 78,
      question: `自分のミス（78）会社に損害を与えてしまった。

78に入る言葉は？`,
      choices: ["のせいで", "により", "おかげで", "次第で"],
      correctIndex: 0,
      explanation: "正解は「のせいで」です。",
      sectionId: "grammar",
    },
    {
      id: 79,
      question: `この店は味がいい（79）値段も手頃だ。

79に入る言葉は？`,
      choices: ["うえに", "反面", "わりに", "ほど"],
      correctIndex: 0,
      explanation: "正解は「うえに」です。",
      sectionId: "grammar",
    },
    {
      id: 80,
      question: `彼はまるで（80）ような顔で笑った。

80に入る言葉は？`,
      choices: ["泣き出しそうな", "泣き出す", "泣き出した", "泣き出しそう"],
      correctIndex: 0,
      explanation: "正解は「泣き出しそうな」です。",
      sectionId: "grammar",
    },
    {
      id: 81,
      question: `彼が犯人だ（81）考えられない。

81に入る言葉は？`,
      choices: ["なんて", "まで", "さえ", "ほど"],
      correctIndex: 0,
      explanation: "正解は「なんて」です。",
      sectionId: "grammar",
    },
    {
      id: 82,
      question: `言葉の意味は時代（82）変わる。

82に入る言葉は？`,
      choices: ["とともに", "に際して", "に伴い", "により"],
      correctIndex: 0,
      explanation: "正解は「とともに」です。",
      sectionId: "grammar",
    },
    {
      id: 83,
      question: `努力の（83）合格できた。

83に入る言葉は？`,
      choices: ["かいあって", "わりに", "たびに", "ついでに"],
      correctIndex: 0,
      explanation: "正解は「かいあって」です。",
      sectionId: "grammar",
    },
    {
      id: 84,
      question: `彼は怒る（84）出ていった。

84に入る言葉は？`,
      choices: ["ばかりに", "ほどに", "くらいに", "までに"],
      correctIndex: 0,
      explanation: "正解は「ばかりに」です。",
      sectionId: "grammar",
    },
    {
      id: 85,
      question: `これ（85）は絶対に負けられない。

85に入る言葉は？`,
      choices: ["こそ", "さえ", "まで", "ほど"],
      correctIndex: 0,
      explanation: "正解は「こそ」です。",
      sectionId: "grammar",
    },
    {
      id: 86,
      question: `謝罪とは、ただ言葉を並べることではない。相手の立場に立ち、自分の非を認め、二度と同じ過ちを繰り返さないと誓うことだ。

筆者にとって謝罪で最も大切なことは？`,
      choices: ["二度と繰り返さない誓い", "丁寧な言葉遣い", "早く謝ること", "相手を許すこと"],
      correctIndex: 0,
      explanation: "正解は「二度と繰り返さない誓い」です。",
      sectionId: "reading",
    },
    {
      id: 87,
      question: `現代社会において、情報は「量」よりも「質」が問われている。溢れる情報の中から真実を見極める力が求められている。

筆者が今最も重要だと言っていることは？`,
      choices: ["情報の量", "質を見極める力", "情報の速さ", "情報の発信力"],
      correctIndex: 1,
      explanation: "正解は「質を見極める力」です。",
      sectionId: "reading",
    },
    {
      id: 88,
      question: `仕事での成功はスキルだけでは得られない。周囲との協力関係を築く「人間力」が不可欠なのである。

成功のために何が必要だと言っていますか。`,
      choices: ["専門スキル", "人間力", "給料", "運"],
      correctIndex: 1,
      explanation: "正解は「人間力」です。",
      sectionId: "reading",
    },
    {
      id: 89,
      question: `SNSの手軽さゆえに、言葉の重みが失われているのではないか。誰もが発信者になれるからこそ注意が必要だ。

筆者が危惧していることは何ですか。`,
      choices: ["SNSの操作", "言葉の重みの喪失", "ネットの速度", "友達の数"],
      correctIndex: 1,
      explanation: "正解は「言葉の重みの喪失」です。",
      sectionId: "reading",
    },
    {
      id: 90,
      question: `「好きこそものの上手なれ」は真理だ。楽しんで取り組む姿勢こそが、上達への最短距離なのである。

上達するための最も良い方法は何ですか。`,
      choices: ["厳しい練習", "楽しんで取り組む", "長時間労働", "高い月謝"],
      correctIndex: 1,
      explanation: "正解は「楽しんで取り組む」です。",
      sectionId: "reading",
    },
    {
      id: 91,
      question: `都会は便利だが自然が少ない。週末だけでも田舎へ行き、心身をリフレッシュさせることが必要だ。

現代人にとって何が必要だと言っていますか。`,
      choices: ["都会での仕事", "田舎でのリフレッシュ", "便利な道具", "節約"],
      correctIndex: 1,
      explanation: "正解は「田舎でのリフレッシュ」です。",
      sectionId: "reading",
    },
    {
      id: 92,
      question: `科学の発展に伴い生活は便利になったが、環境問題も深刻化している。我々は責任を持つべきだ。

科学の発展についてどう述べていますか。`,
      choices: ["良いことしかない", "便利だが問題も出た", "発展は不要だ", "昔の方が良かった"],
      correctIndex: 1,
      explanation: "正解は「便利だが問題も出た」です。",
      sectionId: "reading",
    },
    {
      id: 93,
      question: `言葉の意味は時代とともに変わる。昔は失礼だった言葉が、今は親しみを表すこともある。

言葉の変化について正しいのはどれですか。`,
      choices: ["変化は悪いことだ", "意味が変わる場合がある", "昔の言葉が正しい", "変化は止まった"],
      correctIndex: 1,
      explanation: "正解は「意味が変わる場合がある」です。",
      sectionId: "reading",
    },
    {
      id: 94,
      question: `失敗を恐れて何もしないより、挑戦して失敗するほうが価値がある。その経験が将来に活きるからだ。

なぜ挑戦が大切なのですか。`,
      choices: ["失敗しないから", "経験が将来に役立つ", "褒められるから", "楽だから"],
      correctIndex: 1,
      explanation: "正解は「経験が将来に役立つ」です。",
      sectionId: "reading",
    },
    {
      id: 95,
      question: `睡眠不足は健康だけでなく効率も下げる。休むことは働くことと同じくらい重要だ。

休息についてどう述べていますか。`,
      choices: ["無駄な時間だ", "働くのと同様に重要だ", "寝すぎてはいけない", "効率に関係ない"],
      correctIndex: 1,
      explanation: "正解は「働くのと同様に重要だ」です。",
      sectionId: "reading",
    },
    {
      id: 96,
      question: `読書は他者の人生を体験する手段だ。本を開けば、時間も場所も超えて旅ができる。

読書の利点は何ですか。`,
      choices: ["字が上手くなる", "他者の人生を体験できる", "安上がりな趣味だ", "運動になる"],
      correctIndex: 1,
      explanation: "正解は「他者の人生を体験できる」です。",
      sectionId: "reading",
    },
    {
      id: 97,
      question: `伝統を維持するには、形を守るだけでなく、今の時代に合わせて変化させる勇気も必要だ。

伝統を維持するために必要なことは？`,
      choices: ["形だけを守る", "時代に合わせた変化", "変化を拒むこと", "寄付を集めること"],
      correctIndex: 1,
      explanation: "正解は「時代に合わせた変化」です。",
      sectionId: "reading",
    },
    {
      id: 98,
      question: `相手の目を見て話すことは信頼関係の基本だ。言葉以上に、視線が誠実さを物語る。

信頼関係において何が大切ですか。`,
      choices: ["難しい言葉", "相手の目を見ること", "声の大きさ", "服装"],
      correctIndex: 1,
      explanation: "正解は「相手の目を見ること」です。",
      sectionId: "reading",
    },
    {
      id: 99,
      question: `集中力を高めるには、適度な休憩が欠かせない。90分作業したら10分休むのが理想だ。

理想的な作業スタイルはどれですか。`,
      choices: ["休憩なしで続ける", "適度な休憩を挟む", "3時間一気にやる", "毎日違う時間にやる"],
      correctIndex: 1,
      explanation: "正解は「適度な休憩を挟む」です。",
      sectionId: "reading",
    },
    {
      id: 100,
      question: `記録を残すことは、過去の自分と対話することだ。日記は、未来の自分への贈り物になる。

筆者は日記をどう捉えていますか。`,
      choices: ["面倒な作業", "未来への贈り物", "秘密の暴露", "漢字の練習"],
      correctIndex: 1,
      explanation: "正解は「未来への贈り物」です。",
      sectionId: "reading",
    },
    {
      id: 101,
      question: `女：部長、お呼びでしょうか。男：あ、佐藤さん。明日のプレゼン、資料はもうできてる？女：はい、田中さんにも確認していただきました。男：そうか、安心だ。

資料は今どのような状態ですか。`,
      choices: ["まだできていない", "確認も終わっている", "田中さんが作っている", "これから作る"],
      correctIndex: 1,
      explanation: "正解は「確認も終わっている」です。",
      sectionId: "listening",
    },
    {
      id: 102,
      question: `男：プロジェクトが進まないね。女：予算のせいでしょうか。男：それもあるけど、チーム内のコミュニケーションが足りてない気がするんだ。

男の人が考える、進まない原因は？`,
      choices: ["予算不足", "上司が厳しい", "コミュニケーション不足", "時間不足"],
      correctIndex: 2,
      explanation: "正解は「コミュニケーション不足」です。",
      sectionId: "listening",
    },
    {
      id: 103,
      question: `駅：ただいま信号点検を行っております。運転を見合わせております。再開には1時間ほどかかる見込みです。

今、電車はどうなっていますか。`,
      choices: ["動いている", "止まっている", "遅れて動いている", "事故で壊れた"],
      correctIndex: 1,
      explanation: "正解は「止まっている」です。",
      sectionId: "listening",
    },
    {
      id: 104,
      question: `女：映画、売り切れだって。男：残念。女：代わりに美術館に行ってみない？新しい展覧会が始まったよ。男：そうだね、そうしよう。

二人はこれからどこへ行きますか。`,
      choices: ["映画館", "美術館", "家", "チケット売り場"],
      correctIndex: 1,
      explanation: "正解は「美術館」です。",
      sectionId: "listening",
    },
    {
      id: 105,
      question: `先生：文法はいいですが、自分の言葉で表現している人が少なかったのが残念です。次回は自分の経験を書いてください。

先生は次回の作文で何をしてほしい？`,
      choices: ["文法を直す", "教科書を写す", "自分の経験を書く", "早く出す"],
      correctIndex: 2,
      explanation: "正解は「自分の経験を書く」です。",
      sectionId: "listening",
    },
    {
      id: 106,
      question: `男：このエアコン、全然冷えないね。女：フィルター掃除した？男：昨日やったけど。女：じゃあガス漏れかな。修理呼ばないと。男：わかった、電話するよ。

男の人はこれから何をしますか。`,
      choices: ["掃除をする", "修理を呼ぶ", "窓を開ける", "新しいのを買う"],
      correctIndex: 1,
      explanation: "正解は「修理を呼ぶ」です。",
      sectionId: "listening",
    },
    {
      id: 107,
      question: `女：明日10時に駅ね。男：あ、明日は工事で電車が遅れるらしいよ。15分早めに出よう。女：わかった。じゃあ駅で9時45分ね。男：うん。

二人は明日、何時に駅で会いますか。`,
      choices: ["10時", "9:45", "10:15", "9時"],
      correctIndex: 1,
      explanation: "正解は「9:45」です。",
      sectionId: "listening",
    },
    {
      id: 108,
      question: `客：コーヒー1つ。あ、やっぱり紅茶。店員：かしこまりました。ミルクは入れますか？客：いえ、レモンで。店員：承知しました。

客は何を注文しましたか。`,
      choices: ["ミルクコーヒー", "レモンティー", "ミルクティー", "ブラックコーヒー"],
      correctIndex: 1,
      explanation: "正解は「レモンティー」です。",
      sectionId: "listening",
    },
    {
      id: 109,
      question: `男：引っ越しの手伝い、10時でいい？女：ごめん、荷作りが遅れてて。1時間後にしてもらえる？男：了解。じゃあ11時に行くよ。

男の人は何時に手伝いに行きますか。`,
      choices: ["10時", "11時", "12時", "9時"],
      correctIndex: 1,
      explanation: "正解は「11時」です。",
      sectionId: "listening",
    },
    {
      id: 110,
      question: `女：この服、どう？男：似合ってるけど、ちょっと派手じゃない？女：そうかな。パーティー用だからいいと思って。男：それならいいかもね。

男の人は服についてどう思っていますか。`,
      choices: ["似合わない", "派手すぎる", "パーティーに合う", "安っぽい"],
      correctIndex: 1,
      explanation: "正解は「派手すぎる」です。",
      sectionId: "listening",
    },
    {
      id: 111,
      question: `アナウンス：迷子のお知らせです。5歳の男の子、青いTシャツに白いズボンを履いています。お心当たりの方は受付まで。

迷子の男の子はどんな服装ですか。`,
      choices: ["赤いシャツ", "青いシャツに白ズボン", "白いシャツに青ズボン", "黄色いシャツ"],
      correctIndex: 1,
      explanation: "正解は「青いシャツに白ズボン」です。",
      sectionId: "listening",
    },
    {
      id: 112,
      question: `女：お腹空いたね。ラーメンにする？男：昨日の夜もラーメンだったんだ。今日は和食がいいな。女：じゃあ、あそこの定食屋さんは？男：賛成。

二人はこれから何を何を食べますか。`,
      choices: ["ラーメン", "和食（定食）", "イタリアン", "中華"],
      correctIndex: 1,
      explanation: "正解は「和食（定食）」です。",
      sectionId: "listening",
    },
    {
      id: 113,
      question: `男：会議の資料、20部コピーして。あ、やっぱり25部。1人は欠席だけど予備が必要だから。女：わかりました。

資料を何部コピーしますか。`,
      choices: ["20部", "25部", "1部", "24部"],
      correctIndex: 1,
      explanation: "正解は「25部」です。",
      sectionId: "listening",
    },
    {
      id: 114,
      question: `女：お先に失礼します。男：あ、お疲れ様。あ、悪いけど、帰りにこの手紙、ポストに出してくれる？女：はい、いいですよ。

女の人はこれから何をしますか。`,
      choices: ["手紙を書く", "ポストに出す", "会議に出る", "残業をする"],
      correctIndex: 1,
      explanation: "正解は「ポストに出す」です。",
      sectionId: "listening",
    },
    {
      id: 115,
      question: `先生：来週のテストは、1章から3章までです。4章は出しません。辞書は使ってもいいですよ。

テストの範囲はどこですか。`,
      choices: ["4章まで", "1章から3章まで", "全部", "辞書の内容"],
      correctIndex: 1,
      explanation: "正解は「1章から3章まで」です。",
      sectionId: "listening",
    },
    {
      id: 116,
      question: `男：雨が降ってきた。傘持ってる？女：あ、車の中に忘れてきた。男：じゃあ、僕のを使おう。一緒に入って。女：ありがとう。

二人はどうしますか。`,
      choices: ["車に戻る", "1つの傘に入る", "傘を買う", "雨の中を走る"],
      correctIndex: 1,
      explanation: "正解は「1つの傘に入る」です。",
      sectionId: "listening",
    },
    {
      id: 117,
      question: `女：このケーキ、おいしい！男：でしょ？行列ができる店なんだ。女：1時間も並んだの？男：いや、ネットで予約したからすぐ買えたよ。

男の人はどうやってケーキを買いましたか。`,
      choices: ["行列に並んだ", "ネットで予約した", "友達にもらった", "自分で作った"],
      correctIndex: 1,
      explanation: "正解は「ネットで予約した」です。",
      sectionId: "listening",
    },
    {
      id: 118,
      question: `男：明日の登山、天気大丈夫かな。女：午後は雷が鳴るって。午前中に下りてこよう。男：そうだね。早めに出発しよう。

二人は登山をどうしますか。`,
      choices: ["中止する", "午前中に下りる", "午後から登る", "頂上で泊まる"],
      correctIndex: 1,
      explanation: "正解は「午前中に下りる」です。",
      sectionId: "listening",
    },
    {
      id: 119,
      question: `女：新しいスマホ、どう？男：画面はきれいだけど、電池がすぐなくなるんだ。前のほうが長持ちしたな。女：設定を変えたら？

男の人はスマホの何に不満がありますか。`,
      choices: ["画面のきれいさ", "電池の持ち", "大きさ", "値段"],
      correctIndex: 1,
      explanation: "正解は「電池の持ち」です。",
      sectionId: "listening",
    },
    {
      id: 120,
      question: `男：すみません、市役所へはどう行けばいいですか。女：この道をまっすぐ行って、2つ目の角を右です。郵便局の隣ですよ。男：ありがとうございます。

市役所はどこにありますか。`,
      choices: ["1つ目の角", "郵便局の隣", "左に曲がった所", "駅の中"],
      correctIndex: 1,
      explanation: "正解は「郵便局の隣」です。",
      sectionId: "listening",
    },
  ],
}
