import type { Quiz } from "@/app/data/types"

export const japaneseN4Quiz: Quiz = {
  id: "japanese-n4",
  title: "日本語検定 N4",
  description: "日本語能力試験 N4 レベル（全135問：聴解5問追加）",
  sections: [
    { id: "moji-goi", label: "文字・語彙" },
    { id: "bunpo", label: "文法" },
    { id: "reading", label: "読解" },
  
    { id: "listening", label: "聴解" },
  ],
  questions: [
    {
      id: 1,
      sectionId: "moji-goi",
      question: `毎朝、家の近くを（さんぽ）します。
（さんぽ）の漢字は？`,
      choices: ["散歩", "山歩", "算歩", "散法"],
      correctIndex: 0,
      explanation:
        "正解は「散歩」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 2,
      sectionId: "moji-goi",
      question: `この料理は（あじ）がうすいです。
（あじ）の漢字は？`,
      choices: ["足", "悪", "味", "暗"],
      correctIndex: 2,
      explanation:
        "正解は「味」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 3,
      sectionId: "moji-goi",
      question: `（きゅうこう）列車に乗れば、早く着きます。
（きゅうこう）の漢字は？`,
      choices: ["急行", "急通", "吸行", "休行"],
      correctIndex: 0,
      explanation:
        "正解は「急行」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 4,
      sectionId: "moji-goi",
      question: `（かいがん）で写真を撮りました。
（かいがん）の漢字は？`,
      choices: ["会館", "海岸", "海外", "海関"],
      correctIndex: 1,
      explanation:
        "正解は「海岸」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 5,
      sectionId: "moji-goi",
      question: `近くのコンビニの（てんいん）さんは、とても親切です。
（てんいん）の漢字は？`,
      choices: ["店員", "店人", "点員", "店内"],
      correctIndex: 0,
      explanation:
        "正解は「店員」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 6,
      sectionId: "moji-goi",
      question: `この工事は（きかん）を延ばしました。
（きかん）の漢字は？`,
      choices: ["期間", "機関", "帰還", "規刊"],
      correctIndex: 0,
      explanation:
        "正解は「期間」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 7,
      sectionId: "moji-goi",
      question: `仕事を（さがして）います。
（さがして）の漢字は？`,
      choices: ["探して", "捜して", "察して", "索して"],
      correctIndex: 0,
      explanation:
        "正解は「探して」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 8,
      sectionId: "moji-goi",
      question: `この説明の（つかいかた）がわかりません。
（つかいかた）の漢字は？`,
      choices: ["使い方", "使方", "使用方", "使い形"],
      correctIndex: 0,
      explanation:
        "正解は「使い方」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 9,
      sectionId: "moji-goi",
      question: `この場所は（きけん）です。
（きけん）の漢字は？`,
      choices: ["危険", "危検", "鬼見", "危建"],
      correctIndex: 0,
      explanation:
        "正解は「危険」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 10,
      sectionId: "moji-goi",
      question: `明日の旅行の（じゅんび）は、もう終わりましたか。
（じゅんび）の漢字は？`,
      choices: ["準備", "準美", "久敬", "准備"],
      correctIndex: 0,
      explanation:
        "正解は「準備」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 11,
      sectionId: "moji-goi",
      question: `会議の（よてい）を確認します。
（よてい）の漢字は？`,
      choices: ["予定", "予低", "余定", "与定"],
      correctIndex: 0,
      explanation:
        "正解は「予定」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 12,
      sectionId: "moji-goi",
      question: `朝は（しんぶん）を読みます。
（しんぶん）の漢字は？`,
      choices: ["新聞", "新分", "深文", "信聞"],
      correctIndex: 0,
      explanation:
        "正解は「新聞」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 13,
      sectionId: "moji-goi",
      question: `水を（のむ）と元気になります。
（のむ）の漢字は？`,
      choices: ["飲む", "食む", "呑む", "飲も"],
      correctIndex: 0,
      explanation:
        "正解は「飲む」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 14,
      sectionId: "moji-goi",
      question: `電車が（こんで）います。
（こんで）の漢字は？`,
      choices: ["混んで", "込んで", "困んで", "昆んで"],
      correctIndex: 0,
      explanation:
        "正解は「混んで」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 15,
      sectionId: "moji-goi",
      question: `今日は（きおん）が高いです。
（きおん）の漢字は？`,
      choices: ["気温", "気音", "木温", "気恩"],
      correctIndex: 0,
      explanation:
        "正解は「気温」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 16,
      sectionId: "moji-goi",
      question: `家の近くを（さんぽ）します。
（さんぽ）の漢字は？`,
      choices: ["散歩", "山歩", "算歩", "散法"],
      correctIndex: 0,
      explanation:
        "正解は「散歩」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 17,
      sectionId: "moji-goi",
      question: `道が（せまい）ので気をつけてください。
（せまい）の漢字は？`,
      choices: ["狭い", "窄い", "侠い", "挟い"],
      correctIndex: 0,
      explanation:
        "正解は「狭い」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 18,
      sectionId: "moji-goi",
      question: `この映画は（ゆうめい）です。
（ゆうめい）の漢字は？`,
      choices: ["有名", "友明", "由命", "勇名"],
      correctIndex: 0,
      explanation:
        "正解は「有名」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 19,
      sectionId: "moji-goi",
      question: `この仕事は（かんたん）です。
（かんたん）の漢字は？`,
      choices: ["簡単", "間単", "簡丹", "管短"],
      correctIndex: 0,
      explanation:
        "正解は「簡単」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 20,
      sectionId: "moji-goi",
      question: `この問題は（むずかしい）です。
（むずかしい）の漢字は？`,
      choices: ["難しい", "難かしい", "無図かしい", "難し"],
      correctIndex: 0,
      explanation:
        "正解は「難しい」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 21,
      sectionId: "moji-goi",
      question: `ここは（しずか）です。
（しずか）の漢字は？`,
      choices: ["静か", "靖か", "青か", "清か"],
      correctIndex: 0,
      explanation:
        "正解は「静か」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 22,
      sectionId: "moji-goi",
      question: `友だちに（あう）約束があります。
（あう）の漢字は？`,
      choices: ["会う", "合う", "逢う", "遭う"],
      correctIndex: 0,
      explanation:
        "正解は「会う」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 23,
      sectionId: "moji-goi",
      question: `雨が（ふる）ので、傘を持って行きます。
（ふる）の漢字は？`,
      choices: ["降る", "振る", "布る", "古る"],
      correctIndex: 0,
      explanation:
        "正解は「降る」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 24,
      sectionId: "moji-goi",
      question: `会議の資料を（わすれました）。
（わすれました）の漢字は？`,
      choices: ["忘れました", "忙れました", "亡れました", "妄れました"],
      correctIndex: 0,
      explanation:
        "正解は「忘れました」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
    {
      id: 25,
      sectionId: "moji-goi",
      question: `薬を（のこす）のはよくないです。
（のこす）の漢字は？`,
      choices: ["残す", "存す", "在す", "浅す"],
      correctIndex: 0,
      explanation:
        "正解は「残す」です。 読み（かな）に対応する漢字を選びます。迷ったら、前後の文脈（何をする/どんな状態）で意味を確認しましょう。",
    },
        {
      id: 26,
      sectionId: "moji-goi",
      question: `試験の結果が（ ）で、夜も眠れません。
空欄に入る言葉は？`,
      choices: ["安心", "心配", "丁寧", "複雑"],
      correctIndex: 1,
      explanation:
        "正解は「心配」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 27,
      sectionId: "moji-goi",
      question: `（ ）していたので、駅まで走りました。
空欄に入る言葉は？`,
      choices: ["遅刻", "準備", "仕事", "注文"],
      correctIndex: 0,
      explanation:
        "正解は「遅刻」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 28,
      sectionId: "moji-goi",
      question: `この料理は（ ）が強いです。
空欄に入る言葉は？`,
      choices: ["温度", "味", "色", "場所"],
      correctIndex: 1,
      explanation:
        "正解は「味」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 29,
      sectionId: "moji-goi",
      question: `朝ごはんを（ ）と、午前中つらいです。
空欄に入る言葉は？`,
      choices: ["抜く", "落とす", "忘れる", "止める"],
      correctIndex: 0,
      explanation:
        "正解は「抜く」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 30,
      sectionId: "moji-goi",
      question: `この電車は（ ）で止まりました。
空欄に入る言葉は？`,
      choices: ["事故", "記号", "自動", "自転車"],
      correctIndex: 0,
      explanation:
        "正解は「事故」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 31,
      sectionId: "moji-goi",
      question: `友だちに（ ）をしました。
空欄に入る言葉は？`,
      choices: ["電話", "電気", "伝統", "天気"],
      correctIndex: 0,
      explanation:
        "正解は「電話」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 32,
      sectionId: "moji-goi",
      question: `この部屋はとても（ ）です。
空欄に入る言葉は？`,
      choices: ["綺麗", "危険", "簡単", "有名"],
      correctIndex: 0,
      explanation:
        "正解は「綺麗」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 33,
      sectionId: "moji-goi",
      question: `日本の（ ）を学びたいです。
空欄に入る言葉は？`,
      choices: ["文化", "分科", "文家", "文下"],
      correctIndex: 0,
      explanation:
        "正解は「文化」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 34,
      sectionId: "moji-goi",
      question: `この仕事は（ ）です。
空欄に入る言葉は？`,
      choices: ["大変", "大辺", "体変", "代変"],
      correctIndex: 0,
      explanation:
        "正解は「大変」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 35,
      sectionId: "bunpo",
      question: `日本（ ）アニメは世界で人気があります。
（ ）に入る助詞は？`,
      choices: ["の", "に", "を", "が"],
      correctIndex: 0,
      explanation:
        "正解は「の」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 36,
      sectionId: "bunpo",
      question: `私は毎日7時（ ）起きます。
（ ）に入る助詞は？`,
      choices: ["に", "で", "を", "が"],
      correctIndex: 0,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 37,
      sectionId: "bunpo",
      question: `友だち（ ）電話をしました。
（ ）に入る助詞は？`,
      choices: ["に", "を", "で", "が"],
      correctIndex: 0,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 38,
      sectionId: "bunpo",
      question: `この本は日本語の勉強（ ）役に立ちます。
（ ）に入る助詞は？`,
      choices: ["に", "を", "で", "が"],
      correctIndex: 0,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 39,
      sectionId: "bunpo",
      question: `雨が降った（ ）、試合は中止になりました。
（ ）に入るのは？`,
      choices: ["ので", "のに", "から", "まで"],
      correctIndex: 0,
      explanation: "正解は「ので」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 40,
      sectionId: "bunpo",
      question: `この店は安い（ ）、おいしいです。
（ ）に入るのは？`,
      choices: ["し", "ので", "のに", "まで"],
      correctIndex: 0,
      explanation: "正解は「し」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 41,
      sectionId: "bunpo",
      question: `勉強し（ ）から、寝ます。
（ ）に入るのは？`,
      choices: ["て", "た", "で", "に"],
      correctIndex: 0,
      explanation: "正解は「て」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 42,
      sectionId: "bunpo",
      question: `明日、雨が（ ）でしょう。
（ ）に入るのは？`,
      choices: ["降る", "降り", "降って", "降った"],
      correctIndex: 0,
      explanation: "正解は「降る」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 43,
      sectionId: "bunpo",
      question: `もう一度説明して（ ）ませんか。
（ ）に入るのは？`,
      choices: ["くれ", "くれる", "ください", "もらい"],
      correctIndex: 2,
      explanation: "正解は「ください」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 44,
      sectionId: "bunpo",
      question: `この問題は難しく（ ）ません。
（ ）に入るのは？`,
      choices: ["あり", "い", "なり", "する"],
      correctIndex: 0,
      explanation: "正解は「あり」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 45,
      sectionId: "bunpo",
      question: `「いらっしゃいませ」はどんな場面で言いますか。
正しいものを選んでください。`,
      choices: ["店で客を迎えるとき", "友だちに会ったとき", "先生に注意するとき", "電話を切るとき"],
      correctIndex: 0,
      explanation: "正解は「店で客を迎えるとき」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 46,
      sectionId: "bunpo",
      question: `先生に資料を渡すとき、何と言いますか。
正しいものを選んでください。`,
      choices: ["どうぞ", "ちょうだい", "やれ", "くれ"],
      correctIndex: 0,
      explanation: "正解は「どうぞ」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 47,
      sectionId: "bunpo",
      question: `上司に「見ます」の丁寧な言い方は？`,
      choices: ["拝見します", "見える", "見せる", "見るです"],
      correctIndex: 0,
      explanation: "正解は「拝見します」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 48,
      sectionId: "bunpo",
      question: `会社で「言います」の丁寧な言い方は？`,
      choices: ["申します", "言うです", "話す", "伝える"],
      correctIndex: 0,
      explanation: "正解は「申します」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 49,
      sectionId: "bunpo",
      question: `「社長は来ます」の丁寧な言い方は？`,
      choices: ["社長は来られます", "社長は来るです", "社長は来ますです", "社長は来ているです"],
      correctIndex: 0,
      explanation: "正解は「社長は来られます」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 50,
      sectionId: "bunpo",
      question: `田中さん（ ）会いました。
（ ）に入る助詞は？`,
      choices: ["に", "を", "で", "が"],
      correctIndex: 0,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
        {
      id: 51,
      sectionId: "bunpo",
      question: `家（ ）帰ります。
（ ）に入る助詞は？`,
      choices: ["が", "へ", "を", "で"],
      correctIndex: 1,
      explanation:
        "正解は「へ」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 52,
      sectionId: "bunpo",
      question: `学校（ ）勉強します。
（ ）に入る助詞は？`,
      choices: ["で", "に", "を", "へ"],
      correctIndex: 0,
      explanation:
        "正解は「で」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 53,
      sectionId: "bunpo",
      question: `日本（ ）来ました。
（ ）に入る助詞は？`,
      choices: ["も", "に", "で", "を"],
      correctIndex: 1,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 54,
      sectionId: "bunpo",
      question: `机の上（ ）本があります。
（ ）に入る助詞は？`,
      choices: ["に", "で", "を", "へ"],
      correctIndex: 0,
      explanation:
        "正解は「に」です。 助詞は「だれが/だれに/なにを/どこで/どこへ/いつ」を当てはめると選びやすいです。",
    },
    {
      id: 55,
      sectionId: "bunpo",
      question: ` 1.図書館 2.で 3.勉強 4.します。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["図書館", "で", "勉強", "します"],
      correctIndex: 2,
      explanation:
        "正解は「勉強」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 56,
      sectionId: "bunpo",
      question: ` 1.友だち 2.に 3.会い 4.ます。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["友だち", "に", "会い", "ます"],
      correctIndex: 2,
      explanation:
        "正解は「会い」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 57,
      sectionId: "bunpo",
      question: ` 1.映画 2.を 3.見 4.ます。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["映画", "を", "見", "ます"],
      correctIndex: 2,
      explanation:
        "正解は「見」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 58,
      sectionId: "bunpo",
      question: ` 1.雨 2.が 3.降り 4.ます。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["雨", "が", "降り", "ます"],
      correctIndex: 2,
      explanation:
        "正解は「降り」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 59,
      sectionId: "bunpo",
      question: `明日、（　）ので早く寝ます。
（　）に入る言葉を選んでください。`,
      choices: ["仕事がある", "仕事をある", "仕事がいる", "仕事にある"],
      correctIndex: 0,
      explanation: "正解は「仕事がある」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 60,
      sectionId: "bunpo",
      question: `今日は雨（　）、出かけません。
（　）に入る言葉を選んでください。`,
      choices: ["なので", "のに", "まで", "でも"],
      correctIndex: 0,
      explanation: "正解は「なので」です。 文全体の意味（理由・逆接・並列・順序）に合う形を選びます。",
    },
    {
      id: 61,
      sectionId: "bunpo",
      question: `すみません、もう一度（　）ください。
（　）に入る言葉を選んでください。`,
      choices: ["言って", "言い", "言う", "言った"],
      correctIndex: 0,
      explanation: "正解は「言って」です。 丁寧さのレベル（目上/お客様）に合わせた表現を選びます。",
    },
    {
      id: 62,
      sectionId: "moji-goi",
      question: `駅で（　）を買いました。
（　）に入る言葉を選んでください。`,
      choices: ["切符", "切手", "封筒", "新聞紙"],
      correctIndex: 0,
      explanation:
        "正解は「切符」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 63,
      sectionId: "moji-goi",
      question: `授業が終わったら（　）します。
（　）に入る言葉を選んでください。`,
      choices: ["復習", "予習", "勉強中", "試験中"],
      correctIndex: 0,
      explanation:
        "正解は「復習」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 64,
      sectionId: "moji-goi",
      question: `道が暗いですから、足元に（　）して歩いてください。
（　）に入る言葉を選んでください。`,
      choices: ["注意", "中意", "注文", "面談"],
      correctIndex: 0,
      explanation:
        "正解は「注意」です。 その場面で自然に使う語を選びます。似た語があるときは「何について/誰に/どこで使うか」で区別します。",
    },
    {
      id: 65,
      sectionId: "reading",
      question: `【お知らせ】明日は台風のため学校は休みです。
明日、学校はどうなりますか。`,
      choices: ["あります", "休みです", "早く終わります", "午後だけあります"],
      correctIndex: 1,
      explanation:
        "正解は「休みです」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 66,
      sectionId: "reading",
      question: `【注意】この建物は工事中なので入れません。
この建物は今どうですか。`,
      choices: ["入れます", "工事中です", "開いています", "閉館です"],
      correctIndex: 1,
      explanation:
        "正解は「工事中です」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },

    // ✅ ここから “成立しない” を修正済み（67/68/69/73）
    {
      id: 67,
      sectionId: "bunpo",
      question: `図書館では 1.静かに 2.しなければ 3.いけません 4.。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["静かに", "しなければ", "いけません", "。"],
      correctIndex: 2,
      explanation:
        "正解は「いけません」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 68,
      sectionId: "bunpo",
      question: `田中さんは 1.ギターも 2.歌も 3.上手です 4.。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["ギターも", "歌も", "上手です", "。"],
      correctIndex: 2,
      explanation:
        "正解は「上手です」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 69,
      sectionId: "bunpo",
      question: `昨日は 1.ずっと 2.仕事が 3.あったので 4.忙しかったです。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["ずっと", "仕事が", "あったので", "忙しかったです"],
      correctIndex: 2,
      explanation:
        "正解は「あったので」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 70,
      sectionId: "bunpo",
      question: `この 1.意味 2.どういう 3.言葉は 4.なん ですか。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["意味", "どういう", "言葉は", "なん"],
      correctIndex: 0,
      explanation:
        "正解は「意味」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 71,
      sectionId: "bunpo",
      question: `私は 1.新しい 2.買う 3.車 4.を つもりです。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["新しい", "買う", "車", "を"],
      correctIndex: 2,
      explanation:
        "正解は「車」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 72,
      sectionId: "bunpo",
      question: `ここで 1.たばこを 2.吸っては 3.いけません 4.。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["たばこを", "吸っては", "いけません", "。"],
      correctIndex: 2,
      explanation:
        "正解は「いけません」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 73,
      sectionId: "bunpo",
      question: `掃除を 1.したので 2.部屋が 3.とても 4.きれいに なりました。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["したので", "部屋が", "とても", "きれいに"],
      correctIndex: 2,
      explanation:
        "正解は「とても」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 74,
      sectionId: "bunpo",
      question: `昨日 1.見た 2.映画は 3.とても 4.おもしろかったです。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["見た", "映画は", "とても", "おもしろかったです"],
      correctIndex: 2,
      explanation:
        "正解は「とても」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
    {
      id: 75,
      sectionId: "bunpo",
      question: `私は 1.毎日 2.日本語を 3.勉強 4.しています。
★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["毎日", "日本語を", "勉強", "しています"],
      correctIndex: 2,
      explanation:
        "正解は「勉強」です。 並び替えは、①文末（です/ます/でした等）②助詞（に/を/で/が）③修飾語（とても/静かに）を手がかりに組み立てます。",
    },
        {
      id: 76,
      sectionId: "bunpo",
      question: `田中先生。先日は（☆）ありがとうございました。
☆に入る言葉は？`,
      choices: ["おかげさまで", "こちらこそ", "どうも", "大変"],
      correctIndex: 2,
      explanation:
        "正解は「どうも」です。 前後のつながり（主語・目的語・時制）を見て自然な語を入れます。",
    },
    {
      id: 77,
      sectionId: "bunpo",
      question: `電車が（☆）ので、遅れました。
☆に入る言葉は？`,
      choices: ["混んだ", "混む", "混んでいた", "混みます"],
      correctIndex: 2,
      explanation:
        "正解は「混んでいた」です。 前後のつながり（主語・目的語・時制）を見て自然な語を入れます。",
    },
    {
      id: 78,
      sectionId: "bunpo",
      question: `今日は（☆）寒いですね。
☆に入る言葉は？`,
      choices: ["とても", "たくさん", "すぐ", "だんだん"],
      correctIndex: 0,
      explanation:
        "正解は「とても」です。 前後のつながり（主語・目的語・時制）を見て自然な語を入れます。",
    },
    {
      id: 79,
      sectionId: "bunpo",
      question: `毎日少しずつ練習すると（☆）なります。
☆に入る言葉は？`,
      choices: ["上手", "上手に", "上手だ", "上手です"],
      correctIndex: 0,
      explanation:
        "正解は「上手」です。 前後のつながり（主語・目的語・時制）を見て自然な語を入れます。",
    },
    {
      id: 80,
      sectionId: "bunpo",
      question: `明日は雨が（☆）かもしれません。
☆に入る言葉は？`,
      choices: ["降る", "降り", "降って", "降った"],
      correctIndex: 0,
      explanation:
        "正解は「降る」です。 前後のつながり（主語・目的語・時制）を見て自然な語を入れます。",
    },
    {
      id: 81,
      sectionId: "reading",
      question: `【案内】次の電車は10分遅れています。
次の電車はどうですか。`,
      choices: ["早いです", "遅れています", "来ません", "止まりました"],
      correctIndex: 1,
      explanation:
        "正解は「遅れています」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 82,
      sectionId: "reading",
      question: `【掲示】図書館は毎週月曜日が休みです。
図書館はいつ休みですか。`,
      choices: ["毎日", "月曜日", "火曜日", "土曜日"],
      correctIndex: 1,
      explanation:
        "正解は「月曜日」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 83,
      sectionId: "reading",
      question: `【メール】明日の会議は3時からです。
会議は何時からですか。`,
      choices: ["1時", "2時", "3時", "4時"],
      correctIndex: 2,
      explanation:
        "正解は「3時」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 84,
      sectionId: "reading",
      question: `【案内】この店は10時に開きます。
店は何時に開きますか。`,
      choices: ["8時", "9時", "10時", "11時"],
      correctIndex: 2,
      explanation:
        "正解は「10時」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 85,
      sectionId: "reading",
      question: `【掲示】ゴミは火曜日と金曜日に出してください。
ゴミはいつ出しますか。`,
      choices: ["月曜日と木曜日", "火曜日と金曜日", "水曜日と土曜日", "日曜日だけ"],
      correctIndex: 1,
      explanation:
        "正解は「火曜日と金曜日」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 86,
      sectionId: "reading",
      question: `【注意】ここではたばこを吸わないでください。
ここでたばこは？`,
      choices: ["吸ってもいい", "吸ってはいけない", "吸う人が多い", "わかりません"],
      correctIndex: 1,
      explanation:
        "正解は「吸ってはいけない」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 87,
      sectionId: "reading",
      question: `【お知らせ】本日の受付は午後5時までです。
受付は何時までですか。`,
      choices: ["3時", "4時", "5時", "6時"],
      correctIndex: 2,
      explanation:
        "正解は「5時」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 88,
      sectionId: "reading",
      question: `【掲示】このバスは駅前に止まります。
バスはどこに止まりますか。`,
      choices: ["学校前", "駅前", "病院前", "公園前"],
      correctIndex: 1,
      explanation:
        "正解は「駅前」です。 本文の言い換え・数字・日時・禁止表現（〜ないでください等）を根拠に選びます。",
    },
    {
      id: 89,
      sectionId: "reading",
      question: `木村さんへ。田中さんから電話で「明日の会議は10時ではなく11時から、場所は同じ会議室」と連絡がありました。佐藤より。
会議は何時に始まりますか。`,
      choices: ["10時", "11時", "12時", "未定"],
      correctIndex: 1,
      explanation:
        "正解は「11時」です。 本文の数字・変更点（10時→11時）を根拠に選びます。",
    },
    {
      id: 90,
      sectionId: "reading",
      question: `木村さんへ。田中さんから電話で「明日の会議は10時ではなく11時から、場所は同じ会議室」と連絡がありました。佐藤より。
木村さんは明日どこへ行けばいい？`,
      choices: ["田中さんの家", "同じ会議室", "駅前", "未定"],
      correctIndex: 1,
      explanation:
        "正解は「同じ会議室」です。 本文の場所情報（場所は同じ会議室）を根拠に選びます。",
    },
    {
      id: 91,
      sectionId: "reading",
      question: `【マナー】おじぎは、相手に感謝やあやまる気持ちを伝えるときにします。軽いおじぎは少し頭を下げ、深いおじぎは腰まで下げます。
おじぎは何のためにしますか。`,
      choices: ["眠いから", "感謝や謝罪を伝えるため", "運動のため", "外国人のため"],
      correctIndex: 1,
      explanation:
        "正解は「感謝や謝罪を伝えるため」です。 本文の目的説明（感謝やあやまる気持ち）を根拠に選びます。",
    },
    {
      id: 92,
      sectionId: "reading",
      question: `【マナー】おじぎは、相手に感謝やあやまる気持ちを伝えるときにします。軽いおじぎは少し頭を下げ、深いおじぎは腰まで下げます。
軽いおじぎはどうしますか。`,
      choices: ["腰まで下げる", "少し頭を下げる", "手を振る", "目を閉じる"],
      correctIndex: 1,
      explanation:
        "正解は「少し頭を下げる」です。 本文の定義（軽いおじぎ＝少し頭を下げる）を根拠に選びます。",
    },
    {
      id: 93,
      sectionId: "reading",
      question: `【マナー】おじぎは、相手に感謝やあやまる気持ちを伝えるときにします。軽いおじぎは少し頭を下げ、深いおじぎは腰まで下げます。
おじぎはどんなとき？`,
      choices: ["挨拶のみ", "お礼や謝罪時も", "外国人のみ", "勉強中"],
      correctIndex: 1,
      explanation:
        "正解は「お礼や謝罪時も」です。 本文の用途（感謝/あやまる気持ち）から判断します。",
    },
    {
      id: 94,
      sectionId: "reading",
      question: `【マナー】おじぎは、相手に感謝やあやまる気持ちを伝えるときにします。軽いおじぎは少し頭を下げ、深いおじぎは腰まで下げます。
「深く下げる」のはどんな時？`,
      choices: ["眠い", "少し感謝", "強い感謝・謝罪", "怒っている"],
      correctIndex: 2,
      explanation:
        "正解は「強い感謝・謝罪」です。 深いおじぎ＝腰まで下げる（丁寧/強い気持ち）の場面だと考えると分かりやすいです。",
    },
    {
      id: 95,
      sectionId: "reading",
      question: `【休館】図書館は工事のため5月1日〜7日休みます。返却は入り口横のポストに入れてください。
本を返したい人はどうしますか。`,
      choices: ["開館まで待つ", "郵便で送る", "ポストに入れる", "工事の人に渡す"],
      correctIndex: 2,
      explanation:
        "正解は「ポストに入れる」です。 本文の指示（返却はポスト）を根拠に選びます。",
    },

    // 96〜100は「CSVの残り（全100問）」に続きます：この下に残りを貼ってください
    // ※ ここで止まると100問にならないので、必ずPART4の最後まで貼ること！
   {
      id: 96,
      sectionId: "reading",
      question: `【ゴミ】燃える：月木。燃えない：第2第4水曜。ペット：金。※朝8時までに出してください。
燃えないゴミはいつ出せますか。`,
      choices: ["毎週水曜", "月2回", "金曜", "朝8時以降"],
      correctIndex: 1,
      explanation:
        "正解は「月2回」です。本文に「燃えない：第2第4水曜」とあり、月に2回（第2・第4）の決まりです。「毎週水曜」は“毎週”なので条件と合いません。「金曜」はペットボトルの曜日です。「朝8時以降」は時間のルール（※朝8時まで）と逆です。",
    },
    {
      id: 97,
      sectionId: "reading",
      question: `【ゴミ】燃える：月木。燃えない：第2第4水曜。ペット：金。※朝8時までに出してください。
ゴミ出し時間の決まりは？`,
      choices: ["いつでもよい", "夜に出す", "朝8時前に出す", "午後に出す"],
      correctIndex: 2,
      explanation:
        "正解は「朝8時前に出す」です。本文の「※朝8時までに出してください」は“8時より前（遅くとも8時まで）”という意味です。「いつでもよい」「夜」「午後」は、本文の時間指定と合いません。読解では※や注意書きが答えの根拠になりやすいので、必ず拾います。",
    },
    {
      id: 98,
      sectionId: "reading",
      question: `日本のお辞儀は挨拶、お礼、謝罪でします。深く下げるときは強い感謝や申し訳ない気持ちがあるときです。慣れれば自然にできます。
お辞儀をするのはどんなとき？`,
      choices: ["挨拶のみ", "お礼や謝罪時も", "外国人のみ", "勉強中"],
      correctIndex: 1,
      explanation:
        "正解は「お礼や謝罪時も」です。本文に「挨拶、お礼、謝罪でします」とあるので、挨拶だけではありません。「外国人のみ」「勉強中」は本文に根拠がなく不適切です。選択肢は“本文に書いてある内容の言い換え”を選ぶのが基本です。",
    },
    {
      id: 99,
      sectionId: "reading",
      question: `日本のお辞儀は挨拶、お礼、謝罪でします。深く下げるときは強い感謝や申し訳ない気持ちがあるときです。慣れれば自然にできます。
「深く下げる」のはどんな時？`,
      choices: ["眠い", "少し感謝", "強い感謝・謝罪", "怒っている"],
      correctIndex: 2,
      explanation:
        "正解は「強い感謝・謝罪」です。本文の「深く下げるときは強い感謝や申し訳ない気持ちがあるとき」がそのまま根拠です。「少し感謝」は“強い”と反対なので×。「眠い」「怒っている」も本文の説明と一致しません。",
    },
        {
      id: 100,
      sectionId: "reading",
      question: `【休館】図書館は工事のため5月1日〜7日休みます。返却は入り口横のポストに入れてください。
本を返したい人はどうしますか。`,
      choices: ["開館まで待つ", "郵便で送る", "ポストに入れる", "工事の人に渡す"],
      correctIndex: 2,
      explanation:
        "正解は「ポストに入れる」です。本文に具体的な指示があります。",
   },
    {
      id: 101,
      sectionId: "bunpo",
      question: `明日は休みだから、学校に行か（　）いいです。`,
      choices: ["なくては", "なくても", "ないで", "なければ"],
      correctIndex: 1,
      explanation: "「〜なくてもいい」は『〜する必要がない／しなくてよい』という許可・不要を表します。",
    },
    {
      id: 102,
      sectionId: "bunpo",
      question: `ここで写真を撮っては（　）。`,
      choices: ["いいです", "いけません", "ください", "しまいました"],
      correctIndex: 1,
      explanation: "「〜てはいけません」は禁止です。",
    },
    {
      id: 103,
      sectionId: "bunpo",
      question: `薬は毎日飲まなければ（　）。`,
      choices: ["なりません", "いけませんでした", "いけません", "ありません"],
      correctIndex: 0,
      explanation: "「〜なければなりません」は義務です。一般的なルールの文なので過去形は不自然です。",
    },
    {
      id: 104,
      sectionId: "bunpo",
      question: `私は富士山に登ったことが（　）。`,
      choices: ["います", "あります", "できます", "なります"],
      correctIndex: 1,
      explanation: "「〜たことがあります」は経験です。",
    },
    {
      id: 105,
      sectionId: "bunpo",
      question: `財布を電車に忘れてしまい（　）。`,
      choices: ["ました", "ます", "たいです", "ません"],
      correctIndex: 0,
      explanation: "「〜てしまいました」は『残念な完了』を表します。文末は「ました」が自然です。",
    },
    {
      id: 106,
      sectionId: "bunpo",
      question: `私は日本語を話すことが（　）。`,
      choices: ["なります", "あります", "できます", "しました"],
      correctIndex: 2,
      explanation: "「〜ことができます」は能力・可能です。",
    },
    {
      id: 107,
      sectionId: "bunpo",
      question: `この漢字は（　）。`,
      choices: ["読みます", "読めます", "読まれます", "読みたいです"],
      correctIndex: 1,
      explanation: "可能形「読めます」が適切です。",
    },
    {
      id: 108,
      sectionId: "bunpo",
      question: `雨が降ったら、家に（　）ます。`,
      choices: ["い", "いる", "いき", "いた"],
      correctIndex: 0,
      explanation: "「家にいます」＝家にいる。文末の「ます」に合わせて「い」を入れて「います」。",
    },
    {
      id: 109,
      sectionId: "bunpo",
      question: `日本に行くなら、京都へ（　）ほうがいいです。`,
      choices: ["行った", "行き", "行って", "行くと"],
      correctIndex: 0,
      explanation: "「〜たほうがいい」は助言で、過去形が定型です。",
    },
    {
      id: 110,
      sectionId: "bunpo",
      question: `東京は大阪（　）人口が多いです。`,
      choices: ["から", "より", "なら", "まで"],
      correctIndex: 1,
      explanation: "比較は「〜より」を使います。",
    },
    {
      id: 111,
      sectionId: "bunpo",
      question: `犬より猫の（　）が好きです。`,
      choices: ["ほう", "から", "ので", "まで"],
      correctIndex: 0,
      explanation: "比較で好みを言うときは「〜のほうが」。",
    },
    {
      id: 112,
      sectionId: "bunpo",
      question: `先生が私に宿題を教えて（　）。とてもうれしかったです。`,
      choices: ["くれました", "もらいました", "あげました", "くれます"],
      correctIndex: 0,
      explanation: "主語が先生なので「（先生が私に）〜てくれました」。",
    },
    {
      id: 113,
      sectionId: "bunpo",
      question: `私は友だちに本を貸して（　）。`,
      choices: ["くれました", "もらいました", "くださいました", "いただきました"],
      correctIndex: 1,
      explanation: "「（友だちに）貸してもらいました」＝相手がしてくれる。",
    },
    {
      id: 114,
      sectionId: "bunpo",
      question: `来年日本へ留学する（　）で、今からお金をためています。`,
      choices: ["つもり", "よう", "そう", "らしい"],
      correctIndex: 0,
      explanation: "意志・計画は「つもり」です。",
    },
    {
      id: 115,
      sectionId: "bunpo",
      question: `今日は早く帰ろうと（　）。`,
      choices: ["思います", "なります", "あります", "います"],
      correctIndex: 0,
      explanation: "「〜ようと思います」で意志。",
    },
    {
      id: 116,
      sectionId: "bunpo",
      question: `コーヒーに（　）ます。`,
      choices: ["し", "なり", "する", "した"],
      correctIndex: 0,
      explanation: "注文・選択は「〜にします」。文末が「ます」なので「し」を入れます。",
    },
    {
      id: 117,
      sectionId: "bunpo",
      question: `春になると、だんだん暖かく（　）。`,
      choices: ["なります", "します", "あります", "できます"],
      correctIndex: 0,
      explanation: "変化は「〜になります」。",
    },
    {
      id: 118,
      sectionId: "bunpo",
      question: `日本へ行く（　）は、パスポートが必要です。`,
      choices: ["とき", "から", "まで", "ので"],
      correctIndex: 0,
      explanation: "「〜ときは」で条件・場面を表します。",
    },
    {
      id: 119,
      sectionId: "bunpo",
      question: `日本へ行く前（　）、日本語を勉強しました。`,
      choices: ["に", "で", "が", "を"],
      correctIndex: 0,
      explanation: "「前に」は「〜前に」。助詞は「に」。",
    },
    {
      id: 120,
      sectionId: "bunpo",
      question: `食事のあとで、薬を（　）ます。`,
      choices: ["飲み", "飲む", "飲ん", "飲んで"],
      correctIndex: 0,
      explanation: "「〜ます」に続くのは連用形「飲み」。",
    },
    {
      id: 121,
      sectionId: "bunpo",
      question: `雨が降り（　）です。`,
      choices: ["そう", "よう", "らしい", "つもり"],
      correctIndex: 0,
      explanation: "様態「〜そうです」＝見た感じ。",
    },
    {
      id: 122,
      sectionId: "bunpo",
      question: `このケーキは見た目がとてもおいし（　）です。`,
      choices: ["い", "そう", "な", "だ"],
      correctIndex: 1,
      explanation: "見た目からの推量なので「おいしそう」。",
    },
    {
      id: 123,
      sectionId: "bunpo",
      question: `忙しい（　）、手伝えません。`,
      choices: ["ので", "より", "なら", "ほうが"],
      correctIndex: 0,
      explanation: "原因・理由は「〜ので」。",
    },
    {
      id: 124,
      sectionId: "bunpo",
      question: `雨だから、試合は（　）。`,
      choices: ["ありません", "あります", "します", "しました"],
      correctIndex: 0,
      explanation: "理由「〜だから」で結果。「試合はありません」＝中止。",
    },
    {
      id: 125,
      sectionId: "bunpo",
      question: `時間があったら、映画を（　）ます。`,
      choices: ["見", "見る", "見た", "見ない"],
      correctIndex: 0,
      explanation: "「〜ます」に続く連用形「見」。",
    },
    {
      id: 126,
      sectionId: "bunpo",
      question: `雨（　）、試合は中止です。`,
      choices: ["なら", "ので", "から", "でも"],
      correctIndex: 0,
      explanation: "条件の「〜なら」。",
    },
    {
      id: 127,
      sectionId: "bunpo",
      question: `私は一度も海外へ行ったことが（　）。`,
      choices: ["あります", "ありません", "できます", "しました"],
      correctIndex: 1,
      explanation: "「一度も〜ない」の形なので「ありません」。",
    },
    {
      id: 128,
      sectionId: "bunpo",
      question: `この問題は簡単だから、すぐ（　）。`,
      choices: ["できます", "なります", "あります", "します"],
      correctIndex: 0,
      explanation: "可能「できます」。",
    },
    {
      id: 129,
      sectionId: "bunpo",
      question: `ここではタバコを吸っては（　）。`,
      choices: ["いいです", "いけません", "ください", "しました"],
      correctIndex: 1,
      explanation: "禁止「〜てはいけません」。",
    },
    {
      id: 130,
      sectionId: "bunpo",
      question: `今日は忙しくないから、来なくても（　）。`,
      choices: ["いいです", "いけません", "ください", "なりません"],
      correctIndex: 0,
      explanation: "「来なくてもいいです」＝不要。",
    },
  {
  id: 11001,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "明日は何時に学校へ行きますか。",
  choices: ["八時に行きます。", "学校へ行きます。", "友だちと行きます。", "昨日行きました。"],
  correctIndex: 0,
  explanation: "時間を聞いているので「八時に行きます」が正解。",
},
{
  id: 11002,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "どこで昼ごはんを食べますか。",
  choices: ["学校で食べます。", "昼ごはんです。", "友だちです。", "昨日食べました。"],
  correctIndex: 0,
  explanation: "場所を聞いているので「学校で」が正解。",
},
{
  id: 11003,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "どうして遅れましたか。",
  choices: ["電車が遅れました。", "八時です。", "駅へ行きます。", "友だちとです。"],
  correctIndex: 0,
  explanation: "理由を聞いているので理由で答える。",
},
{
  id: 11004,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "週末は何をしましたか。",
  choices: ["映画を見ました。", "映画です。", "見ます。", "友だち。"],
  correctIndex: 0,
  explanation: "過去形で答える必要がある。",
},
{
  id: 11005,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "どちらが好きですか。犬ですか、猫ですか。",
  choices: ["犬が好きです。", "好きです。", "どちらですか。", "はい。"],
  correctIndex: 0,
  explanation: "二択質問なので具体的に答える。",
},
{
  id: 11006,
  sectionId: "listening",
  question: "【聴解】質問を聞いて、正しい答えを選びましょう。",
  listeningText: "今日は暑いですね。",
  choices: ["そうですね。", "暑いですか。", "いいえ、昨日です。", "学校です。"],
  correctIndex: 0,
  explanation: "共感表現が自然。",
},
{
  id: 11007,
  sectionId: "listening",
  question: "【聴解】会話を聞いて、何時に会いますか。",
  listeningText:
    "A：明日、何時に会いますか。B：三時はどうですか。A：三時はだめです。じゃ、四時にしましょう。",
  choices: ["三時", "四時", "五時", "六時"],
  correctIndex: 1,
  explanation: "三時はだめで、四時に決まりました。",
},
{
  id: 11008,
  sectionId: "listening",
  question: "【聴解】会話を聞いて、二人はどこへ行きますか。",
  listeningText:
    "A：映画を見に行きませんか。B：いいですね。でも今日は混んでいそうです。A：じゃ、図書館に行きましょう。",
  choices: ["映画館", "図書館", "公園", "デパート"],
  correctIndex: 1,
  explanation: "映画はやめて図書館に行きます。",
},
{
  id: 11009,
  sectionId: "listening",
  question: "【聴解】男の人はなぜ遅れましたか。",
  listeningText:
    "女：どうして遅れたんですか。男：バスが来なかったんです。",
  choices: ["寝坊した", "バスが来なかった", "雨だった", "電車が止まった"],
  correctIndex: 1,
  explanation: "バスが来なかったと言っています。",
},
{
  id: 11010,
  sectionId: "listening",
  question: "【聴解】男の人は何を買いますか。",
  listeningText:
    "店員：いらっしゃいませ。男：りんごはいくらですか。店員：三つで五百円です。男：じゃ、三つください。",
  choices: ["みかん", "りんご", "バナナ", "ぶどう"],
  correctIndex: 1,
  explanation: "りんごを三つ買います。",
},
{
  id: 11011,
  sectionId: "listening",
  question: "【聴解】テストはいつですか。",
  listeningText:
    "先生：テストは金曜日です。木曜日ではありません。",
  choices: ["木曜日", "金曜日", "土曜日", "日曜日"],
  correctIndex: 1,
  explanation: "金曜日と明確に言っています。",
},
{
  id: 11012,
  sectionId: "listening",
  question: "【聴解】女の人はこのあと何をしますか。",
  listeningText:
    "男：今からコンビニに行きます。女：じゃ、私は家で待っています。",
  choices: ["コンビニへ行く", "家で待つ", "学校へ行く", "買い物をする"],
  correctIndex: 1,
  explanation: "家で待つと言っています。",
},
{
  id: 11013,
  sectionId: "listening",
  question: "【聴解】今日の天気はどうですか。",
  listeningText:
    "天気予報です。今日は一日中雨でしょう。",
  choices: ["晴れ", "雨", "雪", "くもり"],
  correctIndex: 1,
  explanation: "一日中雨と言っています。",
},
{
  id: 11014,
  sectionId: "listening",
  question: "【聴解】ケーキはいくつありますか。",
  listeningText:
    "店員：ケーキは五つあります。でも、二つは予約です。",
  choices: ["二つ", "三つ", "五つ", "七つ"],
  correctIndex: 2,
  explanation: "五つあります、と言っています。",
},
{
  id: 11015,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "明日は学校が休みです。私は友だちと公園へ行く予定です。でも、雨が降ったら家にいます。",
  choices: [
    "明日は学校があります。",
    "友だちと映画に行きます。",
    "雨が降ったら家にいます。",
    "一人で出かけます。"
  ],
  correctIndex: 2,
  explanation: "雨が降ったら家にいると言っています。",
},
{
  id: 11016,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "私は毎日八時に会社へ行きます。会社は駅の近くにあります。仕事は六時に終わります。",
  choices: [
    "会社は駅から遠いです。",
    "毎日六時に会社へ行きます。",
    "仕事は六時に終わります。",
    "会社は家の近くです。"
  ],
  correctIndex: 2,
  explanation: "仕事は六時に終わると言っています。",
},
{
  id: 11017,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "先週、京都へ旅行に行きました。お寺を見たり、写真を撮ったりしました。とても楽しかったです。",
  choices: [
    "先週、大阪へ行きました。",
    "旅行はつまらなかったです。",
    "京都でお寺を見ました。",
    "写真を撮りませんでした。"
  ],
  correctIndex: 2,
  explanation: "京都でお寺を見たと言っています。",
},
{
  id: 11018,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "昨日、スーパーで牛乳とパンを買いました。卵は高かったので買いませんでした。",
  choices: [
    "卵を買いました。",
    "牛乳とパンを買いました。",
    "何も買いませんでした。",
    "パンは高かったです。"
  ],
  correctIndex: 1,
  explanation: "牛乳とパンを買ったと言っています。",
},
{
  id: 11019,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "私は日本語学校で勉強しています。クラスには十人います。みんなとても親切です。",
  choices: [
    "クラスには二十人います。",
    "日本語学校で働いています。",
    "クラスには十人います。",
    "みんなは冷たいです。"
  ],
  correctIndex: 2,
  explanation: "クラスには十人いると言っています。",
},
{
  id: 11020,
  sectionId: "listening",
  question: "【聴解】話の内容と合っているものを選びましょう。",
  listeningText:
    "天気予報です。今日は朝からくもりです。午後には晴れるでしょう。",
  choices: [
    "今日は一日中雨です。",
    "午後は晴れるでしょう。",
    "朝から晴れです。",
    "雪が降ります。"
  ],
  correctIndex: 1,
  explanation: "午後には晴れると言っています。",
}
]
}