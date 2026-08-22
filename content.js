const subjunctiveCourse = {
  structureVersion: 2,
  objectives: [
    "通常の条件文と仮定法を、現実との距離から見分けられる。",
    "現在・過去・未来の仮定に合う動詞の形を選べる。",
    "願望・後悔・類似表現で、wish や If only の形を使い分けられる。",
    "混合仮定法や定型表現、倒置を文の意味と結び付けて読める。"
  ],
  sections: [
    { id: "reality-and-distance", title: "現実と仮定の区別", lead: "通常の条件文と、現実から距離を置く仮定法を見分けます。", lessonIds: ["conditionals-vs-subjunctive", "past-subjunctive", "past-perfect-subjunctive"] },
    { id: "wishes-and-regrets", title: "願望と後悔", lead: "現在・過去の願望や後悔を wish と If only で表します。", lessonIds: ["wish-subjunctive", "if-only-subjunctive", "mixed-subjunctive"] },
    { id: "fixed-expressions", title: "定型表現", lead: "条件以外の場面で使う仮定法の定型表現を整理します。", lessonIds: ["if-it-were-not-for", "as-if-subjunctive", "it-is-time-subjunctive-past"] },
    { id: "future-and-inversion", title: "未来の仮定と倒置", lead: "可能性の低い未来の仮定と、if を省略する形を学びます。", lessonIds: ["future-subjunctive-should", "future-subjunctive-were-to", "subjunctive-inversion"] }
  ],
  overview: {
    title: "仮定法とは",
    html: `
      <p>仮定法は、現在・過去の事実から距離を置いた想像、願望、後悔、または可能性を控えめに扱う未来の仮定を表します。</p>
      <p>現在について述べる場合でも、現実から距離を置くため過去形を使うことがあります。過去について事実と異なることを述べる場合は <code>had + 過去分詞</code> を使います。</p>
      <blockquote><p>If I have time tonight, I will read this book.<br>今夜時間ができる可能性があるので、時間があればこの本を読みます。</p></blockquote>
      <blockquote><p>If I had more time, I would read more books.<br>実際には十分な時間がないので、もっと時間があればもっと多くの本を読むのに。</p></blockquote>
      <p><code>if</code> を使う文がすべて仮定法ではありません。願望は <code>I wish</code>、より強い願望・後悔は <code>If only</code> の単元で扱います。</p>
      <p class="note">判断順は「いつの話か → 現実との関係 → 条件・願望・定型表現のどれか → 必要な形」です。</p>`
  },
  lessons: [
    {
      id: "conditionals-vs-subjunctive",
      version: 1,
      title: "条件文と仮定法の違い",
      html: `
        <p><code>if</code> の有無だけで仮定法と判断してはいけません。まず、条件が現実に起こり得るものか、現実から距離を置いた仮定かを確認します。</p>
        <details class="section" open>
        <summary>現実に起こり得る条件</summary>
        <div class="formula">If + 主語 + 現在形, 主語 + will / can + 動詞の原形</div>
        <blockquote><p>If it rains tomorrow, we will stay home.<br>明日雨が降る可能性があるので、家にいます。</p></blockquote>
        <p>未来の条件でも、<code>if</code> 節では通常現在形を使います。</p>
        </details>
        <details class="section" open>
        <summary>現実から距離を置いた仮定</summary>
        <div class="formula">If + 主語 + 過去形, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If it rained every day here, we would stay home more often.<br>ここで毎日雨が降るなら、もっと家にいるのに。</p></blockquote>
        </details>
        <details class="section" open>
        <summary>判断手順</summary>
        <ol><li>条件が現実に起こり得るものとして提示されているか確認する。</li><li>現在の事実に反する、または実現可能性を低く見ているか確認する。</li><li>現実的なら通常の条件文、距離を置くなら仮定法を選ぶ。</li></ol>
        </details>`,
      questions: [
        {
          id: "conditionals-vs-subjunctive-q1",
          text: "The forecast says rain is likely tomorrow. If it (　　), we will stay home.",
          choices: ["rains", "rained", "had rained", "would rain"],
          answer: 0,
          explanation: "明日の雨は予報で現実に起こり得る条件です。現実的な条件なので、if節は現在形の rains を使います。",
          translation: "天気予報では明日は雨の可能性が高い。もし雨が降ったら、私たちは家にいます。",
          takeaway: "現実に起こり得る未来の条件は、if節を現在形にする。",
          diagram: { left: "if + 現在形", label: "現実的な条件", right: "will + 原形" }
        },
        {
          id: "conditionals-vs-subjunctive-q2",
          text: "I do not know her number. If I (　　) it, I would call her.",
          choices: ["know", "knew", "had known", "will know"],
          answer: 1,
          explanation: "実際には番号を知らないという文脈で、現実から距離を置いた仮定です。現在の仮定法なので過去形の knew を選びます。",
          translation: "私は彼女の番号を知らない。もし知っていれば、彼女に電話するのに。",
          takeaway: "現在の事実に反する仮定は、if節を過去形にする。",
          diagram: { left: "if + knew", label: "現在の反実仮想", right: "would + call" }
        },
        {
          id: "conditionals-vs-subjunctive-q3",
          text: "「現実に起こり得る未来の条件を表す文」を選びなさい。",
          choices: ["If I were you, I would apologize.", "If she had studied, she would have passed.", "If the train is late, I will call you.", "If I had more time, I could help."],
          answer: 2,
          explanation: "3は列車が遅れる可能性を述べる現実的な条件です。現実的な条件では if節に現在形 is、主節に will を使います。",
          translation: "列車が遅れたら、あなたに電話します。",
          takeaway: "通常の未来条件では、if節に現在形、主節にwillを使う。",
          diagram: { left: "if節: is", label: "通常の未来条件", right: "主節: will + 原形" }
        }
      ]
    },
    {
      id: "past-subjunctive",
      version: 2,
      title: "仮定法過去",
      html: `
        <p>仮定法過去は、現在または未来について、事実と異なる状況や可能性を低く見た状況を表します。先に現実的な条件か仮定法かを判断し、現在の反事実ならこの形を使います。</p>
        <div class="formula">If + 主語 + 過去形, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If she knew the answer, she could help us.<br>実際には答えを知らないので、知っていれば助けられるのに。</p></blockquote>
        <p>be動詞では、標準的で改まった基本形として主語にかかわらず <code>were</code> を使います。会話では <code>If I was ...</code> と聞こえることもありますが、この教材では反事実の標準形 <code>were</code> を基本・正解として扱います。</p>
        <blockquote><p>If I were you, I would accept the offer.<br>もし私があなたなら、その申し出を受けます。</p></blockquote>
        <p class="note">判断するときは、①いつの話か、②事実か反実仮想か、③条件節と結果節の形が対応しているか、の順に確認します。</p>`,
      questions: [
        {
          id: "past-subjunctive-q1",
          text: "If I (　　) you, I would accept the offer.",
          choices: ["am", "was", "have been", "were"],
          answer: 3,
          explanation: "現在の反実仮想で、be動詞の標準形を問う問題です。仮定法過去では、主語が I でも標準形の were を使います。",
          translation: "もし私があなたなら、その申し出を受け入れるでしょう。",
          takeaway: "現在の反実仮想では、be動詞をwereにするのが基本。",
          diagram: { left: "If + 過去形", label: "現在の反実仮想", right: "would + 原形" }
        },
        {
          id: "past-subjunctive-q2",
          text: "If I had enough money, I (　　) a new bicycle.",
          choices: ["will buy", "could buy", "bought", "could have bought"],
          answer: 1,
          explanation: "十分なお金がない現在の反実仮想です。結果は現在の可能なので、could + 動詞の原形の could buy を選びます。現在の反事実と過去の反事実を混同しません。",
          translation: "もし十分なお金があれば、新しい自転車を買えるのに。",
          takeaway: "現在の反実仮想の結果は、could・would・might + 動詞の原形。",
          diagram: { left: "If + had money", label: "現在の仮定", right: "could + buy" }
        },
        {
          id: "past-subjunctive-q3",
          text: "I still have my key. If I lost it, I (　　) able to lock the door.",
          choices: ["will be", "would have been", "wouldn’t be", "am not"],
          answer: 2,
          explanation: "今は鍵を持っているという事実から距離を置いた現在の仮定です。現実から距離を置く結果なので、wouldn’t be able to とします。",
          translation: "今は鍵を持っています。もしそれをなくしたら、ドアに鍵をかけられないでしょう。",
          takeaway: "if節が現在の反実仮想なら、主節もwould + 原形でそろえる。",
          diagram: { left: "If I lost it", label: "現在の仮定", right: "wouldn't be able" }
        }
      ]
    },
    {
      id: "past-perfect-subjunctive",
      version: 3,
      title: "仮定法過去完了",
      html: `
        <p>仮定法過去完了は、過去の事実とは異なる条件を表します。条件だけでなく、結果がいつのことかも確認します。</p>
        <div class="formula">If + 主語 + had + 過去分詞, 主語 + would / could / might have + 過去分詞</div>
        <blockquote><p>If I had studied harder, I would have passed the exam.<br>もっと勉強していたら、試験に合格していただろうに。</p></blockquote>
        <p>条件も結果も過去なら仮定法過去完了です。<code>had + 過去分詞</code> を見ただけで、主節を自動的に <code>would have + 過去分詞</code> にするのではなく、結果の時点を読みます。過去の条件から現在の結果なら、後のミックス仮定法になります。</p>
        <p class="note">Q1は条件節、Q2は結果節の形を確認します。</p>`,
      questions: [
        {
          id: "past-perfect-subjunctive-q1",
          text: "If she (　　) earlier, she would have caught the train.",
          choices: ["leaves", "left", "would leave", "had left"],
          answer: 3,
          explanation: "条件節が過去の事実と異なることを表しています。条件節では had + 過去分詞の had left を使います。",
          translation: "もし彼女がもっと早く出発していたら、列車に間に合っていただろう。",
          takeaway: "過去の反実仮想の条件節は、had + 過去分詞。",
          diagram: { left: "If + had + 過去分詞", label: "過去の反実仮想", right: "would have + 過去分詞" }
        },
        {
          id: "past-perfect-subjunctive-q2",
          text: "If he had listened to the advice, he (　　) the mistake.",
          choices: ["would avoid", "will avoid", "would have avoided", "avoided"],
          answer: 2,
          explanation: "条件節はすでに had listened で示されています。ここでは過去の結果節なので、would have + 過去分詞の would have avoided を使います。",
          translation: "もし彼がその助言を聞いていたら、その間違いを避けられただろう。",
          takeaway: "過去の反実仮想の結果節は、would・could・might have + 過去分詞。",
          diagram: { left: "had listened", label: "過去の条件", right: "would have avoided" }
        },
        {
          id: "past-perfect-subjunctive-q3",
          text: "If I had won the lottery last year, I (　　) a new car immediately, but I did not win.",
          choices: ["would buy", "bought", "would have bought", "would have been buying"],
          answer: 2,
          explanation: "last year が条件を過去に置き、immediately がその直後の過去の結果を示します。結果も過去なので、would have bought を選びます。",
          translation: "もし去年宝くじに当たっていたら、すぐに新しい車を買っていただろう。でも、私は当たらなかった。",
          takeaway: "条件と結果の時点を確認し、過去の結果ならwould have + 過去分詞。",
          diagram: { left: "last year", label: "過去の結果", right: "would have bought" }
        }
      ]
    },
    {
      id: "wish-subjunctive",
      version: 1,
      title: "I wish + 仮定法",
      html: `
        <p><code>I wish</code> の後ろでは、現在の事実に反する願望、現在の能力への願望、過去への後悔、状況の変化への願いを時点で区別します。</p>
        <details class="section" open><summary>現在の事実に反する願望</summary><div class="formula">wish + 主語 + 過去形</div><blockquote><p>I wish I had more free time.<br>もっと自由な時間があればいいのに。</p></blockquote></details>
        <details class="section" open><summary>現在の能力に関する願望</summary><div class="formula">wish + 主語 + could + 動詞の原形</div><blockquote><p>I wish I could speak English better.<br>もっと上手に英語を話せたらいいのに。</p></blockquote></details>
        <details class="section" open><summary>過去への後悔</summary><div class="formula">wish + 主語 + had + 過去分詞</div><blockquote><p>I wish I had studied harder.<br>もっと勉強しておけばよかった。</p></blockquote></details>
        <details class="section" open><summary>状況の変化を望む would</summary><div class="formula">wish + 主語 + would + 動詞の原形</div><blockquote><p>I wish it would stop raining.<br>雨がやんでくれればいいのに。</p></blockquote><p><code>would</code> は、話し手が制御できない状況や他者の行動の変化を望む場合を中心に使います。単なる未来の希望を表す形として広げません。自分自身の意志的な行動には通常 <code>I wish I would ...</code> としないことは発展注意です。</p></details>`,
      questions: [
        {
          id: "wish-subjunctive-q1",
          text: "I wish I (　　) more free time now.",
          choices: ["have", "had", "had had", "will have"],
          answer: 1,
          explanation: "now の現在の事実に反する願望です。現在の願望なので wish + 過去形の had を使います。",
          translation: "今、もっと自由な時間があればいいのに。",
          takeaway: "現在の事実に反する願望は、wish + 過去形で表す。",
          diagram: { left: "wish + 過去形", label: "現在の願望", right: "nowの事実と反対" }
        },
        {
          id: "wish-subjunctive-q2",
          text: "I wish I (　　) harder for yesterday’s test.",
          choices: ["study", "studied", "had studied", "would study"],
          answer: 2,
          explanation: "yesterday’s test は過去の出来事です。過去への後悔なので wish + had + 過去分詞の had studied を使います。",
          translation: "昨日の試験に向けて、もっと一生懸命勉強していればよかったのに。",
          takeaway: "過去の事実への後悔は、wish + had + 過去分詞。",
              diagram: { left: "wish + had + pp", label: "過去の後悔", right: "yesterday's test" }
        },
        {
          id: "wish-subjunctive-q3",
          text: "I wish it (　　) raining soon.",
          choices: ["stops", "stopped", "would stop", "had stopped"],
          answer: 2,
          explanation: "雨という話し手が制御できない状況の変化を望んでいます。状況の変化なので wish + would の would stop を使います。",
          translation: "もうすぐ雨がやめばいいのに。",
          takeaway: "自分で制御しにくい状況の変化を望むときは、wish + would。",
          diagram: { left: "wish + would", label: "状況の変化", right: "stop raining" }
        }
      ]
    },
    {
      id: "if-only-subjunctive",
      version: 1,
      title: "If only + 仮定法",
      html: `
        <p><code>If only</code> は、<code>I wish</code> とほぼ同じ時制選択で、願望・後悔をより強く感情的に表します。</p>
        <p><code>If only ...!</code> のように、主節なしで強い願望・後悔を表せます。ただし <code>If only</code> を含むすべての文を扱うのではなく、この単元では単独の願望表現に範囲を限定します。</p>
        <details class="section" open><summary>現在の強い願望</summary><div class="formula">If only + 主語 + 過去形</div><blockquote><p>If only she were here!<br>彼女がここにいてくれさえすれば。</p></blockquote></details>
        <details class="section" open><summary>能力に関する強い願望</summary><div class="formula">If only + 主語 + could + 動詞の原形</div><blockquote><p>If only I could fly!<br>飛べさえすれば。</p></blockquote></details>
        <details class="section" open><summary>過去の強い後悔</summary><div class="formula">If only + 主語 + had + 過去分詞</div><blockquote><p>If only I had listened to your advice!<br>あなたの助言を聞いてさえいれば。</p></blockquote></details>`,
      questions: [
        {
          id: "if-only-subjunctive-q1",
          text: "If only she (　　) here with us now!",
          choices: ["is", "were", "had been", "will be"],
          answer: 1,
          explanation: "now の現在についての現実から距離を置いた、現在の強い願望です。be動詞の標準形 were を使います。",
          translation: "彼女が今ここに私たちと一緒にいればいいのに。",
          takeaway: "If only + 過去形は、現在についての強い願望を表す。",
          diagram: { left: "If only + 過去形", label: "強い現在の願望", right: "were + 補語" }
        },
        {
          id: "if-only-subjunctive-q2",
          text: "If only I (　　) play the piano better!",
          choices: ["can", "could", "had", "would have"],
          answer: 1,
          explanation: "これは現在の能力についての強い願望です。能力を表す could + 動詞の原形の could play を使います。",
          translation: "もっと上手にピアノを弾けたらいいのに。",
          takeaway: "現在の能力への強い願望では、could + 動詞の原形を使う。",
          diagram: { left: "could + 原形", label: "現在の能力", right: "play better" }
        },
        {
          id: "if-only-subjunctive-q3",
          text: "If only we (　　) the earlier train yesterday!",
          choices: ["catch", "caught", "had caught", "would catch"],
          answer: 2,
          explanation: "yesterday の過去の出来事への、過去の強い後悔です。had + 過去分詞の had caught を使います。",
          translation: "昨日、もっと早い列車に乗っていればよかったのに。",
          takeaway: "If only + had + 過去分詞は、過去への強い後悔を表す。",
          diagram: { left: "If only + had", label: "過去の後悔", right: "caught train" }
        }
      ]
    },
    {
      id: "mixed-subjunctive",
      version: 2,
      title: "ミックス仮定法",
      html: `
        <p>ミックス仮定法は、過去の条件と現在の結果を組み合わせます。<code>then</code> や <code>last year</code> は過去の条件、<code>now</code>・<code>today</code>・<code>at present</code> は現在の結果の手掛かりです。</p>
        <div class="formula">If + 主語 + had + 過去分詞, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If I had taken the job, I would live in Tokyo now.<br>あのときその仕事を引き受けていたら、今は東京に住んでいるだろうに。</p></blockquote>
        <p>過去の選択が現在の状態につながるため、結果は <code>would / could / might + 動詞の原形</code> です。基本形は <code>would live</code> のように考えます。</p>
        <blockquote><p>If I had taken your advice then, I would be happier now.</p></blockquote>
        <p class="note">進行中であることを強調する文脈では <code>would be living</code> のような進行形も可能ですが、まず基本形を定着させます。</p>`,
      questions: [
        {
          id: "mixed-subjunctive-q1",
          text: "If I had taken that job, I (　　) in London now.",
          choices: ["live", "lived", "would live", "would have lived"],
          answer: 2,
          explanation: "過去の条件から now の現在の結果を述べています。ミックス仮定法の基本形なので、would + 動詞の原形の would live を使います。",
          translation: "もしその仕事を受けていたら、今ごろロンドンに住んでいるだろう。",
          takeaway: "過去の条件と現在の結果を組み合わせると、would + 原形になる。",
          diagram: { left: "had + 過去分詞", label: "過去の条件", right: "would + 原形" }
        },
        {
          id: "mixed-subjunctive-q2",
          text: "If I had taken your advice then, I (　　) happier now.",
          choices: ["am", "can be", "would be", "might have been"],
          answer: 2,
          explanation: "then が過去の条件、now が現在の結果を示しています。現在の結果なので would be を使います。",
          translation: "もしそのとき君の助言を聞いていたら、今ごろもっと幸せだろう。",
          takeaway: "thenは過去、nowは現在。結果の時点に合わせてwould be。",
          diagram: { left: "then: had + pp", label: "過去の条件", right: "now: would be" }
        },
        {
          id: "mixed-subjunctive-q3",
          text: "If she had gone to bed earlier, she (　　) so tired now.",
          choices: ["would not be", "would not have been", "is not", "had not been"],
          answer: 0,
          explanation: "過去に早く寝なかったことが now の現在の疲労につながっています。結果は現在なので would not be を使います。",
          translation: "もしもっと早く寝ていたら、今こんなに疲れていないだろう。",
          takeaway: "条件の時点と結果の時点が異なるとき、主節の形は結果の時点で決める。",
          diagram: { left: "earlier: had gone", label: "nowの結果", right: "wouldn't be tired" }
        }
      ]
    },
    {
      id: "if-it-were-not-for",
      version: 2,
      title: "If it were not for",
      html: `
        <p><code>If it were not for + 名詞</code> は、現在の事実を前提に「もし～がなければ」と仮定する表現です。</p>
        <div class="formula">If it were not for + 名詞, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If it were not for your help, I could not finish this work.<br>実際にはあなたの助けがあるので、助けがなければ終えられないでしょう。</p></blockquote>
        <p><code>Without + 名詞</code> には時制がありません。現在か過去かは、主節と文脈から判断します。</p>
        <blockquote><p>Without water, we could not survive.<br>If it were not for water, we could not survive.</p></blockquote>
        <p>過去の事実なら <code>If it had not been for ...</code> / <code>Without ... , would/could have ...</code> とします。実際には助け・太陽・助言が存在する、または存在したことを確認します。</p>`,
      questions: [
        {
          id: "if-it-were-not-for-q1",
          text: "If it (　　) for your help, I could not finish this work.",
          choices: ["is not", "were not", "had not", "would not be"],
          answer: 1,
          explanation: "現在は実際にあなたの助けがあるという事実に反する条件です。現在の If it were not for を使います。",
          translation: "あなたの助けがなければ、私はこの仕事を終えられない。",
          takeaway: "現在の「〜がなければ」はIf it were not for + 名詞。",
          diagram: { left: "were not for + 名詞", label: "現在の「〜がなければ」", right: "could / would + 原形" }
        },
        {
          id: "if-it-were-not-for-q2",
          text: "If it were not for the sun, nothing (　　) live on Earth.",
          choices: ["can", "has", "could", "did"],
          answer: 2,
          explanation: "実際には太陽が存在する現在の仮定です。主節は could + 動詞の原形の could live になります。",
          translation: "太陽がなければ、地球上で何も生きられないだろう。",
          takeaway: "If it were not forの主節は、would・could・might + 原形。",
          diagram: { left: "nothing", label: "主節の可能", right: "could live" }
        },
        {
          id: "if-it-were-not-for-q3",
          text: "If it (　　) your advice, I would have made a serious mistake.",
          choices: ["were not for", "had not been for", "would not be for", "has not been for"],
          answer: 1,
          explanation: "実際には過去に助言があったため、重大な間違いをしなかったという文脈です。過去の If it had not been for を使います。",
          translation: "あなたの助言がなければ、私は重大な間違いをしていただろう。",
          takeaway: "過去の「〜がなければ」はIf it had not been for + 名詞。",
          diagram: { left: "had not been for", label: "過去の条件", right: "would have made" }
        }
      ]
    },
    {
      id: "as-if-subjunctive",
      version: 2,
      title: "as if + 仮定法",
      html: `
        <p><code>as if</code> 自体が必ず反事実を表すわけではありません。話し手が事実ではないと考える場合と、本当にそうかもしれない様子を述べる場合を分けます。</p>
        <details class="section" open><summary>事実ではないと考える場合</summary>
        <p>主節と同じ時点の反事実なら <code>as if + 過去形</code>、主節より前の反事実なら <code>as if + had + 過去分詞</code> を使います。</p>
        <blockquote><p>He talks as if he knew everything, but in fact he does not.</p></blockquote>
        <blockquote><p>She looked as if she had seen a ghost, but of course she had not.</p></blockquote>
        </details>
        <details class="section" open><summary>本当にそうかもしれない様子</summary>
        <p>本当にそうかもしれない場合は通常の時制も使えます。</p>
        <blockquote><p>It looks as if it is going to rain.</p></blockquote>
        <p>これは雨が降らないという反事実ではありません。</p>
        </details>
        <p class="note">仮定法過去は単純な「現在」ではなく主節と同じ時点、仮定法過去完了は主節より前の仮定を表します。</p>`,
      questions: [
        {
          id: "as-if-subjunctive-q1",
          text: "He talks as if he (　　) everything, but in fact he does not.",
          choices: ["knows", "knew", "had known", "will know"],
          answer: 1,
          explanation: "but in fact he does not から、実際には知らない同時点の反事実だと分かります。as if + 過去形の knew を使います。",
          translation: "彼は、実際にはすべてを知っていないのに、何でも知っているかのように話す。",
          takeaway: "as ifの内容が現在の反実仮想なら、過去形を使う。",
          diagram: { left: "as if + 過去形", label: "同時点の反実仮想", right: "実際は違う" }
        },
        {
          id: "as-if-subjunctive-q2",
          text: "She treats me as if I (　　) a child, but I am an adult.",
          choices: ["am", "was", "were", "had been"],
          answer: 2,
          explanation: "but I am an adult が現在の事実を示します。同じ時点の反事実で、be動詞の標準形 were を使います。",
          translation: "彼女は、私が大人なのに、まるで子どものように私を扱う。",
          takeaway: "be動詞の現在の反実仮想は、主語に関係なくwere。",
          diagram: { left: "I am an adult", label: "事実と反対", right: "as if I were" }
        },
        {
          id: "as-if-subjunctive-q3",
          text: "She looked as if she (　　) a ghost, but she had not.",
          choices: ["sees", "saw", "has seen", "had seen"],
          answer: 3,
          explanation: "but she had not から、幽霊を見ていない反事実です。見る出来事は looked より前なので had seen を使います。",
          translation: "彼女は、実際には見ていないのに、幽霊を見たかのような様子だった。",
          takeaway: "主節より前の反実仮想は、as if + had + 過去分詞。",
          diagram: { left: "looked", label: "過去より前", right: "as if had seen" }
        }
      ]
    },
    {
      id: "it-is-time-subjunctive-past",
      version: 2,
      title: "It is time + 仮定法過去",
      html: `
        <p>次の3形式は似ていますが、含みが異なります。</p>
        <ul><li><code>It is time to start the meeting.</code>：会議を始める時間だ。</li><li><code>It is time for us to start the meeting.</code>：私たちが会議を始める時間だ。</li><li><code>It is time we started the meeting.</code>：もう会議を始めてもよいころだ。まだ始めていないことを意識する。</li></ul>
        <div class="formula">It is time + 主語 + 過去形</div>
        <p>過去形は過去の出来事ではなく、「もう実行してよいころなのに、まだ実行していない」という現在との距離を表します。</p>
        <details class="section"><summary>about time・high time</summary><p><code>about time / high time</code> は、遅れているという強い催促や不満を加えます。</p><blockquote><p>It is high time he found a job.</p></blockquote></details>`,
      questions: [
        {
          id: "it-is-time-subjunctive-past-q1",
          text: "It is time you (　　) to bed.",
          choices: ["go", "went", "have gone", "will go"],
          answer: 1,
          explanation: "It is time + 主語 + 過去形は、現在の「もう～するころだ」を表します。過去形の went を使います。",
          translation: "もう寝る時間です。",
          takeaway: "It is time + 主語 + 過去形は、もう〜するころだという催促。",
          diagram: { left: "It is time + 主語", label: "もう〜するころ", right: "過去形" }
        },
        {
          id: "it-is-time-subjunctive-past-q2",
          text: "「私たちはまだ会議を始めておらず、もう始めてもよいころだ」という含みが最も明確な文を選びなさい。",
          choices: ["It is time to start the meeting.", "It is time for the meeting.", "It is time we started the meeting.", "It was time we start the meeting."],
          answer: 2,
          explanation: "まだ始めていないことへの催促を含むのは、It is time + 主語 + 過去形の It is time we started the meeting. です。",
          translation: "私たちは会議を始める時間です。",
          takeaway: "to不定詞は単なる時刻、主語付き過去形は未実施への催促を含む。",
          diagram: { left: "未実施の行動", label: "もう始める時期", right: "we started" }
        },
        {
          id: "it-is-time-subjunctive-past-q3",
          text: "It is high time he (　　) a job.",
          choices: ["finds", "found", "has found", "will find"],
          answer: 1,
          explanation: "It is high time + 主語 + 過去形は、強い催促や不満を表します。過去形の found を使います。",
          translation: "彼はもう仕事を見つけてもよいころだ。",
          takeaway: "It is high time + 主語 + 過去形は、強い催促や不満を表す。",
          diagram: { left: "It is high time", label: "強い催促", right: "he found" }
        }
      ]
    },
    {
      id: "future-subjunctive-should",
      version: 2,
      title: "仮定法未来（should）",
      html: `
        <p><code>if + 主語 + should + 動詞の原形</code> は「万一」の意味を持つことが多く、可能性を低く見る場合に加え、慎重・控えめ・改まった条件提示にも使います。</p>
        <div class="formula">If + 主語 + should + 動詞の原形, 主語 + will / would / can / could + 動詞の原形</div>
        <blockquote><p>If it should rain tomorrow, we will cancel the picnic.</p></blockquote>
        <p>if節の <code>should</code> は義務の「～すべき」ではありません。主節には will / would / can / could や命令文を、話し手の意図に応じて置きます。客観的な確率だけで意味を決めないようにします。</p>
        <blockquote><p>If anyone should call, tell them I’ll be back soon.</p></blockquote>`,
      questions: [
        {
          id: "future-subjunctive-should-q1",
          text: "If you (　　) any help, please contact me.",
          choices: ["should need", "should needed", "would need", "had needed"],
          answer: 0,
          explanation: "「万一助けが必要になれば」という慎重な未来条件です。should の後ろは原形 need で、should は義務の意味ではありません。",
          translation: "もし万一助けが必要になったら、私に連絡してください。",
          takeaway: "仮定法未来のshouldの後ろは動詞の原形。",
          diagram: { left: "should + 原形", label: "万一の未来", right: "please + 主節" }
        },
        {
          id: "future-subjunctive-should-q2",
          text: "If the weather should (　　) worse, we will cancel the game.",
          choices: ["gets", "got", "get", "getting"],
          answer: 2,
          explanation: "should の後ろは主語に関係なく動詞の原形です。ここでは get を選びます。",
          translation: "もし天気が悪化するようなことがあれば、試合を中止します。",
          takeaway: "shouldは主語に関係なく原形と組み合わせる。",
          diagram: { left: "weather should", label: "後ろは原形", right: "get worse" }
        },
        {
          id: "future-subjunctive-should-q3",
          text: "If the train (　　) be delayed, please call me.",
          choices: ["should", "would", "had", "was"],
          answer: 0,
          explanation: "「万一列車が遅れるようなことがあれば」という慎重な未来条件です。ここでの should は義務ではなく、if節の仮定法未来を作っています。",
          translation: "もし列車が遅れるようなことがあれば、私に連絡してください。",
          takeaway: "ここでのshouldは義務ではなく、万一の条件を表す。",
              diagram: { left: "train + should", label: "万一の条件", right: "please call" }
        }
      ]
    },
    {
      id: "future-subjunctive-were-to",
      version: 2,
      title: "仮定法未来（were to）",
      html: `
        <p><code>were to</code> は、未来の状況をいったん現実から切り離し、仮の案として思い描く表現です。起こりそうにない極端な状況にも、実務的な仮案・慎重な検討にも使えます。</p>
        <div class="formula">If + 主語 + were to + 動詞の原形, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If the sun were to disappear, life on Earth would not survive.<br>極端な状況を仮に思い描いています。</p></blockquote>
        <blockquote><p>If we were to reduce the price, sales might increase.<br>現実的な仮案として価格を下げる場合を検討しています。</p></blockquote>
        <p><code>should</code> は万一・慎重な条件提示、<code>were to</code> は状況を仮の案として切り離す表現です。単純な確率の順位として暗記しません。</p>`,
      questions: [
        {
          id: "future-subjunctive-were-to-q1",
          text: "If I (　　) abroad, I would choose Canada.",
          choices: ["were to live", "were living", "should lived", "had lived"],
          answer: 0,
          explanation: "未来の生活を仮の状況として思い描いています。were to の後ろは動詞の原形なので were to live です。",
          translation: "もし海外に住むことになったら、カナダを選ぶでしょう。",
          takeaway: "were to + 原形は、実現可能性を低く見た未来の仮定。",
          diagram: { left: "were to + 原形", label: "実現性の低い未来", right: "would + 原形" }
        },
        {
          id: "future-subjunctive-were-to-q2",
          text: "If she were to (　　) her job, she might move to another city.",
          choices: ["changed", "changing", "change", "changes"],
          answer: 2,
          explanation: "were to の後ろには動詞の原形を置きます。change が正解です。",
          translation: "もし彼女が仕事を変えるようなことがあれば、別の都市へ引っ越すかもしれない。",
          takeaway: "were toの後ろは必ず動詞の原形。",
          diagram: { left: "were to", label: "後ろは原形", right: "change jobs" }
        },
        {
          id: "future-subjunctive-were-to-q3",
          text: "If the sun were to disappear, life on Earth (　　) not survive.",
          choices: ["will", "would", "did", "has"],
          answer: 1,
          explanation: "仮の未来条件の主節には would / could / might + 動詞の原形を使います。would not survive となります。",
          translation: "もし太陽が消えるようなことがあれば、地球上の生命は生き残れないだろう。",
          takeaway: "were toの主節は、would・could・might + 原形。",
          diagram: { left: "were to disappear", label: "仮の未来条件", right: "would not survive" }
        }
      ]
    },
    {
      id: "subjunctive-inversion",
      version: 2,
      title: "仮定法の倒置",
      html: `
        <p>倒置は意味を変えず、文章語的・改まった表現にします。疑問文と同じ語順ですが疑問ではありません。</p>
        <p>まず文頭の <code>Had / Were / Should</code> を見つけ、元の if節に戻します。</p>
        <details class="section" open><summary>Had の倒置</summary><p><code>If I had known ...</code> → <code>Had I known ...</code></p><blockquote><p>Had I known the truth, I would have told you.<br>もし真実を知っていたなら、あなたに伝えていただろうに。</p></blockquote><p>実際には真実を知らず、伝えなかったという反事実です。</p></details>
        <details class="section" open><summary>Were の倒置</summary><p><code>If I were you ...</code> → <code>Were I you ...</code>。もし私があなたなら、という現実との距離を表します。</p><blockquote><p>Were I you, I would accept the offer.</p></blockquote></details>
        <details class="section" open><summary>Should の倒置</summary><p><code>If you should need ...</code> → <code>Should you need ...</code>。元の if節に戻せば意味を確認できます。</p><blockquote><p>Should you need any help, please contact me.</p></blockquote></details>`,
      questions: [
        {
          id: "subjunctive-inversion-q1",
          text: "(　　) I known the truth, I would have told you.",
          choices: ["Were", "Had", "Should", "Would"],
          answer: 1,
          explanation: "If I had known ... の if を省略し、had を主語の前に出した倒置です。元の if節に戻すと形を確認できます。",
          translation: "もし私が真実を知っていたら、あなたに話していただろう。",
          takeaway: "Had + 主語 + 過去分詞は、If + 主語 + had + 過去分詞の倒置。",
          diagram: { left: "Had + 主語 + 過去分詞", label: "ifの省略・倒置", right: "would have + 過去分詞" }
        },
        {
          id: "subjunctive-inversion-q2",
          text: "(　　) I you, I would accept the offer.",
          choices: ["Had", "Was", "Were", "Should"],
          answer: 2,
          explanation: "If I were you ... の if を省略した形です。Were I you は「もし私があなたなら」という反事実を表します。",
          translation: "もし私があなたなら、その申し出を受け入れるだろう。",
          takeaway: "Were + 主語は、If + 主語 + wereの倒置。",
          diagram: { left: "Were I you", label: "wereの倒置", right: "would accept" }
        },
        {
          id: "subjunctive-inversion-q3",
          text: "(　　) you need any help, please contact me.",
          choices: ["Had", "Would", "Were", "Should"],
          answer: 3,
          explanation: "If you should need ... の if を省略し、should を主語の前に出した倒置です。元の文は「万一助けが必要になったら」です。",
          translation: "もし万一助けが必要なら、私に連絡してください。",
          takeaway: "Should + 主語 + 原形は、If + 主語 + should + 原形の倒置。",
          diagram: { left: "Should you need", label: "shouldの倒置", right: "please contact" }
        }
      ]
    }
  ]
};

const curriculum = {
  courses: [
    {
      id: "subjunctive",
      title: "仮定法",
      structureVersion: subjunctiveCourse.structureVersion,
      recommendationLead: "現実と異なる想像・願望・後悔を、動詞の形で表す文法です。",
      objectives: subjunctiveCourse.objectives,
      sections: subjunctiveCourse.sections,
      overview: subjunctiveCourse.overview,
      lessons: subjunctiveCourse.lessons
    },
    {
      id: "participles",
      title: "分詞",
      recommendationLead: "動詞の形を使って、名詞や人・物の状態を説明する文法です。",
      objectives: [
        "現在分詞と過去分詞を、名詞との意味関係から選べる。",
        "分詞が名詞を直接説明する用法を読み取れる。",
        "感情を表す分詞や、補語としての分詞を使い分けられる。",
        "知覚動詞の後ろで、目的語がする動作・受ける動作を表せる。"
      ],
      sections: [
        { id: "adjectival-participles", title: "名詞を説明する分詞", lead: "分詞と名詞の関係を確認し、現在分詞・過去分詞を選びます。", lessonIds: ["participles-as-adjectives-present", "participles-as-adjectives-past"] },
        { id: "states-and-perception", title: "状態と知覚", lead: "感情・補語・知覚動詞の文で分詞の働きを見分けます。", lessonIds: ["emotion-verb-participles", "participle-complements", "perception-verb-participles"] }
      ],
      overview: {
        title: "分詞とは",
        html: `
          <p>分詞は、動詞の性質を残しながら、名詞を説明したり、主語・目的語の状態を説明したりする形です。このコースでは、次の3つの用法を順に学びます。</p>
          <ol>
            <li>名詞を直接説明する分詞（形容詞的用法）</li>
            <li>主語・目的語の状態を補語として説明する分詞</li>
            <li>見たり聞いたりした動作・状態を表す分詞（知覚動詞 + 目的語 + 分詞）</li>
          </ol>
          <p class="note">このコースでは分詞構文は扱いません。分詞構文とは、文の前後に置かれ、副詞のように理由・時・付帯状況などを表す用法です。</p>
          <p>現在分詞は <code>動詞の原形 + -ing</code>、過去分詞は動詞ごとの過去分詞形を使います。名詞が動作をする側なら現在分詞、動作をされる側なら過去分詞を選ぶのが、初学者向けの基本的な判断方法です。</p>
          <blockquote><p>a sleeping baby（眠っている赤ちゃん）<br>a broken window（壊れた窓）</p></blockquote>
          <p>ただし過去分詞には、<code>fallen leaves</code>（落ち葉）のように、「される」という受動ではなく、動作が完了した後の状態を表すものもあります。詳しい例は過去分詞の単元で扱います。</p>
          <p>分詞の形容詞的用法では、分詞だけでなく、分詞に続く語句全体で名詞を説明することもあります。まず「分詞と名詞の関係」を確認してから形を選びます。分詞は名詞の前後だけでなく、<code>be動詞</code> などの後ろで主語や目的語の状態を説明することもあり、これは「補語としての分詞」の単元で整理します。</p>
          <p class="note">分詞は動名詞や進行形と同じ <code>-ing</code> の形になることがあります。<code>be + -ing</code> がすべて補語としての現在分詞になるわけではなく、進行形の場合もあります。文中で何を説明・補足しているかを見分けることが大切です。</p>`
      },
      lessons: [
        {
          id: "participles-as-adjectives-present",
          version: 2,
          title: "分詞の形容詞的用法（現在分詞）",
          html: `
            <p>現在分詞は、動詞の原形に <code>-ing</code> を付けた形で、名詞を説明する形容詞のように使われます。説明される名詞が、その動作を「する側」であることがポイントです。</p>
            <details class="section" open>
            <summary>名詞の前に置く場合（基本形）</summary>
            <p>まずはこの基本形を覚えましょう。現在分詞だけで名詞を説明するときは、通常、名詞の前に置きます。</p>
            <blockquote><p>a sleeping baby<br>眠っている赤ちゃん</p></blockquote>
            <blockquote><p>a barking dog<br>ほえている犬</p></blockquote>
            </details>
            <details class="section">
            <summary>名詞の後ろに置く場合（基本形）</summary>
            <p>現在分詞に目的語や副詞などが伴う場合は、通常、名詞の後ろに置きます。</p>
            <blockquote><p>the girl dancing on the stage<br>ステージで踊っている少女</p></blockquote>
            <blockquote><p>the man standing by the door<br>ドアのそばに立っている男性</p></blockquote>
            <p>名詞の後ろに置かれた現在分詞は、関係代名詞を使った文に戻せます。</p>
            <blockquote><p>the girl dancing on the stage<br>= the girl who is dancing on the stage</p></blockquote>
            </details>
            <details class="section">
            <summary>動名詞や進行形との違い</summary>
            <p><code>Swimming is fun.</code> の <code>Swimming</code> は動名詞、<code>The boy is swimming.</code> の <code>swimming</code> は進行形、<code>the swimming boy</code> の <code>swimming</code> は <code>boy</code> を説明する現在分詞です。</p>
            </details>
            <p class="note">分詞の位置は語数だけで決まる絶対規則ではなく、意味や慣用にも左右されます。単独の分詞が名詞の後ろに置かれる発展例は、過去分詞の単元で扱います。</p>
            <details class="section" open>
            <summary>判断の手順</summary>
            <ol>
              <li>分詞が説明している名詞を探す。</li>
              <li>その名詞が動作をする側か確認する。</li>
              <li>分詞だけの基本形なら前、語句を伴う基本形なら後ろという配置を確認する。</li>
            </ol>
            </details>`,
          questions: [
            {
              id: "participles-as-adjectives-present-q1",
              text: "Look at the baby (　　) in the crib.",
              choices: ["slept", "sleeping", "sleep", "to sleep"],
              answer: 1,
              explanation: "baby が「眠っている」ので、現在分詞 sleeping を使って名詞を説明します。",
              translation: "ベビーベッドで眠っている赤ちゃんを見て。",
              takeaway: "名詞が自分で動作をしているとき、現在分詞で後ろから説明できる。",
              diagram: { left: "名詞が動作をする", label: "現在分詞", right: "baby sleeping" }
            },
            {
              id: "participles-as-adjectives-present-q2",
              text: "The man (　　) by the door is my uncle.",
              choices: ["stood", "standing", "stand", "to stand"],
              answer: 1,
              explanation: "standing by the door は「ドアのそばに立っている」という意味で、the man を後ろから説明しています。who is standing by the door を短くした形です。",
              translation: "ドアのそばに立っている男性は私の叔父です。",
              takeaway: "現在分詞は「〜している」という能動・進行の意味。",
              diagram: { left: "the man", label: "後ろから説明", right: "standing by door" }
            },
            {
              id: "participles-as-adjectives-present-q3",
              text: "次のうち、現在分詞が形容詞的に使われている文を選びなさい。",
              choices: ["Swimming is fun.", "The boy is swimming.", "The swimming boy waved at me.", "He enjoys swimming."],
              answer: 2,
              explanation: "swimming が boy を説明しているため、現在分詞の形容詞的用法です。1と4は動名詞、2は進行形です。",
              translation: "泳いでいる男の子が私に手を振った。",
              takeaway: "同じ-ingでも、名詞を説明すれば形容詞的用法、主語や動詞の一部なら別の用法。",
              diagram: { left: "swimming", label: "名詞を説明", right: "boy" }
            }
          ]
        },
        {
          id: "participles-as-adjectives-past",
          version: 2,
          title: "分詞の形容詞的用法（過去分詞）",
          html: `
            <p>過去分詞は、名詞を説明する形容詞のように使われます。説明される名詞が、動作を「される側」であることや、動作が完了した後の状態であることを表します。</p>
            <p>過去分詞は <code>-ed</code> 形だけでなく、不規則変化もあります。</p>
            <blockquote><p>broken（壊れた）・written（書かれた）・stolen（盗まれた）</p></blockquote>
            <details class="section" open>
            <summary>名詞の前に置く場合（基本形）</summary>
            <p>まずはこの基本形を覚えましょう。通常、名詞の前に置きます。</p>
            <blockquote><p>a broken window<br>壊れた窓</p></blockquote>
            <blockquote><p>a stolen bicycle<br>盗まれた自転車</p></blockquote>
            </details>
            <details class="section">
            <summary>名詞の後ろに置く場合（基本形）</summary>
            <p>過去分詞に修飾語句が伴う場合は、通常、名詞の後ろに置きます。</p>
            <blockquote><p>a picture painted by my father<br>父によって描かれた絵</p></blockquote>
            <blockquote><p>the books written in English<br>英語で書かれた本</p></blockquote>
            <p>名詞の後ろに置かれた過去分詞は、<code>that was ～</code> や <code>that were ～</code> を使った文に戻せます。</p>
            <blockquote><p>the books written in English<br>= the books that were written in English</p></blockquote>
            </details>
            <details class="section">
            <summary>「される」だけでなく「動作が完了した後の状態」を表す場合</summary>
            <p>過去分詞は、誰かに動作をされる「受動」だけでなく、動作がすでに完了した後の状態を表すこともあります。</p>
            <blockquote><p>fallen leaves<br>落ち葉</p></blockquote>
            <blockquote><p>a retired teacher<br>退職した教師</p></blockquote>
            <p>「葉が誰かに落とされた」「教師が誰かに退職させられた」という受動の意味ではなく、「落ちてしまった後の葉」「退職した後の教師」という、動作が完了した後の状態を表しています。</p>
            </details>
            <details class="section">
            <summary>発展：一語の過去分詞が後ろに置かれる例</summary>
            <p>過去分詞1語だけでも、名詞の後ろに置かれることがあります。「1語なら必ず前」という絶対規則ではありません。</p>
            <blockquote><p>the people involved<br>関係している人々</p></blockquote>
            </details>
            <p class="note">名詞が動作をする側なら現在分詞、動作をされる側または動作が完了した後の状態なら過去分詞を使います。</p>
            <details class="section" open>
            <summary>判断の手順</summary>
            <ol>
              <li>分詞が説明している名詞を探す。</li>
              <li>その名詞が動作を受ける側か、動作後の状態にあるか確認する。</li>
              <li>現在分詞とのどちらが意味に合うかを決める。</li>
            </ol>
            </details>`,
          questions: [
            {
              id: "participles-as-adjectives-past-q1",
              text: "The children found a (　　) window.",
              choices: ["breaking", "broken", "broke", "break"],
              answer: 1,
              explanation: "窓は「壊す側」ではなく「壊される側」なので、過去分詞 broken を使います。",
              translation: "子どもたちは壊れた窓を見つけた。",
              takeaway: "名詞が動作を受ける側なら、過去分詞で状態を説明する。",
              diagram: { left: "名詞が動作を受ける", label: "過去分詞", right: "window broken" }
            },
            {
              id: "participles-as-adjectives-past-q2",
              text: "The books (　　) in English are on the desk.",
              choices: ["writing", "wrote", "written", "write"],
              answer: 2,
              explanation: "written in English は「英語で書かれた」という意味で、the books を後ろから説明しています。that were written in English を短くした形です。",
              translation: "英語で書かれた本は机の上にあります。",
              takeaway: "過去分詞は「〜された／〜されている」という受動の意味。",
              diagram: { left: "the books", label: "受動・完了", right: "written in English" }
            },
            {
              id: "participles-as-adjectives-past-q3",
              text: "I found a bicycle (　　) near the station.",
              choices: ["stealing", "stole", "stolen", "steal"],
              answer: 2,
              explanation: "自転車は「盗む側」ではなく「盗まれる側」なので、過去分詞 stolen を使います。",
              translation: "私は駅の近くで盗まれた自転車を見つけた。",
              takeaway: "名詞と分詞の主語・動作関係を確認して、能動か受動かを選ぶ。",
              diagram: { left: "bicycle", label: "動作を受ける", right: "stolen" }
            }
          ]
        },
        {
          id: "emotion-verb-participles",
          version: 2,
          title: "感情動詞の分詞化",
          html: `
            <p>感情を表す動詞は、日本語の「～する」という感覚とは発想が異なり、多くが「人を～させる」という意味です。</p>
            <blockquote><p>excite：人をわくわくさせる<br>interest：人に興味を持たせる</p></blockquote>
            <p>そのため、これらの動詞から作られた分詞は、<code>-ing</code> が感情を引き起こす側、<code>-ed</code> がその感情を感じる側を表す形容詞になります。</p>
            <blockquote><p>The movie was exciting.<br>その映画はわくわくするものでした。</p></blockquote>
            <blockquote><p>I was excited by the movie.<br>私はその映画にわくわくしました。</p></blockquote>
            <p>「その映画はわくわくするものでした」は自然な日本語訳ですが、構造としては「映画が人をわくわくさせる側」であることが、過去分詞ではなく現在分詞 <code>exciting</code> を選ぶ理由です。</p>
            <p>よく使われる組み合わせには、<code>interesting / interested</code>、<code>boring / bored</code>、<code>surprising / surprised</code>、<code>confusing / confused</code> などがあります。</p>
            <blockquote><p>I am interesting.（私は興味深い人です。）<br>I am interested in English.（私は英語に興味があります。）</p></blockquote>
            <p class="note">「自分が感情を感じている」と言いたいときは過去分詞、人や物が感情を起こす側なら現在分詞を使います。</p>
            <p class="note">これらの分詞は、<code>be動詞</code> などの後ろで主語の状態を説明することがあります。次の単元では、この働きを「補語」として整理します。</p>`,
          questions: [
            {
              id: "emotion-verb-participles-q1",
              text: "The movie was very (　　).",
              choices: ["excited", "exciting", "excite", "excites"],
              answer: 1,
              explanation: "映画は人をわくわくさせる側なので、現在分詞 exciting を使います。",
              translation: "その映画はとてもわくわくさせるものだった。",
              takeaway: "原因・対象が感情を起こすなら、-ing形。",
              diagram: { left: "原因・対象", label: "感情を起こす", right: "-ing" }
            },
            {
              id: "emotion-verb-participles-q2",
              text: "I was (　　) by the complicated instructions.",
              choices: ["confusing", "confuse", "confused", "confuses"],
              answer: 2,
              explanation: "「私」は混乱させられた側なので、過去分詞 confused を使います。",
              translation: "私は複雑な説明に混乱した。",
              takeaway: "人が感情を受けた状態なら、過去分詞。",
              diagram: { left: "人", label: "受けた感情", right: "confused" }
            },
            {
              id: "emotion-verb-participles-q3",
              text: "The lecture was boring, so the students felt (　　).",
              choices: ["bored", "boring", "bore", "bores"],
              answer: 0,
              explanation: "講義は退屈させる側なので boring、学生は退屈を感じる側なので bored を使います。",
              translation: "講義は退屈だったので、学生たちは退屈していると感じた。",
              takeaway: "「〜させる」は-ing、「〜している／させられた」は-ed。",
              diagram: { left: "lecture", label: "原因と受け手", right: "boring / bored" }
            }
          ]
        },
        {
          id: "participle-complements",
          version: 1,
          title: "補語としての分詞",
          html: `
            <p>分詞は、名詞を直接説明するだけでなく、文の要素である「補語」として、主語や目的語の状態を説明することがあります。</p>
            <details class="section" open>
            <summary>補語とは</summary>
            <p>補語は、主語または目的語が「どのような状態か」を説明する語です。分詞が補語になるときも、現在分詞・過去分詞を選ぶ判断軸は、名詞を直接説明するときと変わりません。</p>
            <div class="formula">主語 + 動詞 + 現在分詞 / 過去分詞（主格補語）</div>
            <div class="formula">主語 + 動詞 + 目的語 + 現在分詞 / 過去分詞（目的格補語）</div>
            </details>
            <details class="section" open>
            <summary>主語の状態を説明する分詞（主格補語）</summary>
            <blockquote><p>The story was exciting.<br>その話はわくわくするものでした。</p></blockquote>
            <blockquote><p>The students looked excited.<br>生徒たちはわくわくしているように見えました。</p></blockquote>
            <blockquote><p>The door remained locked.<br>ドアは鍵がかかったままでした。</p></blockquote>
            <p><code>exciting</code> は story が感情を起こす側、<code>excited</code> は students が感情を感じる側、<code>locked</code> は door が鍵をかけられた状態であることを表しています。感情動詞の単元で学んだ関係は、感情動詞に限らず、主格補語一般に当てはまります。</p>
            </details>
            <details class="section" open>
            <summary>目的語の状態を説明する分詞（目的格補語）</summary>
            <blockquote><p>We kept the engine running.<br>私たちはエンジンを動かしたままにしました。</p></blockquote>
            <blockquote><p>Please keep the door locked.<br>ドアに鍵をかけたままにしてください。</p></blockquote>
            <blockquote><p>I found the window broken.<br>私は窓が壊れているのに気づきました。</p></blockquote>
            <p>engine は run する側なので <code>running</code>、door / window は lock・break される側、または動作後の状態なので <code>locked</code> / <code>broken</code> を使います。「目的語 → 分詞」の間に「目的語が～している／～されている」という関係を作って判断します。</p>
            </details>
            <details class="section">
            <summary>進行形との区別</summary>
            <p><code>The engine is running.</code> は <code>be + -ing</code> で動作の進行を表す進行形です。一方、<code>We kept the engine running.</code> の <code>running</code> は、<code>kept</code> の目的語 engine の状態を説明する目的格補語です。</p>
            <p>ここでは進行形の詳しい分類には踏み込まず、「分詞が何を説明しているか」を見分けることを目標にします。</p>
            </details>
            <p class="note">補語としての分詞も、まず「どの語（主語・目的語）を説明しているか」を確認し、その語が動作をする側か、される側か・その後の状態かを判断します。</p>`,
          questions: [
            {
              id: "participle-complements-q1",
              text: "The door remained (　　) all night.",
              choices: ["locking", "locked", "lock", "to lock"],
              answer: 1,
              explanation: "door は lock され、その状態が続いています。remained の後ろで主語 door の状態を説明する過去分詞 locked を使います。",
              translation: "そのドアは一晩中鍵がかかったままだった。",
              takeaway: "remain + 過去分詞は、主語が受けた状態の継続を表す。",
              diagram: { left: "remain + 主語", label: "状態の継続", right: "locked" }
            },
            {
              id: "participle-complements-q2",
              text: "We kept the engine (　　) while we waited.",
              choices: ["run", "running", "ran", "to run"],
              answer: 1,
              explanation: "engine は run する側です。running が目的語 engine の状態を説明する目的格補語になります。",
              translation: "私たちは待っている間、エンジンを動かし続けた。",
              takeaway: "keep + 目的語 + -ingは、目的語が動作中の状態を保つ。",
              diagram: { left: "keep + engine", label: "動作中の状態", right: "running" }
            },
            {
              id: "participle-complements-q3",
              text: "Please keep the door (　　) when you leave.",
              choices: ["locking", "locked", "lock", "to locking"],
              answer: 1,
              explanation: "door は鍵をかける側ではなく、鍵をかけられた状態に保たれます。Q2の running とは逆に、目的語が動作を受ける側なので過去分詞 locked を使います。",
              translation: "出かけるときはドアに鍵をかけたままにしてください。",
              takeaway: "目的語が動作を受けるなら、keep + 目的語 + 過去分詞。",
              diagram: { left: "keep + door", label: "受けた状態", right: "locked" }
            }
          ]
        },
        {
          id: "perception-verb-participles",
          version: 1,
          title: "知覚動詞 + 目的語 + 分詞",
          html: `
            <p><code>see / hear / watch / feel / notice</code> などの知覚動詞は、目的語の後ろに分詞を置いて、「目的語が～しているのを見る（聞く）」という意味を表します。</p>
            <details class="section" open>
            <summary>基本の形</summary>
            <div class="formula">知覚動詞 + 目的語 + 現在分詞 / 過去分詞</div>
            <p>ここではまず、次の知覚動詞に限定して学びます。</p>
            <blockquote><p>see・hear・watch・feel・notice</p></blockquote>
            </details>
            <details class="section" open>
            <summary>現在分詞：目的語が動作をしている</summary>
            <blockquote><p>I saw a boy running in the park.<br>私は少年が公園を走っているのを見ました。</p></blockquote>
            <blockquote><p>We heard someone knocking on the door.<br>私たちは誰かがドアをたたいているのを聞きました。</p></blockquote>
            <p>boy が run する、someone が knock する、というように、目的語が動作をする側なので現在分詞を使います。</p>
            </details>
            <details class="section" open>
            <summary>過去分詞：目的語が動作を受ける</summary>
            <blockquote><p>I heard my name called.<br>私は自分の名前が呼ばれるのを聞きました。</p></blockquote>
            <blockquote><p>She saw the man arrested by the police.<br>彼女はその男性が警察に逮捕されるのを見ました。</p></blockquote>
            <p>name は call される、man は arrest される、というように、目的語が動作を受ける側なので過去分詞を使います。受動関係の例は、自然に使われるものに限定しています。</p>
            </details>
            <details class="section">
            <summary>原形不定詞との違い</summary>
            <p>知覚動詞の後ろには、分詞だけでなく動詞の原形（原形不定詞）を置くこともできます。両方とも文法的に成立する場合があるため、どちらを使うかは文脈で判断します。</p>
            <blockquote><p>I saw him cross the street.<br>道を渡る動作を初めから終わりまで一まとまりとして見た。</p></blockquote>
            <blockquote><p>I saw him crossing the street.<br>道を渡っている途中の場面を見た。</p></blockquote>
            <p>そのため、この単元の問題では「その時に進行中の場面を見た／聞いた」のように、答えを一つに決める文脈を必ず与えます。原形不定詞の受動態など、この単元の範囲を超える内容は扱いません。</p>
            </details>
            <p class="note">知覚動詞の分詞も、判断方法は同じです。①直前に知覚動詞があるか確認する。②目的語を確認する。③目的語がその動作をする側か、される側かを確認して分詞を選ぶ。</p>`,
          questions: [
            {
              id: "perception-verb-participles-q1",
              text: "When I looked outside, I saw a dog (　　) across the yard.",
              choices: ["running", "run", "ran", "to run"],
              answer: 0,
              explanation: "外を見たその時に、dog が庭を走っている途中の場面を見ました。dog は run する側で、進行中の場面なので現在分詞 running を使います。",
              translation: "外を見ると、犬が庭を走っているのが見えた。",
              takeaway: "知覚時に動作中の場面を捉えるなら、知覚動詞 + O + -ing。",
              diagram: { left: "see + O", label: "動作の途中", right: "O + -ing" }
            },
            {
              id: "perception-verb-participles-q2",
              text: "While I was studying, I heard someone (　　) on the door.",
              choices: ["knocked", "knocking", "to knock", "was knocking"],
              answer: 1,
              explanation: "勉強している最中に、someone がノックしている音を聞きました。目的語が動作をする側で、進行中の場面なので現在分詞 knocking を使います。",
              translation: "勉強中、誰かがドアをノックしている音が聞こえた。",
              takeaway: "目的語が動作主で、進行中なら現在分詞。",
              diagram: { left: "someone", label: "動作主・進行", right: "knocking" }
            },
            {
              id: "perception-verb-participles-q3",
              text: "I heard my name (　　) from the back of the room.",
              choices: ["calling", "called", "call", "to call"],
              answer: 1,
              explanation: "name は呼ぶ側ではなく呼ばれる側です。my name was called という関係になるため、過去分詞 called を使います。",
              translation: "部屋の後ろから自分の名前が呼ばれるのが聞こえた。",
              takeaway: "目的語が動作を受けるなら、知覚動詞 + O + 過去分詞。",
              diagram: { left: "my name", label: "動作を受ける", right: "called" }
            }
          ]
        }
      ]
    },
    {
      id: "infinitives",
      structureVersion: 1,
      title: "不定詞",
      recommendationLead: "to + 動詞の原形で、名詞・形容詞・副詞の働きをする文法です。",
      objectives: [
        "to + 動詞の原形を見つけ、そのまとまりの文中での働きを説明できる。",
        "名詞的・形容詞的・副詞的用法を、文の意味から使い分けられる。",
        "意味上の主語や形式主語・形式目的語を含む文の構造を読める。",
        "使役・知覚動詞の原形不定詞、否定形、完了形を使える。"
      ],
      sections: [
        { id: "core-uses", title: "基本の3用法", lead: "不定詞が名詞・形容詞・副詞として働く基本を押さえます。", lessonIds: ["infinitive-nominal-use", "infinitive-adjective-use"] },
        { id: "adverbial-uses", title: "副詞的用法", lead: "目的・原因・結果・程度を表す不定詞を読み分けます。", lessonIds: ["infinitive-adverbial-purpose", "infinitive-adverbial-reason", "infinitive-adverbial-result", "infinitive-adverbial-degree"] },
        { id: "logical-subject-and-evaluation", title: "意味上の主語と評価", lead: "不定詞の動作主と、形容詞と組み合わさる表現を整理します。", lessonIds: ["infinitive-logical-subject-for", "infinitive-of-adjective-evaluation"] },
        { id: "dummy-subject-and-object", title: "形式主語・形式目的語", lead: "長い不定詞句を it で受ける文の構造を見抜きます。", lessonIds: ["dummy-subject-it", "dummy-object-it"] },
        { id: "special-forms", title: "特別な形", lead: "原形不定詞・否定形・完了不定詞を文型とともに学びます。", lessonIds: ["bare-infinitive", "perception-bare-infinitive", "infinitive-negative-form", "infinitive-perfect-form"] }
      ],
      overview: {
        title: "不定詞とは",
        html: `
          <section class="overviewVisual" aria-labelledby="infinitive-visual-title">
            <div class="overviewFormula" aria-label="to と動詞の原形">
              <span class="overviewFormulaPart">to</span><span class="overviewFormulaPlus">＋</span><span class="overviewFormulaPart overviewFormulaPart--verb">動詞の原形</span>
            </div>
            <p class="overviewFormulaExample">例：<code>to study</code></p>
            <p id="infinitive-visual-title" class="overviewVisualLead">動詞を、文の部品や説明に変える。</p>
            <div class="overviewUseGrid">
              <article class="overviewUseCard overviewUseCard--noun"><strong>名詞</strong><b>文の部品</b><span>主語・目的語・補語</span></article>
              <article class="overviewUseCard overviewUseCard--adjective"><strong>形容詞</strong><b>名詞を説明</b><span>どんな名詞か</span></article>
              <article class="overviewUseCard overviewUseCard--adverb"><strong>副詞</strong><b>動詞などを説明</b><span>目的・原因・結果・程度</span></article>
            </div>
            <p class="overviewVisualPrompt">読むときは、<code>to do</code> が文の中でどの仕事をしているかを見る。</p>
          </section>
          <p>不定詞は、<code>to + 動詞の原形</code> の形をした「動詞の変身形」です。動詞の意味を残したまま、名詞・形容詞・副詞のように働きます。</p>
          <p>大学受験では、まず <code>to + 動詞の原形</code> を見つけ、それが文の中で何をしているかを考えます。</p>
          <section class="section">
            <h4 class="sectionHeading">基本の3用法</h4>
            <div class="sectionBody">
              <ul>
                <li><strong>名詞的用法</strong>：文の主語・目的語・補語になる　<code>I like to read books.</code></li>
                <li><strong>形容詞的用法</strong>：名詞を後ろから説明する　<code>I need a book to read.</code></li>
                <li><strong>副詞的用法</strong>：動詞・形容詞などに意味を加える　<code>I went to the library to study.</code></li>
              </ul>
              <p><code>to read books</code> は <code>like</code> の目的語、<code>to read</code> は <code>a book</code> を後ろから説明する語句、<code>to study</code> は図書館へ行った目的です。</p>
            </div>
          </section>
          <section class="section">
            <h4 class="sectionHeading">入試でよく出る形</h4>
            <div class="sectionBody">
              <ul>
                <li><code>too ... to do</code>：あまりに～なので…できない</li>
                <li><code>... enough to do</code>：～するのに十分…だ</li>
                <li><code>what / how / where to do</code>：何を／どうやって／どこで～すべきか</li>
                <li><code>for + 人 + to do</code>：人が～する</li>
                <li><code>of + 人 + to do</code>：～するとは、その人は…だ</li>
              </ul>
            </div>
          </section>
          <p>さらに、使役動詞や知覚動詞の後ろでは、<code>to</code> を付けない原形不定詞を使います。否定形は <code>not to do</code>、完了形は <code>to have done</code> です。</p>
          <p class="note">見分ける順番は「<code>to</code> の後ろが動詞の原形か」→「名詞・形容詞・副詞のどの働きか」です。<code>to</code> の後ろに名詞や動名詞が続く場合は前置詞なので、不定詞とは限りません。</p>`
      },
      lessons: [
{
          id: "infinitive-nominal-use",
          version: 2,
          title: "不定詞の名詞的用法",
          html: `
            <p>不定詞の名詞的用法は、<code>to + 動詞の原形</code> のまとまりが名詞と同じように働き、「～すること」を表す用法です。文中で主語・目的語・補語になります。</p>
            <details class="section" open>
            <summary>主語になる場合</summary>
            <p>不定詞が文の主語になる場合、文頭に置いて「～することは…」と表します。</p>
            <div class="formula">To + 動詞の原形 ... + 動詞 / 形容詞</div>
            <blockquote><p>To get enough sleep is important.<br>十分な睡眠をとることは大切です。</p></blockquote>
            <p><code>To get enough sleep</code> が主語で、<code>is important</code> がその内容を説明しています。</p>
            </details>
            <details class="section">
            <summary>目的語になる場合</summary>
            <p>不定詞が動詞の目的語になり、「～することを…する」「～したい」のような意味を表します。</p>
            <blockquote><p>I want to learn English.<br>私は英語を学びたいです。</p></blockquote>
            <p><code>to learn English</code> は <code>want</code> の目的語です。<code>want + to不定詞</code> で「～したい」という意味になります。</p>
            <p>動詞によって、不定詞を続けるか動名詞を続けるかは異なります。すべての動詞に同じ形を続けられるわけではありません。</p>
            </details>
            <details class="section">
            <summary>補語になる場合</summary>
            <p>不定詞がbe動詞の後ろに置かれ、主語の内容を説明することがあります。</p>
            <blockquote><p>My plan is to visit Kyoto.<br>私の計画は京都を訪れることです。</p></blockquote>
            <p><code>to visit Kyoto</code> は <code>My plan</code> の内容を説明する補語です。</p>
            </details>
            <details class="section">
            <summary>副詞的用法との違い</summary>
            <p>文頭に不定詞があっても、必ず名詞的用法になるわけではありません。</p>
            <blockquote><p>To save time, I took a taxi.<br>時間を節約するために、私はタクシーに乗りました。</p></blockquote>
            <p><code>To save time</code> は主語ではなく、文全体の目的を説明しているため、副詞的用法です。</p>
            </details>
            <p class="note">名詞的用法かどうかを判断するときは、不定詞のまとまりが文の主語・目的語・補語になっているかを確認します。<code>to</code> の後ろが動詞の原形なら不定詞、名詞や動名詞なら前置詞です。</p>`,
          questions: [
            {
              id: "infinitive-nominal-use-q1",
              text: "To read books is useful. の To read books の働きは？",
              choices: [
                "名詞句として主語",
                "動詞isの目的語",
                "名詞booksを修飾する形容詞",
                "前置詞句"
              ],
              answer: 0,
              explanation: "文頭のto read books全体が文の主語になっているため、名詞的用法です。",
              translation: "本を読むことは役に立つ。",
              takeaway: "to + 動詞の原形全体が主語や目的語になると、名詞的用法。",
              diagram: { left: "To read books", label: "名詞的用法", right: "主語" }
            },
            {
              id: "infinitive-nominal-use-q2",
              text: "空所に入る最も適切な語句を選びなさい。Fast food restaurants are popular because many people want (    ).",
              choices: [
                "to eat quickly and cheaply",
                "eat quickly and cheaply",
                "eaten quickly and cheaply",
                "the eating quickly and cheaply"
              ],
              answer: 0,
              explanation: "want の後ろで「食べたい内容」を表すので、want to + 動詞の原形 とします。to eat quickly and cheaply 全体がwantの目的語です。",
              translation: "ファストフード店が人気なのは、多くの人が早く安く食べたいと思うからです。",
              takeaway: "wantの後ろには、望む内容を表すto + 動詞の原形を置く。",
              diagram: { left: "want", label: "目的語の内容", right: "to eat" }
            },
            {
              id: "infinitive-nominal-use-q3",
              text: "空所に入る最も適切な語句を選びなさい。My dream is (    ) a lot of sick people in the hospital.",
              choices: [
                "helped with",
                "taking care",
                "to be needed",
                "to look after"
              ],
              answer: 3,
              explanation: "My dream is ... の後ろで、夢の内容を to look after ... が説明しています。to + 動詞の原形 の不定詞が補語となり、「病院で多くの病人の世話をすること」という意味です。",
              translation: "私の夢は、病院で多くの病人の世話をすることです。",
              takeaway: "be動詞の後ろで主語の内容を説明する不定詞は補語になる。",
              diagram: { left: "My dream is", label: "補語", right: "to look after" }
            }
          ]
        },
{
          id: "infinitive-adjective-use",
          version: 2,
          title: "不定詞の形容詞的用法",
          html: `
            <p>不定詞の形容詞的用法は、<code>to + 動詞の原形</code> が名詞を説明する用法です。「～するための」「～すべき」「～する」という意味になります。</p>
            <details class="section" open>
            <summary>名詞を説明する基本の形</summary>
            <div class="formula">名詞 + to + 動詞の原形</div>
            <blockquote><p>I need something to drink.<br>私は何か飲むものが必要です。</p></blockquote>
            <p><code>to drink</code> が <code>something</code> を説明し、「飲むもの」という意味になります。</p>
            </details>
            <details class="section" open>
            <summary>名詞が不定詞の動作を受ける場合</summary>
            <blockquote><p>She has a lot of homework to do.<br>彼女にはするべき宿題がたくさんあります。</p><p>I need a book to read.<br>私は読む本が必要です。</p><p>He found a chair to sit on.<br>彼は座る椅子を見つけました。</p></blockquote>
            <p><code>homework</code> や <code>book</code> は「する」「読む」対象なので、<code>to do</code> や <code>to read</code> の目的語にあたります。<code>a chair to sit on</code> のように、動詞と結びつく前置詞が文末に残ることもあります。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる表現</summary>
            <p><code>something</code>、<code>anything</code>、<code>nothing</code>、<code>a place</code>、<code>a chance</code>、<code>a way</code> などの後ろに、不定詞を置くことがあります。</p>
            <blockquote><p>Do you have anything to eat?<br>何か食べるものを持っていますか。</p><p>We need a place to stay.<br>私たちには泊まる場所が必要です。</p><p>This is a good way to learn English.<br>これは英語を学ぶよい方法です。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>他の用法との見分け方</summary>
            <p>不定詞が名詞を説明していれば、形容詞的用法です。</p>
            <ol>
              <li><code>To study English is important.</code> は、不定詞が主語なので名詞的用法です。</li>
              <li><code>She went to the library to study English.</code> は、目的を表すので副詞的用法です。</li>
              <li><code>I need a book to read.</code> は、<code>to read</code> が <code>a book</code> を説明するので形容詞的用法です。<code>book</code> は読む対象です。</li>
            </ol>
            <p>不定詞の前にある名詞を確認し、「どのような名詞か」を説明していれば、形容詞的用法と判断できます。</p>
            </details>
            <p class="note">不定詞の形容詞的用法は、基本的に「名詞 + to不定詞」の形です。不定詞が前の名詞を説明しているかどうかを確認しましょう。</p>`,
          questions: [
            {
              id: "infinitive-adjective-use-q1",
              text: "I need something (　　) before the trip.",
              choices: ["eat", "to eat", "eating", "eaten"],
              answer: 1,
              explanation: "<code>to eat</code> が <code>something</code> を説明し、「食べるもの」という意味になるため、to eat が正解です。",
              translation: "旅行の前に食べるものが必要です。",
              takeaway: "不定詞が名詞の後ろから内容を説明すると、形容詞的用法。",
              diagram: { left: "something", label: "名詞を説明", right: "to eat" }
            },
            {
              id: "infinitive-adjective-use-q2",
              text: "I need someone (　　) me with this work.",
              choices: ["to help", "helping", "helped", "to be helped"],
              answer: 0,
              explanation: "<code>someone</code> が「手伝う」人なので、<code>to help me</code> が <code>someone</code> を説明します。",
              translation: "この仕事を手伝ってくれる人が必要です。",
              takeaway: "something・someone + to不定詞は「〜するもの／人」。",
              diagram: { left: "someone", label: "名詞の内容", right: "to help me" }
            },
            {
              id: "infinitive-adjective-use-q3",
              text: "不定詞の形容詞的用法が使われている文を選びなさい。",
              choices: [
                "To get enough sleep is important.",
                "She went to bed early to get enough sleep.",
                "I have a lot of homework to do.",
                "He wants to get enough sleep."
              ],
              answer: 2,
              explanation: "<code>to do</code> が <code>homework</code> を説明し、「するべき宿題」という意味になっています。",
              translation: "私はするべき宿題をたくさん持っています。",
              takeaway: "名詞と不定詞の意味関係を確認して、「〜する／される」を訳す。",
              diagram: { left: "homework", label: "するべき内容", right: "to do" }
            }
          ]
        },
{
          id: "infinitive-adverbial-purpose",
          version: 1,
          title: "不定詞の副詞的用法（目的）",
          html: `
            <p>不定詞の副詞的用法（目的）は、<code>to + 動詞の原形</code> が動詞や文全体を説明し、「何のためにその動作をするのか」という目的を表す用法です。「～するために」と訳します。</p>
            <details class="section" open>
            <summary>目的を表す基本の形</summary>
            <div class="formula">主語 + 動詞 ... + to + 動詞の原形</div>
            <blockquote><p>She went to the library to study English.<br>彼女は英語を勉強するために図書館へ行きました。</p></blockquote>
            <p><code>to study English</code> は、図書館へ行った目的を表しています。主節の動作が「行った」、不定詞が「何のために行ったか」を説明しています。</p>
            </details>
            <details class="section" open>
            <summary>目的を強調する表現</summary>
            <p>目的をはっきり示すために、<code>in order to</code> や <code>so as to</code> を使うこともあります。</p>
            <blockquote><p>He left early in order to catch the train.<br>彼は電車に間に合うために早く出発しました。</p><p>She spoke quietly so as not to wake the baby.<br>彼女は赤ちゃんを起こさないように静かに話しました。</p></blockquote>
            <p>否定の目的は、<code>in order not to</code> や <code>so as not to</code> で表します。</p>
            </details>
            <details class="section" open>
            <summary>形容詞的用法との違い</summary>
            <blockquote><p>I need a book to read.<br>私は読む本が必要です。</p><p>I went to the library to read books.<br>私は本を読むために図書館へ行きました。</p></blockquote>
            <p>前の文の <code>to read</code> は <code>a book</code> を説明するため形容詞的用法です。後の文の <code>to read books</code> は図書館へ行った目的を説明するため、副詞的用法です。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <p>不定詞を「何のために」と訳して、主節の動作の目的として自然なら、目的を表す副詞的用法です。不定詞が動詞や文全体を説明しているかを確認しましょう。</p>
            </details>
            <p class="note">目的を表す副詞的用法では、「不定詞の前に名詞があるか」ではなく、「何のための動作か」を確認します。</p>`,
          questions: [
            {
              id: "infinitive-adverbial-purpose-q1",
              text: "She went to the library (　　) English.",
              choices: ["study", "to study", "studying", "studied"],
              answer: 1,
              explanation: "図書館へ行った目的を表すので、<code>to study</code> が正解です。",
              translation: "彼女は英語を勉強するために図書館へ行った。",
              takeaway: "動作の目的は、主節の後ろにto + 動詞の原形を置く。",
              diagram: { left: "went to library", label: "目的", right: "to study" }
            },
            {
              id: "infinitive-adverbial-purpose-q2",
              text: "She spoke quietly so as (　　) the baby.",
              choices: ["not to wake", "not wake", "to not waking", "not waking"],
              answer: 0,
              explanation: "否定の目的は <code>so as not to + 動詞の原形</code> で表します。",
              translation: "彼女は赤ちゃんを起こさないように静かに話した。",
              takeaway: "否定の目的は、not to + 動詞の原形。",
              diagram: { left: "spoke quietly", label: "否定の目的", right: "not to wake" }
            },
            {
              id: "infinitive-adverbial-purpose-q3",
              text: "目的を表す副詞的用法が使われている文を選びなさい。",
              choices: [
                "I have homework to do.",
                "To read books is useful.",
                "He went outside to get some fresh air.",
                "I need a pen to write with."
              ],
              answer: 2,
              explanation: "<code>to get some fresh air</code> は、外へ行った目的を表しています。",
              translation: "彼は新鮮な空気を吸うために外へ出た。",
              takeaway: "to不定詞が「何のために」を答えていれば副詞的用法（目的）。",
              diagram: { left: "went outside", label: "動作の目的", right: "to get air" }
            }
          ]
        },
{
          id: "infinitive-adverbial-reason",
          version: 1,
          title: "不定詞の副詞的用法（原因・理由）",
          html: `
            <p>不定詞の副詞的用法（原因・理由）は、<code>to + 動詞の原形</code> が、感情や判断が生じた原因・理由を表す用法です。「～して」「～なので」「～したことを」と訳します。</p>
            <details class="section" open>
            <summary>感情を表す形容詞の後ろ</summary>
            <div class="formula">主語 + be動詞 + 感情を表す形容詞 + to + 動詞の原形</div>
            <blockquote><p>I am glad to see you.<br>あなたに会えてうれしいです。</p></blockquote>
            <p><code>to see you</code> は、「うれしい」という感情が生じた理由を表しています。「あなたに会うためにうれしい」という目的ではありません。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる形容詞</summary>
            <p><code>glad</code>・<code>happy</code> は「うれしい」、<code>sorry</code> は「残念に思う・申し訳なく思う」、<code>surprised</code> は「驚いている」、<code>pleased</code> は「喜んでいる」、<code>disappointed</code> は「失望している」という意味です。</p>
            <blockquote><p>She was surprised to hear the result.<br>彼女はその結果を聞いて驚きました。</p><p>He was sorry to keep us waiting.<br>彼は私たちを待たせて申し訳なく思いました。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>目的を表す用法との違い</summary>
            <blockquote><p>I went to the station to meet her.<br>私は彼女に会うために駅へ行きました。</p><p>I was glad to meet her.<br>私は彼女に会えてうれしかったです。</p></blockquote>
            <p>前の <code>to meet her</code> は駅へ行った目的です。後の <code>to meet her</code> は、うれしかった理由です。同じ不定詞でも、何を説明しているかによって用法が変わります。</p>
            </details>
            <details class="section" open>
            <summary>判断の理由を表す場合</summary>
            <p>感情だけでなく、驚き・残念さ・喜びなどの判断の理由も表します。</p>
            <blockquote><p>She was lucky to find her wallet.<br>彼女は財布を見つけて運がよかったです。</p></blockquote>
            <p><code>to find her wallet</code> は、運がよかった理由を説明しています。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <p>形容詞の後ろに不定詞があり、その不定詞が感情や判断の理由を表している場合は、原因・理由を表す副詞的用法です。</p>
            </details>
            <p class="note">「なぜうれしいのか」「なぜ驚いたのか」のように、感情や判断の理由を不定詞が説明しているかを確認しましょう。</p>`,
          questions: [
            {
              id: "infinitive-adverbial-reason-q1",
              text: "I am glad (　　) you again.",
              choices: ["see", "to see", "seeing", "saw"],
              answer: 1,
              explanation: "<code>glad</code> の原因・理由を表すため、<code>to see</code> が正解です。",
              translation: "私はあなたにまた会えてうれしい。",
              takeaway: "感情を表す形容詞の後ろのto不定詞は、その理由を表すことが多い。",
              diagram: { left: "glad", label: "感情の理由", right: "to see" }
            },
            {
              id: "infinitive-adverbial-reason-q2",
              text: "She was surprised (　　) the result.",
              choices: ["hear", "to hear", "hearing", "heard"],
              answer: 1,
              explanation: "驚いた理由を表すので、<code>to hear</code> を使います。",
              translation: "彼女はその結果を聞いて驚いた。",
              takeaway: "glad・surprisedなどの感情と、to以下の原因を結びつける。",
              diagram: { left: "was surprised", label: "驚いた理由", right: "to hear" }
            },
            {
              id: "infinitive-adverbial-reason-q3",
              text: "He was sorry to keep us waiting. の to keep us waiting の働きは？",
              choices: ["目的", "sorry の理由", "名詞を修飾する説明", "結果"],
              answer: 1,
              explanation: "<code>to keep us waiting</code> は、申し訳なく思った理由を表しています。",
              translation: "彼は私たちを待たせてしまって申し訳なく思った。",
              takeaway: "to以下が「なぜその感情になったか」を示せば原因・理由の副詞的用法。",
              diagram: { left: "was sorry", label: "感情の原因", right: "to keep waiting" }
            }
          ]
        },
{
          id: "infinitive-adverbial-result",
          version: 2,
          title: "不定詞の副詞的用法（結果）",
          html: `
            <p>不定詞の副詞的用法（結果）は、<code>to + 動詞の原形</code> が、ある動作のあとに起こった結果を表す用法です。「～して、その結果…」と訳します。</p>
            <details class="section" open>
            <summary>結果を表す基本の考え方</summary>
            <blockquote><p>He grew up to be a scientist.<br>彼は成長して科学者になりました。</p></blockquote>
            <p><code>to be a scientist</code> は「成長した目的」ではありません。成長したあとにどうなったかという結果を表しています。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる表現</summary>
            <p><code>grow up to be ...</code> は「成長して～になる」、<code>live to ...</code> は「生きて～する」、<code>wake up to find ...</code> は「目を覚ますと～だと分かる」という意味です。</p>
            <blockquote><p>She woke up to find the room empty.<br>彼女は目を覚ますと、部屋が空っぽだと分かりました。</p></blockquote>
            </details>
            <details class="section" open>
            <summary><code>only to</code> の使い方</summary>
            <p><code>only to</code> は、期待とは異なる残念な結果を表すことが多く、「結局～することになった」と訳します。</p>
            <blockquote><p>He hurried to the station, only to miss the train.<br>彼は急いで駅へ行きましたが、結局電車に乗り遅れました。</p></blockquote>
            <p>急いだ目的は電車に乗ることでしたが、実際の結果は「乗り遅れたこと」です。</p>
            </details>
            <details class="section" open>
            <summary>目的を表す用法との違い</summary>
            <blockquote><p>He went to the library to study.<br>彼は勉強するために図書館へ行きました。</p><p>He grew up to become a famous writer.<br>彼は成長して有名な作家になりました。</p></blockquote>
            <p>勉強は図書館へ行った後に行われますが、図書館へ行った目的です。一方、作家になったことは成長した後に実際に起きた結果です。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <ol>
              <li>不定詞が主節の動作の意図・目的を表し、「何のために」と言えるなら目的用法です。</li>
              <li>不定詞が主節の後に実際に起きたこと・分かったことを述べ、「その後、実際にどうなったか」と言えるなら結果用法です。</li>
              <li><code>grow up to ...</code>、<code>wake up to find ...</code>、<code>only to ...</code> は、結果用法の手掛かりになります。</li>
              <li>時間的に後で起きることだけでは、結果用法と決めません。</li>
            </ol>
            </details>
            <p class="note">結果を表す副詞的用法では、不定詞が「何のために」ではなく、「そのあとどうなったか」を表している点に注意します。</p>`,
          questions: [
            {
              id: "infinitive-adverbial-result-q1",
              text: "He grew up (　　) a scientist.",
              choices: ["be", "to be", "being", "been"],
              answer: 1,
              explanation: "<code>grow up to be ...</code> は、成長した後に実際に科学者になった結果を表します。成長する目的ではありません。",
              translation: "彼は成長して科学者になった。",
              takeaway: "grow up to beは、成長した後の結果を表し、目的ではない。",
              diagram: { left: "grew up", label: "その後の結果", right: "to be" }
            },
            {
              id: "infinitive-adverbial-result-q2",
              text: "She hurried to the station, only (　　) that the train had left.",
              choices: ["find", "to find", "finding", "found"],
              answer: 1,
              explanation: "<code>only to + 動詞の原形</code> で、急いだ目的ではなく、その後に実際に起きた予想外の結果を表します。",
              translation: "彼女は駅へ急いだが、列車が出たことに気づく結果になった。",
              takeaway: "only to + 動詞の原形は、予想外の結果を表す。",
              diagram: { left: "hurried", label: "予想外の結果", right: "only to find" }
            },
            {
              id: "infinitive-adverbial-result-q3",
              text: "結果を表す副詞的用法が使われている文を選びなさい。",
              choices: [
                "He went to the store to buy milk.",
                "I need a bag to carry books.",
                "She opened the door to find nobody there.",
                "To travel abroad is exciting."
              ],
              answer: 2,
              explanation: "<code>to find nobody there</code> は、ドアを開けた目的ではなく、開けた後に実際に分かった結果を表しています。",
              translation: "彼女はドアを開けたところ、そこには誰もいなかった。",
              takeaway: "to以下が主動作の後に起きた事実なら、結果の副詞的用法。",
              diagram: { left: "opened the door", label: "後に分かった事実", right: "to find nobody" }
            }
          ]
        },
{
          id: "infinitive-adverbial-degree",
          version: 1,
          title: "不定詞の副詞的用法（程度・結果）",
          html: `
            <p>不定詞の副詞的用法（程度・結果）は、<code>too ... to ～</code> や <code>... enough to ～</code> を使い、ある状態の程度と、その結果として可能か不可能かを表す用法です。</p>
            <details class="section" open>
            <summary><code>too ... to ～</code></summary>
            <div class="formula">too + 形容詞 + to + 動詞の原形</div>
            <blockquote><p>This box is too heavy to carry.<br>この箱は重すぎて運べません。</p></blockquote>
            <p><code>too ... to</code> は「あまりに…なので～できない」「～するには…すぎる」という意味です。「運ぶために重すぎる」ではなく、「重すぎる。その結果、運べない」と捉えます。</p>
            </details>
            <details class="section" open>
            <summary><code>... enough to ～</code></summary>
            <div class="formula">形容詞 + enough + to + 動詞の原形</div>
            <blockquote><p>He is old enough to drive.<br>彼は運転できる年齢です。</p></blockquote>
            <p><code>old enough</code> は「十分に年齢が高い」、<code>to drive</code> はその結果としてできることを表します。名詞を使う場合は、<code>enough + 名詞 + to ...</code> の形になります。</p>
            <blockquote><p>She has enough time to finish the work.<br>彼女にはその仕事を終える十分な時間があります。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>目的を表す用法との違い</summary>
            <blockquote><p>I went to the library to study.<br>私は勉強するために図書館へ行きました。</p><p>The book is too difficult to understand.<br>その本は難しすぎて理解できません。</p></blockquote>
            <p>前の文は図書館へ行った目的です。後の文は本が難しい程度と、その結果として理解できないことを表しています。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <p><code>too ... to</code> や <code>... enough to</code> では、不定詞が目的ではなく、形容詞が表す程度から生じる結果を説明しています。</p>
            </details>
            <p class="note"><code>too ... to</code> は「～するには…すぎる」、<code>... enough to</code> は「～するのに十分…」と、程度と結果をまとめて捉えます。</p>`,
          questions: [
            {
              id: "infinitive-adverbial-degree-q1",
              text: "This bag is too heavy (　　) carry.",
              choices: ["to", "for", "that", "as"],
              answer: 0,
              explanation: "<code>too + 形容詞 + to + 動詞の原形</code> の形なので、<code>to</code> が正解です。",
              translation: "このバッグは重すぎて運べない。",
              takeaway: "too + 形容詞 + to + 原形は、「あまりに〜なので…できない」。",
              diagram: { left: "too + heavy", label: "できない程度", right: "to carry" }
            },
            {
              id: "infinitive-adverbial-degree-q2",
              text: "The room is large enough (　　) hold fifty people.",
              choices: ["to", "for", "that", "than"],
              answer: 0,
              explanation: "<code>形容詞 + enough + to + 動詞の原形</code> の形を使います。",
              translation: "その部屋は50人を収容できるほど広い。",
              takeaway: "形容詞 + enough + to + 原形は、「…できるほど〜」。",
              diagram: { left: "large enough", label: "できる程度", right: "to hold 50" }
            },
            {
              id: "infinitive-adverbial-degree-q3",
              text: "This problem is too difficult (　　) me to solve.",
              choices: ["for", "to", "of", "with"],
              answer: 0,
              explanation: "「私には解けない」という意味になるため、<code>for</code> が正解です。",
              translation: "この問題は私には難しすぎて解けない。",
              takeaway: "不定詞の動作主を示すときは、for + 人 + to + 原形。",
              diagram: { left: "too difficult", label: "動作主を示す", right: "for me to solve" }
            }
          ]
        },
{
          id: "infinitive-logical-subject-for",
          version: 1,
          title: "不定詞の意味上の主語",
          html: `
            <p>不定詞が表す動作を「誰がするのか」を示す語を、意味上の主語と呼びます。文の主語とは別に、不定詞の動作主を示したいときに <code>for + 人</code> を使います。</p>
            <details class="section" open>
            <summary>基本の形</summary>
            <div class="formula">for + 人 + to + 動詞の原形</div>
            <blockquote><p>It is important for him to study.<br>彼が勉強することは大切です。</p></blockquote>
            <p>「勉強する」のは <code>him</code> です。<code>for</code> は前置詞なので、後ろの代名詞は主格の <code>he</code> ではなく目的格の <code>him</code> を使います。</p>
            <div class="formula">for me / for you / for him / for her / for us / for them</div>
            </details>
            <details class="section" open>
            <summary>形容詞と意味上の主語</summary>
            <blockquote><p>It is difficult for children to understand the rule.<br>子どもたちにとって、その規則を理解するのは難しいです。</p></blockquote>
            <p><code>children</code> が <code>understand</code> の意味上の主語です。「子どもたちにとって、その規則を理解するのは難しい」と捉えます。</p>
            </details>
            <details class="section" open>
            <summary><code>too</code>・<code>enough</code> との接続</summary>
            <blockquote><p>This problem is too difficult for me to solve.<br>この問題は難しすぎて、私には解けません。</p></blockquote>
            <p><code>solve</code> するのは <code>me</code> です。既習の <code>too ... to</code> に <code>for me</code> が加わり、誰にとって難しいかを示しています。</p>
            </details>
            <details class="section" open>
            <summary><code>of + 人</code> との予告</summary>
            <p>一般に不定詞の動作主を示す場合は <code>for + 人</code> を使います。<code>kind</code> や <code>careless</code> のように、人の性質・行動を評価する形容詞では、次の単元で学ぶ <code>of + 人</code> を使います。詳しい比較は次の単元で扱います。</p>
            </details>
            <p class="note"><code>for + 人</code> を見つけたら、その人が不定詞の動作をする主語にあたるかを確認します。</p>` ,
          questions: [
            {
              id: "infinitive-logical-subject-for-q1",
              text: "It is important (　　) to study.",
              choices: ["for him", "him", "he", "to him"],
              answer: 0,
              explanation: "勉強するのは him なので、<code>for + 人 + to + 動詞の原形</code> の <code>for him</code> を使います。for は前置詞なので目的格の him になります。",
              translation: "彼が勉強することは重要です。",
              takeaway: "不定詞の意味上の主語は、for + 目的格 + to + 原形で示す。",
              diagram: { left: "for + 人", label: "意味上の主語", right: "to study" }
            },
            {
              id: "infinitive-logical-subject-for-q2",
              text: "It is difficult for children (　　) the rule.",
              choices: ["to understand", "understanding", "understand", "understood"],
              answer: 0,
              explanation: "children が understand の意味上の主語です。<code>for children + to + 動詞の原形</code> なので、<code>to understand</code> を使います。",
              translation: "子どもたちがその規則を理解するのは難しい。",
              takeaway: "for childrenの後ろには、動詞の原形を伴うto不定詞。",
              diagram: { left: "children", label: "動作主", right: "to understand rule" }
            },
            {
              id: "infinitive-logical-subject-for-q3",
              text: "正しい英文を選びなさい。",
              choices: [
                "It is important for he to study.",
                "It is important him to study.",
                "It is important for him to study.",
                "It is important of him to study."
              ],
              answer: 2,
              explanation: "不定詞の動作主を示す <code>for + 人</code> と、前置詞 for の後ろの目的格 <code>him</code> が必要なので、<code>It is important for him to study.</code> が正解です。",
              translation: "彼が勉強することは重要です。",
              takeaway: "前置詞forの後ろは目的格なので、heではなくhim。",
              diagram: { left: "for + 人", label: "前置詞の目的格", right: "him to study" }
            }
          ]
        },
{
          id: "infinitive-of-adjective-evaluation",
          version: 1,
          title: "人の性質を表す形容詞と不定詞",
          html: `
            <p>人の性質や行動を評価する形容詞の後ろでは、<code>of + 人 + to + 動詞の原形</code> の形を使います。「～するとは、その人は…だ」「～して、その人は…だ」と訳します。</p>
            <details class="section" open>
            <summary>基本の形</summary>
            <div class="formula">It is + 形容詞 + of + 人 + to + 動詞の原形</div>
            <blockquote><p>It was kind of you to help me.<br>手伝ってくれて、あなたは親切でした。</p></blockquote>
            <p><code>kind</code> は、手伝った人である <code>you</code> の性質を評価しています。<code>to help me</code> は、どのような行動について評価しているのかを示します。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる形容詞</summary>
            <p><code>kind</code>・<code>nice</code>・<code>polite</code>・<code>clever</code>・<code>wise</code> などは、よい性質や行動を表します。</p>
            <p><code>careless</code>・<code>foolish</code>・<code>rude</code> などは、不注意な性質や好ましくない行動を表します。</p>
            <blockquote><p>It was foolish of him to ignore the warning.<br>彼が警告を無視したのは愚かなことでした。</p><p>It was careless of her to forget the key.<br>彼女が鍵を忘れたのは不注意でした。</p></blockquote>
            </details>
            <details class="section" open>
            <summary><code>of</code> の後ろの代名詞</summary>
            <p><code>of</code> の後ろには目的格を置きます。</p>
            <div class="formula">of me / of you / of him / of her / of us / of them</div>
            <blockquote><p>It was nice of him to help us.<br>彼が私たちを助けてくれて親切でした。</p></blockquote>
            <p><code>of he</code> や <code>of they</code> とはしません。</p>
            </details>
            <details class="section" open>
            <summary><code>for + 人</code> との違い</summary>
            <p><code>It is important for students to study.</code> では、<code>important</code> は students の性質を評価していません。不定詞の動作主を示すので <code>for</code> を使います。</p>
            <p><code>It was careless of him to forget the key.</code> では、<code>careless</code> が him の行動・性質を評価しているので <code>of</code> を使います。</p>
            <ol>
              <li>形容詞が「その人は親切だ・不注意だ」など、人を直接評価しているか確認します。</li>
              <li>評価していれば <code>of + 人</code> を使います。</li>
              <li>難易度・重要性・可能性と動作主を示すだけなら <code>for + 人</code> を使います。</li>
            </ol>
            </details>
            <details class="section" open>
            <summary>書き換え</summary>
            <p><code>It is + 形容詞 + of + 人 + to ...</code> は、<code>人 + be動詞 + 形容詞 + to ...</code> の形に書き換えられることがあります。</p>
            <blockquote><p>It was kind of you to help me.<br>= You were kind to help me.</p></blockquote>
            <p>どちらも「あなたが手伝ってくれて親切だった」という意味です。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <p>形容詞が人の性質や行動を評価しているかを確認します。人を評価する形容詞なら <code>of + 人 + to ...</code> を使います。</p>
            </details>
            <p class="note"><code>of + 人 + to ...</code> は、人の性質や行動への評価を表します。</p>`,
          questions: [
            {
              id: "infinitive-of-adjective-evaluation-q1",
              text: "It was kind (　　) you to help me.",
              choices: ["for", "of", "from", "with"],
              answer: 1,
              explanation: "<code>kind</code> は <code>you</code> の性質を評価する形容詞なので、<code>of you to help</code> とします。",
              translation: "私を助けてくれたあなたは親切でした。",
              takeaway: "人の性質を評価する形容詞は、of + 人 + to + 原形。",
              diagram: { left: "kind", label: "人の性質の評価", right: "of you + to help" }
            },
            {
              id: "infinitive-of-adjective-evaluation-q2",
              text: "正しい英文を選びなさい。",
              choices: [
                "It was nice of he to help us.",
                "It was nice of him to help us.",
                "It was nice him to help us.",
                "It was nice of him helping us."
              ],
              answer: 1,
              explanation: "<code>of</code> の後ろには目的格の <code>him</code> を置き、不定詞は <code>to help</code> とします。",
              translation: "彼が私たちを助けてくれたのは親切でした。",
              takeaway: "ofの後ろは目的格、動作はto + 原形。",
              diagram: { left: "nice of him", label: "人の行動を評価", right: "to help us" }
            },
            {
              id: "infinitive-of-adjective-evaluation-q3",
              text: "人の性質や行動を評価している文を選びなさい。",
              choices: [
                "It is important for students to study.",
                "It is difficult for me to answer.",
                "It was careless of him to forget the key.",
                "It is possible for her to join us."
              ],
              answer: 2,
              explanation: "<code>careless</code> は <code>him</code> の不注意な行動を評価しているため、<code>of him to forget</code> の形です。",
              translation: "彼が鍵を忘れたのは不注意でした。",
              takeaway: "kind・nice・carelessなど、人を評価する形容詞はofを使う。",
              diagram: { left: "careless of him", label: "性質の評価", right: "to forget key" }
            }
          ]
        },
{
          id: "dummy-subject-it",
          version: 2,
          title: "形式主語構文",
          html: `
            <p>英語では、主語が長くなると、文の形を整えるために <code>it</code> を主語の位置に置き、内容を表す不定詞句やthat節を文の後ろに置くことがあります。これを形式主語構文といいます。</p>
            <details class="section" open>
            <summary>不定詞を使う形</summary>
            <div class="formula">It is + 形容詞 + to + 動詞の原形</div>
            <blockquote><p>It is important to check the answer.<br>答えを確認することは大切です。</p></blockquote>
            <p><code>it</code> は具体的なものを指していません。内容上の主語は <code>to check the answer</code> です。<code>To check the answer is important.</code> としても意味は通りますが、長い主語を後ろに置く形式主語構文のほうが自然です。</p>
            </details>
            <details class="section">
            <summary>that節を使う形（発展）</summary>
            <div class="formula">It is + 形容詞 + that + 主語 + 動詞</div>
            <blockquote><p>It is surprising that Ken solved the problem.<br>ケンがその問題を解いたことは驚きです。</p></blockquote>
            <p>この文では、<code>that Ken solved the problem</code> が内容上の主語です。</p>
            </details>
            <details class="section" open>
            <summary>形式主語の見分け方</summary>
            <ol>
              <li><code>it</code> が具体的なものを指しているか確認する。</li>
              <li>後ろに <code>to + 動詞の原形</code> や <code>that + 主語 + 動詞</code> があるか確認する。</li>
              <li>後ろの句や節を主語の位置に戻して、意味が通るか確認する。</li>
            </ol>
            <p>天候・時刻を表す <code>it</code> や、具体的なものを指す代名詞の <code>it</code> とは区別します。</p>
            </details>
            <p class="note">形式主語の <code>it</code> を「それ」と訳す必要はありません。後ろの不定詞句やthat節が表す内容を、日本語では「～すること」「～ということ」と訳します。</p>`,
          questions: [
            {
              id: "dummy-subject-it-q1",
              text: "It is important to check the answer. の It の働きは？",
              choices: [
                "内容上の主語を後ろへ送る形式主語",
                "天候だけを表す形式上の主語",
                "動詞checkが直接取る目的語",
                "前置詞toが取る目的語"
              ],
              answer: 0,
              explanation: "It が形式上の主語となり、内容を担う to check the answer を後ろに置いています。完成文は「答えを確認することは重要だ」という意味です。",
              translation: "答えを確認することは重要です。",
              takeaway: "長い主語を後ろへ送り、文頭に形式主語itを置く。",
              diagram: { left: "It", label: "形式主語", right: "to check..." }
            },
            {
              id: "dummy-subject-it-q2",
              text: "It is difficult (　　) the answer.",
              choices: ["to find", "finding", "find", "found"],
              answer: 0,
              explanation: "形式主語 it の内容を表す不定詞なので、to + 動詞の原形の to find を使います。",
              translation: "その答えを見つけるのは難しい。",
              takeaway: "It is + 形容詞 + to + 原形で、後ろの不定詞が内容を表す。",
              diagram: { left: "It is difficult", label: "形式主語", right: "to find answer" }
            },
            {
              id: "dummy-subject-it-q3",
              text: "形式主語構文が使われている文を選びなさい。",
              choices: [
                "It is raining now.",
                "I found it on the desk.",
                "It is useful to read every day.",
                "It is my new bag."
              ],
              answer: 2,
              explanation: "It is useful to read every day. では it が具体的なものを指さず、to read every day が内容上の主語です。",
              translation: "毎日読書をすることは役に立つ。",
              takeaway: "itが具体的なものを指さず、to不定詞が内容上の主語なら形式主語構文。",
              diagram: { left: "it = 内容", label: "本当の主語", right: "to read daily" }
            }
          ]
        },
{
          id: "dummy-object-it",
          version: 2,
          title: "形式目的語構文",
          html: `
            <p>目的語になる不定詞句やthat節が長い場合、英語では目的語の位置に <code>it</code> を置き、内容を表す不定詞句やthat節を後ろに置くことがあります。これを形式目的語構文といいます。</p>
            <details class="section" open>
            <summary>不定詞を使う基本の形</summary>
            <div class="formula">主語 + 動詞 + it + 形容詞 + to + 動詞の原形</div>
            <blockquote><p>I found it difficult to answer the question.<br>私には、その質問に答えるのが難しいと分かりました。</p></blockquote>
            <p>この文では、<code>it</code> が形式目的語、<code>to answer the question</code> が内容上の目的語です。<code>difficult</code> は、it の内容を「難しい」と説明する語（目的格補語）です。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる形</summary>
            <p><code>find</code>、<code>think</code>、<code>feel</code>、<code>consider</code>、<code>make</code> などの動詞で、<code>動詞 + it + 形容詞</code> の形が使われます。</p>
            <blockquote><p>A lot of people may feel it easy to answer this question.<br>この問題に答えることは簡単だと、多くの人が感じているかもしれません。</p><p>Lisa thinks it important not to give up halfway.<br>リサは、途中であきらめないことが重要だと考えています。</p></blockquote>
            <p>不定詞を否定するときは、<code>not to + 動詞の原形</code> とします。この形は後の「不定詞の否定形」で詳しく学びます。</p>
            </details>
            <details class="section">
            <summary>that節を使う形（発展）</summary>
            <div class="formula">主語 + 動詞 + it + 形容詞 + that + 主語 + 動詞</div>
            <blockquote><p>We made it clear that the plan must change.<br>私たちは、その計画を変更しなければならないことを明確にしました。</p></blockquote>
            <p>この文では、<code>it</code> が形式目的語、<code>that the plan must change</code> が内容上の目的語です。</p>
            </details>
            <details class="section" open>
            <summary>形式目的語の見分け方</summary>
            <ol>
              <li><code>it</code> が具体的なものを指しているか確認する。</li>
              <li><code>it</code> の後ろに形容詞などの補語があるか確認する。</li>
              <li>さらに後ろの不定詞句やthat節が、判断されている内容になっているか確認する。</li>
            </ol>
            <p><code>I found it on the desk.</code> の <code>it</code> は、具体的なものを指す代名詞です。後ろに内容上の目的語となる不定詞句やthat節がないため、形式目的語ではありません。</p>
            </details>
            <p class="note">形式目的語の <code>it</code> は「それ」と訳す具体的な代名詞ではありません。後ろの不定詞句やthat節が表す内容を、「～すること」「～ということ」と捉えます。</p>`,
          questions: [
            {
              id: "dummy-object-it-q1",
              text: "A lot of people may feel it easy (    ) this question.",
              choices: ["answer", "to answer", "answering", "for answering"],
              answer: 1,
              explanation: "feel it easy to do の形で、it が形式目的語、to answer this question が内容上の目的語です。",
              translation: "多くの人は、この問題に答えるのは簡単だと感じるかもしれない。",
              takeaway: "feel・think + it + 形容詞 + to不定詞で、itが形式目的語。",
              diagram: { left: "feel it easy", label: "形式目的語", right: "to answer" }
            },
            {
              id: "dummy-object-it-q2",
              text: "Lisa thinks it important (    ) up halfway.",
              choices: ["not to give", "not give", "not giving", "not to giving"],
              answer: 0,
              explanation: "think it important not to do の形です。不定詞を否定するため、not to + 動詞の原形 の not to give を使います。",
              translation: "リサは途中であきらめないことが重要だと考えている。",
              takeaway: "不定詞を否定するときは、not to + 動詞の原形。",
              diagram: { left: "think it", label: "否定の内容", right: "not to give up" }
            },
            {
              id: "dummy-object-it-q3",
              text: "An unexpected snowstorm made it (    ) for them to reach the summit.",
              choices: ["possible", "impossible", "easy", "important"],
              answer: 1,
              explanation: "予想外の吹雪によって登頂が不可能になったため、impossible が適切です。",
              translation: "予想外の吹雪で、彼らが頂上に到達することは不可能になった。",
              takeaway: "make it + 形容詞 + for 人 + to不定詞で、結果を表す。",
              diagram: { left: "made it", label: "結果の評価", right: "impossible" }
            }
          ]
        },
{
          id: "bare-infinitive",
          version: 3,
          title: "使役動詞と原形不定詞",
          html: `
            <p>使役動詞は、主語が別の人やものに動作をさせる関係を表します。<code>make</code>・<code>let</code>・<code>have</code> の後ろに「動作をする人・もの」を置き、その後ろに原形不定詞を続けます。</p>
            <details class="section" open>
            <summary>使役動詞の基本</summary>
            <div class="formula">動詞 + 人 + 動詞の原形</div>
            <p>使役動詞の後ろでは、能動態なら原形の前に <code>to</code> を置きません。<code>to</code> がないことだけで判断せず、前の動詞がどのような関係を作っているかを確認します。</p>
            </details>
            <details class="section" open>
            <summary><code>make</code> と <code>let</code></summary>
            <div class="formula">make + 人 + 動詞の原形</div>
            <p><code>make + 人 + 動詞の原形</code> は、強制・働きかけを表し、「人に～させる」と訳します。</p>
            <blockquote><p>The teacher made us clean the room.<br>先生は私たちに部屋を掃除させました。</p></blockquote>
            <div class="formula">let + 人 + 動詞の原形</div>
            <p><code>let + 人 + 動詞の原形</code> は、許可を表し、「人が～するのを許す」と訳します。</p>
            <blockquote><p>My parents let me go out.<br>両親は私を外出させてくれました。</p></blockquote>
            <p><code>make</code> は強制、<code>let</code> は許可という違いに注意します。</p>
            </details>
            <details class="section" open>
            <summary><code>have</code> を使う使役</summary>
            <div class="formula">have + 人 + 動詞の原形</div>
            <p><code>have + 人 + 動詞の原形</code> は、依頼・手配によって「人に～してもらう」という関係を表します。<code>make</code> のような強制よりも、仕事や役割を依頼する意味で使います。</p>
            <blockquote><p>I had him check the report.<br>私は彼に報告書を確認してもらいました。</p></blockquote>
            <p><code>make</code>・<code>let</code>・<code>have</code> は、いずれも能動態では原形の前に <code>to</code> を置きません。</p>
            </details>
            <details class="section" open>
            <summary>使役動詞の受動態</summary>
            <p>能動態の <code>make + 人 + 動詞の原形</code> を受動態にすると、<code>人 + be made + to + 動詞の原形</code> となり、<code>to</code> が戻ります。</p>
            <blockquote><p>The teacher made us clean the room.<br>先生は私たちに部屋を掃除させました。</p><p>We were made to clean the room by the teacher.<br>私たちは先生に部屋を掃除させられました。</p></blockquote>
            <p><code>let + 人 + 動詞の原形</code> の「許可」は、受動態では通常 <code>be allowed to + 動詞の原形</code> で表します。</p>
            <blockquote><p>I was allowed to go out.<br>私は外出を許されました。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>助動詞との関係</summary>
            <p><code>can play</code>、<code>must study</code> のように、助動詞の後ろにも <code>to</code> を付けず動詞の原形を置きます。ただし、これは助動詞の規則であり、使役動詞の原形不定詞とは別の仕組みです。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <ol>
              <li>直前に <code>make</code>、<code>let</code>、<code>have</code> があるか確認します。</li>
              <li>その動詞と原形の間に、動作をする人・ものがあるか確認します。</li>
              <li>能動態では原形の前に <code>to</code> を置きません。</li>
              <li><code>be made</code> の受動態では <code>to + 動詞の原形</code> にします。</li>
            </ol>
            </details>
            <p class="note">使役動詞では、主語が誰かに動作をさせる関係を読み取り、<code>make</code>・<code>let</code>・<code>have</code> の意味の違いを確認しましょう。</p>` ,
          questions: [
            {
              id: "bare-infinitive-q1",
              text: "The teacher made us (　　) the room.",
              choices: ["clean", "to clean", "cleaning", "cleaned"],
              answer: 0,
              explanation: "<code>make + 人 + 動詞の原形</code> の形なので、<code>to</code> のない <code>clean</code> を使います。",
              translation: "先生は私たちに部屋を掃除させた。",
              takeaway: "make + 人 + 動詞の原形は、「人に〜させる」。",
              diagram: { left: "make + 人", label: "使役", right: "clean" }
            },
            {
              id: "bare-infinitive-q2",
              text: "My parents let me (　　) out.",
              choices: ["go", "to go", "going", "gone"],
              answer: 0,
              explanation: "<code>let + 人 + 動詞の原形</code> の形なので、<code>go</code> を使います。両親が私の外出を許した、という意味です。",
              translation: "両親は私を外出させてくれた。",
              takeaway: "let + 人 + 動詞の原形は、「人が〜するのを許す」。",
              diagram: { left: "let + 人", label: "許可", right: "go out" }
            },
            {
              id: "bare-infinitive-q3",
              text: "I had him (　　) the report.",
              choices: ["check", "to check", "checking", "checked"],
              answer: 0,
              explanation: "依頼・手配を表す <code>have + 人 + 動詞の原形</code> の形なので、<code>check</code> を使います。",
              translation: "私は彼に報告書を確認してもらった。",
              takeaway: "have + 人 + 動詞の原形は、人に依頼・手配して〜してもらう。",
              diagram: { left: "have + 人", label: "依頼・手配", right: "check report" }
            }
          ]
        },
{
          id: "perception-bare-infinitive",
          version: 1,
          title: "知覚動詞と原形不定詞",
          html: `
            <p>知覚動詞は、目や耳などで人やものの動作を捉える表現です。<code>see</code>・<code>watch</code>・<code>hear</code>・<code>feel</code> などの後ろに、動作をする人・ものと原形不定詞を置きます。</p>
            <details class="section" open>
            <summary>知覚動詞の基本</summary>
            <div class="formula">知覚動詞 + 人・もの + 動詞の原形</div>
            <blockquote><p>I saw him cross the street.<br>私は彼が通りを渡るのを見ました。</p><p>We heard her sing.<br>私たちは彼女が歌うのを聞きました。</p><p>I watched the children play in the park.<br>私は子どもたちが公園で遊ぶのを見ました。</p><p>I felt the ground shake.<br>私は地面が揺れるのを感じました。</p></blockquote>
            <p>原形不定詞は、動作の全体を一まとまりとして捉えるときに使います。見る・聞く・感じる対象が、どの動作をしたかを表します。</p>
            </details>
            <details class="section" open>
            <summary>動作の全体と途中</summary>
            <div class="formula">知覚動詞 + 人・もの + 動詞-ing</div>
            <blockquote><p>I saw him crossing the street.<br>私は彼が通りを渡っている途中なのを見ました。</p></blockquote>
            <p><code>I saw him cross the street.</code> は動作の全体、<code>I saw him crossing the street.</code> は動作の途中に焦点を当てます。<code>-ing</code> を使うと、知覚した場面の途中の様子を表せます。</p>
            </details>
            <details class="section" open>
            <summary>使役動詞との違い</summary>
            <p><code>make</code>・<code>let</code>・<code>have</code> は、主語が別の人・ものに動作をさせる使役動詞です。一方、<code>see</code>・<code>watch</code>・<code>hear</code>・<code>feel</code> は、人・ものがする動作を主語が知覚したことを表します。</p>
            <p>どちらも <code>動詞 + 人・もの + 動詞の原形</code> になりますが、前の動詞の意味によって、使役か知覚かを判断します。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <ol>
              <li>前の動詞が知覚を表しているか確認します。</li>
              <li>知覚の対象となる人・ものを、動詞と原形の間から探します。</li>
              <li>動作の全体なら原形、動作の途中の場面なら <code>-ing</code> も使えます。</li>
              <li>受動態の <code>be made to ...</code> は知覚ではなく、使役動詞 <code>make</code> の受動態です。</li>
            </ol>
            </details>
            <p class="note">知覚動詞では、誰がどの動作をしたのかを確認し、動作の全体か途中かに応じて原形と <code>-ing</code> を捉え分けます。</p>` ,
          questions: [
            {
              id: "perception-bare-infinitive-q1",
              text: "I saw him (　　) the street.",
              choices: ["cross", "to cross", "crossed", "to crossed"],
              answer: 0,
              explanation: "<code>see + 人 + 動詞の原形</code> の形で、him が渡る動作を知覚したことを表すため、<code>cross</code> を使います。",
              translation: "私は彼が通りを渡るのを見た。",
              takeaway: "see・hear + 人 + 原形は、動作全体を捉える。",
              diagram: { left: "see + 人", label: "動作全体", right: "cross" }
            },
            {
              id: "perception-bare-infinitive-q2",
              text: "We heard her (　　).",
              choices: ["sing", "to sing", "singing", "sang"],
              answer: 0,
              explanation: "<code>hear + 人 + 動詞の原形</code> の形なので、<code>sing</code> を使います。",
              translation: "私たちは彼女が歌うのを聞いた。",
              takeaway: "知覚動詞の後ろの人が動作主なので、toのない原形を置く。",
              diagram: { left: "hear + 人", label: "動作主", right: "sing" }
            },
            {
              id: "perception-bare-infinitive-q3",
              text: "動作の途中を表す文を選びなさい。",
              choices: [
                "I saw him cross the street.",
                "I saw him crossing the street.",
                "I heard her sing.",
                "My parents let me go out."
              ],
              answer: 1,
              explanation: "<code>I saw him crossing the street.</code> は <code>-ing</code> によって、通りを渡っている途中の場面に焦点を当てています。",
              translation: "私は彼が通りを渡っている途中を見た。",
              takeaway: "動作の途中に焦点を当てるなら、知覚動詞 + O + -ing。",
              diagram: { left: "saw him", label: "動作の途中", right: "crossing" }
            }
          ]
        },
{
          id: "infinitive-negative-form",
          version: 2,
          title: "不定詞の否定形",
          html: `
            <p>不定詞を否定するときは、<code>to</code> の前に <code>not</code> を置きます。基本の形は <code>not to + 動詞の原形</code> で、「～しないこと」「～しないために」などを表します。</p>
            <details class="section" open>
            <summary>基本の形</summary>
            <div class="formula">not to + 動詞の原形</div>
            <blockquote><p>I decided not to go.<br>私は行かないことに決めました。</p></blockquote>
            <p>否定を表す <code>not</code> は <code>to</code> の前に置きます。<code>to</code> の後ろは、通常の不定詞と同じく動詞の原形です。</p>
            </details>
            <details class="section" open>
            <summary>名詞的用法</summary>
            <p>不定詞の否定形を「～しないこと」という名詞のように使います。</p>
            <blockquote><p>She promised not to tell anyone.<br>彼女は誰にも話さないと約束しました。</p></blockquote>
            <p><code>not to tell anyone</code> は、彼女が約束した内容を表しています。</p>
            <blockquote><p>I hope not to disappoint you.<br>あなたを失望させないことを願っています。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>目的を表す場合</summary>
            <p>「～しないために」「～しないように」という目的を表すときにも、不定詞の否定形を使います。</p>
            <div class="formula">in order not to + 動詞の原形<br>so as not to + 動詞の原形</div>
            <blockquote><p>He left home early in order not to miss the train.<br>彼は電車に乗り遅れないように早く家を出ました。</p></blockquote>
            <blockquote><p>She spoke quietly so as not to wake the baby.<br>彼女は赤ちゃんを起こさないように静かに話しました。</p></blockquote>
            </details>
            <details class="section" open>
            <summary>主節の動作との違い</summary>
            <p><code>not</code> は、不定詞が表す動作を否定します。</p>
            <blockquote><p>I decided not to buy it.<br>私はそれを買わないことに決めました。</p></blockquote>
            <p>これは「買うと決めなかった」ではなく、「買わないと決めた」という意味です。主節の動詞を否定する場合とは意味が異なります。</p>
            </details>
            <details class="section" open>
            <summary>受動態・完了形</summary>
            <p>受動態や完了形の不定詞でも、<code>not</code> は <code>to</code> の前に置きます。</p>
            <blockquote><p>He hoped not to be noticed.<br>彼は気づかれないことを望みました。</p><p>She was sorry not to have called earlier.<br>彼女はもっと早く電話しなかったことを残念に思いました。</p></blockquote>
            <p><code>not to be + 過去分詞</code> は「～されないこと」、<code>not to have + 過去分詞</code> は「～しなかったこと」を表します。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <ol>
              <li><code>not</code> が <code>to</code> の前にあるか確認する。</li>
              <li><code>to</code> の後ろが動詞の原形か確認する。</li>
              <li>「～しないこと」または「～しないために」と訳して、文中での働きを判断する。</li>
            </ol>
            </details>
            <p class="note">不定詞の否定形は <code>not to + 動詞の原形</code> が基本です。まず <code>not</code> と <code>to</code> の位置を確認しましょう。</p>`,
          questions: [
            {
              id: "infinitive-negative-form-q1",
              text: "I decided (　　　) the invitation.",
              choices: ["not accepting", "not to accept", "to not accepting", "to accept not"],
              answer: 1,
              explanation: "<code>not to + 動詞の原形</code> の形にします。<code>decide not to do</code> で「～しないことに決める」という意味です。",
              translation: "私はその招待を受けないことに決めた。",
              takeaway: "不定詞の否定は、toの前にnotを置く。",
              diagram: { left: "decide", label: "否定不定詞", right: "not to accept" }
            },
            {
              id: "infinitive-negative-form-q2",
              text: "He left home early in order (　　　) the train.",
              choices: ["not missing", "not to miss", "to not missing", "not miss"],
              answer: 1,
              explanation: "「～しないために」は <code>in order not to + 動詞の原形</code> で表します。",
              translation: "彼は列車に乗り遅れないよう、早く家を出た。",
              takeaway: "in order not to + 原形は、「〜しないために」。",
              diagram: { left: "in order", label: "否定の目的", right: "not to miss" }
            },
            {
              id: "infinitive-negative-form-q3",
              text: "She tried not to laugh. の意味として正しいものを選びなさい。",
              choices: [
                "彼女は笑わないように努めた。",
                "彼女は笑うことを決めなかった。",
                "彼女は笑わなかったことを後悔した。",
                "彼女は笑ってはいけないと約束した。"
              ],
              answer: 0,
              explanation: "<code>try not to + 動詞の原形</code> は「～しないように努める」という意味です。",
              translation: "彼女は笑わないように努めた。",
              takeaway: "try not to doは、「〜しないように努める」。",
              diagram: { left: "try", label: "しない努力", right: "not to laugh" }
            }
          ]
        },
{
          id: "infinitive-perfect-form",
          version: 2,
          title: "完了不定詞",
          html: `
            <p>完了不定詞は、<code>to have + 過去分詞</code> の形で、基準となる時点より前の動作や状態を表します。「～した」「～していた」などと訳します。</p>
            <details class="section" open>
            <summary>基本の形</summary>
            <div class="formula">to have + 過去分詞</div>
            <blockquote><p>I am happy to have met you.<br>あなたに会えたことをうれしく思います。</p></blockquote>
            <p><code>am happy</code> は現在の気持ち、<code>to have met you</code> はそれより前に会ったことを表しています。</p>
            </details>
            <details class="section" open>
            <summary>単純不定詞との違い</summary>
            <blockquote><p>I am happy to meet you.<br>あなたに会えてうれしいです。</p><p>I am happy to have met you.<br>あなたに会えたことをうれしく思います。</p></blockquote>
            <p>単純不定詞は主節と同時、またはそれ以後の内容を表すことが多いのに対し、完了不定詞は主節より前の出来事を表します。</p>
            </details>
            <details class="section" open>
            <summary><code>seem</code> などと使う場合</summary>
            <blockquote><p>She seems to have forgotten the key.<br>彼女は鍵を忘れたようです。</p></blockquote>
            <p><code>seems</code> は現在の判断で、鍵を忘れたのはそれより前の出来事です。</p>
            <blockquote><p>He is said to have left the country.<br>彼は国外へ出たと言われています。</p></blockquote>
            <p>「言われている」時点より前に、国外へ出たことを表します。</p>
            </details>
            <details class="section" open>
            <summary>受動態</summary>
            <div class="formula">to have been + 過去分詞</div>
            <blockquote><p>She was proud to have been chosen.<br>彼女は選ばれたことを誇りに思いました。</p></blockquote>
            <p><code>to have been chosen</code> は「選ばれたこと」を表す、完了不定詞の受動態です。</p>
            </details>
            <details class="section" open>
            <summary>過去分詞の形に注意</summary>
            <p><code>to</code> の後ろは動詞の原形なので、<code>had</code> ではなく <code>have</code> を使います。</p>
            <blockquote><p><code>to have visited</code> / <code>to have seen</code> / <code>to have finished</code></p></blockquote>
            <p><code>to have saw</code> のように、<code>have</code> の後ろに過去形を置くことはできません。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <ol>
              <li><code>to have + 過去分詞</code> の形を探す。</li>
              <li>完了不定詞と主節の出来事の時間を比べる。</li>
              <li>完了不定詞のほうが先に起きていれば、「～した」「～していた」と訳す。</li>
            </ol>
            </details>
            <p class="note">完了不定詞は、単なる過去形ではなく、主節の内容より前に起きたことを示します。まず <code>to have + 過去分詞</code> の形を確認しましょう。</p>`,
          questions: [
            {
              id: "infinitive-perfect-form-q1",
              text: "I met you last year, and I am happy (　　　) you.",
              choices: ["to meet", "meeting", "to have met", "to have meet"],
              answer: 2,
              explanation: "last year に会った出来事は、現在の am happy より前です。過去の出来事を現在うれしく思っているので、<code>to have + 過去分詞</code> の <code>to have met</code> を使います。",
              translation: "私は去年あなたに会いました。そして、あなたに会えたことをうれしく思います。",
              takeaway: "現在の基準時より前の出来事は、to have + 過去分詞で表す。",
              diagram: { left: "am happy now", label: "前の出来事", right: "to have met" }
            },
            {
              id: "infinitive-perfect-form-q2",
              text: "She seems (　　　) the key.",
              choices: ["to forget", "to have forgotten", "to have forget", "forgetting"],
              answer: 1,
              explanation: "<code>seems</code> は現在の判断で、鍵を忘れたのはそれより前の出来事なので、<code>to have forgotten</code> が正解です。",
              translation: "彼女は鍵を忘れたようです。",
              takeaway: "seem + to have + 過去分詞は、過去の出来事を現在判断している。",
              diagram: { left: "seems", label: "現在の判断", right: "to have forgotten" }
            },
            {
              id: "infinitive-perfect-form-q3",
              text: "She was proud (　　　) for the team.",
              choices: ["to choose", "to have chosen", "to have been chosen", "to be choosing"],
              answer: 2,
              explanation: "完了不定詞の受動態は <code>to have been + 過去分詞</code> です。<code>to have been chosen</code> で「選ばれたこと」を表します。",
              translation: "彼女はチームに選ばれたことを誇りに思っていました。",
              takeaway: "完了不定詞の受動態は、to have been + 過去分詞。",
              diagram: { left: "to have been", label: "受動の完了", right: "chosen" }
            }
          ]
        }
      ]
    }
  ]
};

if (typeof process !== "undefined" && process.argv.includes("--check")) {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const courses = curriculum.courses;
  const lessons = courses.flatMap(course => course.lessons);
  check(courses.length > 0, "文法カテゴリが1件以上あること");
  check(new Set(courses.map(course => course.id)).size === courses.length, "カテゴリIDが重複しないこと");
  check(lessons.length > 0, "単元が1件以上あること");
  check(new Set(lessons.map(lesson => lesson.id)).size === lessons.length, "単元IDが重複しないこと");
  check(lessons.every(lesson => lesson.questions.length > 0), "各単元に問題があること");
  check(lessons.every(lesson => lesson.questions.length === 3), "各単元が3問であること");
  check(lessons.every(lesson => Number.isInteger(lesson.version) && lesson.version > 0), "全単元に正の整数versionがあること");
  check(lessons.flatMap(lesson => lesson.questions).every(question => question.choices.length === 4 && question.answer >= 0 && question.answer < 4), "全問が有効な4択であること");
  const allQuestions = lessons.flatMap(lesson => lesson.questions);
  const subjunctive = courses.find(course => course.id === "subjunctive");
  check(!subjunctive || (subjunctive.lessons.length === 12 && subjunctive.lessons.flatMap(lesson => lesson.questions).length === 36), "仮定法が12単元36問であること");
  check(allQuestions.every(question => typeof question.id === "string" && question.id.length > 0), "全問にIDがあること");
  check(new Set(allQuestions.map(question => question.id)).size === allQuestions.length, "問題IDが重複しないこと");
  check(allQuestions.every(question => typeof question.text === "string" && question.text.trim() && typeof question.explanation === "string" && question.explanation.trim()), "全問に問題文と解説があること");
  check(allQuestions.every(question => typeof question.translation === "string" && question.translation.trim()), "全問に日本語訳があること");
  check(allQuestions.every(question => typeof question.takeaway === "string" && question.takeaway.trim()), "全問に締めルールがあること");
  check(allQuestions.every(question => question.diagram), "全問に図解があること");
  check(allQuestions.every(question => !question.diagram || (typeof question.diagram.left === "string" && question.diagram.left.trim() && typeof question.diagram.label === "string" && question.diagram.label.trim() && typeof question.diagram.right === "string" && question.diagram.right.trim())), "図解の3要素がそろっていること");
  check(allQuestions.every(question => new Set(question.choices).size === question.choices.length && question.choices.every(choice => typeof choice === "string" && choice.trim())), "各問題の選択肢が重複せず空でないこと");
  check(courses.filter(course => course.structureVersion !== undefined).every(course => Number.isInteger(course.structureVersion) && course.structureVersion > 0), "構造versionが正の整数であること");
  check(courses.every(course => typeof course.recommendationLead === "string" && course.recommendationLead.trim().length > 0), "全カテゴリに推薦紹介文があること");
  check(courses.every(course => !/[<>]/.test(course.recommendationLead)), "推薦紹介文にHTMLを含めないこと");
  check(courses.every(course => !course.objectives || (Array.isArray(course.objectives) && course.objectives.length >= 4 && course.objectives.length <= 8 && course.objectives.every(objective => typeof objective === "string" && objective.trim() && !/[<>]/.test(objective)))), "学習目標が4〜8件のテキストであること");
  courses.filter(course => course.sections !== undefined).forEach(course => {
    const sections = course.sections;
    const lessonIds = Array.isArray(sections) ? sections.flatMap(section => Array.isArray(section.lessonIds) ? section.lessonIds : []) : [];
    const courseLessonIds = course.lessons.map(lesson => lesson.id);
    check(Array.isArray(sections) && sections.length > 0, `${course.title}の章が1件以上あること`);
    check(Array.isArray(sections) && sections.every(section => typeof section.id === "string" && section.id.trim() && typeof section.title === "string" && section.title.trim() && typeof section.lead === "string" && section.lead.trim()), `${course.title}の章にID・タイトル・説明があること`);
    check(new Set(lessonIds).size === lessonIds.length, `${course.title}の章で単元IDが重複しないこと`);
    check(lessonIds.length === courseLessonIds.length && courseLessonIds.every(id => lessonIds.includes(id)), `${course.title}の章が全単元を重複なく覆うこと`);
    check(lessonIds.every(id => courseLessonIds.includes(id)), `${course.title}の章が存在する単元IDだけを参照すること`);
  });
  if (failures.length > 0) {
    failures.forEach(message => console.error(`CONTENT_CHECK_NG: ${message}`));
    process.exitCode = 1;
  } else {
    console.log("CONTENT_CHECK_OK");
  }
}
