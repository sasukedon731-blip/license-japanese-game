import type { Quiz } from "@/app/data/types"

export const japaneseN3Quiz: Quiz = {
  id: "japanese-n3",
  title: "日本語検定N3",
  description: "文法・語彙・読解・聴解（N3）",
  questions: [
    {
      id: 1,
      question: `駅前は（こんざつ）していて、歩くのが大変だった。

（こんざつ）の漢字は？`,
      choices: ["混雑", "混列", "混乱", "混設"],
      correctIndex: 0,
      explanation: "正解は「混雑」です。",
      sectionId: "vocab",
    },
    {
      id: 1,
      question: `男：雨だ！洗濯物取り込まなきゃ。女：お願い、私は窓を閉めるから。男：あ、その前に自転車にカバーを…。女：洗濯物が先よ！自転車は後。男：わかった。

男の人はまず何をしますか。`,
      choices: ["洗濯物を取り込む", "窓を閉める", "カバーをかける", "庭に出る"],
      correctIndex: 0,
      explanation: "正解は「洗濯物を取り込む」です。",
      sectionId: "listening",
    },
    {
      id: 2,
      question: `女：今日のパーティー行けなくなった。男：風邪？女：ううん、急に仕事が入って、明日までの資料を作らなきゃ。男：そっか、残念。

女の人はなぜ行けませんか。`,
      choices: ["仕事が入ったから", "風邪をひいたから", "資料を失くしたから", "家族が来たから"],
      correctIndex: 0,
      explanation: "正解は「仕事が入ったから」です。",
      sectionId: "listening",
    },
    {
      id: 2,
      question: `自分の（のうりょく）を最大限に発揮したい。

（のうりょく）の漢字は？`,
      choices: ["能率", "能力", "農力", "脳力"],
      correctIndex: 1,
      explanation: "正解は「能力」です。",
      sectionId: "vocab",
    },
    {
      id: 3,
      question: `将来の（きぼう）について作文を書いた。

（きぼう）の漢字は？`,
      choices: ["希法", "祈望", "希望", "既望"],
      correctIndex: 2,
      explanation: "正解は「希望」です。",
      sectionId: "vocab",
    },
    {
      id: 3,
      question: `佐藤です。明日の10時からの会議ですが、部長の都合で1時間遅らせることになりました。場所は第3会議室で変わりません。

会議は何時に始まりますか。`,
      choices: ["11時", "10時", "9時", "12時"],
      correctIndex: 0,
      explanation: "正解は「11時」です。",
      sectionId: "listening",
    },
    {
      id: 4,
      question: `会議の内容を忘れないように（きろく）した。

（きろく）の漢字は？`,
      choices: ["記緑", "記録", "紀録", "奇録"],
      correctIndex: 1,
      explanation: "正解は「記録」です。",
      sectionId: "vocab",
    },
    {
      id: 4,
      question: `男：セミナーに何がいる？女：学生証が必要って。履歴書は？男：それは来週の面接でいいみたい。女：お茶は出るらしいから飲み物はいらないよ。

何を持っていきますか。`,
      choices: ["学生証", "履歴書", "飲み物", "パソコン"],
      correctIndex: 0,
      explanation: "正解は「学生証」です。",
      sectionId: "listening",
    },
    {
      id: 5,
      question: `（がんじょう）な机なので、長く使えそうだ。

（がんじょう）の漢字は？`,
      choices: ["岩丈", "顔丈", "頑丈", "強丈"],
      correctIndex: 2,
      explanation: "正解は「頑丈」です。",
      sectionId: "vocab",
    },
    {
      id: 5,
      question: `ただいまタイムセール中です。野菜コーナーのトマトとキュウリが20％引きです！肉と魚のセールは明日行います。

今日安くなるのはどれですか。`,
      choices: ["トマトとキュウリ", "お肉", "お魚", "すべての野菜"],
      correctIndex: 0,
      explanation: "正解は「トマトとキュウリ」です。",
      sectionId: "listening",
    },
    {
      id: 6,
      question: `女：大人2人と小学生1人です。受付：大人は千円、小学生は500円ですが、今日は記念日なので大人は半額、子供はそのままです。

全部でいくら払いますか。`,
      choices: ["1,500円", "2,500円", "1,000円", "2,000円"],
      correctIndex: 0,
      explanation: "正解は「1,500円」です。",
      sectionId: "listening",
    },
    {
      id: 6,
      question: `試験の（けっか）をインターネットで確認した。

（けっか）の漢字は？`,
      choices: ["結果", "結過", "結価", "決果"],
      correctIndex: 0,
      explanation: "正解は「結果」です。",
      sectionId: "vocab",
    },
    {
      id: 7,
      question: `女：新しい靴だね。男：うん、前のがボロボロで。デザインは好きだったけど底に穴が開いちゃって。サイズは合ってたんだけどね。

なぜ靴を買いましたか。`,
      choices: ["古い靴が壊れたから", "デザインが嫌い", "サイズが合わない", "流行だから"],
      correctIndex: 0,
      explanation: "正解は「古い靴が壊れたから」です。",
      sectionId: "listening",
    },
    {
      id: 7,
      question: `資料を（ほぞん）するのを忘れてしまった。

（ほぞん）の漢字は？`,
      choices: ["捕存", "保在", "保存", "保持"],
      correctIndex: 2,
      explanation: "正解は「保存」です。",
      sectionId: "vocab",
    },
    {
      id: 8,
      question: `山川駅で車両点検を行っているため、上下線とも15分ほど遅れています。事故や信号の故障ではありません。

遅れている理由は何ですか。`,
      choices: ["車両の点検", "信号の故障", "事故", "雪の影響"],
      correctIndex: 0,
      explanation: "正解は「車両の点検」です。",
      sectionId: "listening",
    },
    {
      id: 8,
      question: `彼は（きよう）に道具を使いこなしている。

（きよう）の漢字は？`,
      choices: ["器用", "器様", "希用", "貴用"],
      correctIndex: 0,
      explanation: "正解は「器用」です。",
      sectionId: "vocab",
    },
    {
      id: 9,
      question: `女：レポート出した？男：ううん、内容は書けたけど表を入れなきゃ。今夜完成させて、明日の朝チェックしてから出すよ。

レポートをいつ出しますか。`,
      choices: ["明日", "今日", "昨日", "明後日"],
      correctIndex: 0,
      explanation: "正解は「明日」です。",
      sectionId: "listening",
    },
    {
      id: 9,
      question: `太平洋の（えんがん）に沿って走る。

（えんがん）の漢字は？`,
      choices: ["遠岸", "沿岸", "円岸", "延岸"],
      correctIndex: 1,
      explanation: "正解は「沿岸」です。",
      sectionId: "vocab",
    },
    {
      id: 10,
      question: `女：準備手伝って。机は並べたわ。椅子が足りないから隣から10個持ってきて。男：お茶も用意しますか？女：それは後でいいわ。

男の人はまず何をしますか。`,
      choices: ["椅子を運ぶ", "机を並べる", "お茶を用意する", "コピーをする"],
      correctIndex: 0,
      explanation: "正解は「椅子を運ぶ」です。",
      sectionId: "listening",
    },
    {
      id: 10,
      question: `恵まれない子供たちのために（きふ）をした。

（きふ）の漢字は？`,
      choices: ["寄付", "記付", "喜付", "基付"],
      correctIndex: 0,
      explanation: "正解は「寄付」です。",
      sectionId: "vocab",
    },
    {
      id: 11,
      question: `女：最近本読んでる？男：忙しくはないんだけど、目が疲れやすくてね。細かい字をずっと見るのが辛いんだ。スマホもあまり見ないよ。

なぜ本を読みませんか。`,
      choices: ["目が疲れやすいから", "忙しいから", "スマホが楽しい", "本が面白くない"],
      correctIndex: 0,
      explanation: "正解は「目が疲れやすいから」です。",
      sectionId: "listening",
    },
    {
      id: 11,
      question: `この地域は一年中温暖な気候です。

温暖の読み方は？`,
      choices: ["おんたん", "おんだん", "おんらん", "おんぬん"],
      correctIndex: 1,
      explanation: "正解は「おんだん」です。",
      sectionId: "vocab",
    },
    {
      id: 12,
      question: `科学技術の急速な発展に驚く。

発展の読み方は？`,
      choices: ["はてん", "はつてん", "はってん", "ばってん"],
      correctIndex: 2,
      explanation: "正解は「はってん」です。",
      sectionId: "vocab",
    },
    {
      id: 12,
      question: `明日の朝は晴れますが、お昼から雲が広がるでしょう。午後は雨が降り出し、夜には激しく降る見込みです。

明日の午後の天気は？`,
      choices: ["雨", "晴れ", "曇り", "雪"],
      correctIndex: 0,
      explanation: "正解は「雨」です。",
      sectionId: "listening",
    },
    {
      id: 13,
      question: `男：改札前で会おう。女：混んでるよ。男：じゃあ隣の喫茶店は？女：広場の時計の下はどう？わかりやすいし。男：わかった。

二人はどこで会いますか。`,
      choices: ["時計の下", "改札前", "喫茶店", "コンビニ"],
      correctIndex: 0,
      explanation: "正解は「時計の下」です。",
      sectionId: "listening",
    },
    {
      id: 13,
      question: `将来の計画について具体的に話す。

具体的の読み方は？`,
      choices: ["ぐてき", "ぐていてき", "ぐたいてき", "ぐたいしき"],
      correctIndex: 2,
      explanation: "正解は「ぐたいてき」です。",
      sectionId: "vocab",
    },
    {
      id: 14,
      question: `これは私にとって非常に貴重な経験だ。

貴重の読み方は？`,
      choices: ["きちょ", "きちょう", "きじゅう", "きちゅう"],
      correctIndex: 1,
      explanation: "正解は「きちょう」です。",
      sectionId: "vocab",
    },
    {
      id: 14,
      question: `男：カレーパン2つとアンパン1つ。店員：アンパンは売り切れで、代わりにクリームパンはどうですか？男：じゃあ、それを2つ。カレーパンはやめます。

どのパンを買いますか。`,
      choices: ["クリームパン2つ", "カレーパン2つ", "アンパン1つ", "全部"],
      correctIndex: 0,
      explanation: "正解は「クリームパン2つ」です。",
      sectionId: "listening",
    },
    {
      id: 15,
      question: `彼は自分の権利を強く主張した。

権利の読み方は？`,
      choices: ["けんり", "げんり", "けんりい", "けいり"],
      correctIndex: 0,
      explanation: "正解は「けんり」です。",
      sectionId: "vocab",
    },
    {
      id: 15,
      question: `女：昨日電話出なかったね。男：ごめん、映画館にいてマナーモードにしてたんだ。寝てたわけじゃないよ。昨日は休みだったし。

なぜ電話に出なかった？`,
      choices: ["映画を見ていた", "寝ていた", "仕事が忙しかった", "携帯を失くした"],
      correctIndex: 0,
      explanation: "正解は「映画を見ていた」です。",
      sectionId: "listening",
    },
    {
      id: 16,
      question: `男：発表の準備できました。先生：ええ、でもその前に図書館へこの本を返してきて。今日が期限なの。資料を見るのはその後ね。

まず何をしますか。`,
      choices: ["本を返す", "発表の準備", "資料を見せる", "本を借りる"],
      correctIndex: 0,
      explanation: "正解は「本を返す」です。",
      sectionId: "listening",
    },
    {
      id: 16,
      question: `出かける支度をするのに時間がかかる。

支度の読み方は？`,
      choices: ["したく", "しど", "したび", "さたく"],
      correctIndex: 0,
      explanation: "正解は「したく」です。",
      sectionId: "vocab",
    },
    {
      id: 17,
      question: `大雨が農作物に悪影響を及ぼす。

及ぼすの読み方は？`,
      choices: ["およぼす", "こぼす", "はぼす", "むよぼす"],
      correctIndex: 0,
      explanation: "正解は「およぼす」です。",
      sectionId: "vocab",
    },
    {
      id: 17,
      question: `女：今日買い物行こう。男：今日は残業。明日は？女：明日は友達と会うの。あさってなら暇だけど。男：よし、じゃあそうしよう。

いつ買い物に行きますか。`,
      choices: ["あさって", "今日", "明日", "来週"],
      correctIndex: 0,
      explanation: "正解は「あさって」です。",
      sectionId: "listening",
    },
    {
      id: 18,
      question: `男：料理が30分も来ないし、後から来た人が先に出るんだ！店員に言っても「今作ってます」だけ。結局食べずに帰ってきたよ。

なぜ怒っていますか。`,
      choices: ["料理が遅かったから", "まずかったから", "休みだったから", "財布を忘れたから"],
      correctIndex: 0,
      explanation: "正解は「料理が遅かったから」です。",
      sectionId: "listening",
    },
    {
      id: 18,
      question: `畑を耕すのは大変な重労働だ。

耕すの読み方は？`,
      choices: ["たがやす", "とかす", "ぬらす", "たやす"],
      correctIndex: 0,
      explanation: "正解は「たがやす」です。",
      sectionId: "vocab",
    },
    {
      id: 19,
      question: `彼は慎重に言葉を選んで話した。

慎重の読み方は？`,
      choices: ["しんちゅう", "しんじゅう", "しんちょう", "しんじょ"],
      correctIndex: 2,
      explanation: "正解は「しんちょう」です。",
      sectionId: "vocab",
    },
    {
      id: 19,
      question: `女：木村さん、部長が応接室で呼んでるわよ。男：コピー機直さなくていい？女：田中さんが修理を呼んだから大丈夫。早く行って。

どこへ行きますか。`,
      choices: ["応接室", "コピー機の前", "田中さんの席", "部長の席"],
      correctIndex: 0,
      explanation: "正解は「応接室」です。",
      sectionId: "listening",
    },
    {
      id: 20,
      question: `男：仕事楽しい？女：給料はいいけど、忙しすぎて自分の時間がないのが悩みかな。休みの日も疲れて寝るだけ。余裕がほしいわ。

最近の生活をどう思う？`,
      choices: ["余裕がない", "給料が安くて不満", "仕事が簡単すぎる", "充実している"],
      correctIndex: 0,
      explanation: "正解は「余裕がない」です。",
      sectionId: "listening",
    },
    {
      id: 20,
      question: `事態がさらに悪化する恐れがある。

悪化の読み方は？`,
      choices: ["あくか", "あっか", "あくげ", "あつか"],
      correctIndex: 1,
      explanation: "正解は「あっか」です。",
      sectionId: "vocab",
    },
    {
      id: 21,
      question: `忘れ物を（ ）していたことに後で気づいた。

空欄に入る言葉は？`,
      choices: ["うっかり", "すっきり", "はっきり", "ゆっくり"],
      correctIndex: 0,
      explanation: "正解は「うっかり」です。",
      sectionId: "vocab",
    },
    {
      id: 22,
      question: `このスマートフォンの操作は（ ）だ。

空欄に入る言葉は？`,
      choices: ["単純", "簡潔", "器用", "手軽"],
      correctIndex: 0,
      explanation: "正解は「単純」です。",
      sectionId: "vocab",
    },
    {
      id: 23,
      question: `会議を（ ）に進めるために準備をする。

空欄に入る言葉は？`,
      choices: ["スムーズ", "スマート", "ドライ", "ベスト"],
      correctIndex: 0,
      explanation: "正解は「スムーズ」です。",
      sectionId: "vocab",
    },
    {
      id: 24,
      question: `会社から（ ）して、自分の店を持った。

空欄に入る言葉は？`,
      choices: ["独立", "独身", "独占", "独断"],
      correctIndex: 0,
      explanation: "正解は「独立」です。",
      sectionId: "vocab",
    },
    {
      id: 25,
      question: `専門家の（ ）を伺いたいと思います。

空欄に入る言葉は？`,
      choices: ["見解", "見学", "見本", "見当"],
      correctIndex: 0,
      explanation: "正解は「見解」です。",
      sectionId: "vocab",
    },
    {
      id: 26,
      question: `彼の話には最初から最後まで（ ）がある。

空欄に入る言葉は？`,
      choices: ["矛盾", "欠陥", "欠点", "延長"],
      correctIndex: 0,
      explanation: "正解は「矛盾」です。",
      sectionId: "vocab",
    },
    {
      id: 27,
      question: `実力に（ ）自信があるようだ。

空欄に入る言葉は？`,
      choices: ["相当", "適当", "正当", "担当"],
      correctIndex: 0,
      explanation: "正解は「相当」です。",
      sectionId: "vocab",
    },
    {
      id: 28,
      question: `予定が（ ）になってしまった。

空欄に入る言葉は？`,
      choices: ["むちゃくちゃ", "めちゃくちゃ", "めったに", "もともと"],
      correctIndex: 1,
      explanation: "正解は「めちゃくちゃ」です。",
      sectionId: "vocab",
    },
    {
      id: 29,
      question: `彼はどんなときも（ ）を崩さない。

空欄に入る言葉は？`,
      choices: ["ペース", "コース", "サービス", "ケース"],
      correctIndex: 0,
      explanation: "正解は「ペース」です。",
      sectionId: "vocab",
    },
    {
      id: 30,
      question: `この小説はとても（ ）が深い。

空欄に入る言葉は？`,
      choices: ["味わい", "味付け", "味見", "意味"],
      correctIndex: 0,
      explanation: "正解は「味わい」です。",
      sectionId: "vocab",
    },
    {
      id: 31,
      question: `それはでたらめな話だ。

でたらめの類義語は？`,
      choices: ["うそ", "本当", "おもしろい", "悲しい"],
      correctIndex: 0,
      explanation: "正解は「うそ」です。",
      sectionId: "vocab",
    },
    {
      id: 32,
      question: `予定より会議が長引いた。

長引いたの意味は？`,
      choices: ["時間が長くなった", "すぐ終わった", "始まった", "中止になった"],
      correctIndex: 0,
      explanation: "正解は「時間が長くなった」です。",
      sectionId: "vocab",
    },
    {
      id: 33,
      question: `隣の人に席をゆずる。

ゆずるの類義語は？`,
      choices: ["あげる", "借りる", "売る", "捨てる"],
      correctIndex: 0,
      explanation: "正解は「あげる」です。",
      sectionId: "vocab",
    },
    {
      id: 34,
      question: `彼はとても冷静だ。

冷静の類義語は？`,
      choices: ["落ち着いている", "怒っている", "慌てている", "疲れている"],
      correctIndex: 0,
      explanation: "正解は「落ち着いている」です。",
      sectionId: "vocab",
    },
    {
      id: 35,
      question: `今後の計画を実行する。

実行の類義語は？`,
      choices: ["実際にやる", "考える", "やめる", "相談する"],
      correctIndex: 0,
      explanation: "正解は「実際にやる」です。",
      sectionId: "vocab",
    },
    {
      id: 36,
      question: `彼は少し短気なところがある。

短気の意味は？`,
      choices: ["すぐ怒る", "すぐ泣く", "気が長い", "優しい"],
      correctIndex: 0,
      explanation: "正解は「すぐ怒る」です。",
      sectionId: "vocab",
    },
    {
      id: 37,
      question: `今日は朝からあわただしい。

あわただしいの意味は？`,
      choices: ["忙しい", "暇な", "楽しい", "悲しい"],
      correctIndex: 0,
      explanation: "正解は「忙しい」です。",
      sectionId: "vocab",
    },
    {
      id: 38,
      question: `彼は長年勤めた会社を去ることにした。

去るの意味は？`,
      choices: ["やめる", "始める", "変える", "探す"],
      correctIndex: 0,
      explanation: "正解は「やめる」です。",
      sectionId: "vocab",
    },
    {
      id: 39,
      question: `一応、中身を確認しておきましょう。

一応の類義語は？`,
      choices: ["とりあえず", "完璧に", "全然", "二度と"],
      correctIndex: 0,
      explanation: "正解は「とりあえず」です。",
      sectionId: "vocab",
    },
    {
      id: 40,
      question: `彼の態度はあいまいだ。

あいまいの意味は？`,
      choices: ["はっきりしない", "厳しい", "親切だ", "丁寧だ"],
      correctIndex: 0,
      explanation: "正解は「はっきりしない」です。",
      sectionId: "vocab",
    },
    {
      id: 41,
      question: `窓（ ）見える海がとてもきれいです。

空欄に入る助詞は？`,
      choices: ["から", "へ", "を", "まで"],
      correctIndex: 0,
      explanation: "正解は「から」です。",
      sectionId: "grammar",
    },
    {
      id: 42,
      question: `忙しい（ ）スマホで遊んでしまった。

空欄に入る言葉は？`,
      choices: ["せいで", "くせに", "ために", "おかげで"],
      correctIndex: 1,
      explanation: "正解は「くせに」です。",
      sectionId: "grammar",
    },
    {
      id: 43,
      question: `日本に来た（ ）は、合格して帰りたい。

空欄に入る言葉は？`,
      choices: ["からに", "以上", "ために", "ほどに"],
      correctIndex: 1,
      explanation: "正解は「以上」です。",
      sectionId: "grammar",
    },
    {
      id: 44,
      question: `彼はまるで日本人の（ ）日本語を話す。

空欄に入る言葉は？`,
      choices: ["ように", "そうに", "らしい", "なりに"],
      correctIndex: 0,
      explanation: "正解は「ように」です。",
      sectionId: "grammar",
    },
    {
      id: 45,
      question: `先生は明日、こちらに（ ）そうです。

空欄に入る尊敬語は？`,
      choices: ["いらっしゃる", "まいる", "おる", "拝見する"],
      correctIndex: 0,
      explanation: "正解は「いらっしゃる」です。",
      sectionId: "grammar",
    },
    {
      id: 46,
      question: `お菓子が多すぎて、一人では食べ（ ）ない。

空欄に入る形は？`,
      choices: ["きれ", "きる", "きた", "きらず"],
      correctIndex: 0,
      explanation: "正解は「きれ」です。",
      sectionId: "grammar",
    },
    {
      id: 47,
      question: `彼の言うことは信じ（ ）ところがある。

空欄に入る言葉は？`,
      choices: ["がたい", "やすい", "づらい", "かねない"],
      correctIndex: 0,
      explanation: "正解は「がたい」です。",
      sectionId: "grammar",
    },
    {
      id: 48,
      question: `雨が（ ）そうにないので、傘を貸してください。

空欄に入る形は？`,
      choices: ["やみ", "やむ", "やんだ", "やまず"],
      correctIndex: 0,
      explanation: "正解は「やみ」です。",
      sectionId: "grammar",
    },
    {
      id: 49,
      question: `健康（ ）毎朝ジョギングをしています。

空欄に入る言葉は？`,
      choices: ["のために", "のせいで", "のおかげで", "のかわりに"],
      correctIndex: 0,
      explanation: "正解は「のために」です。",
      sectionId: "grammar",
    },
    {
      id: 50,
      question: `この薬は苦くて（ ）にくい。

空欄に入る形は？`,
      choices: ["飲み", "飲む", "飲んだ", "飲める"],
      correctIndex: 0,
      explanation: "正解は「飲み」です。",
      sectionId: "grammar",
    },
    {
      id: 51,
      question: `今日（ ）は絶対に勝つつもりだ。

空欄に入る言葉は？`,
      choices: ["こそ", "さえ", "まで", "ほど"],
      correctIndex: 0,
      explanation: "正解は「こそ」です。",
      sectionId: "grammar",
    },
    {
      id: 52,
      question: `契約した（ ）、守らなければならない。

空欄に入る言葉は？`,
      choices: ["以上", "わりに", "たびに", "ついでに"],
      correctIndex: 0,
      explanation: "正解は「以上」です。",
      sectionId: "grammar",
    },
    {
      id: 53,
      question: `料理はできた（ ）、まだ客が来ない。

空欄に入る言葉は？`,
      choices: ["ものの", "からには", "といえば", "ついでに"],
      correctIndex: 0,
      explanation: "正解は「ものの」です。",
      sectionId: "grammar",
    },
    {
      id: 54,
      question: `宿題をやり（ ）寝てしまった。

空欄に入る言葉は？`,
      choices: ["かけて", "終わって", "ついでに", "ながら"],
      correctIndex: 0,
      explanation: "正解は「かけて」です。",
      sectionId: "grammar",
    },
    {
      id: 55,
      question: `有名な店（ ）あまりおいしくなかった。

空欄に入る言葉は？`,
      choices: ["わりに", "ほど", "ために", "せいで"],
      correctIndex: 0,
      explanation: "正解は「わりに」です。",
      sectionId: "grammar",
    },
    {
      id: 56,
      question: `外出する（ ）にゴミを出してきて。

空欄に入る言葉は？`,
      choices: ["ついで", "ほど", "かわり", "どころ"],
      correctIndex: 0,
      explanation: "正解は「ついで」です。",
      sectionId: "grammar",
    },
    {
      id: 57,
      question: `最近忙しかった（ ）、少し痩せた。

空欄に入る言葉は？`,
      choices: ["せいか", "おかげで", "わりに", "たびに"],
      correctIndex: 0,
      explanation: "正解は「せいか」です。",
      sectionId: "grammar",
    },
    {
      id: 58,
      question: `あの子は（ ）ばかりいて、何も話さない。

空欄に入る形は？`,
      choices: ["泣いて", "泣く", "泣いた", "泣き"],
      correctIndex: 0,
      explanation: "正解は「泣いて」です。",
      sectionId: "grammar",
    },
    {
      id: 59,
      question: `あんなこと、言わ（ ）よかった。

空欄に入る形は？`,
      choices: ["なければ", "ない", "なくて", "ないで"],
      correctIndex: 0,
      explanation: "正解は「なければ」です。",
      sectionId: "grammar",
    },
    {
      id: 60,
      question: `学生に（ ）は、学割が利用できます。

空欄に入る言葉は？`,
      choices: ["とって", "反して", "おいて", "ついて"],
      correctIndex: 0,
      explanation: "正解は「とって」です。",
      sectionId: "grammar",
    },
    {
      id: 61,
      question: `この仕事、私に（ ）いただけませんか。

空欄に入る形は？`,
      choices: ["させて", "して", "される", "させる"],
      correctIndex: 0,
      explanation: "正解は「させて」です。",
      sectionId: "grammar",
    },
    {
      id: 62,
      question: `窓から雨が（ ）きた。

空欄に入る形は？`,
      choices: ["降って", "降り", "降る", "降ら"],
      correctIndex: 0,
      explanation: "正解は「降って」です。",
      sectionId: "grammar",
    },
    {
      id: 63,
      question: `彼は歌（ ）ダンスも上手だ。

空欄に入る言葉は？`,
      choices: ["ばかりか", "どころか", "ついでに", "わりに"],
      correctIndex: 0,
      explanation: "正解は「ばかりか」です。",
      sectionId: "grammar",
    },
    {
      id: 64,
      question: `景気が（ ）にしたがって、求人が増えた。

空欄に入る形は？`,
      choices: ["回復する", "回復し", "回復した", "回復"],
      correctIndex: 0,
      explanation: "正解は「回復する」です。",
      sectionId: "grammar",
    },
    {
      id: 65,
      question: `こんな高いもの、（ ）はずがない。

空欄に入る形は？`,
      choices: ["買える", "買う", "買った", "買い"],
      correctIndex: 0,
      explanation: "正解は「買える」です。",
      sectionId: "grammar",
    },
    {
      id: 66,
      question: `田中さんは 1.仕事の 2.忙しさの 3.あまり 4.倒れてしまった。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["仕事の", "忙しさの", "あまり", "倒れてしまった"],
      correctIndex: 2,
      explanation: "正解は「あまり」です。",
      sectionId: "grammar",
    },
    {
      id: 67,
      question: `この店は 1.味がいい 2.だけでなく 3.値段も 4.安い。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["味がいい", "だけでなく", "値段も", "安い"],
      correctIndex: 2,
      explanation: "正解は「値段も」です。",
      sectionId: "grammar",
    },
    {
      id: 68,
      question: `1.早く 2.起きれば 3.よかった 4.のに。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["早く", "起きれば", "よかった", "のに"],
      correctIndex: 2,
      explanation: "正解は「よかった」です。",
      sectionId: "grammar",
    },
    {
      id: 69,
      question: `1.やる 2.からには 3.最後まで 4.やりなさい。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["やる", "からには", "最後まで", "やりなさい"],
      correctIndex: 2,
      explanation: "正解は「最後まで」です。",
      sectionId: "grammar",
    },
    {
      id: 70,
      question: `1.先生に 2.教えて 3.いただいた 4.本を読む。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["先生に", "教えて", "いただいた", "本を読む"],
      correctIndex: 1,
      explanation: "正解は「教えて」です。",
      sectionId: "grammar",
    },
    {
      id: 71,
      question: `1.雨が 2.降ろうが 3.槍が 4.降ろうが 行く。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["雨が", "降ろうが", "槍が", "降ろうが"],
      correctIndex: 2,
      explanation: "正解は「槍が」です。",
      sectionId: "grammar",
    },
    {
      id: 72,
      question: `1.あきらめ 2.ない 3.こと 4.が大切だ。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["あきらめ", "ない", "こと", "が大切だ"],
      correctIndex: 1,
      explanation: "正解は「ない」です。",
      sectionId: "grammar",
    },
    {
      id: 73,
      question: `1.そんなに 2.食べたら 3.お腹が 4.痛くなる。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["そんなに", "食べたら", "お腹が", "痛くなる"],
      correctIndex: 2,
      explanation: "正解は「お腹が」です。",
      sectionId: "grammar",
    },
    {
      id: 74,
      question: `1.昨日 2.買った 3.ばかりの 4.靴。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["昨日", "買った", "ばかりの", "靴"],
      correctIndex: 2,
      explanation: "正解は「ばかりの」です。",
      sectionId: "grammar",
    },
    {
      id: 75,
      question: `1.日本に来て 2.初めて 3.納豆を 4.食べた。

★に入る番号は？ [ __ __ ★ __ ]`,
      choices: ["日本に来て", "初めて", "納豆を", "食べた"],
      correctIndex: 1,
      explanation: "正解は「初めて」です。",
      sectionId: "grammar",
    },
    {
      id: 76,
      question: `彼はいつも嘘をつく。（76）彼の話は誰も信じない。

76に入る言葉は？`,
      choices: ["だから", "しかし", "すると", "ところが"],
      correctIndex: 0,
      explanation: "正解は「だから」です。",
      sectionId: "grammar",
    },
    {
      id: 77,
      question: `A「駅まで歩こう」B「雨が降っている（77）タクシーで行こう」

77に入る言葉は？`,
      choices: ["から", "ため", "おかげ", "せい"],
      correctIndex: 0,
      explanation: "正解は「から」です。",
      sectionId: "grammar",
    },
    {
      id: 78,
      question: `A「どこへ行くの？」B「ちょっとコンビニへ（78）くる」

78に入る言葉は？`,
      choices: ["行って", "行き", "行く", "行った"],
      correctIndex: 0,
      explanation: "正解は「行って」です。",
      sectionId: "grammar",
    },
    {
      id: 79,
      question: `母「部屋を片付けなさい」子「今（79）としたのに！」

79に入る言葉は？`,
      choices: ["やろう", "する", "やれ", "しろ"],
      correctIndex: 0,
      explanation: "正解は「やろう」です。",
      sectionId: "grammar",
    },
    {
      id: 80,
      question: `窓が（80）まま出かけてしまい、部屋が濡れた。

80に入る言葉は？`,
      choices: ["あいた", "あけて", "あく", "あける"],
      correctIndex: 0,
      explanation: "正解は「あいた」です。",
      sectionId: "grammar",
    },
    {
      id: 81,
      question: `卒業（81）に、お世話になった先生に挨拶をした。

81に入る言葉は？`,
      choices: ["際", "たびに", "ついで", "どころ"],
      correctIndex: 0,
      explanation: "正解は「際」です。",
      sectionId: "grammar",
    },
    {
      id: 82,
      question: `彼はまるで（82）ように泣きじゃくっている。

82に入る言葉は？`,
      choices: ["子供の", "子供な", "子供", "子供だ"],
      correctIndex: 0,
      explanation: "正解は「子供の」です。",
      sectionId: "grammar",
    },
    {
      id: 83,
      question: `この本は難しすぎて、最後まで（83）きれません。

83に入る言葉は？`,
      choices: ["読み", "読め", "読ん", "読ま"],
      correctIndex: 0,
      explanation: "正解は「読み」です。",
      sectionId: "grammar",
    },
    {
      id: 84,
      question: `日本に来てから、納豆が（84）ようになりました。

84に入る言葉は？`,
      choices: ["食べられる", "食べる", "食べ", "食べた"],
      correctIndex: 0,
      explanation: "正解は「食べられる」です。",
      sectionId: "grammar",
    },
    {
      id: 85,
      question: `早く（85）ために、毎日欠かさず練習しています。

85に入る言葉は？`,
      choices: ["走れる", "走る", "走り", "走った"],
      correctIndex: 0,
      explanation: "正解は「走れる」です。",
      sectionId: "grammar",
    },
    {
      id: 86,
      question: `先生は今、お電話を（86）おられます。

86に入る言葉は？`,
      choices: ["かけて", "かけ", "し", "なさって"],
      correctIndex: 0,
      explanation: "正解は「かけて」です。",
      sectionId: "grammar",
    },
    {
      id: 87,
      question: `明日は雨が（87）でしょう。

87に入る言葉は？`,
      choices: ["降る", "降り", "降って", "降ら"],
      correctIndex: 0,
      explanation: "正解は「降る」です。",
      sectionId: "grammar",
    },
    {
      id: 88,
      question: `最近の若者は本を読まないと言われるが、実際はインターネットで大量の文章を読んでいる。形式が変わっただけで、読書量は減っていない。

筆者の最も言いたいことは？`,
      choices: ["本を読め", "読書量は減っていない", "ネットは悪い", "若者は勉強不足"],
      correctIndex: 1,
      explanation: "正解は「読書量は減っていない」です。",
      sectionId: "reading",
    },
    {
      id: 89,
      question: `失敗を恐れて何もしないより、挑戦して失敗するほうが価値がある。その経験が将来の成功につながるからだ。

なぜ挑戦するほうがいいのか。`,
      choices: ["成功するから", "経験が将来に役立つ", "失敗しないから", "暇つぶしになる"],
      correctIndex: 1,
      explanation: "正解は「経験が将来に役立つ」です。",
      sectionId: "reading",
    },
    {
      id: 90,
      question: `メールは便利だが誤解を招くこともある。大切な話は直接会って話すか、電話ですべきだ。そのほうが気持ちが伝わるからだ。

大切な話はどうすべきか。`,
      choices: ["メールでする", "会うか電話でする", "手紙を書く", "誰にも言わない"],
      correctIndex: 1,
      explanation: "正解は「会うか電話でする」です。",
      sectionId: "reading",
    },
    {
      id: 91,
      question: `睡眠不足は健康だけでなく効率も下げる。しっかり休むことは働くことと同じくらい重要だということを忘れてはならない。

休むことについてどう述べているか。`,
      choices: ["働くより大切", "働くのと同じくらい重要", "効率を上げるのみ", "健康に悪い"],
      correctIndex: 1,
      explanation: "正解は「働くのと同じくらい重要」です。",
      sectionId: "reading",
    },
    {
      id: 92,
      question: `【募集】週末のゴミ拾いボランティア。日時：土曜10時。場所：駅前広場。雨天中止。申込不要。直接来てください。

参加したい人はどうすればいい？`,
      choices: ["申込書を書く", "土曜に駅前へ行く", "電話予約する", "友達を誘う"],
      correctIndex: 1,
      explanation: "正解は「土曜に駅前へ行く」です。",
      sectionId: "reading",
    },
    {
      id: 93,
      question: `(92と同じ本文)

雨が降ったらどうなりますか。`,
      choices: ["室内で実施", "中止になる", "日曜に延期", "事務局へ聞く"],
      correctIndex: 1,
      explanation: "正解は「中止になる」です。",
      sectionId: "reading",
    },
    {
      id: 94,
      question: `日本の家は夏を基準に作られてきた。風通しを良くして涼しくするためだ。しかし、冬は非常に寒いという欠点がある。

なぜ日本の家は風通しがいい？`,
      choices: ["冬が寒いから", "夏に涼しくするため", "工事が簡単だから", "見た目がいいから"],
      correctIndex: 1,
      explanation: "正解は「夏に涼しくするため」です。",
      sectionId: "reading",
    },
    {
      id: 95,
      question: `(94と同じ本文)

日本の家の欠点は何ですか。`,
      choices: ["夏に暑すぎる", "冬に寒い", "風が通らない", "維持費が高い"],
      correctIndex: 1,
      explanation: "正解は「冬に寒い」です。",
      sectionId: "reading",
    },
    {
      id: 96,
      question: `毎日日記を書いている。その日の出来事を振り返ることで、明日の目標が明確になるからだ。三ヶ月続いて、大きな自信になった。

なぜ日記を書いている？`,
      choices: ["字の練習のため", "明日の目標を明確にするため", "記録に残すため", "褒められたいから"],
      correctIndex: 1,
      explanation: "正解は「明日の目標を明確にするため」です。",
      sectionId: "reading",
    },
    {
      id: 97,
      question: `(96と同じ本文)

「自信になった」のはなぜか。`,
      choices: ["褒められたから", "継続できたから", "目標が達成したから", "暇だったから"],
      correctIndex: 1,
      explanation: "正解は「継続できたから」です。",
      sectionId: "reading",
    },
    {
      id: 98,
      question: `言葉の意味は時代とともに変わる。昔は悪い意味だった言葉が、今はいい意味で使われることもある。だから言葉は面白いのだ。

筆者は言葉の何が面白いと言っている？`,
      choices: ["覚えやすさ", "意味が変わること", "書き方の難しさ", "種類の多さ"],
      correctIndex: 1,
      explanation: "正解は「意味が変わること」です。",
      sectionId: "reading",
    },
    {
      id: 99,
      question: `(98と同じ本文)

昔と今の言葉の違いについて正しいのは？`,
      choices: ["意味が変わる場合がある", "音が変わった", "使いにくくなった", "消えてしまった"],
      correctIndex: 0,
      explanation: "正解は「意味が変わる場合がある」です。",
      sectionId: "reading",
    },
    {
      id: 100,
      question: `山登りでは無理をしないことが大切だ。疲れたら休む。天候が悪くなったら引き返す。それが自分を守る唯一のルールだ。

山登りのルールは何ですか。`,
      choices: ["早く登りきる", "無理をしない", "一人で登る", "頂上まで必ず行く"],
      correctIndex: 1,
      explanation: "正解は「無理をしない」です。",
      sectionId: "reading",
    },
  ],
}
