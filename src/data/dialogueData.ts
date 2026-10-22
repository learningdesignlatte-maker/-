import { teacherAvatar, studentAvatar } from '../assets';

export interface DialogueMessage {
  speaker: 'teacher' | 'student';
  speakerName: string;
  avatarUrl: string;
  text: string;
  emphasis?: string;
  tag?: string;
}

export interface DialogueTopic {
  id: string;
  title: string;
  shortDesc: string;
  messages: DialogueMessage[];
}

export const DIALOGUE_TOPICS: DialogueTopic[] = [
  {
    id: 'trouble',
    title: 'よくあるお悩み「なぜか先に進めない！」',
    shortDesc: '行政や試験の入力で誰もが一度はつまずく理由',
    messages: [
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: '先生、この前、市役所の電子申請と資格試験の申し込みをネットでしたんですけど…何回「次へ」を押しても赤文字でエラーが出て、結局最後まで申し込めなかったんです…！',
        emphasis: '何回「次へ」を押しても赤文字でエラー',
        tag: 'あるある！',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: 'あるあるですね！実は教室でも、一番多く寄せられるご相談なんです。「ちゃんと正確に入れたはずなのに、どうして！？」って本当に焦ってしまいますよね。',
        emphasis: '教室でも一番多いご相談',
        tag: '共感',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: 'そうなんです！何回見直しても間違いが分からなくて、疲れ果てて画面を閉じちゃいました…。',
      },
    ],
  },
  {
    id: 'zen_vs_han',
    title: '最大の落とし穴「全角と半角」',
    shortDesc: '見た目は同じでもパソコンにとっては別物！',
    messages: [
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: '一番多い原因は「住所の番地」です。よく注意書きに『※住所の数字・番地は全角で入力してください』と書いてあるのに、キーボードの普段の打ち方で「1-1」と半角で打ってしまうケースです。',
        emphasis: '※住所の数字・番地は全角で入力してください',
        tag: '最大の落とし穴',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: 'えっ！「1-1」と「１－１」って、目で見るとほとんど同じなのに、ダメなんですか！？',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: 'そうなんです！人間には同じに見えても、行政や試験の古いコンピューターにとっては「全く別の文字」と判定されてしまうんです。全角は正方形（マス目いっぱい）、半角はその半分の幅の文字ですね。',
        emphasis: '「全く別の文字」と判定されてしまう',
        tag: '仕組み',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: 'なるほど！文字の幅が違ったんですね。カタカナの「フリガナ」を平仮名で打ってしまったり、電話番号にハイフンを入れて弾かれることもありそうです。',
      },
    ],
  },
  {
    id: 'patterns',
    title: 'サイトによって違う「3つの入力パターン」',
    shortDesc: '警告が出るタイミングがサイトによって全く違います',
    messages: [
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: 'ウェブサイトの仕組みによって、注意してくれるタイミングが主に3種類あります。今回はごちゃ混ぜにせず、1つずつ体験できるようにしました！',
        emphasis: 'サイトによって違う3つのパターン',
        tag: 'ここを練習！',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: '【パターン①：一括警告型】行政や試験に一番多い！入力中は何も言われないのに、下の「次へ」を押した瞬間に、画面の上にドカンと赤い文字で「※住所は全角で入力してください」と警告が出るタイプです。',
        emphasis: '【パターン①】「次へ」を押した瞬間に画面上に赤い警告文',
        tag: 'パターン①',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: '私が引っかかったのはまさにそれです！上の方に赤い文字が出て、入力欄がピンクや赤枠になるやつですね。',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: '【パターン②：うっすら入力例型】入力欄の中に最初から薄いグレーで「例：千代田１－１」と入っているタイプです。「もう入っているから飛ばしていいの？」と勘違いしたり、例と違う形式で打つミスが起きやすいです。',
        emphasis: '【パターン②】最初から薄いグレーの例（プレースホルダー）がある',
        tag: 'パターン②',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: '【パターン③：即時判定・ピンク背景型】入力欄から次のマスに移動した瞬間に、背景がピンク色になって「※全角で入力してください」と即座に教えてくれる親切なタイプです。',
        emphasis: '【パターン③】マスを移動した瞬間にピンク色に変化',
        tag: 'パターン③',
      },
    ],
  },
  {
    id: 'rules',
    title: '安全な練習ルールとお手本カード',
    shortDesc: '本人の個人情報は入れず、見本カードを使います',
    messages: [
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: '練習の大事なお約束です！セキュリティのため、生徒さんご自身の本当の名前や住所は絶対に入力しないでください。画面の上に「見本カード（運転免許証風）」を常時表示しておきます！',
        emphasis: 'ご自身の本名は絶対に入力しない！画面の「見本カード」を使用',
        tag: '安心・安全',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: '免許証カードが画面の上についてきてくれるなら、架空の住所でも忘れる心配がなくて安心ですね！男性の山田さんと、女性の佐藤さんを選べるんですね。',
      },
      {
        speaker: 'teacher',
        speakerName: '先生',
        avatarUrl: teacherAvatar,
        text: 'パソコンのキーボードでも、スマホのタップでもどちらでも練習できますよ。わざと間違えてみて、どんな警告文が出るかを確かめるのも大歓迎です！',
        tag: '準備完了',
      },
      {
        speaker: 'student',
        speakerName: '生徒さん',
        avatarUrl: studentAvatar,
        text: 'よし、仕組みがよくわかりました！それでは早速やってみましょう！',
        emphasis: 'それではやってみましょう！',
      },
    ],
  },
];
