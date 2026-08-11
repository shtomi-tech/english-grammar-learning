const courses = curriculum.courses;
const defaultCourseId = courses[0].id;
const storageKey = "englishGrammarLearning.v3";
const legacyStorageKey = "englishGrammarLearning.v2";
const veryLegacyStorageKey = "englishGrammarLearning.subjunctivePast.v1";
const defaultState = {
  courseId: defaultCourseId, stage: 0, question: 0, answers: {}, versions: {}, visitedLessons: [],
  review: {}, reviewSession: null, finalChecks: {}, finalRun: null
};

const LEITNER_LADDER = [1, 3, 7, 14]; // 正解のたびに進む復習間隔（日）
const REVIEW_SESSION_SIZE = 10;
// 復習対象の状態区分。LEITNER_LADDERの各間隔から生成する（eiken-q1-practiceの内訳表示と同じ区分）。
const REVIEW_INTERVALS = [
  { label: "未実施" },
  { label: "要再確認" },
  ...LEITNER_LADDER.map(days => ({ days, label: `${days}日後` })),
];
const FINAL_PASS_RATE = 0.8;

const APP_ID = "english-grammar-learning";
const CONFIG_PATH = "config.json";
const CLOUD_STUDENT_STAMP_KEY = storageKey + ".cloudStudent";
let cloud = null;

let questionIndex = {};
function buildQuestionIndex() {
  questionIndex = {};
  courses.forEach(course => {
    course.lessons.forEach(lesson => {
      lesson.questions.forEach(question => {
        questionIndex[question.id] = { course, lesson, question };
      });
    });
  });
}
buildQuestionIndex();

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function courseFor(courseId) {
  return courses.find(course => course.id === courseId) || courses[0];
}

function stagesFor(course) {
  return [
    { type: "overview", label: "概論", course },
    ...course.lessons.flatMap((lesson, lessonIndex) => [
      { type: "lesson", label: lesson.title, lesson, lessonIndex, course },
      { type: "practice", label: `${lesson.title} 練習`, lesson, lessonIndex, course }
    ]),
    { type: "final", label: "修了テスト", course }
  ];
}

function validCourseId(courseId) {
  return courses.some(course => course.id === courseId) ? courseId : defaultCourseId;
}

function clampStage(stage, courseId) {
  return Math.min(Math.max(Number.isInteger(stage) ? stage : 0, 0), stagesFor(courseFor(courseId)).length - 1);
}

let state = loadState();
let stages = stagesFor(courseFor(state.courseId));
backfillVisitedLessons();
sanitizePersistedSessions();
const progressMedia = matchMedia("(max-width: 640px)");

// content.js の編集で問題IDが削除・変更されていた場合、保存済みの復習・修了テストの
// 途中状態が存在しない問題を参照してクラッシュしないよう、対象がなければ破棄する。
function sanitizePersistedSessions() {
  if (state.reviewSession && !state.reviewSession.order.every(id => questionIndex[id])) {
    state.reviewSession = null;
  }
  if (state.finalRun && !state.finalRun.order.every(id => questionIndex[id])) {
    state.finalRun = null;
  }
}

function syncProgressDetails(event = progressMedia) {
  document.querySelector(".progress-details").toggleAttribute("open", !event.matches);
}

syncProgressDetails();
progressMedia.addEventListener("change", syncProgressDetails);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isInteger(saved.stage) && saved.answers && !Array.isArray(saved.answers)) {
      const courseId = validCourseId(saved.courseId);
      return { ...defaultState, ...saved, courseId, stage: clampStage(saved.stage, courseId) };
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (legacy && Number.isInteger(legacy.stage) && legacy.answers && !Array.isArray(legacy.answers)) {
      return { ...defaultState, ...legacy, courseId: defaultCourseId, stage: clampStage(legacy.stage, defaultCourseId) };
    }
    const veryLegacy = JSON.parse(localStorage.getItem(veryLegacyStorageKey));
    if (veryLegacy && Number.isInteger(veryLegacy.step)) {
      return {
        ...defaultState,
        stage: Math.min(veryLegacy.step, 2),
        question: Number.isInteger(veryLegacy.question) ? veryLegacy.question : 0,
        answers: { "past-subjunctive": Array.isArray(veryLegacy.answers) ? veryLegacy.answers : [] },
        versions: {}
      };
    }
  } catch {}
  return { ...defaultState };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  if (cloud && cloud.isEnabled()) cloud.queueSave();
}

function updateSaveStatus(message, tone) {
  const el = document.querySelector("#save-status");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("save-status-ng", tone === "ng");
}

// 欠損フィールドを defaultState で埋めてから、通常のロード直後と同じ正規化
// （クランプ → 破棄セッション除去 → 版チェック）を通す。版チェックまで通さないと、
// version 付きの単元で state.versions が未初期化のまま残り、次回起動時に
// 「内容が更新された」と誤判定してその単元の回答を消してしまう。
function applyNormalizedState(source) {
  const courseId = validCourseId(source.courseId);
  state = { ...defaultState, ...source, courseId };
  state.stage = clampStage(state.stage, courseId);
  stages = stagesFor(currentCourse());
  backfillVisitedLessons();
  sanitizePersistedSessions();
  syncContentVersions();
}

// クラウドから届いた進捗をそのまま state に差し替えない。今週追加した review / finalChecks /
// reviewSession / finalRun 等のフィールドを欠いた古い保存データが来た場合、
// defaultState でまず欠損を埋めてから、既存のロード直後と同じ正規化を通す。
// クラウドに保存履歴が無い（新規発行の生徒URL）場合、RPCは空オブジェクトを返す。ここで空判定せずに
// 差し替えると、端末に残っていた匿名時代の進捗を空状態で上書きしてしまう。空なら何もせず、
// 次の saveState() で今の端末側の状態をそのままクラウドへ書き込ませる。
function mergeCloudProgress(raw) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  if (Object.keys(source).length === 0) return false;
  applyNormalizedState(source);
  return true;
}

function currentCourse() {
  return courseFor(state.courseId);
}

function switchCourse(courseId) {
  state.courseId = validCourseId(courseId);
  stages = stagesFor(currentCourse());
  state.stage = 0;
  state.question = 0;
  backfillVisitedLessons();
  saveState();
  render(true);
}

function backfillVisitedLessons() {
  state.visitedLessons ||= [];
  const course = courseFor(state.courseId);
  course.lessons.forEach((lesson, lessonIndex) => {
    const alreadyPast = state.stage > lessonIndex * 2 + 1;
    const hasAnswers = lessonAnsweredCount(lesson) > 0;
    if ((alreadyPast || hasAnswers) && !state.visitedLessons.includes(lesson.id)) {
      state.visitedLessons.push(lesson.id);
    }
  });
  courses.flatMap(courseItem => courseItem.lessons).forEach(lesson => {
    if (lessonAnsweredCount(lesson) > 0 && !state.visitedLessons.includes(lesson.id)) {
      state.visitedLessons.push(lesson.id);
    }
  });
}

function syncContentVersions() {
  state.versions ||= {};
  let changed = false;
  for (const lesson of courses.flatMap(course => course.lessons)) {
    if (lesson.version && state.versions[lesson.id] !== lesson.version) {
      state.answers[lesson.id] = [];
      state.versions[lesson.id] = lesson.version;
      state.visitedLessons = state.visitedLessons.filter(id => id !== lesson.id);
      lesson.questions.forEach(question => { if (state.review) delete state.review[question.id]; });
      if (stages[state.stage]?.lesson?.id === lesson.id) state.question = 0;
      changed = true;
    }
  }
  if (changed) saveState();
}

/* ---- 単元マスター・修了テスト（案3） ---- */
function lessonMastered(lesson) {
  return lessonCompleted(lesson) && lessonScore(lesson) === lesson.questions.length;
}

function courseMastered(course) {
  return course.lessons.every(lessonMastered);
}

function courseProgressStats(course) {
  const total = course.lessons.length;
  const completed = course.lessons.filter(lessonCompleted).length;
  const mastered = course.lessons.filter(lessonMastered).length;
  return { total, completed, mastered };
}

function finalStatusFor(course) {
  if (!courseMastered(course)) {
    const remaining = course.lessons.length - course.lessons.filter(lessonMastered).length;
    return { label: "未解放", detail: `あと${remaining}単元でマスター`, tone: "" };
  }
  const record = state.finalChecks[course.id];
  if (record?.cleared) return { label: "CLEAR", detail: `過去最高 ${record.bestScore}/${record.bestTotal}問`, tone: "ok" };
  return { label: "挑戦可能", detail: "修了テストに挑戦できます", tone: "" };
}

function allCourseQuestions(course) {
  return course.lessons.flatMap(lesson => lesson.questions.map(question => ({ lesson, question })));
}

function finalPassScore(total) {
  return Math.ceil(total * FINAL_PASS_RATE);
}

function finalRecordFor(course) {
  state.finalChecks ||= {};
  const record = state.finalChecks[course.id] || (state.finalChecks[course.id] = { bestScore: 0, lastScore: 0, cleared: false, bestTotal: 0 });
  const total = allCourseQuestions(course).length;
  // 単元・問題が増減すると過去のCLEAR判定は引き継がない。
  if (record.cleared && record.bestTotal !== total) record.cleared = false;
  return record;
}

function startFinalCheck(course) {
  state.finalRun = {
    courseId: course.id,
    order: shuffle(allCourseQuestions(course)).map(({ question }) => question.id),
    index: 0,
    correctCount: 0,
    answers: []
  };
  saveState();
  render(true);
}

/* ---- 問題単位の間隔反復・今日の復習（案4） ---- */
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayKey() {
  return dateKey(new Date());
}

function addDaysKey(key, days) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

function daysBetween(fromKey, toKey) {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  return Math.round((new Date(ty, tm - 1, td) - new Date(fy, fm - 1, fd)) / (24 * 60 * 60 * 1000));
}

function recordReviewResult(question, correct) {
  state.review ||= {};
  const s = state.review[question.id] || (state.review[question.id] = { wrongCount: 0, leitnerStage: 0, nextReviewAt: null, lastAnsweredAt: null });
  s.lastAnsweredAt = todayKey();
  if (correct) {
    const stage = Math.min(s.leitnerStage, LEITNER_LADDER.length - 1);
    s.nextReviewAt = addDaysKey(s.lastAnsweredAt, LEITNER_LADDER[stage]);
    s.leitnerStage = Math.min(stage + 1, LEITNER_LADDER.length - 1);
  } else {
    s.wrongCount += 1;
    s.leitnerStage = 0;
    s.nextReviewAt = null;
  }
}

function isQuestionDue(question) {
  const s = state.review && state.review[question.id];
  if (!s || !s.lastAnsweredAt) return true;
  return !s.nextReviewAt || s.nextReviewAt <= todayKey();
}

// 通常学習で最後まで解いた単元の問題だけを復習の対象にする。
function reviewCandidates() {
  const items = [];
  courses.forEach(course => course.lessons.forEach(lesson => {
    if (!lessonCompleted(lesson)) return;
    lesson.questions.forEach(question => items.push({ course, lesson, question }));
  }));
  return items;
}

// 復習対象の問題を、直前の復習間隔でREVIEW_INTERVALSの区分に分類する。
function reviewIntervalLabel(question) {
  const s = state.review && state.review[question.id];
  if (!s || !s.lastAnsweredAt) return "未実施";
  if (!s.nextReviewAt) return "要再確認";
  const elapsedDays = daysBetween(s.lastAnsweredAt, s.nextReviewAt);
  return REVIEW_INTERVALS.find(({ days }) => days === elapsedDays)?.label || "要再確認";
}

function reviewIntervalBreakdown(items) {
  const counts = Object.fromEntries(REVIEW_INTERVALS.map(({ label }) => [label, 0]));
  items.forEach(item => { counts[reviewIntervalLabel(item.question)] += 1; });
  return counts;
}

function dueReviewCount() {
  return reviewCandidates().filter(item => isQuestionDue(item.question)).length;
}

// 誤答回数が多い問題を前に出す（shuffle後に安定ソートするため抽選は崩れない）。
function weightedReviewOrder(items) {
  const shuffled = shuffle(items);
  const wrongCounts = new Map(shuffled.map(item => [item, (state.review[item.question.id]?.wrongCount) || 0]));
  return shuffled.sort((a, b) => wrongCounts.get(b) - wrongCounts.get(a));
}

function dueReviewItems(limit = REVIEW_SESSION_SIZE) {
  const due = reviewCandidates().filter(item => isQuestionDue(item.question));
  return weightedReviewOrder(due).slice(0, limit);
}

function startReviewSession() {
  const items = dueReviewItems();
  if (!items.length) return;
  state.reviewSession = { order: items.map(item => item.question.id), index: 0, correctCount: 0, answers: [] };
  saveState();
  render(true);
}

function updateReviewBanner() {
  const banner = document.querySelector("#review-banner");
  if (!banner) return;
  if (state.reviewSession) { banner.hidden = true; return; }
  const candidates = reviewCandidates();
  banner.hidden = candidates.length === 0;
  if (candidates.length === 0) return;

  const due = dueReviewCount();
  banner.querySelector("#review-due-row").hidden = due === 0;
  if (due > 0) banner.querySelector("[data-review-count]").textContent = `今日の復習：${due}問`;

  const total = Object.keys(questionIndex).length;
  banner.querySelector("#review-breakdown-help").textContent =
    `通常学習済みの問題（対象 ${candidates.length} / ${total}問）の現在の状態です。「今日の復習」は未実施・要再確認・期限到来を合計した件数です。`;
  const counts = reviewIntervalBreakdown(candidates);
  banner.querySelector("#review-breakdown-grid").innerHTML = REVIEW_INTERVALS.map(({ label }) =>
    `<div class="review-breakdown-cell"><strong>${counts[label]}</strong><span>${label}</span></div>`
  ).join("");
}

function lessonAnswers(lesson) {
  return state.answers[lesson.id] || [];
}

function lessonAnsweredCount(lesson) {
  return lessonAnswers(lesson).filter(Number.isInteger).length;
}

function lessonScore(lesson) {
  const answers = lessonAnswers(lesson);
  return lesson.questions.reduce((sum, question, index) => sum + (answers[index] === question.answer), 0);
}

function lessonCompleted(lesson) {
  return lessonAnsweredCount(lesson) === lesson.questions.length;
}

// サイドバーの単元グループ見出しに出す1行要約。
function lessonGroupSummary(lesson) {
  const total = lesson.questions.length;
  const answered = lessonAnsweredCount(lesson);
  if (answered === total) return lessonScore(lesson) === total ? `全問正解（${total}/${total}）` : `練習問題 ${lessonScore(lesson)}/${total}`;
  if (answered > 0) return `練習問題 ${answered}/${total} 途中`;
  return state.visitedLessons.includes(lesson.id) ? "各論：済" : "未着手";
}

function resumeQuestionIndex(lesson) {
  const answers = lessonAnswers(lesson);
  const firstUnanswered = lesson.questions.findIndex((question, index) => !Number.isInteger(answers[index]));
  return firstUnanswered === -1 ? lesson.questions.length : firstUnanswered;
}

function setStage(stage, resetQuestion = false) {
  stages = stagesFor(currentCourse());
  state.stage = Math.max(0, Math.min(stage, stages.length - 1));
  if (resetQuestion) state.question = 0;
  saveState();
  render(true);
}

function currentAnswers(lesson) {
  return state.answers[lesson.id] || (state.answers[lesson.id] = []);
}

function isLastLessonStage(stage) {
  return (stage.type === "lesson" || stage.type === "practice") && stage.lessonIndex === stage.course.lessons.length - 1;
}

function resultLabel() {
  return isLastLessonStage(stages[state.stage]) ? "全単元完了" : "単元結果";
}

function currentPath(stage) {
  const course = currentCourse();
  if (state.reviewSession) return "今日の復習";
  if (stage.type === "overview") return `${course.title} ＞ 概論`;
  if (stage.type === "final") return `${course.title} ＞ 修了テスト`;
  if (stage.type === "lesson") return `${course.title} ＞ ${stage.lesson.title} ＞ 各論`;
  const result = state.question >= stage.lesson.questions.length;
  return `${course.title} ＞ ${stage.lesson.title} ＞ ${result ? resultLabel() : "練習問題"}`;
}

function render(resetScroll = false) {
  const stage = stages[state.stage];
  const course = currentCourse();
  const showingResult = stage.type === "practice" && state.question >= stage.lesson.questions.length;
  // サイドバーの行(概論/各論/練習問題/修了テスト)は共通で「済み表示」「現在地」の2状態を持つ。
  const rowAttrs = (className, index, done, extra = "") => `class="${className} ${done ? "done" : ""} ${extra} ${index === state.stage ? "current" : ""}" data-stage="${index}" ${index === state.stage ? 'aria-current="step"' : ""}`;
  document.querySelector("#course-selector").innerHTML = `
    <span class="course-selector-label">文法カテゴリ</span>
    ${courses.map(courseItem => `<button type="button" class="course-tab ${courseItem.id === course.id ? "current" : ""}" data-course="${courseItem.id}" ${courseItem.id === course.id ? 'aria-current="page" disabled' : ""}>${courseItem.title}</button>`).join("")}`;
  document.querySelector("#current-path").textContent = currentPath(stage);

  const finalStatus = finalStatusFor(course);
  document.querySelector("#steps").innerHTML = `
    <li><button type="button" ${rowAttrs("overview-item", 0, state.stage > 0)}><strong>概論</strong><em>${state.stage > 0 ? "済" : ""}</em></button></li>
    ${course.lessons.map((lesson, lessonIndex) => {
      const lessonStage = lessonIndex * 2 + 1;
      const practiceStage = lessonStage + 1;
      const isCurrentGroup = (stage.type === "lesson" || stage.type === "practice") && stage.lessonIndex === lessonIndex;
      const answeredCount = lessonAnsweredCount(lesson);
      const practiceLabel = showingResult && state.stage === practiceStage ? resultLabel() : "練習問題";
      return `<li>
        <details class="lesson-group ${isCurrentGroup ? "current" : ""} ${lessonMastered(lesson) ? "mastered" : ""}" ${isCurrentGroup ? "open" : ""}>
          <summary><span class="lt"><strong>${lesson.title}</strong><small>${lessonGroupSummary(lesson)}</small></span></summary>
          <div class="lesson-items">
            <button type="button" ${rowAttrs("lesson-item", lessonStage, state.visitedLessons.includes(lesson.id))}>各論 <span class="badge">${state.visitedLessons.includes(lesson.id) ? "済" : "未"}</span></button>
            <button type="button" ${rowAttrs("lesson-item", practiceStage, lessonCompleted(lesson))}>${practiceLabel} <span class="badge">${answeredCount}/${lesson.questions.length}</span></button>
          </div>
        </details>
      </li>`;
    }).join("")}
    <li><button type="button" ${rowAttrs("final-item", stages.length - 1, finalStatus.tone === "ok", !courseMastered(course) ? "locked" : "")}><strong>修了テスト</strong><em>${finalStatus.label}</em></button></li>`;

  const content = document.querySelector("#content");
  if (state.reviewSession) renderReviewSession(content);
  else if (stage.type === "overview") renderOverview(content);
  else if (stage.type === "lesson") renderLesson(content, stage.lesson);
  else if (stage.type === "practice") renderPractice(content, stage.lesson);
  else renderFinal(content, course);
  content.focus({ preventScroll: true });
  if (resetScroll) scrollTo(0, 0);
  updateReviewBanner();
}

function renderOverview(content) {
  const course = currentCourse();
  const { total, completed, mastered } = courseProgressStats(course);
  const finalStatus = finalStatusFor(course);
  content.innerHTML = `
    <p class="eyebrow">${course.title}の学習状況</p>
    <div class="dashboard-kpis">
      <div class="kpi-card kpi-primary">
        <p class="kpi-value">${completed} <span class="kpi-unit">/ ${total}単元</span></p>
        <p class="kpi-label">学習が完了した単元</p>
      </div>
      <div class="kpi-card">
        <p class="kpi-value">${mastered} <span class="kpi-unit">/ ${total}単元</span></p>
        <p class="kpi-label">全問正解でマスター済み</p>
      </div>
      <div class="kpi-card ${finalStatus.tone === "ok" ? "kpi-ok" : ""}">
        <p class="kpi-value">${finalStatus.label}</p>
        <p class="kpi-label">修了テスト・${finalStatus.detail}</p>
      </div>
    </div>
    <h2>${course.overview.title}</h2>
    ${course.overview.html}
    <div class="actions"><button class="primary" data-action="next">${course.lessons[0].title}へ</button></div>`;
}

function renderLesson(content, lesson) {
  if (!state.visitedLessons.includes(lesson.id)) {
    state.visitedLessons.push(lesson.id);
    saveState();
  }
  const stage = stages[state.stage];
  const course = currentCourse();
  const backLabel = stage.lessonIndex === 0 ? "概論へ戻る" : `${course.lessons[stage.lessonIndex - 1].title}の結果へ戻る`;
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
  const stage = stages[state.stage];
  const course = currentCourse();
  const answers = currentAnswers(lesson);
  const score = lessonScore(lesson);
  const wrongIndexes = lesson.questions.map((question, index) => answers[index] === question.answer ? -1 : index).filter(index => index >= 0);
  const isLastLesson = isLastLessonStage(stage);
  let forwardAction, forwardLabel;
  if (!isLastLesson) {
    forwardAction = "next-lesson";
    forwardLabel = `次の単元へ：${course.lessons[stage.lessonIndex + 1].title}`;
  } else if (courseMastered(course)) {
    forwardAction = "goto-final";
    forwardLabel = "修了テストへ";
  } else {
    forwardAction = "overview";
    forwardLabel = "概論へ戻る";
  }
  const decisionButtons = wrongIndexes.length
    ? `<button class="secondary" data-action="${forwardAction}">${forwardLabel}</button><button class="primary" data-action="retry-wrong">間違えた${wrongIndexes.length}問を解き直す</button>`
    : `<button class="primary" data-action="${forwardAction}">${forwardLabel}</button>`;
  content.innerHTML = `
    <p class="eyebrow">${isLastLesson ? "全単元完了" : "単元完了"}</p>
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
    ${isLastLesson ? renderCourseSummary(course) : ""}
    <div class="actions">
      <button class="secondary" data-action="detail">各論を読み直す</button>
      <button class="secondary" data-action="retry">3問をもう一度解く</button>
      <div class="actions-decision">${decisionButtons}</div>
    </div>`;
}

function renderCourseSummary(course) {
  const lessons = course.lessons;
  const total = lessons.length;
  const totalQuestions = lessons.reduce((sum, l) => sum + l.questions.length, 0);
  const totalScore = lessons.reduce((sum, l) => sum + lessonScore(l), 0);
  const completedUnits = lessons.filter(lessonCompleted);
  const weakUnits = completedUnits.filter(l => lessonScore(l) < l.questions.length);
  const notStarted = lessons.filter(l => lessonAnsweredCount(l) === 0);
  let statusMessage = "";
  if (weakUnits.length) {
    statusMessage = `<p>復習をおすすめする単元：${weakUnits.map(l => `${l.title}（${lessonScore(l)}/${l.questions.length}）`).join("・")}</p>`;
  } else if (completedUnits.length === total) {
    statusMessage = "<p>すべての単元で全問正解でした。修了テストに挑戦できます。</p>";
  } else if (completedUnits.length > 0) {
    statusMessage = "<p>回答済みの単元はすべて正解でした。</p>";
  }
  return `<section class="review-summary course-summary" aria-labelledby="course-summary-title">
    <h3 id="course-summary-title">全${total}単元のまとめ</h3>
    <p class="total-score">${totalScore} / ${totalQuestions} 問正解</p>
    ${statusMessage}
    ${notStarted.length ? `<p class="note">未実施の単元：${notStarted.map(l => l.title).join("・")}</p>` : ""}
  </section>`;
}

/* ---- 修了テスト（案3） ---- */
function renderFinal(content, course) {
  const run = state.finalRun && state.finalRun.courseId === course.id ? state.finalRun : null;
  if (run && run.index < run.order.length) return renderFinalQuestion(content, run);
  if (run && run.index >= run.order.length) return renderFinalResult(content, course, run);

  if (!courseMastered(course)) {
    const unmastered = course.lessons.filter(lesson => !lessonMastered(lesson));
    content.innerHTML = `
      <p class="eyebrow">修了テスト</p>
      <h2>${course.title}の修了テスト</h2>
      <p class="note">修了テストは、すべての単元の練習問題に全問正解すると挑戦できます。</p>
      <section class="review-summary" aria-labelledby="final-lock-title">
        <h3 id="final-lock-title">あと${unmastered.length}単元</h3>
        <ol class="review-list">
          ${unmastered.map(lesson => `<li><span>${lesson.title}（${lessonScore(lesson)}/${lesson.questions.length}）</span></li>`).join("")}
        </ol>
      </section>
      <div class="actions"><button class="secondary" data-action="overview">概論へ戻る</button></div>`;
    return;
  }

  const record = finalRecordFor(course);
  const total = allCourseQuestions(course).length;
  const passScore = finalPassScore(total);
  content.innerHTML = `
    <p class="eyebrow">修了テスト</p>
    <h2>${course.title}の修了テスト</h2>
    <p>全${total}問からランダムに出題します。${passScore}/${total}問以上（正答率80%以上）でCLEARです。</p>
    ${record.cleared ? `<p class="note">CLEAR済みです（過去最高 ${record.bestScore}/${record.bestTotal}）。もう一度挑戦できます。</p>`
      : record.lastScore ? `<p class="note">前回の結果：${record.lastScore}/${record.bestTotal}</p>` : ""}
    <div class="actions"><button class="secondary" data-action="overview">概論へ戻る</button><button class="primary" data-action="start-final">修了テストを始める</button></div>`;
}

function renderFinalQuestion(content, run) {
  const { course, lesson, question } = questionIndex[run.order[run.index]];
  const selected = run.answers[run.index];
  const answered = Number.isInteger(selected);
  const correct = selected === question.answer;
  content.innerHTML = `
    <p class="question-count">${course.title}　修了テスト　問題 ${run.index + 1} / ${run.order.length}</p>
    <p class="note">出典：${lesson.title}</p>
    <h2>${question.text}</h2>
    <div class="choices" role="group" aria-label="選択肢">
      ${question.choices.map((choice, index) => `<button class="choice ${answered && index === question.answer ? "correct" : ""} ${answered && index === selected && !correct ? "wrong" : ""}" data-final-choice="${index}" ${answered ? "disabled" : ""}>${index + 1}. ${choice}</button>`).join("")}
    </div>
    ${answered ? `<div class="feedback ${correct ? "ok" : "ng"}" role="status"><strong>${correct ? "✓ 正解" : `✕ 不正解　正解は ${question.answer + 1}. ${question.choices[question.answer]}`}</strong>${question.explanation}</div>` : `<p class="note" aria-live="polite">最も適切な選択肢を一つ選んでください。</p>`}
    <div class="actions">${answered ? `<button class="primary" data-action="final-next">${run.index + 1 === run.order.length ? "結果を見る" : "次の問題"}</button>` : ""}</div>`;
}

// 記録の更新はテスト完了の瞬間（final-nextでindexが末尾に達したとき）だけ行う。
// この関数は再描画のたびに呼ばれる（リロード・stage移動での再訪も含む）ため、
// ここで記録を書き換えると古い結果画面を開き直すたびにベスト記録が壊れる。
function finishFinalRun(course, run) {
  const record = finalRecordFor(course);
  const total = run.order.length;
  const score = run.correctCount;
  record.lastScore = score;
  record.bestScore = Math.max(record.bestScore, score);
  record.bestTotal = total;
  if (score >= finalPassScore(total)) record.cleared = true;
}

function renderFinalResult(content, course, run) {
  const record = finalRecordFor(course);
  const total = run.order.length;
  const score = run.correctCount;
  const passScore = finalPassScore(total);
  const passed = score >= passScore;

  const wrongEntries = run.order.filter((qId, i) => run.answers[i] !== questionIndex[qId].question.answer);

  content.innerHTML = `
    <p class="eyebrow">${passed ? "修了テスト CLEAR" : "修了テスト結果"}</p>
    <h2>${course.title}の修了テスト</h2>
    <p class="score">${score} / ${total} 問正解</p>
    <p>${passed ? `${passScore}/${total}問以上（正答率80%以上）でCLEARです。おめでとうございます。` : `${passScore}/${total}問以上（正答率80%以上）でCLEARです。もう一度挑戦してみましょう。`}</p>
    ${record.bestScore > score ? `<p class="note">過去最高は${record.bestScore}/${record.bestTotal}です。</p>` : ""}
    ${wrongEntries.length ? `<section class="review-summary" aria-labelledby="final-review-title">
      <h3 id="final-review-title">間違えた問題</h3>
      <ol class="review-list">
        ${wrongEntries.map(qId => {
          const { lesson, question } = questionIndex[qId];
          return `<li><strong>${lesson.title}</strong><span>${question.text}</span><span>正解：${question.answer + 1}. ${question.choices[question.answer]}</span></li>`;
        }).join("")}
      </ol>
    </section>` : ""}
    <div class="actions">
      <button class="secondary" data-action="overview">概論へ戻る</button>
      <button class="primary" data-action="start-final">もう一度挑戦する</button>
    </div>`;
}

/* ---- 今日の復習セッション（案4） ---- */
function renderReviewSession(content) {
  const session = state.reviewSession;
  if (session.index >= session.order.length) return renderReviewResult(content, session);
  const { course, lesson, question } = questionIndex[session.order[session.index]];
  const selected = session.answers[session.index];
  const answered = Number.isInteger(selected);
  const correct = selected === question.answer;
  content.innerHTML = `
    <p class="question-count">今日の復習　問題 ${session.index + 1} / ${session.order.length}</p>
    <p class="note">出典：${course.title} ＞ ${lesson.title}</p>
    <h2>${question.text}</h2>
    <div class="choices" role="group" aria-label="選択肢">
      ${question.choices.map((choice, index) => `<button class="choice ${answered && index === question.answer ? "correct" : ""} ${answered && index === selected && !correct ? "wrong" : ""}" data-review-choice="${index}" ${answered ? "disabled" : ""}>${index + 1}. ${choice}</button>`).join("")}
    </div>
    ${answered ? `<div class="feedback ${correct ? "ok" : "ng"}" role="status"><strong>${correct ? "✓ 正解" : `✕ 不正解　正解は ${question.answer + 1}. ${question.choices[question.answer]}`}</strong>${question.explanation}</div>` : `<p class="note" aria-live="polite">最も適切な選択肢を一つ選んでください。</p>`}
    <div class="actions">
      <button class="secondary" data-action="review-exit">復習を終了する</button>
      ${answered ? `<button class="primary" data-action="review-next">${session.index + 1 === session.order.length ? "結果を見る" : "次の問題"}</button>` : ""}
    </div>`;
}

function renderReviewResult(content, session) {
  const remaining = dueReviewCount();
  content.innerHTML = `
    <p class="eyebrow">今日の復習</p>
    <h2>復習が完了しました</h2>
    <p class="score">${session.correctCount} / ${session.order.length} 問正解</p>
    <p>正解した問題は次の復習日まで表示されません。間違えた問題はまた近いうちに出題されます。</p>
    ${remaining > 0
      ? `<p class="note">今日の復習：残り${remaining}問</p>
         <div class="actions"><button class="secondary" data-action="review-exit">学習に戻る</button><button class="primary" data-action="review-continue">続けて復習する</button></div>`
      : `<p class="note">今日の復習はすべて終わりました。</p>
         <div class="actions"><button class="primary" data-action="review-exit">学習に戻る</button></div>`}`;
}

function goBack(stage) {
  if (stage.type === "lesson" && stage.lessonIndex > 0) {
    const previousLesson = currentCourse().lessons[stage.lessonIndex - 1];
    state.question = previousLesson.questions.length;
  }
  setStage(state.stage - 1);
}

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "start-review") { startReviewSession(); return; }
  if (state.reviewSession) {
    const session = state.reviewSession;
    if (button.dataset.reviewChoice !== undefined) {
      const { question } = questionIndex[session.order[session.index]];
      const idx = Number(button.dataset.reviewChoice);
      session.answers[session.index] = idx;
      const correct = idx === question.answer;
      if (correct) session.correctCount += 1;
      recordReviewResult(question, correct);
      saveState();
      render();
      return;
    }
    if (button.dataset.action === "review-next") {
      session.index += 1;
      saveState();
      render(true);
      return;
    }
    if (button.dataset.action === "review-exit") {
      state.reviewSession = null;
      saveState();
      render(true);
      return;
    }
    if (button.dataset.action === "review-continue") {
      startReviewSession();
      return;
    }
    // 復習セッション中に他の操作（コース切替・単元移動など）が押された場合は、
    // 復習前にいた位置（state.stage）はそのままに、復習だけを終了して通常処理へ進む。
    state.reviewSession = null;
    saveState();
  }
  if (button.dataset.course) {
    switchCourse(button.dataset.course);
    return;
  }
  const stage = stages[state.stage];
  if (button.dataset.action === "next") setStage(state.stage + 1, stage.type === "lesson");
  if (button.dataset.action === "back") goBack(stage);
  if (button.dataset.action === "detail") setStage(state.stage - 1);
  if (button.dataset.action === "overview") setStage(0, true);
  if (button.dataset.action === "goto-final") setStage(stages.length - 1);
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
    const question = stage.lesson.questions[state.question];
    const idx = Number(button.dataset.choice);
    currentAnswers(stage.lesson)[state.question] = idx;
    recordReviewResult(question, idx === question.answer);
    saveState();
    render();
  }
  if (button.dataset.action === "start-final") startFinalCheck(currentCourse());
  if (button.dataset.finalChoice !== undefined) {
    const run = state.finalRun;
    const { question } = questionIndex[run.order[run.index]];
    const idx = Number(button.dataset.finalChoice);
    run.answers[run.index] = idx;
    if (idx === question.answer) run.correctCount += 1;
    saveState();
    render();
  }
  if (button.dataset.action === "final-next") {
    state.finalRun.index += 1;
    if (state.finalRun.index >= state.finalRun.order.length) finishFinalRun(currentCourse(), state.finalRun);
    saveState();
    render(true);
  }
  if (button.dataset.stage !== undefined) {
    const targetStage = Number(button.dataset.stage);
    const target = stages[targetStage];
    if (target.type === "practice") state.question = resumeQuestionIndex(target.lesson);
    setStage(targetStage);
  }
});

async function boot() {
  syncContentVersions();
  render();

  // 共有URL（?s=&t=）があるときだけクラウド同期を試みる。無ければ完全に
  // ローカル動作のまま（harness の設計どおり no-op）。
  if (typeof window.createCloud !== "function") return;
  let loadedFromCloud = null;
  cloud = window.createCloud({
    appId: APP_ID,
    configPath: CONFIG_PATH,
    getPayload: () => state,
    applyLoaded: (progress) => { loadedFromCloud = progress; },
    onStatus: (message, tone) => updateSaveStatus(message, tone),
  });
  const session = await cloud.init();
  if (!session.enabled) return;

  // 空のクラウド保存＝端末側を保持、で正しいのは「同じ生徒が続きから」の場合だけ。
  // 直前に別の生徒として同期していた端末なら、その生徒の進捗を新しい生徒に
  // 付け替えてしまうため、既定状態から始め直す（取り違え防止）。
  let changed = mergeCloudProgress(loadedFromCloud);
  const stampedStudentId = localStorage.getItem(CLOUD_STUDENT_STAMP_KEY);
  if (!changed && stampedStudentId && stampedStudentId !== session.studentId) {
    applyNormalizedState({});
    changed = true;
  }
  localStorage.setItem(CLOUD_STUDENT_STAMP_KEY, session.studentId);
  if (changed) render(true);
}

boot();
