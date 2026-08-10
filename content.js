const curriculum = {
  overview: {
    title: "仮定法とは",
    html: `
      <p>仮定法は、現実の事実をそのまま述べるのではなく、現実とは異なる状況、実現しにくい想像、願望、後悔などを表す仕組みです。</p>
      <p>中心となる考え方は、現実から距離を置くとき、動詞の形を一段階過去へずらすことです。現在の事実に反する内容でも、過去形を使うことがあります。</p>
      <blockquote><p>If I had more time, I would read more books.<br>もっと時間があれば、もっと多くの本を読むのに。</p></blockquote>
      <p><code>had</code> が表しているのは過去ではなく、「今は十分な時間がない」という現実との距離です。</p>
      <p class="note">if を使う文がすべて仮定法になるわけではありません。時点と、現実との関係を確認します。</p>`
  },
  lessons: [
    {
      id: "past-subjunctive",
      title: "仮定法過去",
      html: `
        <p>仮定法過去は、現在または未来について、事実と異なる状況や実現する可能性の低い状況を想像する表現です。</p>
        <div class="formula">If + 主語 + 過去形, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If she knew the answer, she could help us.<br>彼女が答えを知っていれば、私たちを助けられるのに。</p></blockquote>
        <p>実際には彼女は答えを知りません。過去形 <code>knew</code> は、現在の事実から距離を置いています。</p>
        <p>be動詞では、仮定法の基本形として主語にかかわらず <code>were</code> を使います。</p>
        <blockquote><p>If I were you, I would accept the offer.<br>私があなたなら、その申し出を受けます。</p></blockquote>
        <p class="note">判断するときは、①いつの話か、②事実か反実仮想か、③条件節と結果節の形が対応しているか、の順に確認します。</p>`,
      questions: [
        {
          text: "If I (　　) you, I would accept the offer.",
          choices: ["am", "was", "have been", "were"],
          answer: 3,
          explanation: "現在の事実に反する仮定です。仮定法過去のbe動詞は、主語が I でも基本的に were を使います。"
        },
        {
          text: "If I had enough money, I (　　) a new bicycle.",
          choices: ["plan buy", "could buy", "might had", "happily buy"],
          answer: 1,
          explanation: "現在は十分なお金がないという仮定に対し、could + 動詞の原形で「買えるのに」と表します。"
        },
        {
          text: "If I lost my key, I (　　) able to lock the door.",
          choices: ["will not be", "will not have been", "wouldn’t be", "am not"],
          answer: 2,
          explanation: "If + 主語 + 過去形, 主語 + would + 動詞の原形という仮定法過去です。主節は wouldn’t be とします。"
        }
      ]
    },
    {
      id: "past-perfect-subjunctive",
      version: 2,
      title: "仮定法過去完了",
      html: `
        <p>仮定法過去完了は、過去の事実とは異なる状況を想像し、「もしあのとき～していたら、…だっただろうに」と表す方法です。</p>
        <div class="formula">If + 主語 + had + 過去分詞, 主語 + would / could / might have + 過去分詞</div>
        <blockquote><p>If I had studied harder, I would have passed the exam.<br>もっと勉強していたら、試験に合格していただろうに。</p></blockquote>
        <p>実際には十分に勉強せず、試験にも合格しませんでした。過去完了形を使って現実から距離を置き、実際とは異なる過去と結果を想像しています。</p>
        <p><code>would have + 過去分詞</code> は「～しただろうに」、<code>could have + 過去分詞</code> は「～できただろうに」、<code>might have + 過去分詞</code> は「～したかもしれないのに」を表します。</p>
        <blockquote><p>If she had left earlier, she could have caught the train.<br>彼女がもっと早く出発していたら、電車に間に合っただろうに。</p></blockquote>
        <p>通常、条件を表す if 節には <code>would have</code> を置かず、<code>had + 過去分詞</code> を使います。</p>
        <p class="note">仮定法過去は現在・未来、仮定法過去完了は過去の事実に反する仮定です。まず変えたい出来事の時点を確かめます。</p>`,
      questions: [
        {
          text: "If she (　　) earlier, she would have caught the train.",
          choices: ["leaves", "left", "would leave", "had left"],
          answer: 3,
          explanation: "過去の事実に反する仮定なので、if + 主語 + had + 過去分詞を使います。"
        },
        {
          text: "If he had listened to the advice, he (　　) the mistake.",
          choices: ["would avoid", "will avoid", "would have avoided", "avoided"],
          answer: 2,
          explanation: "過去の事実に反する条件の結果は、would have + 過去分詞で表します。"
        },
        {
          text: "If I had won the lottery, I (　　) a new car.",
          choices: ["would buy", "bought", "would have bought", "would have been buying"],
          answer: 2,
          explanation: "過去の事実に反する仮定で、結果も過去のことなので、would have + 過去分詞の would have bought を使います。"
        }
      ]
    },
    {
      id: "mixed-subjunctive",
      title: "ミックス仮定法",
      html: `
        <p>過去の出来事が現在の状況に影響している場合は、仮定法過去完了と仮定法過去を組み合わせます。一般に「混合仮定法」または「ミックス仮定法」と呼ばれる形です。</p>
        <div class="formula">If + 主語 + had + 過去分詞, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If I had taken the job, I would live in Tokyo now.<br>あのときその仕事を引き受けていたら、今は東京に住んでいるだろうに。</p></blockquote>
        <p><code>If I had taken the job</code> は過去の事実に反する条件、<code>I would live in Tokyo now</code> は現在の事実に反する結果です。実際にはその仕事を引き受けず、現在も東京には住んでいません。</p>
        <p>通常の仮定法過去完了では条件と結果の両方が過去にありますが、ミックス仮定法では過去の選択が現在の状態につながっています。</p>
        <blockquote><p>If she had gone to bed earlier, she would not be tired now.<br>彼女がもっと早く寝ていたら、今こんなに疲れてはいないだろうに。</p></blockquote>
        <p>主節の <code>would + 原形</code> は現在の結果、<code>could + 原形</code> は現在の可能、<code>might + 原形</code> は現在の可能性を表します。</p>
        <p class="note">if節が had + 過去分詞でも、結果が現在なら主節を would have + 過去分詞にはしません。now、today、at present などが現在の結果を示す手掛かりになります。</p>`,
      questions: [
        {
          text: "If I had taken that job, I (　　) in London now.",
          choices: ["live", "lived", "would be living", "would have lived"],
          answer: 2,
          explanation: "過去にその仕事を選ばなかったという仮定から、現在の生活について述べています。結果は現在なので、would be living を使います。"
        },
        {
          text: "If I had taken your advice then, I (　　) happier now.",
          choices: ["am", "can be", "would be", "might have been"],
          answer: 2,
          explanation: "then が過去の条件、now が現在の結果を示しています。過去の条件には had taken、現在の結果には would be を使います。"
        },
        {
          text: "If she had gone to bed earlier, she (　　) so tired now.",
          choices: ["would not be", "would not have been", "is not", "had not been"],
          answer: 0,
          explanation: "過去に早く寝なかったことが現在の疲労につながっています。結果は現在なので、would not be を使います。"
        }
      ]
    },
    {
      id: "future-subjunctive-should",
      version: 1,
      title: "仮定法未来（should）",
      html: `
        <p><code>if + 主語 + should + 動詞の原形</code> は、未来に起こる可能性が低いことを「万一～するようなことがあれば」と表す形です。</p>
        <div class="formula">If + 主語 + should + 動詞の原形, 主語 + will / would / can / could + 動詞の原形</div>
        <blockquote><p>If it should rain tomorrow, we will cancel the picnic.<br>万一明日雨が降れば、私たちはピクニックを中止します。</p></blockquote>
        <p>if節の <code>should</code> は「～すべきだ」という義務ではありません。通常の条件文 <code>If it rains tomorrow</code> よりも可能性を低く見ており、慎重でやや改まった表現です。</p>
        <p>主節には <code>will</code> などの直説法と、<code>would</code> などの仮定法のどちらも使えます。</p>
        <blockquote><p>If the plan should fail, we would need another solution.<br>万一その計画が失敗すれば、別の解決策が必要になるでしょう。</p></blockquote>
        <p>主節を命令文にすることもできます。</p>
        <blockquote><p>If anyone should call, tell them I’ll be back soon.<br>万一誰かから電話があったら、すぐ戻ると伝えてください。</p></blockquote>
        <p class="note">判断するときは、if節の should を義務の意味で訳さず、「万一」と考えます。should の後ろには必ず動詞の原形を置きます。</p>`,
      questions: [
        {
          text: "If you (　　) any help, please contact me.",
          choices: ["should need", "should needed", "would need", "had needed"],
          answer: 0,
          explanation: "should の後ろには動詞の原形を置きます。「万一助けが必要になれば」という、可能性の低い未来の条件です。"
        },
        {
          text: "If the weather should (　　) worse, we will cancel the game.",
          choices: ["gets", "got", "get", "getting"],
          answer: 2,
          explanation: "仮定法未来のif節は should + 動詞の原形です。主語が the weather でも、gets ではなく原形の get を使います。"
        },
        {
          text: "If the train should be delayed, please (　　) me.",
          choices: ["called", "calling", "to call", "call"],
          answer: 3,
          explanation: "仮定法未来では、主節を命令文にすることもできます。please の後ろには動詞の原形 call を置きます。"
        }
      ]
    },
    {
      id: "future-subjunctive-were-to",
      version: 1,
      title: "仮定法未来（were to）",
      html: `
        <p><code>if + 主語 + were to + 動詞の原形</code> は、未来に起こる可能性が非常に低いことや、現実にはほとんど考えられないことを「仮に～するようなことがあれば」「もし～するとしたら」と表す形です。</p>
        <div class="formula">If + 主語 + were to + 動詞の原形, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If I were to live abroad, I would choose Canada.<br>仮に外国で暮らすとしたら、私はカナダを選ぶでしょう。</p></blockquote>
        <p><code>were to</code> は、主語が何であっても基本的に同じ形で使います。</p>
        <blockquote><p>If he were to lose his job, he would have to move.<br>仮に彼が仕事を失うようなことがあれば、引っ越さなければならないでしょう。</p></blockquote>
        <p>現実には起こりそうにないことだけでなく、想像上の極端な状況にも使えます。</p>
        <blockquote><p>If the sun were to disappear, life on Earth would not survive.<br>仮に太陽が消滅するとしたら、地球上の生命は生き残れないでしょう。</p></blockquote>
        <p><code>should</code> を使う仮定法未来が「万一、実際に起こったら」という条件を表すのに対し、<code>were to</code> は「仮にそうなるとしたら」と、より仮想的な状況を思い描く表現です。</p>
        <p class="note">判断するときは、were to の後ろに動詞の原形が置かれていることと、主節に would / could / might などが使われていることを確認します。</p>`,
      questions: [
        {
          text: "If I (　　) abroad, I would choose Canada.",
          choices: ["were to live", "were living", "should lived", "had lived"],
          answer: 0,
          explanation: "if + 主語 + were to + 動詞の原形で、「仮に外国で暮らすとしたら」という可能性の低い未来を表します。"
        },
        {
          text: "If she were to (　　) her job, she might move to another city.",
          choices: ["changed", "changing", "change", "changes"],
          answer: 2,
          explanation: "were to の後ろには動詞の原形を置くため、change が正解です。"
        },
        {
          text: "If the sun were to disappear, life on Earth (　　) not survive.",
          choices: ["will", "would", "did", "has"],
          answer: 1,
          explanation: "were to を使った仮定法未来の主節では、通常 would / could / might + 動詞の原形を使います。ここでは would not survive となります。"
        }
      ]
    },
    {
      id: "subjunctive-inversion",
      version: 1,
      title: "仮定法の倒置",
      html: `
        <p>仮定法では、if節から <code>if</code> を省略し、助動詞やbe動詞を主語の前に出すことがあります。意味は通常の仮定法と同じですが、文章語的で改まった表現です。</p>
        <p>倒置できるのは、if節に <code>had</code>、<code>were</code>、<code>should</code> がある場合です。</p>
        <h3>had の倒置</h3>
        <p>仮定法過去完了では、<code>if</code> を省略して <code>had</code> を主語の前に出します。</p>
        <div class="formula">If + 主語 + had + 過去分詞 → Had + 主語 + 過去分詞</div>
        <blockquote><p>If I had known the truth, I would have told you.<br>Had I known the truth, I would have told you.<br>もし真実を知っていたら、あなたに伝えていたでしょう。</p></blockquote>
        <h3>were の倒置</h3>
        <p>仮定法過去のbe動詞や、<code>were to</code> を使う仮定法未来でも倒置できます。</p>
        <blockquote><p>If I were you, I would accept the offer.<br>Were I you, I would accept the offer.<br>もし私があなたなら、その申し出を受け入れるでしょう。</p></blockquote>
        <blockquote><p>If he were to change his mind, we would reconsider the plan.<br>Were he to change his mind, we would reconsider the plan.<br>仮に彼が考えを変えるとしたら、私たちは計画を再検討するでしょう。</p></blockquote>
        <h3>should の倒置</h3>
        <p><code>should</code> を使う仮定法未来では、<code>if</code> を省略して <code>should</code> を主語の前に出します。</p>
        <div class="formula">If + 主語 + should + 動詞の原形 → Should + 主語 + 動詞の原形</div>
        <blockquote><p>If you should need any help, please contact me.<br>Should you need any help, please contact me.<br>万一助けが必要になったら、私に連絡してください。</p></blockquote>
        <p class="note">倒置では疑問文と同じ語順になりますが、疑問ではありません。文頭の Had / Were / Should の後ろに主語が続いていれば、省略された if を補って考えます。</p>`,
      questions: [
        {
          text: "(　　) I known the truth, I would have told you.",
          choices: ["Were", "Had", "Should", "Would"],
          answer: 1,
          explanation: "If I had known ... から if を省略し、had を主語の前に出した仮定法過去完了の倒置です。"
        },
        {
          text: "(　　) I you, I would accept the offer.",
          choices: ["Had", "Was", "Were", "Should"],
          answer: 2,
          explanation: "If I were you ... の if を省略すると、Were I you ... となります。"
        },
        {
          text: "(　　) you need any help, please contact me.",
          choices: ["Had", "Would", "Were", "Should"],
          answer: 3,
          explanation: "If you should need ... から if を省略し、should を主語の前に出した形です。「万一助けが必要になったら」という意味を表します。"
        }
      ]
    },
    {
      id: "if-it-were-not-for",
      version: 1,
      title: "If it were not for",
      html: `
        <p><code>If it were not for + 名詞</code> は、「もし～がなければ」という意味を表します。現在の事実とは反対の状況を仮定する、仮定法過去の表現です。</p>
        <div class="formula">If it were not for + 名詞, 主語 + would / could / might + 動詞の原形</div>
        <blockquote><p>If it were not for your help, I could not finish this work.<br>もしあなたの助けがなければ、私はこの仕事を終えられないでしょう。</p></blockquote>
        <p>この文は、実際には「あなたの助けがある」という現在の事実を前提に、その反対を仮定しています。</p>
        <blockquote><p>If it were not for the sun, nothing could live on Earth.<br>もし太陽がなければ、地球上では何も生きられないでしょう。</p></blockquote>
        <p><code>If it were not for</code> は、<code>Without</code> を使って書き換えることもできます。</p>
        <blockquote><p>If it were not for water, we could not survive.<br>Without water, we could not survive.<br>水がなければ、私たちは生きていけないでしょう。</p></blockquote>
        <p>過去の事実について「もし～がなかったなら」と仮定する場合は、仮定法過去完了の <code>If it had not been for + 名詞</code> を使います。</p>
        <blockquote><p>If it had not been for your advice, I would have made a serious mistake.<br>もしあなたの助言がなかったなら、私は重大な間違いをしていたでしょう。</p></blockquote>
        <p class="note">現在についての仮定なら were not for、過去についての仮定なら had not been for と区別します。</p>`,
      questions: [
        {
          text: "If it (　　) for your help, I could not finish this work.",
          choices: ["is not", "were not", "had not", "would not be"],
          answer: 1,
          explanation: "現在の事実に反する仮定なので、If it were not for + 名詞を使います。「もしあなたの助けがなければ」という意味です。"
        },
        {
          text: "If it were not for the sun, nothing (　　) live on Earth.",
          choices: ["can", "has", "could", "did"],
          answer: 2,
          explanation: "If it were not for は仮定法過去の表現です。主節では通常、would / could / might + 動詞の原形を使います。"
        },
        {
          text: "If it (　　) your advice, I would have made a serious mistake.",
          choices: ["were not for", "had not been for", "would not be for", "has not been for"],
          answer: 1,
          explanation: "過去の事実について「もしあなたの助言がなかったなら」と仮定しているため、仮定法過去完了の If it had not been for + 名詞を使います。"
        }
      ]
    },
    {
      id: "as-if-subjunctive",
      version: 1,
      title: "as if + 仮定法",
      html: `
        <p><code>as if + 仮定法</code> は、「まるで～であるかのように」「まるで～したかのように」という意味を表します。実際の事実とは異なることや、話し手が事実ではないと考えていることを表す表現です。<code>as though</code> もほぼ同じ意味で使えます。</p>
        <h3>as if + 仮定法過去</h3>
        <p>現在の事実に反することや、主節と同じ時点の状況を表す場合は、<code>as if + 主語 + 過去形</code> を使います。</p>
        <blockquote><p>He talks as if he knew everything.<br>彼はまるですべてを知っているかのように話します。</p></blockquote>
        <p>実際には「彼はすべてを知っているわけではない」という含みがあります。be動詞は、仮定法では主語にかかわらず <code>were</code> を使うのが基本です。</p>
        <blockquote><p>She treats me as if I were a child.<br>彼女は私をまるで子どもであるかのように扱います。</p></blockquote>
        <h3>as if + 仮定法過去完了</h3>
        <p>主節よりも前に起きた、事実とは異なることを表す場合は、<code>as if + 主語 + had + 過去分詞</code> を使います。</p>
        <blockquote><p>She looked as if she had seen a ghost.<br>彼女はまるで幽霊を見たかのような顔をしていました。</p></blockquote>
        <p>「幽霊を見た」という仮定上の出来事は、「そのような顔をしていた」時点より前にあります。</p>
        <blockquote><p>He speaks English as if he had lived in the United States.<br>彼はまるでアメリカに住んでいたことがあるかのように英語を話します。</p></blockquote>
        <p class="note">主節と同じ時点の仮定なら仮定法過去、主節より前の仮定なら仮定法過去完了を使います。主節の形だけでなく、二つの出来事の時間関係を確認します。</p>`,
      questions: [
        {
          text: "He talks as if he (　　) everything, but in fact he does not.",
          choices: ["knows", "knew", "had known", "will know"],
          answer: 1,
          explanation: "現在の事実に反して「まるですべてを知っているかのように」と表すため、as if + 仮定法過去を使います。"
        },
        {
          text: "She treats me as if I (　　) a child, but I am an adult.",
          choices: ["am", "was", "were", "had been"],
          answer: 2,
          explanation: "実際には子どもではないという現在の事実に反する仮定です。仮定法では、主語が I でも基本的に were を使います。"
        },
        {
          text: "She looked as if she (　　) a ghost, but she had not.",
          choices: ["sees", "saw", "has seen", "had seen"],
          answer: 3,
          explanation: "「幽霊を見た」という仮定上の出来事は、「そのような顔をしていた」時点より前なので、as if + had + 過去分詞を使います。"
        }
      ]
    },
    {
      id: "it-is-time-subjunctive-past",
      version: 1,
      title: "It is time + 仮定法過去",
      html: `
        <p><code>It is time + 主語 + 過去形</code> は、「もう～する時間だ」「そろそろ～してもよいころだ」という意味を表します。</p>
        <div class="formula">It is time + 主語 + 動詞の過去形</div>
        <blockquote><p>It is time you went to bed.<br>もうあなたは寝る時間です。</p></blockquote>
        <p><code>went</code> は過去の出来事を表しているのではありません。「今はまだ寝ていないが、もう寝るべき時間だ」という現在の状況を、仮定法過去によって表しています。</p>
        <blockquote><p>It is time we started the meeting.<br>そろそろ会議を始める時間です。</p></blockquote>
        <p>この表現には、単に時刻を示すだけでなく、「もう実行してもよいころなのに、まだ実行していない」という含みがあります。</p>
        <h3>about time・high time</h3>
        <p><code>time</code> の前に <code>about</code> や <code>high</code> を置くと、遅れているという気持ちが強くなります。</p>
        <blockquote><p>It is about time you cleaned your room.<br>そろそろ部屋を掃除してもよいころです。</p></blockquote>
        <blockquote><p>It is high time he found a job.<br>彼はもう仕事を見つけるべきころです。</p></blockquote>
        <p class="note">It is high time は「とっくに～してもよいころだ」という、強い催促や不満を表します。</p>`,
      questions: [
        {
          text: "It is time you (　　) to bed.",
          choices: ["go", "went", "have gone", "will go"],
          answer: 1,
          explanation: "It is time + 主語 + 過去形で、「もう～する時間だ」という意味を表します。過去形ですが、現在の状況について述べています。"
        },
        {
          text: "It is time we (　　) the meeting.",
          choices: ["start", "will start", "started", "have started"],
          answer: 2,
          explanation: "「そろそろ会議を始める時間だ」という、現在の状況を表す仮定法過去です。we の後ろには過去形の started を置きます。"
        },
        {
          text: "It is high time he (　　) a job.",
          choices: ["finds", "found", "has found", "will find"],
          answer: 1,
          explanation: "It is high time + 主語 + 過去形は、「もうとっくに～してもよいころだ」という強い催促や不満を表します。ここでは過去形の found が適切です。"
        }
      ]
    }
  ]
};

if (typeof process !== "undefined" && process.argv.includes("--check")) {
  console.assert(curriculum.lessons.length > 0, "単元が1件以上あること");
  console.assert(new Set(curriculum.lessons.map(lesson => lesson.id)).size === curriculum.lessons.length, "単元IDが重複しないこと");
  console.assert(curriculum.lessons.every(lesson => lesson.questions.length > 0), "各単元に問題があること");
  console.assert(curriculum.lessons.flatMap(lesson => lesson.questions).every(question => question.choices.length === 4 && question.answer >= 0 && question.answer < 4), "全問が有効な4択であること");
  console.log("CONTENT_CHECK_OK");
}
