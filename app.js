const courses = curriculum.courses;
const defaultCourseId = courses[0].id;
const storageKey = "englishGrammarLearning.v3";
const legacyStorageKey = "englishGrammarLearning.v2";
const veryLegacyStorageKey = "englishGrammarLearning.subjunctivePast.v1";
const defaultState = {
  courseId: defaultCourseId, stage: 0, question: 0, answers: {}, versions: {}, visitedLessons: [],
  review: {}, reviewSession: null, finalChecks: {}, finalRun: null, coursePositions: {}
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

function isRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function normalizePosition(courseId, source = {}) {
  const course = courseFor(courseId);
  const stage = clampStage(source.stage, course.id);
  const stageItem = stagesFor(course)[stage];
  const maxQuestion = stageItem.type === "practice" ? stageItem.lesson.questions.length : 0;
  const rawQuestion = Number.isInteger(source.question) ? source.question : 0;
  return { stage, question: Math.min(Math.max(rawQuestion, 0), maxQuestion) };
}

function normalizeCoursePositions(source, activeCourseId, activeStage, activeQuestion) {
  const raw = isRecord(source) ? source : {};
  const normalized = {};
  courses.forEach(course => {
    if (isRecord(raw[course.id])) normalized[course.id] = normalizePosition(course.id, raw[course.id]);
  });
  const activeId = validCourseId(activeCourseId);
  normalized[activeId] ||= normalizePosition(activeId, { stage: activeStage, question: activeQuestion });
  return normalized;
}

function normalizeState(source, fallbackCourseId = defaultCourseId) {
  const raw = isRecord(source) ? source : {};
  const courseId = validCourseId(raw.courseId || fallbackCourseId);
  const next = { ...defaultState, ...raw, courseId };
  const position = normalizePosition(courseId, { stage: next.stage, question: next.question });
  next.stage = position.stage;
  next.question = position.question;
  next.coursePositions = normalizeCoursePositions(next.coursePositions, courseId, position.stage, position.question);
  next.coursePositions[courseId] = position;
  return next;
}

let state = loadState();
let stages = stagesFor(courseFor(state.courseId));
backfillVisitedLessons();
sanitizePersistedSessions();

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

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (isRecord(saved) && isRecord(saved.answers)) {
      return normalizeState(saved);
    }
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (isRecord(legacy) && isRecord(legacy.answers)) {
      return normalizeState({ ...legacy, courseId: defaultCourseId }, defaultCourseId);
    }
    const veryLegacy = JSON.parse(localStorage.getItem(veryLegacyStorageKey));
    if (veryLegacy && Number.isInteger(veryLegacy.step)) {
      return normalizeState({
        ...defaultState,
        stage: veryLegacy.step,
        question: Number.isInteger(veryLegacy.question) ? veryLegacy.question : 0,
        answers: { "past-subjunctive": Array.isArray(veryLegacy.answers) ? veryLegacy.answers : [] },
        versions: {}
      });
    }
  } catch {}
  return normalizeState(defaultState);
}

function rememberCurrentCoursePosition() {
  if (!isRecord(state.coursePositions)) state.coursePositions = {};
  state.coursePositions[state.courseId] = normalizePosition(state.courseId, {
    stage: state.stage,
    question: state.question
  });
}

function saveState() {
  rememberCurrentCoursePosition();
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
  state = normalizeState(source);
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
  rememberCurrentCoursePosition();
  state.courseId = validCourseId(courseId);
  stages = stagesFor(currentCourse());
  const position = normalizePosition(state.courseId, state.coursePositions[state.courseId]);
  state.stage = position.stage;
  state.question = position.question;
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

// ホームの間隔復習カード。復習対象（通常学習を全問回答済みの単元の問題）が0件のときは
// カード自体を表示しない（今日の復習セッション中もrenderOverviewは呼ばれないため自動的に非表示）。
function reviewMissionCard(course) {
  const candidates = reviewCandidates();
  if (!candidates.length) return "";
  const due = dueReviewCount();
  const counts = reviewIntervalBreakdown(candidates);
  const action = overviewActionFor(course);
  const target = stagesFor(course)[action.targetStage];
  const midProgress = target.type === "practice" && lessonAnsweredCount(target.lesson) > 0 && !lessonCompleted(target.lesson);
  const ctaLabel = due > 0 ? `今回の${Math.min(due, REVIEW_SESSION_SIZE)}問を復習する` : "今すぐ復習する問題はありません";
  return `
    <section class="card reviewMission">
      <p class="label">間隔復習</p>
      <h2>今日の復習</h2>
      <p class="lead">通常学習を全問回答済みの単元から、1回最大${REVIEW_SESSION_SIZE}問を出題します。正解すると1・3・7・14日後の間隔へ進みます。</p>
      <div class="reviewMetrics">
        ${statHtml(candidates.length, Object.keys(questionIndex).length, "対象問題")}
        ${statHtml(due, candidates.length, "今すぐ復習")}
      </div>
      <div class="intervalGrid" aria-label="復習間隔別内訳">
        ${REVIEW_INTERVALS.map(({ label }) => `<div class="intervalCell"><strong>${counts[label]}</strong><span>${label}</span></div>`).join("")}
      </div>
      ${midProgress ? `<p class="hint">通常学習の続きがあるため、先に再開するのがおすすめです。</p>` : ""}
      <button type="button" class="${midProgress ? "ghost secondaryCta" : "cta reviewCta"}" data-action="start-review" ${due === 0 ? "disabled" : ""}>${ctaLabel}</button>
    </section>`;
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

// 単元一覧の行に出す状態文言。5区分（未着手／各論確認済み／練習途中／要復習／全問正解）。
function lessonStatusLabel(lesson) {
  const total = lesson.questions.length;
  const answered = lessonAnsweredCount(lesson);
  if (answered === total) return lessonScore(lesson) === total ? "全問正解" : `要復習 ${lessonScore(lesson)}/${total}`;
  if (answered > 0) return `練習途中 ${answered}/${total}`;
  return state.visitedLessons.includes(lesson.id) ? "各論確認済み" : "未着手";
}

// 単元一覧の行がクリックされたときの移動先。各論未確認なら各論へ、確認済みなら練習問題（結果画面も含む）へ。
function unitTargetStage(lesson, lessonIndex) {
  const lessonStage = lessonIndex * 2 + 1;
  return state.visitedLessons.includes(lesson.id) ? lessonStage + 1 : lessonStage;
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
  const isHome = !state.reviewSession && stage.type === "overview";

  document.querySelector(".wrap").classList.toggle("sessionActive", !isHome);
  document.querySelector("#homePanel").classList.toggle("hide", !isHome);
  document.querySelector("#sessionPanel").classList.toggle("hide", isHome);

  document.querySelector("#course-selector").innerHTML = `
    <label class="categoryPicker">
      <span>文法カテゴリ</span>
      <select class="categorySelect">
        ${courses.map(courseItem => `<option value="${courseItem.id}" ${courseItem.id === course.id ? "selected" : ""}>${courseItem.title}</option>`).join("")}
      </select>
    </label>`;
  document.querySelector("#current-path").textContent = currentPath(stage);

  let container;
  if (isHome) {
    container = document.querySelector("#home-content");
    renderOverview(container);
    document.querySelector("#homePanel").removeAttribute("aria-busy");
  } else {
    container = document.querySelector("#session-content");
    if (state.reviewSession) renderReviewSession(container);
    else if (stage.type === "lesson") renderLesson(container, stage.lesson);
    else if (stage.type === "practice") renderPractice(container, stage.lesson);
    else renderFinal(container, course);
  }
  // 回答直後はfeedbackへ、次の問題表示時は問題文へ、各論表示時は単元見出しへ、
  // それ以外（結果画面・概論など）はそのカードのh2へフォーカスを移す。
  const focusTarget = container.querySelector(".feedback") || container.querySelector(".questionText") ||
    container.querySelector(".flashCard h3") || container.querySelector("h2") || container;
  focusTarget.focus({ preventScroll: true });
  if (resetScroll) scrollTo(0, 0);
}

function recommendedStageFor(course) {
  for (let index = 0; index < course.lessons.length; index += 1) {
    const lesson = course.lessons[index];
    if (!state.visitedLessons.includes(lesson.id)) return index * 2 + 1;
    if (!lessonCompleted(lesson)) return index * 2 + 2;
  }
  const weakIndex = course.lessons.findIndex(lesson => !lessonMastered(lesson));
  return weakIndex >= 0 ? weakIndex * 2 + 2 : stagesFor(course).length - 1;
}

function overviewActionFor(course) {
  const targetStage = recommendedStageFor(course);
  const target = stagesFor(course)[targetStage];
  if (target.type === "final") {
    return { targetStage, label: "修了テストへ", hint: "全単元マスター済みです。修了テストに挑戦できます。" };
  }
  if (target.type === "lesson") {
    return { targetStage, label: `${target.lesson.title}へ`, hint: `${target.lesson.title}の解説を確認します。` };
  }
  if (!lessonCompleted(target.lesson)) {
    return { targetStage, label: `続きから：${target.lesson.title} 練習問題`, hint: `${target.lesson.title}の練習問題を続きから解きます。` };
  }
  return { targetStage, label: `復習する：${target.lesson.title}`, hint: `${target.lesson.title}の練習問題をもう一度解きます。` };
}

function statHtml(value, total, label, secondary = false) {
  return `<div class="stat${secondary ? " stat--secondary" : ""}"><strong>${value}<small> / ${total}</small></strong><span>${label}</span></div>`;
}

/* ---- セッション画面（各論・練習・修了テスト・今日の復習）の共通部品 ---- */
function savedStateText() {
  return cloud && cloud.isEnabled() ? "現在地はクラウドとこの端末に保存済み" : "現在地はこの端末に保存済み";
}

function sessionHeadHtml(label, title, { showBack = true } = {}) {
  return `<div class="sessionHead">
    <div>
      <p class="label">${label}</p>
      <h2 tabindex="-1">${title}</h2>
      <p class="hint savedState">${savedStateText()}</p>
    </div>
    ${showBack ? `<button type="button" class="ghost" data-action="go-home">一覧へ戻る</button>` : ""}
  </div>`;
}

const SESSION_STEPS = [
  { key: "overview", label: "概論" },
  { key: "lesson", label: "各論" },
  { key: "practice", label: "練習" },
  { key: "final", label: "修了" }
];
const REVIEW_STEPS = [{ key: "review", label: "今日の復習" }];

function stepBarHtml(steps, activeKey) {
  const activeIndex = steps.findIndex(step => step.key === activeKey);
  return `<div class="stepBar" aria-label="学習ステップ">
    ${steps.map((step, index) => {
      const cls = step.key === activeKey ? "active" : (activeIndex >= 0 && index < activeIndex) ? "cleared" : "";
      return `<span class="step ${cls}" ${step.key === activeKey ? 'aria-current="step"' : ""}>${step.label}</span>`;
    }).join("")}
  </div>`;
}

// 練習問題・今日の復習・修了テストの問題画面で共有する4択カード。採点・保存はここでは行わない。
// 回答後の「次へ」はカード内の.quizNextActionに置き、デスクトップでは画面下部に固定表示される。
function quizCardHtml({ label, question, selectedIndex, dataAttr, nextLabel, nextAction }) {
  const answered = Number.isInteger(selectedIndex);
  const correct = selectedIndex === question.answer;
  return `
    <section class="quiz ${answered ? "quiz--answered" : ""}">
      <p class="label">${label}</p>
      <p class="questionText" tabindex="-1">${question.text}</p>
      <div class="choices" role="group" aria-label="選択肢">
        ${question.choices.map((choice, index) => `
          <button type="button" class="choice ${answered && index === question.answer ? "correct" : ""} ${answered && index === selectedIndex && !correct ? "wrong" : ""}" data-${dataAttr}="${index}" ${answered ? "disabled" : ""}>
            <span class="choiceNo">${index + 1}</span><span>${choice}</span>
          </button>`).join("")}
      </div>
      ${!answered ? `<p class="hint kbdHint">キーボード: 1〜4で回答</p>` : `
      <div class="feedback ${correct ? "ok" : "ng"}" role="status" tabindex="-1">
        <h3>${correct ? "○ 正解" : `× 不正解　正解は ${question.answer + 1}. ${question.choices[question.answer]}`}</h3>
        ${question.explanation}
      </div>
      <p class="hint kbdHint">Enterで次の問題へ</p>
      <div class="quizNextAction"><button type="button" class="cta next" data-action="${nextAction}">${nextLabel}</button></div>`}
    </section>`;
}

function handleQuizKeydown(event) {
  if (event.repeat || event.isComposing || event.keyCode === 229) return;
  if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
  if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, [contenteditable]")) return;
  const quiz = document.querySelector("#sessionPanel .quiz");
  if (!quiz) return;

  if (!quiz.classList.contains("quiz--answered")) {
    const index = { "1": 0, "2": 1, "3": 2, "4": 3 }[event.key];
    if (index == null) return;
    const choice = quiz.querySelectorAll(".choice:not(:disabled)")[index];
    if (!choice) return;
    event.preventDefault();
    choice.click();
  } else if (event.key === "Enter") {
    const next = quiz.querySelector(".quizNextAction .next");
    if (!next) return;
    event.preventDefault();
    next.click();
  }
}
document.addEventListener("keydown", handleQuizKeydown);

function renderOverview(content) {
  const course = currentCourse();
  const { total, completed, mastered } = courseProgressStats(course);
  const weakCount = course.lessons.filter(lesson => lessonCompleted(lesson) && !lessonMastered(lesson)).length;
  const finalStatus = finalStatusFor(course);
  const finalRecord = state.finalChecks?.[course.id];
  const finalBest = finalRecord?.bestScore || 0;
  const finalBestTotal = finalRecord?.bestTotal || allCourseQuestions(course).length;
  const action = overviewActionFor(course);

  content.innerHTML = `
    <section class="card">
      <p class="label">今回の学習</p>
      <h2 tabindex="-1">${course.title}</h2>
      <p class="lead">全${total}単元を「概論 → 各論 → 練習問題」の順に進めます。</p>
      <div class="recommend">
        <p class="label">まずはここから</p>
        <button type="button" class="cta" data-stage="${action.targetStage}">${action.label}</button>
        <p class="hint">${action.hint}</p>
      </div>
      <div class="stats">
        ${statHtml(completed, total, "完了単元")}
        ${statHtml(weakCount, total, "要復習単元")}
        ${statHtml(mastered, total, "マスター済み", true)}
        ${statHtml(finalBest, finalBestTotal, "修了BEST", true)}
      </div>
    </section>
    ${reviewMissionCard(course)}
    <details class="card" open>
      <summary><h3>${course.overview.title}</h3></summary>
      ${course.overview.html}
    </details>
    <section class="card">
      <p class="label">単元一覧</p>
      <h2>全${total}単元</h2>
      <div class="unitList">
        ${course.lessons.map((lesson, lessonIndex) => {
          const status = lessonStatusLabel(lesson);
          const stateClass = lessonCompleted(lesson) ? (lessonMastered(lesson) ? "done" : "review") : "";
          return `<button type="button" class="unitRow ${stateClass}" data-stage="${unitTargetStage(lesson, lessonIndex)}">
            <span class="unitNo">${lessonIndex + 1}</span>
            <span class="unitName">${lesson.title}</span>
            <span class="unitStatus">${status}</span>
          </button>`;
        }).join("")}
        <button type="button" class="unitRow ${finalStatus.tone === "ok" ? "done" : ""}" data-stage="${stagesFor(course).length - 1}">
          <span class="unitNo">${course.lessons.length + 1}</span>
          <span class="unitName">修了テスト</span>
          <span class="unitStatus">${finalStatus.label}</span>
        </button>
      </div>
    </section>`;
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
    ${sessionHeadHtml(course.title, "各論")}
    ${stepBarHtml(SESSION_STEPS, "lesson")}
    <article class="flashCard">
      <h3 tabindex="-1">${lesson.title}</h3>
      ${lesson.html}
    </article>
    <div class="actions"><button type="button" class="ghost" data-action="back">${backLabel}</button><button type="button" class="cta" data-action="next">3問に挑戦</button></div>`;
}

function renderPractice(content, lesson) {
  if (state.question >= lesson.questions.length) return renderResult(content, lesson);
  const question = lesson.questions[state.question];
  const answers = currentAnswers(lesson);
  const selected = answers[state.question];
  content.innerHTML = `
    ${sessionHeadHtml(lesson.title, "練習問題")}
    ${stepBarHtml(SESSION_STEPS, "practice")}
    ${quizCardHtml({
      label: `問題 ${state.question + 1} / ${lesson.questions.length}`, question, selectedIndex: selected, dataAttr: "choice",
      nextLabel: state.question + 1 === lesson.questions.length ? "結果を見る" : "次の問題", nextAction: "next-question"
    })}
    <div class="actions"><button type="button" class="ghost" data-action="back">各論へ戻る</button></div>`;
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
    ? `<button type="button" class="cta" data-action="retry-wrong">間違えた${wrongIndexes.length}問を解き直す</button><button type="button" class="ghost" data-action="${forwardAction}">${forwardLabel}</button>`
    : `<button type="button" class="cta" data-action="${forwardAction}">${forwardLabel}</button>`;
  content.innerHTML = `
    ${sessionHeadHtml(lesson.title, isLastLesson ? "全単元完了" : "単元結果", { showBack: false })}
    ${stepBarHtml(SESSION_STEPS, "practice")}
    <section class="doneBanner ${score === lesson.questions.length ? "doneBanner--success" : ""}">
      <p class="label">学習結果</p>
      <div class="score">${score} / ${lesson.questions.length}</div>
      <p>${score === lesson.questions.length ? `${lesson.title}の基本を確認できました。` : "間違えた問題の解説を意識して、もう一度取り組んでみましょう。"}</p>
    </section>
    ${wrongIndexes.length ? `<section class="card review-summary" aria-labelledby="review-title">
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
      <button type="button" class="ghost" data-action="detail">各論を読み直す</button>
      <button type="button" class="ghost" data-action="retry">3問をもう一度解く</button>
      <div class="actionsDecision">${decisionButtons}</div>
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
  return `<section class="card course-summary" aria-labelledby="course-summary-title">
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
      ${sessionHeadHtml(course.title, "修了テスト")}
      ${stepBarHtml(SESSION_STEPS, "final")}
      <section class="card" aria-labelledby="final-lock-title">
        <p class="hint">修了テストは、すべての単元の練習問題に全問正解すると挑戦できます。</p>
        <h3 id="final-lock-title">あと${unmastered.length}単元</h3>
        <ol class="review-list">
          ${unmastered.map(lesson => `<li><span>${lesson.title}（${lessonScore(lesson)}/${lesson.questions.length}）</span></li>`).join("")}
        </ol>
      </section>`;
    return;
  }

  const record = finalRecordFor(course);
  const total = allCourseQuestions(course).length;
  const passScore = finalPassScore(total);
  content.innerHTML = `
    ${sessionHeadHtml(course.title, "修了テスト")}
    ${stepBarHtml(SESSION_STEPS, "final")}
    <section class="card">
      <p class="lead">全${total}問からランダムに出題します。${passScore}/${total}問以上（正答率80%以上）でCLEARです。</p>
      ${record.cleared ? `<p class="hint">CLEAR済みです（過去最高 ${record.bestScore}/${record.bestTotal}）。もう一度挑戦できます。</p>`
        : record.lastScore ? `<p class="hint">前回の結果：${record.lastScore}/${record.bestTotal}</p>` : ""}
    </section>
    <div class="actions"><button type="button" class="cta" data-action="start-final">修了テストを始める</button></div>`;
}

function renderFinalQuestion(content, run) {
  const { course, lesson, question } = questionIndex[run.order[run.index]];
  const selected = run.answers[run.index];
  content.innerHTML = `
    ${sessionHeadHtml(`${course.title}　出典：${lesson.title}`, "修了テスト")}
    ${stepBarHtml(SESSION_STEPS, "final")}
    ${quizCardHtml({
      label: `問題 ${run.index + 1} / ${run.order.length}`, question, selectedIndex: selected, dataAttr: "final-choice",
      nextLabel: run.index + 1 === run.order.length ? "結果を見る" : "次の問題", nextAction: "final-next"
    })}`;
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
    ${sessionHeadHtml(course.title, passed ? "修了テスト CLEAR" : "修了テスト結果", { showBack: false })}
    ${stepBarHtml(SESSION_STEPS, "final")}
    <section class="doneBanner ${passed ? "doneBanner--success" : ""}">
      <p class="label">学習結果</p>
      <div class="score">${score} / ${total}</div>
      <p>${passed ? `${passScore}/${total}問以上（正答率80%以上）でCLEARです。おめでとうございます。` : `${passScore}/${total}問以上（正答率80%以上）でCLEARです。もう一度挑戦してみましょう。`}</p>
      ${record.bestScore > score ? `<p class="hint">過去最高は${record.bestScore}/${record.bestTotal}です。</p>` : ""}
    </section>
    ${wrongEntries.length ? `<section class="card review-summary" aria-labelledby="final-review-title">
      <h3 id="final-review-title">間違えた問題</h3>
      <ol class="review-list">
        ${wrongEntries.map(qId => {
          const { lesson, question } = questionIndex[qId];
          return `<li><strong>${lesson.title}</strong><span>${question.text}</span><span>正解：${question.answer + 1}. ${question.choices[question.answer]}</span></li>`;
        }).join("")}
      </ol>
    </section>` : ""}
    <div class="actions">
      <button type="button" class="ghost" data-action="overview">概論へ戻る</button>
      <button type="button" class="cta" data-action="start-final">もう一度挑戦する</button>
    </div>`;
}

/* ---- 今日の復習セッション（案4） ---- */
function renderReviewSession(content) {
  const session = state.reviewSession;
  if (session.index >= session.order.length) return renderReviewResult(content, session);
  const { course, lesson, question } = questionIndex[session.order[session.index]];
  const selected = session.answers[session.index];
  content.innerHTML = `
    ${sessionHeadHtml(`出典：${course.title} ＞ ${lesson.title}`, "今日の復習", { showBack: false })}
    ${stepBarHtml(REVIEW_STEPS, "review")}
    ${quizCardHtml({
      label: `問題 ${session.index + 1} / ${session.order.length}`, question, selectedIndex: selected, dataAttr: "review-choice",
      nextLabel: session.index + 1 === session.order.length ? "結果を見る" : "次の問題", nextAction: "review-next"
    })}
    <div class="actions">
      <button type="button" class="ghost" data-action="review-exit">復習を終了する</button>
    </div>`;
}

function renderReviewResult(content, session) {
  const remaining = dueReviewCount();
  content.innerHTML = `
    ${sessionHeadHtml("今日の復習", "復習完了", { showBack: false })}
    ${stepBarHtml(REVIEW_STEPS, "review")}
    <section class="doneBanner ${remaining === 0 ? "doneBanner--success" : ""}">
      <p class="label">学習結果</p>
      <div class="score">${session.correctCount} / ${session.order.length}</div>
      <p>正解した問題は次の復習日まで表示されません。間違えた問題はまた近いうちに出題されます。</p>
    </section>
    ${remaining > 0
      ? `<p class="hint">今日の復習：残り${remaining}問</p>
         <div class="actions"><button type="button" class="ghost" data-action="review-exit">学習に戻る</button><button type="button" class="cta reviewCta" data-action="review-continue">続けて復習する</button></div>`
      : `<p class="hint">今日の復習はすべて終わりました。</p>
         <div class="actions"><button type="button" class="cta" data-action="review-exit">学習に戻る</button></div>`}`;
}

function goBack(stage) {
  if (stage.type === "lesson" && stage.lessonIndex > 0) {
    const previousLesson = currentCourse().lessons[stage.lessonIndex - 1];
    state.question = previousLesson.questions.length;
  }
  setStage(state.stage - 1);
}

document.addEventListener("change", event => {
  if (event.target.matches(".categorySelect")) switchCourse(event.target.value);
});

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
  if (button.dataset.action === "go-home") { setStage(0, true); return; }
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
