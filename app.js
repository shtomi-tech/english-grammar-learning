const stages = [
  { type: "overview", label: "概論" },
  ...curriculum.lessons.flatMap((lesson, lessonIndex) => [
    { type: "lesson", label: lesson.title, lesson, lessonIndex },
    { type: "practice", label: `${lesson.title} 練習`, lesson, lessonIndex }
  ])
];

const storageKey = "englishGrammarLearning.v2";
const legacyStorageKey = "englishGrammarLearning.subjunctivePast.v1";
const defaultState = { stage: 0, question: 0, answers: {}, versions: {} };
let state = loadState();
const progressMedia = matchMedia("(max-width: 520px)");

function syncProgressDetails(event = progressMedia) {
  document.querySelector(".progress-details").toggleAttribute("open", !event.matches);
}

syncProgressDetails();
progressMedia.addEventListener("change", syncProgressDetails);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isInteger(saved.stage) && saved.answers && !Array.isArray(saved.answers)) {
      return { ...defaultState, ...saved, stage: Math.min(saved.stage, stages.length - 1) };
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (legacy && Number.isInteger(legacy.step)) {
      return {
        stage: Math.min(legacy.step, 2),
        question: Number.isInteger(legacy.question) ? legacy.question : 0,
        answers: { "past-subjunctive": Array.isArray(legacy.answers) ? legacy.answers : [] },
        versions: {}
      };
    }
  } catch {}
  return { ...defaultState };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function syncContentVersions() {
  state.versions ||= {};
  let changed = false;
  for (const lesson of curriculum.lessons) {
    if (lesson.version && state.versions[lesson.id] !== lesson.version) {
      state.answers[lesson.id] = [];
      state.versions[lesson.id] = lesson.version;
      if (stages[state.stage]?.lesson?.id === lesson.id) state.question = 0;
      changed = true;
    }
  }
  if (changed) saveState();
}

function setStage(stage, resetQuestion = false) {
  state.stage = Math.max(0, Math.min(stage, stages.length - 1));
  if (resetQuestion) state.question = 0;
  saveState();
  render(true);
}

function currentAnswers(lesson) {
  return state.answers[lesson.id] || (state.answers[lesson.id] = []);
}

function resultLabel() {
  return state.stage === stages.length - 1 ? "学習完了" : "単元結果";
}

function currentPath(stage) {
  if (stage.type === "overview") return "仮定法 ＞ 概論";
  if (stage.type === "lesson") return `仮定法 ＞ ${stage.lesson.title} ＞ 各論`;
  const result = state.question >= stage.lesson.questions.length;
  return `仮定法 ＞ ${stage.lesson.title} ＞ ${result ? resultLabel() : "練習問題"}`;
}

function render(resetScroll = false) {
  const stage = stages[state.stage];
  const showingResult = stage.type === "practice" && state.question >= stage.lesson.questions.length;
  const stepMarkup = index => `<span class="step ${index < state.stage ? "done" : index === state.stage ? "current" : ""}" ${index === state.stage ? 'aria-current="step"' : ""}>`;
  document.querySelector("#current-path").textContent = currentPath(stage);
  document.querySelector("#steps").innerHTML = `
    <li>${stepMarkup(0)}概論</span></li>
    <li>
      <span class="branch-label">各論</span>
      <ol>
        ${curriculum.lessons.map((lesson, lessonIndex) => {
          const lessonStage = lessonIndex * 2 + 1;
          const practiceStage = lessonStage + 1;
          const practiceLabel = showingResult && state.stage === practiceStage ? resultLabel() : "練習問題";
          return `<li>
            ${stepMarkup(lessonStage)}${lesson.title}</span>
            <ol><li>${stepMarkup(practiceStage)}${practiceLabel}</span></li></ol>
          </li>`;
        }).join("")}
      </ol>
    </li>`;

  const content = document.querySelector("#content");
  if (stage.type === "overview") renderOverview(content);
  else if (stage.type === "lesson") renderLesson(content, stage.lesson);
  else renderPractice(content, stage.lesson);
  content.focus({ preventScroll: true });
  if (resetScroll) scrollTo(0, 0);
}

function renderOverview(content) {
  content.innerHTML = `
    <h2>${curriculum.overview.title}</h2>
    ${curriculum.overview.html}
    <div class="actions"><button class="primary" data-action="next">${curriculum.lessons[0].title}へ</button></div>`;
}

function renderLesson(content, lesson) {
  const stage = stages[state.stage];
  const backLabel = stage.lessonIndex === 0 ? "概論へ戻る" : `${curriculum.lessons[stage.lessonIndex - 1].title}の結果へ戻る`;
  content.innerHTML = `
    <h2>${lesson.title}</h2>
    ${lesson.html}
    <div class="actions"><button class="secondary" data-action="back">${backLabel}</button><button class="primary" data-action="next">3問に挑戦</button></div>`;
}

function renderPractice(content, lesson) {
  if (state.question >= lesson.questions.length) return renderResult(content, lesson);
  const question = lesson.questions[state.question];
  const answers = currentAnswers(lesson);
  const selected = answers[state.question];
  const answered = Number.isInteger(selected);
  const correct = selected === question.answer;
  content.innerHTML = `
    <p class="question-count">${lesson.title}　問題 ${state.question + 1} / ${lesson.questions.length}</p>
    <h2>${question.text}</h2>
    <div class="choices" role="group" aria-label="選択肢">
      ${question.choices.map((choice, index) => `<button class="choice ${answered && index === question.answer ? "correct" : ""} ${answered && index === selected && !correct ? "wrong" : ""}" data-choice="${index}" ${answered ? "disabled" : ""}>${index + 1}. ${choice}</button>`).join("")}
    </div>
    ${answered ? `<div class="feedback ${correct ? "ok" : "ng"}" role="status"><strong>${correct ? "✓ 正解" : `✕ 不正解　正解は ${question.answer + 1}. ${question.choices[question.answer]}`}</strong>${question.explanation}</div>` : `<p class="note" aria-live="polite">最も適切な選択肢を一つ選んでください。</p>`}
    <div class="actions"><button class="secondary" data-action="back">各論へ戻る</button>${answered ? `<button class="primary" data-action="next-question">${state.question + 1 === lesson.questions.length ? "結果を見る" : "次の問題"}</button>` : ""}</div>`;
}

function renderResult(content, lesson) {
  const answers = currentAnswers(lesson);
  const score = answers.reduce((sum, answer, index) => sum + (answer === lesson.questions[index].answer), 0);
  const wrongIndexes = lesson.questions.map((question, index) => answers[index] === question.answer ? -1 : index).filter(index => index >= 0);
  const hasNextLesson = state.stage + 1 < stages.length;
  const nextButton = hasNextLesson ? `<button class="${wrongIndexes.length ? "secondary" : "primary"}" data-action="next-lesson">次の各論へ</button>` : `<button class="${wrongIndexes.length ? "secondary" : "primary"}" data-action="overview">概論へ戻る</button>`;
  content.innerHTML = `
    <p class="eyebrow">${hasNextLesson ? "単元完了" : "学習完了"}</p>
    <h2>${lesson.title}の結果</h2>
    <p class="score">${score} / ${lesson.questions.length} 問正解</p>
    <p>${score === lesson.questions.length ? `${lesson.title}の基本を確認できました。` : "間違えた問題の解説を意識して、もう一度取り組んでみましょう。"}</p>
    ${wrongIndexes.length ? `<section class="review-summary" aria-labelledby="review-title">
      <h3 id="review-title">要復習：${wrongIndexes.map(index => `問題${index + 1}`).join("・")}</h3>
      <ol class="review-list">
        ${wrongIndexes.map(index => {
          const question = lesson.questions[index];
          return `<li><strong>問題${index + 1}</strong><span>${question.text}</span><span>正解：${question.answer + 1}. ${question.choices[question.answer]}</span></li>`;
        }).join("")}
      </ol>
    </section>` : ""}
    <div class="actions">
      <button class="secondary" data-action="detail">各論を読み直す</button>
      <button class="secondary" data-action="retry">3問をもう一度解く</button>
      ${wrongIndexes.length ? `<button class="primary" data-action="retry-wrong">間違えた${wrongIndexes.length}問を解き直す</button>` : ""}
      ${nextButton}
    </div>`;
}

function goBack(stage) {
  if (stage.type === "lesson" && stage.lessonIndex > 0) {
    const previousLesson = curriculum.lessons[stage.lessonIndex - 1];
    state.question = previousLesson.questions.length;
  }
  setStage(state.stage - 1);
}

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const stage = stages[state.stage];
  if (button.dataset.action === "next") setStage(state.stage + 1, stage.type === "lesson");
  if (button.dataset.action === "back") goBack(stage);
  if (button.dataset.action === "detail") setStage(state.stage - 1);
  if (button.dataset.action === "overview") setStage(0, true);
  if (button.dataset.action === "retry") {
    state.question = 0;
    state.answers[stage.lesson.id] = [];
    saveState();
    render(true);
  }
  if (button.dataset.action === "retry-wrong") {
    const answers = currentAnswers(stage.lesson);
    const firstWrong = stage.lesson.questions.findIndex((question, index) => answers[index] !== question.answer);
    stage.lesson.questions.forEach((question, index) => {
      if (answers[index] !== question.answer) answers[index] = null;
    });
    state.question = firstWrong;
    saveState();
    render(true);
  }
  if (button.dataset.action === "next-lesson") setStage(state.stage + 1, true);
  if (button.dataset.action === "next-question") {
    state.question += 1;
    saveState();
    render(true);
  }
  if (button.dataset.choice !== undefined) {
    currentAnswers(stage.lesson)[state.question] = Number(button.dataset.choice);
    saveState();
    render();
  }
});

syncContentVersions();
render();
