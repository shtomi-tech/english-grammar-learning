const subjunctiveCourse = {
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
          id: "past-subjunctive-q1",
          text: "If I (　　) you, I would accept the offer.",
          choices: ["am", "was", "have been", "were"],
          answer: 3,
          explanation: "現在の事実に反する仮定です。仮定法過去のbe動詞は、主語が I でも基本的に were を使います。"
        },
        {
          id: "past-subjunctive-q2",
          text: "If I had enough money, I (　　) a new bicycle.",
          choices: ["plan buy", "could buy", "might had", "happily buy"],
          answer: 1,
          explanation: "現在は十分なお金がないという仮定に対し、could + 動詞の原形で「買えるのに」と表します。"
        },
        {
          id: "past-subjunctive-q3",
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
          id: "past-perfect-subjunctive-q1",
          text: "If she (　　) earlier, she would have caught the train.",
          choices: ["leaves", "left", "would leave", "had left"],
          answer: 3,
          explanation: "過去の事実に反する仮定なので、if + 主語 + had + 過去分詞を使います。"
        },
        {
          id: "past-perfect-subjunctive-q2",
          text: "If he had listened to the advice, he (　　) the mistake.",
          choices: ["would avoid", "will avoid", "would have avoided", "avoided"],
          answer: 2,
          explanation: "過去の事実に反する条件の結果は、would have + 過去分詞で表します。"
        },
        {
          id: "past-perfect-subjunctive-q3",
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
          id: "mixed-subjunctive-q1",
          text: "If I had taken that job, I (　　) in London now.",
          choices: ["live", "lived", "would be living", "would have lived"],
          answer: 2,
          explanation: "過去にその仕事を選ばなかったという仮定から、現在の生活について述べています。結果は現在なので、would be living を使います。"
        },
        {
          id: "mixed-subjunctive-q2",
          text: "If I had taken your advice then, I (　　) happier now.",
          choices: ["am", "can be", "would be", "might have been"],
          answer: 2,
          explanation: "then が過去の条件、now が現在の結果を示しています。過去の条件には had taken、現在の結果には would be を使います。"
        },
        {
          id: "mixed-subjunctive-q3",
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
          id: "future-subjunctive-should-q1",
          text: "If you (　　) any help, please contact me.",
          choices: ["should need", "should needed", "would need", "had needed"],
          answer: 0,
          explanation: "should の後ろには動詞の原形を置きます。「万一助けが必要になれば」という、可能性の低い未来の条件です。"
        },
        {
          id: "future-subjunctive-should-q2",
          text: "If the weather should (　　) worse, we will cancel the game.",
          choices: ["gets", "got", "get", "getting"],
          answer: 2,
          explanation: "仮定法未来のif節は should + 動詞の原形です。主語が the weather でも、gets ではなく原形の get を使います。"
        },
        {
          id: "future-subjunctive-should-q3",
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
          id: "future-subjunctive-were-to-q1",
          text: "If I (　　) abroad, I would choose Canada.",
          choices: ["were to live", "were living", "should lived", "had lived"],
          answer: 0,
          explanation: "if + 主語 + were to + 動詞の原形で、「仮に外国で暮らすとしたら」という可能性の低い未来を表します。"
        },
        {
          id: "future-subjunctive-were-to-q2",
          text: "If she were to (　　) her job, she might move to another city.",
          choices: ["changed", "changing", "change", "changes"],
          answer: 2,
          explanation: "were to の後ろには動詞の原形を置くため、change が正解です。"
        },
        {
          id: "future-subjunctive-were-to-q3",
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
        <details class="section" open>
        <summary>had の倒置</summary>
        <p>仮定法過去完了では、<code>if</code> を省略して <code>had</code> を主語の前に出します。</p>
        <div class="formula">If + 主語 + had + 過去分詞 → Had + 主語 + 過去分詞</div>
        <blockquote><p>If I had known the truth, I would have told you.<br>Had I known the truth, I would have told you.<br>もし真実を知っていたら、あなたに伝えていたでしょう。</p></blockquote>
        </details>
        <details class="section">
        <summary>were の倒置</summary>
        <p>仮定法過去のbe動詞や、<code>were to</code> を使う仮定法未来でも倒置できます。</p>
        <blockquote><p>If I were you, I would accept the offer.<br>Were I you, I would accept the offer.<br>もし私があなたなら、その申し出を受け入れるでしょう。</p></blockquote>
        <blockquote><p>If he were to change his mind, we would reconsider the plan.<br>Were he to change his mind, we would reconsider the plan.<br>仮に彼が考えを変えるとしたら、私たちは計画を再検討するでしょう。</p></blockquote>
        </details>
        <details class="section">
        <summary>should の倒置</summary>
        <p><code>should</code> を使う仮定法未来では、<code>if</code> を省略して <code>should</code> を主語の前に出します。</p>
        <div class="formula">If + 主語 + should + 動詞の原形 → Should + 主語 + 動詞の原形</div>
        <blockquote><p>If you should need any help, please contact me.<br>Should you need any help, please contact me.<br>万一助けが必要になったら、私に連絡してください。</p></blockquote>
        </details>
        <p class="note">倒置では疑問文と同じ語順になりますが、疑問ではありません。文頭の Had / Were / Should の後ろに主語が続いていれば、省略された if を補って考えます。</p>`,
      questions: [
        {
          id: "subjunctive-inversion-q1",
          text: "(　　) I known the truth, I would have told you.",
          choices: ["Were", "Had", "Should", "Would"],
          answer: 1,
          explanation: "If I had known ... から if を省略し、had を主語の前に出した仮定法過去完了の倒置です。"
        },
        {
          id: "subjunctive-inversion-q2",
          text: "(　　) I you, I would accept the offer.",
          choices: ["Had", "Was", "Were", "Should"],
          answer: 2,
          explanation: "If I were you ... の if を省略すると、Were I you ... となります。"
        },
        {
          id: "subjunctive-inversion-q3",
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
          id: "if-it-were-not-for-q1",
          text: "If it (　　) for your help, I could not finish this work.",
          choices: ["is not", "were not", "had not", "would not be"],
          answer: 1,
          explanation: "現在の事実に反する仮定なので、If it were not for + 名詞を使います。「もしあなたの助けがなければ」という意味です。"
        },
        {
          id: "if-it-were-not-for-q2",
          text: "If it were not for the sun, nothing (　　) live on Earth.",
          choices: ["can", "has", "could", "did"],
          answer: 2,
          explanation: "If it were not for は仮定法過去の表現です。主節では通常、would / could / might + 動詞の原形を使います。"
        },
        {
          id: "if-it-were-not-for-q3",
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
        <details class="section" open>
        <summary>as if + 仮定法過去</summary>
        <p>現在の事実に反することや、主節と同じ時点の状況を表す場合は、<code>as if + 主語 + 過去形</code> を使います。</p>
        <blockquote><p>He talks as if he knew everything.<br>彼はまるですべてを知っているかのように話します。</p></blockquote>
        <p>実際には「彼はすべてを知っているわけではない」という含みがあります。be動詞は、仮定法では主語にかかわらず <code>were</code> を使うのが基本です。</p>
        <blockquote><p>She treats me as if I were a child.<br>彼女は私をまるで子どもであるかのように扱います。</p></blockquote>
        </details>
        <details class="section">
        <summary>as if + 仮定法過去完了</summary>
        <p>主節よりも前に起きた、事実とは異なることを表す場合は、<code>as if + 主語 + had + 過去分詞</code> を使います。</p>
        <blockquote><p>She looked as if she had seen a ghost.<br>彼女はまるで幽霊を見たかのような顔をしていました。</p></blockquote>
        <p>「幽霊を見た」という仮定上の出来事は、「そのような顔をしていた」時点より前にあります。</p>
        <blockquote><p>He speaks English as if he had lived in the United States.<br>彼はまるでアメリカに住んでいたことがあるかのように英語を話します。</p></blockquote>
        </details>
        <p class="note">主節と同じ時点の仮定なら仮定法過去、主節より前の仮定なら仮定法過去完了を使います。主節の形だけでなく、二つの出来事の時間関係を確認します。</p>`,
      questions: [
        {
          id: "as-if-subjunctive-q1",
          text: "He talks as if he (　　) everything, but in fact he does not.",
          choices: ["knows", "knew", "had known", "will know"],
          answer: 1,
          explanation: "現在の事実に反して「まるですべてを知っているかのように」と表すため、as if + 仮定法過去を使います。"
        },
        {
          id: "as-if-subjunctive-q2",
          text: "She treats me as if I (　　) a child, but I am an adult.",
          choices: ["am", "was", "were", "had been"],
          answer: 2,
          explanation: "実際には子どもではないという現在の事実に反する仮定です。仮定法では、主語が I でも基本的に were を使います。"
        },
        {
          id: "as-if-subjunctive-q3",
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
        <details class="section">
        <summary>about time・high time</summary>
        <p><code>time</code> の前に <code>about</code> や <code>high</code> を置くと、遅れているという気持ちが強くなります。</p>
        <blockquote><p>It is about time you cleaned your room.<br>そろそろ部屋を掃除してもよいころです。</p></blockquote>
        <blockquote><p>It is high time he found a job.<br>彼はもう仕事を見つけるべきころです。</p></blockquote>
        <p class="note">It is high time は「とっくに～してもよいころだ」という、強い催促や不満を表します。</p>
        </details>`,
      questions: [
        {
          id: "it-is-time-subjunctive-past-q1",
          text: "It is time you (　　) to bed.",
          choices: ["go", "went", "have gone", "will go"],
          answer: 1,
          explanation: "It is time + 主語 + 過去形で、「もう～する時間だ」という意味を表します。過去形ですが、現在の状況について述べています。"
        },
        {
          id: "it-is-time-subjunctive-past-q2",
          text: "It is time we (　　) the meeting.",
          choices: ["start", "will start", "started", "have started"],
          answer: 2,
          explanation: "「そろそろ会議を始める時間だ」という、現在の状況を表す仮定法過去です。we の後ろには過去形の started を置きます。"
        },
        {
          id: "it-is-time-subjunctive-past-q3",
          text: "It is high time he (　　) a job.",
          choices: ["finds", "found", "has found", "will find"],
          answer: 1,
          explanation: "It is high time + 主語 + 過去形は、「もうとっくに～してもよいころだ」という強い催促や不満を表します。ここでは過去形の found が適切です。"
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
      recommendationLead: "現実と異なる想像・願望・後悔を、動詞の形で表す文法です。",
      overview: subjunctiveCourse.overview,
      lessons: subjunctiveCourse.lessons
    },
    {
      id: "participles",
      title: "分詞",
      recommendationLead: "動詞の形を使って、名詞や人・物の状態を説明する文法です。",
      overview: {
        title: "分詞とは",
        html: `
          <p>分詞は、動詞の性質を残しながら、名詞を説明したり、状態や感情を表したりする形です。</p>
          <p>現在分詞は <code>動詞の原形 + -ing</code>、過去分詞は動詞ごとの過去分詞形を使います。名詞が動作をする側なら現在分詞、動作をされる側なら過去分詞を選ぶのが基本です。</p>
          <blockquote><p>a sleeping baby（眠っている赤ちゃん）<br>a broken window（壊れた窓）</p></blockquote>
          <p>分詞の形容詞的用法では、分詞だけでなく、分詞に続く語句全体で名詞を説明することもあります。まず「分詞と名詞の関係」を確認してから形を選びます。</p>
          <p class="note">分詞は動名詞や進行形と同じ <code>-ing</code> の形になることがあります。文中で何を説明・補足しているかを見分けることが大切です。</p>`
      },
      lessons: [
        {
          id: "participles-as-adjectives-present",
          version: 1,
          title: "分詞の形容詞的用法（現在分詞）",
          html: `
            <p>現在分詞は、動詞の原形に <code>-ing</code> を付けた形で、名詞を説明する形容詞のように使われます。説明される名詞が、その動作を「する側」であることがポイントです。</p>
            <details class="section" open>
            <summary>名詞の前に置く場合</summary>
            <p>現在分詞だけで名詞を説明するときは、通常、名詞の前に置きます。</p>
            <blockquote><p>a sleeping baby<br>眠っている赤ちゃん</p></blockquote>
            <blockquote><p>a barking dog<br>ほえている犬</p></blockquote>
            </details>
            <details class="section">
            <summary>名詞の後ろに置く場合</summary>
            <p>現在分詞に目的語や副詞などが伴う場合は、名詞の後ろに置きます。</p>
            <blockquote><p>the girl dancing on the stage<br>ステージで踊っている少女</p></blockquote>
            <blockquote><p>the man standing by the door<br>ドアのそばに立っている男性</p></blockquote>
            <p>名詞の後ろに置かれた現在分詞は、関係代名詞を使った文に戻せます。</p>
            <blockquote><p>the girl dancing on the stage<br>= the girl who is dancing on the stage</p></blockquote>
            </details>
            <details class="section">
            <summary>動名詞や進行形との違い</summary>
            <p><code>Swimming is fun.</code> の <code>Swimming</code> は動名詞、<code>The boy is swimming.</code> の <code>swimming</code> は進行形、<code>the swimming boy</code> の <code>swimming</code> は <code>boy</code> を説明する現在分詞です。</p>
            </details>
            <p class="note">現在分詞を見つけたら、説明されている名詞がその動作をしているかを確認します。</p>`,
          questions: [
            {
              id: "participles-as-adjectives-present-q1",
              text: "Look at the baby (　　) in the crib.",
              choices: ["slept", "sleeping", "sleep", "to sleep"],
              answer: 1,
              explanation: "baby が「眠っている」ので、現在分詞 sleeping を使って名詞を説明します。"
            },
            {
              id: "participles-as-adjectives-present-q2",
              text: "The man (　　) by the door is my uncle.",
              choices: ["stood", "standing", "stand", "to stand"],
              answer: 1,
              explanation: "standing by the door は「ドアのそばに立っている」という意味で、the man を後ろから説明しています。who is standing by the door を短くした形です。"
            },
            {
              id: "participles-as-adjectives-present-q3",
              text: "次のうち、現在分詞が形容詞的に使われている文を選びなさい。",
              choices: ["Swimming is fun.", "The boy is swimming.", "The swimming boy waved at me.", "He enjoys swimming."],
              answer: 2,
              explanation: "swimming が boy を説明しているため、現在分詞の形容詞的用法です。1と4は動名詞、2は進行形です。"
            }
          ]
        },
        {
          id: "participles-as-adjectives-past",
          version: 1,
          title: "分詞の形容詞的用法（過去分詞）",
          html: `
            <p>過去分詞は、名詞を説明する形容詞のように使われます。説明される名詞が、動作を「される側」であることや、動作が完了した状態であることを表します。</p>
            <p>過去分詞は <code>-ed</code> 形だけでなく、不規則変化もあります。</p>
            <blockquote><p>broken（壊れた）・written（書かれた）・stolen（盗まれた）</p></blockquote>
            <details class="section" open>
            <summary>名詞の前に置く場合</summary>
            <blockquote><p>a broken window<br>壊れた窓</p></blockquote>
            <blockquote><p>a stolen bicycle<br>盗まれた自転車</p></blockquote>
            </details>
            <details class="section">
            <summary>名詞の後ろに置く場合</summary>
            <p>過去分詞に修飾語句が伴う場合は、名詞の後ろに置きます。</p>
            <blockquote><p>a picture painted by my father<br>父によって描かれた絵</p></blockquote>
            <blockquote><p>the books written in English<br>英語で書かれた本</p></blockquote>
            <p>名詞の後ろに置かれた過去分詞は、<code>that was ～</code> や <code>that were ～</code> を使った文に戻せます。</p>
            <blockquote><p>the books written in English<br>= the books that were written in English</p></blockquote>
            </details>
            <p class="note">名詞が動作をする側なら現在分詞、動作をされる側なら過去分詞を使います。</p>`,
          questions: [
            {
              id: "participles-as-adjectives-past-q1",
              text: "The children found a (　　) window.",
              choices: ["breaking", "broken", "broke", "break"],
              answer: 1,
              explanation: "窓は「壊す側」ではなく「壊される側」なので、過去分詞 broken を使います。"
            },
            {
              id: "participles-as-adjectives-past-q2",
              text: "The books (　　) in English are on the desk.",
              choices: ["writing", "wrote", "written", "write"],
              answer: 2,
              explanation: "written in English は「英語で書かれた」という意味で、the books を後ろから説明しています。that were written in English を短くした形です。"
            },
            {
              id: "participles-as-adjectives-past-q3",
              text: "I found a bicycle (　　) near the station.",
              choices: ["stealing", "stole", "stolen", "steal"],
              answer: 2,
              explanation: "自転車は「盗む側」ではなく「盗まれる側」なので、過去分詞 stolen を使います。"
            }
          ]
        },
        {
          id: "emotion-verb-participles",
          version: 1,
          title: "感情動詞の分詞化",
          html: `
            <p>感情を表す動詞から作られた現在分詞・過去分詞は、形容詞として使われます。現在分詞は感情を引き起こす側、過去分詞は感情を感じる側を表します。</p>
            <blockquote><p>The movie was exciting.<br>その映画はわくわくさせるものでした。</p></blockquote>
            <blockquote><p>I was excited by the movie.<br>私はその映画にわくわくしました。</p></blockquote>
            <p>よく使われる組み合わせには、<code>interesting / interested</code>、<code>boring / bored</code>、<code>surprising / surprised</code>、<code>confusing / confused</code> などがあります。</p>
            <blockquote><p>I am interesting.（私は興味深い人です。）<br>I am interested in English.（私は英語に興味があります。）</p></blockquote>
            <p class="note">「自分が感情を感じている」と言いたいときは過去分詞、人や物が感情を起こす側なら現在分詞を使います。</p>`,
          questions: [
            {
              id: "emotion-verb-participles-q1",
              text: "The movie was very (　　).",
              choices: ["excited", "exciting", "excite", "excites"],
              answer: 1,
              explanation: "映画は人をわくわくさせる側なので、現在分詞 exciting を使います。"
            },
            {
              id: "emotion-verb-participles-q2",
              text: "I was (　　) by the complicated instructions.",
              choices: ["confusing", "confuse", "confused", "confuses"],
              answer: 2,
              explanation: "「私」は混乱させられた側なので、過去分詞 confused を使います。"
            },
            {
              id: "emotion-verb-participles-q3",
              text: "The lecture was boring, so the students felt (　　).",
              choices: ["bored", "boring", "bore", "bores"],
              answer: 0,
              explanation: "講義は退屈させる側なので boring、学生は退屈を感じる側なので bored を使います。"
            }
          ]
        }
      ]
    },
    {
      id: "infinitives",
      title: "不定詞",
      recommendationLead: "to + 動詞の原形で、名詞・形容詞・副詞の働きをする文法です。",
      overview: {
        title: "不定詞とは",
        html: `
          <p>不定詞は、基本的に <code>to + 動詞の原形</code> の形で、動詞の意味を残しながら、名詞・形容詞・副詞のように働く表現です。</p>
          <p>「～すること」「～するために」「～するための」のように、動作や状態をさまざまな形で文に組み込めます。</p>
          <blockquote>
            <p>To learn English takes time.<br>英語を学ぶには時間がかかります。</p>
            <p>I need something to drink.<br>私は何か飲むものが必要です。</p>
            <p>She went to the library to study.<br>彼女は勉強するために図書館へ行きました。</p>
          </blockquote>
          <p><code>to learn English</code> は「英語を学ぶこと」、<code>to drink</code> は <code>something</code> の内容、<code>to study</code> は目的を表しています。</p>
          <p>不定詞は、主語・目的語・補語になったり、名詞を説明したり、目的や理由を付け加えたりします。また、助動詞や一部の使役・知覚を表す動詞の後ろでは、<code>to</code> を使わない原形不定詞が使われます。</p>
          <p class="note">まず <code>to</code> の後ろが動詞の原形かを確認し、その不定詞のまとまりが文中でどの働きをしているかを見分けます。<code>to</code> が前置詞の場合は、後ろに名詞や動名詞が続くため、形だけで判断しないことが大切です。</p>`
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
              explanation: "文頭のto read books全体が文の主語になっているため、名詞的用法です。"
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
              explanation: "want の後ろで「食べたい内容」を表すので、want to + 動詞の原形 とします。to eat quickly and cheaply 全体がwantの目的語です。"
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
              explanation: "My dream is ... の後ろで、夢の内容を to look after ... が説明しています。to + 動詞の原形 の不定詞が補語となり、「病院で多くの病人の世話をすること」という意味です。"
            }
          ]
        },
        {
          id: "dummy-subject-it",
          version: 1,
          title: "形式主語構文",
          html: `
            <p>英語では、主語が長くなると、文の形を整えるために <code>it</code> を主語の位置に置き、内容を表す不定詞句やthat節を文の後ろに置くことがあります。これを形式主語構文といいます。</p>
            <details class="section" open>
            <summary>不定詞を使う形</summary>
            <div class="formula">It is + 形容詞 + to + 動詞の原形</div>
            <blockquote><p>It is important to check the answer.<br>答えを確認することは大切です。</p></blockquote>
            <p><code>it</code> は具体的なものを指していません。内容上の主語は <code>to check the answer</code> です。<code>To check the answer is important.</code> としても意味は通りますが、長い主語を後ろに置く形式主語構文のほうが自然です。</p>
            </details>
            <details class="section" open>
            <summary>動作をする人を示す形</summary>
            <div class="formula">It is + 形容詞 + for + 人 + to + 動詞の原形</div>
            <blockquote><p>It is important for students to review the lesson.<br>生徒がその授業を復習することは大切です。</p></blockquote>
            <p><code>for students</code> は、<code>to review</code> の動作をする人、つまり不定詞の意味上の主語を表しています。</p>
            </details>
            <details class="section" open>
            <summary>that節を使う形</summary>
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
              explanation: "It が形式上の主語となり、内容を担う to check the answer を後ろに置いています。完成文は「答えを確認することは重要だ」という意味です。"
            },
            {
              id: "dummy-subject-it-q2",
              text: "It is important ___ to study. に入る形は？",
              choices: ["for him", "him", "he", "to him"],
              answer: 0,
              explanation: "for him to study で、him が to study の意味上の主語になり、「彼が勉強すること」が重要だという意味になります。"
            },
            {
              id: "dummy-subject-it-q3",
              text: "It is difficult for children ___ the rule. に入る形は？",
              choices: ["to understand", "understanding", "understand", "understood"],
              answer: 0,
              explanation: "It is 形容詞 for + 人 + to不定詞 の形です。for children は to understand の意味上の主語です。"
            }
          ]
        },
        {
          id: "dummy-object-it",
          version: 1,
          title: "形式目的語構文",
          html: `
            <p>目的語になる不定詞句やthat節が長い場合、英語では目的語の位置に <code>it</code> を置き、内容を表す不定詞句やthat節を後ろに置くことがあります。これを形式目的語構文といいます。</p>
            <details class="section" open>
            <summary>不定詞を使う基本の形</summary>
            <div class="formula">主語 + 動詞 + it + 形容詞 + to + 動詞の原形</div>
            <blockquote><p>I found it difficult to answer the question.<br>私は、その質問に答えることが難しいと分かりました。</p></blockquote>
            <p>この文では、<code>it</code> が形式目的語、<code>to answer the question</code> が内容上の目的語です。<code>difficult</code> は、目的語の内容がどのようなものかを説明する目的格補語です。</p>
            </details>
            <details class="section" open>
            <summary>よく使われる形</summary>
            <p><code>find</code>、<code>think</code>、<code>feel</code>、<code>consider</code>、<code>make</code> などの動詞で、<code>動詞 + it + 形容詞</code> の形が使われます。</p>
            <blockquote><p>A lot of people may feel it easy to answer this question.<br>この問題に答えることは簡単だと、多くの人が感じているかもしれません。</p><p>Lisa thinks it important not to give up halfway.<br>リサは、途中であきらめないことが重要だと考えています。</p></blockquote>
            <p>不定詞を否定するときは、<code>not to + 動詞の原形</code> とします。</p>
            </details>
            <details class="section" open>
            <summary>不定詞の意味上の主語を示す形</summary>
            <div class="formula">主語 + 動詞 + it + 形容詞 + for + 人 + to + 動詞の原形</div>
            <blockquote><p>An unexpected snowstorm made it impossible for them to reach the summit.<br>予想外の吹雪によって、彼らが頂上に到達することは不可能になりました。</p></blockquote>
            <p><code>for them</code> は、<code>to reach</code> の動作をする人、つまり不定詞の意味上の主語を表しています。</p>
            </details>
            <details class="section" open>
            <summary>that節を使う形</summary>
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
              explanation: "feel it easy to do の形で、it が形式目的語、to answer this question が内容上の目的語です。"
            },
            {
              id: "dummy-object-it-q2",
              text: "Lisa thinks it important (    ) up halfway.",
              choices: ["not to give", "not give", "not giving", "not to giving"],
              answer: 0,
              explanation: "think it important not to do の形です。不定詞を否定するため、not to + 動詞の原形 の not to give を使います。"
            },
            {
              id: "dummy-object-it-q3",
              text: "An unexpected snowstorm made it (    ) for them to reach the summit.",
              choices: ["possible", "impossible", "easy", "important"],
              answer: 1,
              explanation: "make it + 形容詞 + for + 人 + to do の形です。予想外の吹雪によって登頂が不可能になったため、impossible が適切です。"
            }
          ]
        },
        {
          id: "infinitive-adjective-use",
          version: 1,
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
            <summary>名詞が不定詞の動作をする場合</summary>
            <blockquote><p>I need someone to help me.<br>私を助けてくれる人が必要です。</p></blockquote>
            <p><code>someone</code> が「助ける」人なので、<code>to help</code> の意味上の主語になっています。このように、名詞が不定詞の動作を受けるのか、動作をするのかを確認すると、意味を取りやすくなります。</p>
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
              <li><code>I need a book to study.</code> は、<code>to study</code> が <code>a book</code> を説明するので形容詞的用法です。</li>
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
              explanation: "<code>to eat</code> が <code>something</code> を説明し、「食べるもの」という意味になるため、to eat が正解です。"
            },
            {
              id: "infinitive-adjective-use-q2",
              text: "I need someone (　　) me with this work.",
              choices: ["to help", "helping", "helped", "to be helped"],
              answer: 0,
              explanation: "<code>someone</code> が「手伝う」人なので、<code>to help me</code> が <code>someone</code> を説明します。"
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
              explanation: "<code>to do</code> が <code>homework</code> を説明し、「するべき宿題」という意味になっています。"
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
            <summary>主節と不定詞の動作主</summary>
            <p>この用法では、主節の主語と不定詞の動作主が同じになることが多いです。</p>
            <blockquote><p>I got up early to catch the first train.<br>私は始発電車に乗るために早起きしました。</p></blockquote>
            <p><code>I</code> が「早起きする人」であり、「始発電車に乗る人」でもあります。</p>
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
              explanation: "図書館へ行った目的を表すので、<code>to study</code> が正解です。"
            },
            {
              id: "infinitive-adverbial-purpose-q2",
              text: "She spoke quietly so as (　　) the baby.",
              choices: ["not to wake", "not wake", "to not waking", "not waking"],
              answer: 0,
              explanation: "否定の目的は <code>so as not to + 動詞の原形</code> で表します。"
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
              explanation: "<code>to get some fresh air</code> は、外へ行った目的を表しています。"
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
              explanation: "<code>glad</code> の原因・理由を表すため、<code>to see</code> が正解です。"
            },
            {
              id: "infinitive-adverbial-reason-q2",
              text: "She was surprised (　　) the result.",
              choices: ["hear", "to hear", "hearing", "heard"],
              answer: 1,
              explanation: "驚いた理由を表すので、<code>to hear</code> を使います。"
            },
            {
              id: "infinitive-adverbial-reason-q3",
              text: "He was sorry to keep us waiting. の to keep us waiting の働きは？",
              choices: ["目的", "sorry の理由", "名詞を修飾する説明", "結果"],
              answer: 1,
              explanation: "<code>to keep us waiting</code> は、申し訳なく思った理由を表しています。"
            }
          ]
        },
        {
          id: "infinitive-adverbial-result",
          version: 1,
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
            <blockquote><p>He went to London to study English.<br>彼は英語を勉強するためにロンドンへ行きました。</p><p>He grew up to become a famous writer.<br>彼は成長して有名な作家になりました。</p></blockquote>
            <p>前の文はロンドンへ行った目的、後の文は成長した結果です。不定詞を「～するために」と訳すか、「～して、その結果」と訳すかを確認します。</p>
            </details>
            <details class="section" open>
            <summary>見分け方</summary>
            <p>不定詞の前にある動作と、不定詞が表す出来事の時間的な順序に注目します。前の動作のあとに起こった出来事なら、結果を表す副詞的用法です。</p>
            </details>
            <p class="note">結果を表す副詞的用法では、不定詞が「何のために」ではなく、「そのあとどうなったか」を表している点に注意します。</p>`,
          questions: [
            {
              id: "infinitive-adverbial-result-q1",
              text: "He grew up (　　) a scientist.",
              choices: ["be", "to be", "being", "been"],
              answer: 1,
              explanation: "<code>grow up to be ...</code> は「成長して～になる」という結果を表します。"
            },
            {
              id: "infinitive-adverbial-result-q2",
              text: "She hurried to the station, only (　　) that the train had left.",
              choices: ["find", "to find", "finding", "found"],
              answer: 1,
              explanation: "<code>only to + 動詞の原形</code> で、予想外の結果を表します。"
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
              explanation: "<code>to find nobody there</code> は、ドアを開けたあとに分かった結果を表しています。"
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
            <summary>不定詞の動作主を示す場合</summary>
            <p>不定詞の動作をする人を示すときは、<code>for + 人 + to + 動詞の原形</code> を使います。</p>
            <blockquote><p>This problem is too difficult for me to solve.<br>この問題は私には難しすぎて解けません。</p></blockquote>
            <p><code>for me</code> は、<code>to solve</code> の動作をする人を表しています。</p>
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
              explanation: "<code>too + 形容詞 + to + 動詞の原形</code> の形なので、<code>to</code> が正解です。"
            },
            {
              id: "infinitive-adverbial-degree-q2",
              text: "The room is large enough (　　) hold fifty people.",
              choices: ["to", "for", "that", "than"],
              answer: 0,
              explanation: "<code>形容詞 + enough + to + 動詞の原形</code> の形を使います。"
            },
            {
              id: "infinitive-adverbial-degree-q3",
              text: "This problem is too difficult (　　) me to solve.",
              choices: ["for", "to", "of", "with"],
              answer: 0,
              explanation: "不定詞の動作主を示す <code>for me</code> が必要です。"
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
  check(lessons.flatMap(lesson => lesson.questions).every(question => question.choices.length === 4 && question.answer >= 0 && question.answer < 4), "全問が有効な4択であること");
  const allQuestions = lessons.flatMap(lesson => lesson.questions);
  check(allQuestions.every(question => typeof question.id === "string" && question.id.length > 0), "全問にIDがあること");
  check(new Set(allQuestions.map(question => question.id)).size === allQuestions.length, "問題IDが重複しないこと");
  check(courses.every(course => typeof course.recommendationLead === "string" && course.recommendationLead.trim().length > 0), "全カテゴリに推薦紹介文があること");
  check(courses.every(course => !/[<>]/.test(course.recommendationLead)), "推薦紹介文にHTMLを含めないこと");
  if (failures.length > 0) {
    failures.forEach(message => console.error(`CONTENT_CHECK_NG: ${message}`));
    process.exitCode = 1;
  } else {
    console.log("CONTENT_CHECK_OK");
  }
}
