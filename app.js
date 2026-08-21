const courses = curriculum.courses;
const defaultCourseId = courses[0].id;
const storageKey = "englishGrammarLearning.v3";
const legacyStorageKey = "englishGrammarLearning.v2";
const veryLegacyStorageKey = "englishGrammarLearning.subjunctivePast.v1";
const defaultState = {
  courseId: defaultCourseId, stage: 0, question: 0, answers: {}, versions: {}, visitedLessons: [],
  review: {}, reviewSession: null, finalChecks: {}, finalRun: null, coursePositions: {}, courseStructureVersions: {}
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
// 修了テストが「未解放→解放」に変わった直後だけ、次にホームを描画するときunlock表現を一度出す。
// 保存データには残さず、現在のページ滞在中のみ有効なモジュール変数として扱う。
let justUnlockedCourseId = null;
let reviewReturnHash = "#/";

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

const VIEW_CATALOG = "catalog";
const VIEW_COURSE = "course";
const VIEW_SESSION = "session";

function parseHashRoute() {
  const rawHash = window.location.hash;
  if (!rawHash) return { type: "none" };
  let path;
  try {
    path = decodeURIComponent(rawHash.slice(1));
  } catch {
    return { type: "invalid" };
  }
  const parts = path.split("/").filter(Boolean);
  if (!parts.length) return { type: "catalog" };
  if (parts.length === 1 && parts[0] === "review") return { type: "review" };
  if (parts[0] !== "c") return { type: "invalid" };
  const courseId = parts[1];
  if (validCourseId(courseId) !== courseId) return { type: "invalid" };
  const course = courseFor(courseId);
  if (parts.length === 2) return { type: "course", courseId };
  if (parts[2] === "final" && parts.length === 3) return { type: "final", courseId };
  if (parts[2] !== "l" || !parts[3]) return { type: "invalid" };
  const lesson = course.lessons.find(item => item.id === parts[3]);
  if (!lesson) return { type: "invalid" };
  const mode = parts[4] || "lesson";
  if (!["lesson", "practice", "result"].includes(mode) || parts.length > 5) return { type: "invalid" };
  return { type: mode, courseId, lessonId: lesson.id };
}

function persistedState() {
  const copy = { ...state };
  delete copy.view;
  return copy;
}

function initialViewForState() {
  if (state.reviewSession) return VIEW_SESSION;
  return stagesFor(courseFor(state.courseId))[state.stage]?.type === "overview" ? VIEW_CATALOG : VIEW_SESSION;
}

function lessonStageIndex(course, lessonId) {
  const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
  return lessonIndex < 0 ? -1 : lessonIndex * 2 + 1;
}

function hashForStage(course, stageIndex) {
  const stage = stagesFor(course)[stageIndex];
  if (!stage || stage.type === "overview") return `#/c/${course.id}`;
  if (stage.type === "final") return `#/c/${course.id}/final`;
  const base = `#/c/${course.id}/l/${stage.lesson.id}`;
  if (stage.type === "lesson") return base;
  return state.question >= stage.lesson.questions.length ? `${base}/result` : `${base}/practice`;
}

function routeUrl(hash) {
  return `${window.location.pathname}${window.location.search}${hash}`;
}

function navigateHash(hash, { replace = false, resetScroll = true } = {}) {
  if (window.location.hash === hash) {
    applyHashRoute();
    render(resetScroll);
    return;
  }
  if (replace) history.replaceState({}, "", routeUrl(hash));
  else history.pushState({}, "", routeUrl(hash));
  applyHashRoute();
  render(resetScroll);
}

function selectCourseContext(courseId) {
  rememberCurrentCoursePosition();
  state.courseId = validCourseId(courseId);
  stages = stagesFor(currentCourse());
  const position = normalizePosition(state.courseId, state.coursePositions[state.courseId]);
  state.stage = position.stage;
  state.question = position.question;
}

function applyHashRoute(route = parseHashRoute()) {
  if (state.reviewSession && !["none", "review"].includes(route.type)) {
    state.reviewSession = null;
    saveState();
  }
  if (route.type === "none") {
    state.view = initialViewForState();
    stages = stagesFor(currentCourse());
    return true;
  }
  if (route.type === "catalog") {
    state.view = VIEW_CATALOG;
    stages = stagesFor(currentCourse());
    return true;
  }
  if (route.type === "invalid") {
    history.replaceState({}, "", routeUrl("#/"));
    state.view = VIEW_CATALOG;
    stages = stagesFor(currentCourse());
    return false;
  }
  if (route.type === "course") {
    selectCourseContext(route.courseId);
    state.view = VIEW_COURSE;
    return true;
  }
  if (route.type === "review") {
    if (!state.reviewSession) {
      const items = dueReviewItems();
      if (!items.length) {
        history.replaceState({}, "", routeUrl("#/"));
        state.view = VIEW_CATALOG;
        return false;
      }
      state.reviewSession = { order: items.map(item => item.question.id), index: 0, correctCount: 0, answers: [] };
    }
    state.view = VIEW_SESSION;
    stages = stagesFor(currentCourse());
    return true;
  }
  selectCourseContext(route.courseId);
  const course = currentCourse();
  if (route.type === "final") {
    state.stage = stages.length - 1;
    state.question = 0;
  } else {
    const lessonStage = lessonStageIndex(course, route.lessonId);
    state.stage = route.type === "lesson" ? lessonStage : lessonStage + 1;
    const lesson = course.lessons.find(item => item.id === route.lessonId);
    state.question = route.type === "result" ? lesson.questions.length : route.type === "practice" ? resumeQuestionIndex(lesson) : 0;
  }
  state.view = VIEW_SESSION;
  stages = stagesFor(course);
  return true;
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
  next.courseStructureVersions = isRecord(next.courseStructureVersions) ? next.courseStructureVersions : {};
  return next;
}

let state = loadState();
let stages = stagesFor(courseFor(state.courseId));
state.view = initialViewForState();
syncCourseStructureVersions();
backfillVisitedLessons();
sanitizePersistedSessions();
applyHashRoute();

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
  localStorage.setItem(storageKey, JSON.stringify(persistedState()));
  if (cloud && cloud.isEnabled()) cloud.queueSave();
}

// harnessから届くtone（"syncing"/"ok"/"ng"）をlocal/syncing/saved/errorの表示へ正規化する。
// "saved"のcheckは、直前がokでなかった（＝今回新たに保存が完了した）ときだけ再生する。
let previousSaveTone = null;
function updateSaveStatus(message, tone) {
  const el = document.querySelector("#save-status");
  if (!el) return;
  const SHORT = { ok: "保存済み", syncing: "保存中" };
  el.textContent = tone === "ng" ? message : (SHORT[tone] || message);
  el.title = message;
  el.classList.toggle("save-status-ng", tone === "ng");
  el.classList.toggle("save-status-syncing", tone === "syncing");
  if (tone === "ok") {
    if (previousSaveTone !== "ok") {
      el.classList.remove("save-status-saved");
      void el.offsetWidth;
      el.classList.add("save-status-saved");
    }
  } else {
    el.classList.remove("save-status-saved");
  }
  previousSaveTone = tone;
}

function mountSaveStatus() {
  const el = document.querySelector("#save-status");
  const sessionPanel = document.querySelector("#sessionPanel");
  const slot = sessionPanel && !sessionPanel.classList.contains("hide")
    ? sessionPanel.querySelector(".saveSlot")
    : document.querySelector(".top");
  if (el && slot && el.parentElement !== slot) slot.appendChild(el);
}

// 欠損フィールドを defaultState で埋めてから、通常のロード直後と同じ正規化
// （クランプ → 破棄セッション除去 → 版チェック）を通す。版チェックまで通さないと、
// version 付きの単元で state.versions が未初期化のまま残り、次回起動時に
// 「内容が更新された」と誤判定してその単元の回答を消してしまう。
function applyNormalizedState(source) {
  const currentView = state.view;
  state = normalizeState(source);
  state.view = currentView || initialViewForState();
  syncCourseStructureVersions();
  stages = stagesFor(currentCourse());
  backfillVisitedLessons();
  sanitizePersistedSessions();
  syncContentVersions();
}

function syncCourseStructureVersions() {
  state.courseStructureVersions ||= {};
  let changed = false;
  for (const course of courses) {
    if (!Number.isInteger(course.structureVersion) || state.courseStructureVersions[course.id] === course.structureVersion) continue;
    state.courseStructureVersions[course.id] = course.structureVersion;
    state.coursePositions[course.id] = { stage: 0, question: 0 };
    if (state.courseId === course.id) {
      state.stage = 0;
      state.question = 0;
    }
    if (state.finalRun?.courseId === course.id) state.finalRun = null;
    changed = true;
  }
  if (changed) saveState();
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

function switchCourse(courseId, { advanceFromHome = false } = {}) {
  selectCourseContext(courseId);
  if (advanceFromHome && state.stage === 0) {
    state.stage = recommendedStageFor(currentCourse());
    state.question = 0;
  }
  state.view = advanceFromHome ? VIEW_SESSION : VIEW_COURSE;
  backfillVisitedLessons();
  saveState();
  navigateHash(advanceFromHome ? hashForStage(currentCourse(), state.stage) : `#/c/${currentCourse().id}`);
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

function courseQuestionCount(course) {
  return course.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
}

function finalStatusFor(course) {
  if (!courseMastered(course)) {
    const remaining = course.lessons.length - course.lessons.filter(lessonMastered).length;
    return { label: "未解放", detail: `あと${remaining}単元でマスター`, tone: "" };
  }
  const record = state.finalChecks?.[course.id];
  if (courseCleared(course)) return { label: "CLEAR", detail: `過去最高 ${record.bestScore}/${record.bestTotal}問`, tone: "ok" };
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

function courseCleared(course) {
  const record = state.finalChecks?.[course.id];
  return record?.cleared === true && record.bestTotal === allCourseQuestions(course).length;
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
// カード自体を表示しない（今日の復習セッション中もrenderCatalogは呼ばれないため自動的に非表示）。
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
      <details class="reviewBreakdown">
        <summary>復習の内訳</summary>
        <div class="reviewMetrics">
          ${statHtml(candidates.length, Object.keys(questionIndex).length, "対象問題")}
          ${statHtml(due, candidates.length, "今すぐ復習")}
        </div>
        <div class="intervalGrid" aria-label="復習間隔別内訳">
          ${REVIEW_INTERVALS.map(({ label }) => `<div class="intervalCell"><strong>${counts[label]}</strong><span>${label}</span></div>`).join("")}
        </div>
      </details>
      ${midProgress ? `<p class="hint">通常学習の続きがあるため、先に再開するのがおすすめです。</p>` : ""}
      <p class="reviewTodayCount">今日やる：${due}問</p>
      <button type="button" class="ghost secondaryCta" data-action="start-review" ${due === 0 ? "disabled" : ""}>${ctaLabel}</button>
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
  if (!state.reviewSession) {
    reviewReturnHash = state.view === VIEW_CATALOG ? "#/" : state.view === VIEW_COURSE ? `#/c/${currentCourse().id}` : hashForStage(currentCourse(), state.stage);
  }
  state.reviewSession = { order: items.map(item => item.question.id), index: 0, correctCount: 0, answers: [] };
  state.view = VIEW_SESSION;
  saveState();
  navigateHash("#/review");
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
  state.view = state.stage === 0 ? VIEW_COURSE : VIEW_SESSION;
  saveState();
  navigateHash(hashForStage(currentCourse(), state.stage));
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
  if (state.view === VIEW_CATALOG) return "カタログ";
  if (state.view === VIEW_COURSE || stage.type === "overview") return `カタログ / ${course.title}`;
  if (stage.type === "final") return `カタログ / ${course.title} / 修了テスト`;
  if (stage.type === "lesson") return `カタログ / ${course.title} / ${stage.lesson.title} / 各論`;
  const result = state.question >= stage.lesson.questions.length;
  return `カタログ / ${course.title} / ${stage.lesson.title} / ${result ? resultLabel() : "練習問題"}`;
}

function render(resetScroll = false) {
  const stage = stages[state.stage];
  const course = currentCourse();
  const isHome = !state.reviewSession && [VIEW_CATALOG, VIEW_COURSE].includes(state.view);
  if (isHome) previousStepKey = null;

  document.querySelector(".wrap").classList.toggle("sessionActive", !isHome);
  document.querySelector("#homePanel").classList.toggle("hide", !isHome);
  document.querySelector("#sessionPanel").classList.toggle("hide", isHome);

  document.querySelector("#current-path").textContent = currentPath(stage);

  let container;
  if (isHome) {
    container = document.querySelector("#home-content");
    const homePanel = document.querySelector("#homePanel");
    const wasLoading = homePanel.hasAttribute("aria-busy");
    if (state.view === VIEW_CATALOG) renderCatalog(container);
    else renderCourseOverview(container);
    homePanel.removeAttribute("aria-busy");
    if (wasLoading) {
      // 初回のskeleton→実コンテンツだけ短くクロスフェードする。実描画自体は待たせない。
      container.classList.add("is-appearing");
      void container.offsetWidth;
      container.classList.remove("is-appearing");
    }
  } else {
    container = document.querySelector("#session-content");
    if (state.reviewSession) renderReviewSession(container);
    else if (stage.type === "lesson") renderLesson(container, stage.lesson);
    else if (stage.type === "practice") renderPractice(container, stage.lesson);
    else renderFinal(container, course);
  }
  mountSaveStatus();
  // 回答直後はfeedbackへ、次の問題表示時は問題文へ、各論表示時は単元見出しへ、
  // それ以外（結果画面・概論など）はそのカードのh2へフォーカスを移す。
  const focusTarget = container.querySelector(".feedback") || container.querySelector(".questionText") ||
    container.querySelector(".flashCard h3") || container.querySelector("h2") || container;
  focusTarget.focus({ preventScroll: !focusTarget.classList.contains("feedback") });
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

function courseStarted(course) {
  const hasLessonProgress = course.lessons.some(lesson =>
    state.visitedLessons?.includes(lesson.id) || lessonAnsweredCount(lesson) > 0
  );
  const hasSavedPosition = state.coursePositions?.[course.id]?.stage > 0;
  const hasFinalAttempt = state.finalChecks?.[course.id]?.bestTotal > 0;
  const hasFinalRun = state.finalRun?.courseId === course.id && state.finalRun.order?.length > 0;
  return hasLessonProgress || hasSavedPosition || hasFinalAttempt || hasFinalRun;
}

// 概論の初期開閉。専用の永続状態は持たず、既存courseStarted()から毎回導出する。
function overviewOpenFor(course) {
  return !courseStarted(course);
}

function recommendedOtherCourse(currentCourse) {
  const candidates = courses.filter(course => course.id !== currentCourse.id && !courseCleared(course));
  const started = candidates.find(courseStarted);
  if (started) return started;

  const currentIndex = courses.findIndex(course => course.id === currentCourse.id);
  for (let offset = 1; offset <= courses.length; offset += 1) {
    const course = courses[(currentIndex + offset) % courses.length];
    if (course.id !== currentCourse.id && !courseCleared(course)) return course;
  }
  return null;
}

function homePrimaryActionFor(course) {
  const action = overviewActionFor(course);
  if (!courseMastered(course)) {
    return {
      mode: "learning",
      eyebrow: "まずはここから",
      title: "",
      lead: action.hint,
      primary: { label: action.label, dataAttribute: "stage", value: action.targetStage, className: "cta" },
      secondary: null
    };
  }

  const record = state.finalChecks?.[course.id];
  const attempted = record?.bestTotal > 0;
  if (!courseCleared(course)) {
    return {
      mode: "final-retry",
      eyebrow: "修了テスト",
      title: attempted ? "修了テストにもう一度挑戦しましょう" : "修了テストを受けましょう",
      lead: attempted
        ? `前回の得点：${record.lastScore ?? 0} / ${record.bestTotal}`
        : "全単元マスター済みです。修了テストに挑戦できます。",
      primary: {
        label: attempted ? "修了テストにもう一度挑戦する" : "修了テストへ",
        dataAttribute: "action",
        value: "goto-final",
        className: "cta"
      },
      secondary: null
    };
  }

  const nextCourse = recommendedOtherCourse(course);
  if (nextCourse) {
    const started = courseStarted(nextCourse);
    return {
      mode: "next-course",
      eyebrow: `${course.title} 修了`,
      title: `次は「${nextCourse.title}」を学びましょう`,
      lead: nextCourse.recommendationLead,
      primary: {
        label: started ? `続きから：${nextCourse.title}` : `${nextCourse.title}の学習を始める`,
        dataAttribute: "action",
        value: "start-course",
        courseId: nextCourse.id,
        className: "cta"
      },
      secondary: {
        label: "修了テストにもう一度挑戦する",
        dataAttribute: "action",
        value: "goto-final",
        className: "ghost secondaryCta"
      }
    };
  }

  const due = dueReviewCount();
  return {
    mode: "all-cleared",
    eyebrow: "全カテゴリ修了",
    title: "すべての文法カテゴリを修了しました",
    lead: due > 0
      ? "全カテゴリの修了を確認しました。今日の復習を始めましょう。"
      : "今すぐ復習する問題はありません。次回の復習まで、学んだ内容を思い出しておきましょう。",
    primary: due > 0 ? { label: "今日の復習を始める", dataAttribute: "action", value: "start-review", className: "cta reviewCta" } : null,
    secondary: {
      label: "修了テストにもう一度挑戦する",
      dataAttribute: "action",
      value: "goto-final",
      className: "ghost secondaryCta"
    }
  };
}

function statHtml(value, total, label, secondary = false) {
  return `<div class="stat${secondary ? " stat--secondary" : ""}"><strong>${value}<small> / ${total}</small></strong><span>${label}</span></div>`;
}

/* ---- セッション画面（各論・練習・修了テスト・今日の復習）の共通部品 ---- */
function sessionBarHtml(label, { showBack = true, position = "" } = {}) {
  return `<div class="sessionBar">
    ${showBack ? `<button type="button" class="ghost" data-action="go-home">一覧へ戻る</button>` : ""}
    <p class="label">${label}</p>
    ${position ? `<p class="sessionPosition">${position}</p>` : ""}
    <div class="saveSlot"></div>
  </div>`;
}

function sessionTitleHtml(title) {
  return `<h2 tabindex="-1">${title}</h2>`;
}

// 各論・問題・修了テスト・今日の復習の画面で、スクロール中もsticky表示する現在地の文言。
function sessionPositionText(stage) {
  if (state.reviewSession) return "今日の復習";
  const totalLessons = currentCourse().lessons.length;
  if (stage.type === "overview") return "";
  if (stage.type === "final") return "修了テスト";
  const lessonNo = stage.lessonIndex + 1;
  return `単元 ${lessonNo}/${totalLessons}`;
}

const LESSON_STEPS = [
  { key: "lesson", label: "各論" },
  { key: "practice", label: "練習" },
  { key: "result", label: "結果" }
];

// active段階の移動・cleared化の瞬間だけ対象stepにsettleモーションを付けるため、
// 直前にstepBarHtmlを描画したときのactiveKeyをモジュールスコープで覚えておく。
// ホーム表示のたびにnullへ戻す（render()側）ことで、初期描画・リロード・カテゴリ切替では再演しない。
let previousStepKey = null;

function stepBarHtml(steps, activeKey) {
  const activeIndex = steps.findIndex(step => step.key === activeKey);
  const previousIndex = steps.findIndex(step => step.key === previousStepKey);
  const justChanged = previousStepKey !== null && previousStepKey !== activeKey;
  const justClearedIndex = justChanged && previousIndex >= 0 && previousIndex < activeIndex ? previousIndex : -1;
  previousStepKey = activeKey;

  return `<div class="stepBar" aria-label="学習ステップ">
    ${steps.map((step, index) => {
      const isActive = step.key === activeKey;
      const isCleared = activeIndex >= 0 && index < activeIndex;
      const isLocked = activeIndex >= 0 && index > activeIndex;
      const isSettling = (isActive && justChanged) || index === justClearedIndex;
      const cls = [isActive && "active", isCleared && "cleared", isLocked && "locked", isSettling && "is-settling"].filter(Boolean).join(" ");
      const ariaCurrent = isActive ? ' aria-current="step"' : "";
      const ariaDisabled = isLocked ? ' aria-disabled="true"' : "";
      return `<span class="step ${cls}"${ariaCurrent}${ariaDisabled}>${step.label}</span>`;
    }).join("")}
  </div>`;
}

// sessionBarとstepBarを.sessionProgressへまとめる共通helper。スクロール中もsticky表示する（styles.css）。
function sessionProgressHtml(label, steps, activeKey, { showBack = true, stage = stages[state.stage], lessonId = null, outlineCourse = currentCourse() } = {}) {
  return `<div class="sessionProgress">
    ${sessionBarHtml(label, { showBack, position: sessionPositionText(stage) })}
    ${steps?.length ? stepBarHtml(steps, activeKey) : ""}
    ${lessonId ? sessionOutlineMobileHtml(outlineCourse, lessonId) : ""}
  </div>`;
}

// 練習問題・今日の復習・修了テストの問題画面で共有する4択カード。採点・保存はここでは行わない。
// 回答後の「次へ」はカード内の.quizNextActionに置く。
const BLANK = /[(（][\s　]*[)）]/;

function filledSentence(question) {
  if (!BLANK.test(question.text)) return null;
  return question.text.replace(BLANK, `<b class="blankFill">${question.choices[question.answer]}</b>`);
}

function quizCardHtml({ label, question, selectedIndex, dataAttr, nextLabel, nextAction }) {
  const answered = Number.isInteger(selectedIndex);
  const correct = selectedIndex === question.answer;
  const filled = filledSentence(question);
  return `
    <section class="quiz ${answered ? "quiz--answered" : "is-entering"}">
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
        <p class="feedbackVerdict">${correct ? "○ 正解" : "× 不正解"}</p>
        <h3 class="feedbackAnswer"><span class="feedbackBadge">正解</span>${question.choices[question.answer]}</h3>
        ${filled ? `<p class="feedbackSentence">${filled}</p>` : ""}
        ${question.translation ? `<p class="feedbackTranslation"><span class="feedbackBadge">日本語訳</span>${question.translation}</p>` : ""}
        <div class="feedbackPoint">
          <h4>ポイント</h4>
          <p class="feedbackPointBody">${question.explanation}</p>
        </div>
        ${question.diagram ? `<div class="feedbackDiagram" role="group" aria-label="文法の関係図">
          <div class="feedbackDiagramCell">${question.diagram.left}</div>
          <div class="feedbackDiagramLabel">${question.diagram.label}</div>
          <div class="feedbackDiagramCell">${question.diagram.right}</div>
        </div>` : ""}
        ${question.takeaway ? `<p class="feedbackTakeaway">${question.takeaway}</p>` : ""}
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

function homeActionButtonHtml(action) {
  if (!action) return "";
  const courseAttribute = action.courseId ? ` data-course="${action.courseId}"` : "";
  return `<button type="button" class="${action.className}" data-${action.dataAttribute}="${action.value}"${courseAttribute}>${action.label}</button>`;
}

function courseCardModel(course) {
  const { total, completed, mastered } = courseProgressStats(course);
  const finalStatus = finalStatusFor(course);
  const nextLabel = finalStatus.label === "CLEAR" ? "修了テストCLEAR" : overviewActionFor(course).label;
  return { course, total, completed, mastered, questionCount: courseQuestionCount(course), estimatedMinutes: courseEstimatedMinutes(course), finalStatus, nextLabel };
}

function courseCardHtml(course, index, activeCourse) {
  const model = courseCardModel(course);
  const isActive = course.id === activeCourse.id;
  return `<button type="button" class="courseCard ${isActive ? "active" : ""}" data-action="open-course" data-course="${course.id}" ${isActive ? 'aria-current="true"' : ""}>
    <span class="courseCardNo">${String(index + 1).padStart(2, "0")}</span>
    <span class="courseCardTitle">${course.title}${isActive ? "（選択中）" : ""}</span>
    <span class="courseCardMeta">カテゴリ · ${model.total}単元 · ${model.questionCount}問 · 約${model.estimatedMinutes}分</span>
    <span class="courseCardProgress">完了 ${model.completed}/${model.total}単元・マスター ${model.mastered}/${model.total}</span>
    <span class="courseCardFinal">修了テスト：${model.finalStatus.label}</span>
    <span class="courseCardNext">${model.nextLabel}</span>
  </button>`;
}

function textLengthFromHtml(html) {
  const text = String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length;
}

function lessonEstimatedMinutes(lesson) {
  if (Number.isFinite(lesson.estMinutes) && lesson.estMinutes > 0) return Math.ceil(lesson.estMinutes);
  return Math.max(1, Math.ceil(textLengthFromHtml(lesson.html) / 500) + lesson.questions.length);
}

function courseEstimatedMinutes(course) {
  const total = course.lessons.reduce((sum, lesson) => sum + lessonEstimatedMinutes(lesson), 0);
  return Math.max(5, Math.ceil(total / 5) * 5);
}

function courseMetaHtml(course) {
  return `<div class="courseMeta" aria-label="カテゴリの分量"><span>カテゴリ</span><span>${course.lessons.length}単元</span><span>${courseQuestionCount(course)}問</span><span>約${courseEstimatedMinutes(course)}分</span><span>修了テスト</span></div>`;
}

function courseSectionsFor(course) {
  const sections = Array.isArray(course.sections) ? course.sections : [];
  const lessonById = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  const referenced = sections.flatMap(section => Array.isArray(section.lessonIds) ? section.lessonIds : []);
  const valid = sections.length > 0 && sections.every(section => section && typeof section.title === "string" && typeof section.lead === "string" && Array.isArray(section.lessonIds))
    && new Set(referenced).size === referenced.length
    && referenced.length === course.lessons.length
    && course.lessons.every(lesson => referenced.includes(lesson.id))
    && referenced.every(id => lessonById.has(id));
  if (!valid) return [{ section: null, lessons: course.lessons }];
  return sections.map(section => ({ section, lessons: section.lessonIds.map(id => lessonById.get(id)) }));
}

function curriculumStatsHtml() {
  const allLessons = courses.flatMap(course => course.lessons);
  const completed = allLessons.filter(lessonCompleted).length;
  const weak = allLessons.filter(lesson => lessonCompleted(lesson) && !lessonMastered(lesson)).length;
  const mastered = allLessons.filter(lessonMastered).length;
  const finalBest = courses.reduce((sum, course) => sum + (state.finalChecks?.[course.id]?.bestScore || 0), 0);
  const finalTotal = courses.reduce((sum, course) => sum + (state.finalChecks?.[course.id]?.bestTotal || 0), 0);
  const questionTotal = courses.reduce((sum, course) => sum + courseQuestionCount(course), 0);
  return `<div class="stats catalogStats">
    ${statHtml(completed, allLessons.length, "完了単元")}
    ${statHtml(weak, allLessons.length, "要復習単元")}
    ${statHtml(mastered, allLessons.length, "マスター済み", true)}
    ${statHtml(finalBest, finalTotal || questionTotal, "修了テストBEST", true)}
  </div>`;
}

function catalogPrimaryHtml(course) {
  const action = homePrimaryActionFor(course);
  const recommendation = action.mode === "learning"
    ? `<p class="lead">${course.recommendationLead}</p><p class="hint">${action.lead}</p>`
    : `<h3 class="homeHeroTitle">${action.title}</h3><p class="lead">${action.lead}</p>`;
  return `<section class="catalogHero" aria-labelledby="catalog-title">
    <p class="label">今回の学習</p>
    <h2 id="catalog-title" tabindex="-1">英文法を学ぶ</h2>
    <p class="lead">カテゴリを選び、概論・各論・練習問題の順に進みます。</p>
    <div class="recommend recommend--${action.mode}">
      <p class="label">${action.eyebrow}</p>
      ${recommendation}
      <div class="actions homeHeroActions">${homeActionButtonHtml(action.primary)}${homeActionButtonHtml(action.secondary)}</div>
    </div>
  </section>`;
}

function renderCatalog(content) {
  const course = currentCourse();
  content.innerHTML = `
    <div class="catalogPage">
      ${catalogPrimaryHtml(course)}
      ${curriculumStatsHtml()}
      ${reviewMissionCard(course)}
      <section class="courseCatalog" aria-labelledby="course-catalog-title">
        <p class="label">文法カテゴリ</p>
        <h2 id="course-catalog-title">学ぶカテゴリを選ぶ</h2>
        <div class="courseGrid">${courses.map((item, index) => courseCardHtml(item, index, course)).join("")}</div>
      </section>
    </div>`;
}

function objectivesHtml(course) {
  if (!Array.isArray(course.objectives) || !course.objectives.length) return "";
  return `<section class="card courseObjectives" aria-labelledby="objectives-title">
    <p class="label">学習内容</p>
    <h3 id="objectives-title">このカテゴリを終えるとできること</h3>
    <ul>${course.objectives.map(objective => `<li>${objective}</li>`).join("")}</ul>
  </section>`;
}

function courseSectionHtml(course, group) {
  return `<section class="courseSection" aria-labelledby="course-section-${group.section?.id || "all"}">
    <div class="courseSectionHead"><h3 id="course-section-${group.section?.id || "all"}">${group.section?.title || "全単元"}</h3>${group.section ? `<p class="hint">${group.section.lead}</p>` : ""}</div>
    <div class="unitList">${group.lessons.map(lesson => lessonCardHtml(lesson, course.lessons.indexOf(lesson))).join("")}</div>
  </section>`;
}

function renderCourseOverview(content) {
  const course = currentCourse();
  const action = overviewActionFor(course);
  const showUnlock = justUnlockedCourseId === course.id;
  if (showUnlock) justUnlockedCourseId = null;
  content.innerHTML = `
    <div class="courseDetail">
      <button type="button" class="ghost catalogBack" data-action="catalog">カタログへ戻る</button>
      <section class="courseDetailHero" aria-labelledby="course-detail-title">
        <p class="label">文法カテゴリ</p>
        <h2 id="course-detail-title" tabindex="-1">${course.title}</h2>
        <p class="lead">${course.recommendationLead}</p>
        ${courseMetaHtml(course)}
        <div class="actions"><button type="button" class="cta" data-stage="${action.targetStage}">${action.label}</button></div>
      </section>
      ${objectivesHtml(course)}
      <details class="card courseOverview" ${overviewOpenFor(course) ? "open" : ""}>
        <summary><h3>${course.overview.title}</h3><span class="hint">概論・判断のポイント</span></summary>
        ${course.overview.html}
      </details>
      <section class="courseSections" aria-labelledby="course-sections-title">
        <p class="label">学習単元</p>
        <h2 id="course-sections-title">全${course.lessons.length}単元</h2>
        ${courseSectionsFor(course).map(group => courseSectionHtml(course, group)).join("")}
      </section>
      ${courseAssessmentHtml(course, showUnlock)}
    </div>`;
}

// 単元一覧の1カードの表示モデル。区分自体はlessonStatusLabel()を正本にし、ここでは文言を組み合わせるだけ。
function lessonCardModel(lesson, lessonIndex) {
  const total = lesson.questions.length;
  const answered = lessonAnsweredCount(lesson);
  const score = lessonScore(lesson);
  const visited = state.visitedLessons.includes(lesson.id);
  const status = lessonStatusLabel(lesson);
  const stateKey = status === "未着手" ? "todo"
    : status === "各論確認済み" ? "ready"
    : status.startsWith("練習途中") ? "progress"
    : status.startsWith("要復習") ? "review"
    : "done";
  const stateLabel = { todo: "未着手", ready: "練習へ", progress: "続きから", review: "要復習", done: "マスター" }[stateKey];
  const nextLabel = { todo: "各論を読む", ready: "練習を始める", progress: "続きから", review: "解き直す", done: "解き直す" }[stateKey];
  return {
    number: lessonIndex + 1,
    title: lesson.title,
    stateKey,
    stateLabel,
    lessonStageLabel: visited ? "各論 ✓" : "各論 未確認",
    practiceStageLabel: `練習 ${answered}/${total}`,
    scoreLabel: answered === total ? `正解 ${score}/${total}` : "",
    estimatedMinutes: lessonEstimatedMinutes(lesson),
    nextLabel,
    targetStage: unitTargetStage(lesson, lessonIndex)
  };
}

function lessonCardHtml(lesson, lessonIndex) {
  const model = lessonCardModel(lesson, lessonIndex);
  return `<button type="button" class="lessonCard ${model.stateKey}" data-stage="${model.targetStage}">
    <span class="lessonCardHead">
      <span class="lessonNo">${String(model.number).padStart(2, "0")}</span>
      <span class="lessonState">${model.stateLabel}</span>
    </span>
    <strong class="lessonTitle">${model.title}</strong>
    <span class="lessonStages">
      <span>${model.lessonStageLabel}</span>
      <span>${model.practiceStageLabel}</span>
      <span>約${model.estimatedMinutes}分</span>
      ${model.scoreLabel ? `<span>${model.scoreLabel}</span>` : ""}
    </span>
    <span class="lessonNext">${model.nextLabel}</span>
  </button>`;
}

function outlineListHtml(course, currentLessonId) {
  return courseSectionsFor(course).map(group => `
    <section class="outlineSection">
      ${group.section ? `<h3>${group.section.title}</h3>` : ""}
      <ol>${group.lessons.map(lesson => {
        const lessonIndex = course.lessons.indexOf(lesson);
        const current = lesson.id === currentLessonId;
        const completed = lessonCompleted(lesson);
        const stateMark = completed ? "✓" : lesson.id === currentLessonId ? "▸" : "○";
        return `<li><a class="outlineLesson" href="#/c/${course.id}/l/${lesson.id}"${current ? ' aria-current="page"' : ""}>
          <span class="outlineLessonMark" aria-hidden="true">${stateMark}</span><span>${lessonIndex + 1}. ${lesson.title}</span>
        </a></li>`;
      }).join("")}</ol>
    </section>`).join("");
}

function outlineHtml(course, currentLessonId, className = "lessonOutline") {
  return `<aside class="${className}" aria-label="コースアウトライン">
    <p class="label">コースアウトライン</p>
    ${outlineListHtml(course, currentLessonId)}
  </aside>`;
}

function sessionWorkspaceHtml(mainHtml, { course = currentCourse(), lessonId = null, hasOutline = false } = {}) {
  const left = hasOutline ? outlineHtml(course, lessonId) : `<div class="workspaceRail" aria-hidden="true"></div>`;
  const right = hasOutline
    ? `<nav class="lessonToc" aria-label="ページ内目次"><p class="label">この単元の内容</p><ol class="lessonTocList"></ol></nav>`
    : `<div class="workspaceRail" aria-hidden="true"></div>`;
  return `<div class="lessonWorkspace${hasOutline ? "" : " lessonWorkspace--empty"}">${left}<div class="lessonWorkspaceMain">${mainHtml}</div>${right}</div>`;
}

function sessionOutlineMobileHtml(course, lessonId) {
  return `<details class="sessionOutlineMobile">
    <summary>単元一覧</summary>
    ${outlineHtml(course, lessonId, "sessionOutlineNav")}
  </details>`;
}

function buildLessonToc(container) {
  const main = container.querySelector(".lessonWorkspaceMain");
  const toc = container.querySelector(".lessonToc");
  const inline = container.querySelector(".lessonTocInline");
  if (!main || !toc) return;
  const items = Array.from(main.querySelectorAll("details.section > summary")).map((summary, index) => {
    const details = summary.parentElement;
    const id = `lesson-section-${index + 1}`;
    details.id = id;
    return { id, title: summary.textContent.trim() };
  });
  const links = items.map(item => `<li><a class="lessonTocLink" href="#${item.id}" data-toc-target="#${item.id}">${item.title}</a></li>`).join("");
  toc.querySelector(".lessonTocList").innerHTML = links;
  if (inline) inline.querySelector(".lessonTocList").innerHTML = links;
  if (items.length <= 1) {
    toc.classList.add("hide");
    inline?.classList.add("hide");
  }
}

// 修了テストは学習単元の通し番号から分離した「カテゴリ認定」カードとして描画する。
// 解放判定・CLEAR基準・unlock演出の対象化はfinalStatusFor()等の既存関数のまま変更しない。
function courseAssessmentHtml(course, showUnlock) {
  const finalStatus = finalStatusFor(course);
  const total = allCourseQuestions(course).length;
  const passScore = finalPassScore(total);
  const stageIndex = stagesFor(course).length - 1;
  return `<section class="courseAssessment">
    <p class="label">カテゴリ認定</p>
    <button type="button" class="assessmentCard ${finalStatus.tone === "ok" ? "done" : ""} ${showUnlock ? "is-unlocking" : ""}" data-stage="${stageIndex}">
      <span class="assessmentHead">
        <strong>修了テスト</strong>
        <span class="assessmentState">${showUnlock ? "修了テストが解放されました" : finalStatus.label}</span>
      </span>
      <span class="assessmentDetail">${finalStatus.detail}</span>
      <span class="assessmentMeta">全${total}問・合格ライン ${passScore}/${total}問（正答率80%以上）</span>
    </button>
  </section>`;
}

function renderLesson(content, lesson) {
  if (!state.visitedLessons.includes(lesson.id)) {
    state.visitedLessons.push(lesson.id);
    saveState();
  }
  const stage = stages[state.stage];
  const course = currentCourse();
  const backButton = stage.lessonIndex === 0 ? "" : `<button type="button" class="ghost" data-action="back">${course.lessons[stage.lessonIndex - 1].title}の結果へ戻る</button>`;
  const lessonMain = `
    ${sessionTitleHtml("各論")}
    <h3 tabindex="-1">${lesson.title}</h3>
    ${lesson.html}
    <details class="lessonTocInline"><summary>ページ内目次</summary><ol class="lessonTocList"></ol></details>`;
  content.innerHTML = `
    ${sessionProgressHtml(course.title, LESSON_STEPS, "lesson", { stage, lessonId: lesson.id, outlineCourse: course })}
    ${sessionWorkspaceHtml(`<article class="flashCard">${lessonMain}</article>`, { course, lessonId: lesson.id, hasOutline: true })}
    <div class="actions">${backButton}<button type="button" class="cta" data-action="next">3問に挑戦</button></div>`;
  enhanceAccordions(content);
  buildLessonToc(content);
}

// 各論本文内の details.section を初期表示ですべて開き、矢印transform＋本文opacity/translateYで開閉するよう補強する。
// 教材本文（content.js）自体は変更せず、描画時にsummary以外の子要素だけをwrapperへ移す。
function enhanceAccordions(container) {
  container.querySelectorAll("details.section").forEach(details => {
    let body = details.querySelector(":scope > .sectionBody");
    if (!body) {
      body = document.createElement("div");
      body.className = "sectionBody";
      Array.from(details.children).filter(child => child.tagName !== "SUMMARY").forEach(child => body.appendChild(child));
      details.appendChild(body);
    }
    details.open = !details.hasAttribute("data-initially-closed");
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      body.classList.add("is-entering");
      void body.offsetWidth;
      body.classList.remove("is-entering");
    });
  });
}

function renderPractice(content, lesson) {
  if (state.question >= lesson.questions.length) return renderResult(content, lesson);
  const question = lesson.questions[state.question];
  const answers = currentAnswers(lesson);
  const selected = answers[state.question];
  const practiceMain = `
    ${sessionTitleHtml("練習問題")}
    ${quizCardHtml({
      label: `問題 ${state.question + 1} / ${lesson.questions.length}`, question, selectedIndex: selected, dataAttr: "choice",
      nextLabel: state.question + 1 === lesson.questions.length ? "結果を見る" : "次の問題", nextAction: "next-question"
    })}`;
  content.innerHTML = `
    ${sessionProgressHtml(lesson.title, LESSON_STEPS, "practice")}
    ${sessionWorkspaceHtml(practiceMain)}
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
  const resultMain = `
    ${sessionTitleHtml(isLastLesson ? "全単元完了" : "単元結果")}
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
    ${isLastLesson ? renderCourseSummary(course) : ""}`;
  content.innerHTML = `
    ${sessionProgressHtml(lesson.title, LESSON_STEPS, "result", { stage })}
    ${sessionWorkspaceHtml(resultMain)}
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
    const firstUnmasteredIndex = course.lessons.findIndex(lesson => !lessonMastered(lesson));
    const firstUnmastered = course.lessons[firstUnmasteredIndex];
    const finalLockMain = `
      ${sessionTitleHtml("修了テスト")}
      <section class="card" aria-labelledby="final-lock-title">
        <p class="hint">修了テストは、すべての単元の練習問題に全問正解すると挑戦できます。</p>
        <h3 id="final-lock-title">あと${unmastered.length}単元</h3>
        <ol class="review-list">
          ${unmastered.map(lesson => `<li><span>${lesson.title}（${lessonScore(lesson)}/${lesson.questions.length}）</span></li>`).join("")}
        </ol>
      </section>`;
    content.innerHTML = `
      ${sessionProgressHtml(course.title, null, null)}
      ${sessionWorkspaceHtml(finalLockMain)}
      <div class="actions"><button type="button" class="cta" data-stage="${unitTargetStage(firstUnmastered, firstUnmasteredIndex)}">${firstUnmastered.title}へ</button></div>`;
    return;
  }

  const record = finalRecordFor(course);
  const total = allCourseQuestions(course).length;
  const passScore = finalPassScore(total);
  const finalMain = `
    ${sessionTitleHtml("修了テスト")}
    <section class="card">
      <p class="lead">全${total}問からランダムに出題します。${passScore}/${total}問以上（正答率80%以上）でCLEARです。</p>
      ${record.cleared ? `<p class="hint">CLEAR済みです（過去最高 ${record.bestScore}/${record.bestTotal}）。もう一度挑戦できます。</p>`
        : record.lastScore ? `<p class="hint">前回の結果：${record.lastScore}/${record.bestTotal}</p>` : ""}
    </section>`;
  content.innerHTML = `
    ${sessionProgressHtml(course.title, null, null)}
    ${sessionWorkspaceHtml(finalMain)}
    <div class="actions"><button type="button" class="cta" data-action="start-final">修了テストを始める</button></div>`;
}

function renderFinalQuestion(content, run) {
  const { course, lesson, question } = questionIndex[run.order[run.index]];
  const selected = run.answers[run.index];
  const finalQuestionMain = `
    ${sessionTitleHtml("修了テスト")}
    ${quizCardHtml({
      label: `問題 ${run.index + 1} / ${run.order.length}`, question, selectedIndex: selected, dataAttr: "final-choice",
      nextLabel: run.index + 1 === run.order.length ? "結果を見る" : "次の問題", nextAction: "final-next"
    })}`;
  content.innerHTML = `
    ${sessionProgressHtml(`${course.title}　出典：${lesson.title}`, null, null)}
    ${sessionWorkspaceHtml(finalQuestionMain)}`;
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

  const finalResultMain = `
    ${sessionTitleHtml(passed ? "修了テスト CLEAR" : "修了テスト結果")}
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
    </section>` : ""}`;
  content.innerHTML = `
    ${sessionProgressHtml(course.title, null, null, { showBack: false })}
    ${sessionWorkspaceHtml(finalResultMain)}
    <div class="actions">
      <button type="button" class="ghost" data-action="overview">一覧へ戻る</button>
      <button type="button" class="cta" data-action="start-final">もう一度挑戦する</button>
    </div>`;
}

/* ---- 今日の復習セッション（案4） ---- */
function renderReviewSession(content) {
  const session = state.reviewSession;
  if (session.index >= session.order.length) return renderReviewResult(content, session);
  const { course, lesson, question } = questionIndex[session.order[session.index]];
  const selected = session.answers[session.index];
  const reviewMain = `
    ${sessionTitleHtml("今日の復習")}
    ${quizCardHtml({
      label: `問題 ${session.index + 1} / ${session.order.length}`, question, selectedIndex: selected, dataAttr: "review-choice",
      nextLabel: session.index + 1 === session.order.length ? "結果を見る" : "次の問題", nextAction: "review-next"
    })}`;
  content.innerHTML = `
    ${sessionProgressHtml(`出典：${course.title} ＞ ${lesson.title}`, null, null)}
    ${sessionWorkspaceHtml(reviewMain)}`;
}

function renderReviewResult(content, session) {
  const remaining = dueReviewCount();
  const reviewResultMain = `
    ${sessionTitleHtml("復習完了")}
    <section class="doneBanner ${remaining === 0 ? "doneBanner--success" : ""}">
      <p class="label">学習結果</p>
      <div class="score">${session.correctCount} / ${session.order.length}</div>
      <p>正解した問題は次の復習日まで表示されません。間違えた問題はまた近いうちに出題されます。</p>
    </section>`;
  content.innerHTML = `
    ${sessionProgressHtml("今日の復習", null, null, { showBack: false })}
    ${sessionWorkspaceHtml(reviewResultMain)}
    ${remaining > 0
       ? `<p class="hint">今日の復習：残り${remaining}問</p>
          <div class="actions"><button type="button" class="ghost" data-action="review-exit">一覧へ戻る</button><button type="button" class="cta reviewCta" data-action="review-continue">続けて復習する</button></div>`
       : `<p class="hint">今日の復習はすべて終わりました。</p>
          <div class="actions"><button type="button" class="cta" data-action="review-exit">一覧へ戻る</button></div>`}`;
}

function goBack(stage) {
  if (stage.type === "lesson" && stage.lessonIndex > 0) {
    const previousLesson = currentCourse().lessons[stage.lessonIndex - 1];
    state.question = previousLesson.questions.length;
  }
  setStage(state.stage - 1);
}

document.addEventListener("click", event => {
  const tocLink = event.target.closest("a[data-toc-target]");
  if (tocLink) {
    event.preventDefault();
    const target = document.querySelector(tocLink.dataset.tocTarget);
    if (target) {
      target.open = true;
      target.scrollIntoView({ block: "start" });
      target.querySelector("summary")?.focus();
    }
    return;
  }
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
      navigateHash(reviewReturnHash);
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
  if (button.dataset.action === "start-course") {
    switchCourse(button.dataset.course, { advanceFromHome: true });
    return;
  }
  if (button.dataset.action === "open-course") {
    selectCourseContext(button.dataset.course);
    state.view = VIEW_COURSE;
    saveState();
    navigateHash(`#/c/${currentCourse().id}`);
    return;
  }
  if (button.dataset.course) {
    switchCourse(button.dataset.course);
    return;
  }
  const stage = stages[state.stage];
  if (button.dataset.action === "go-home") { setStage(0, true); return; }
  if (button.dataset.action === "catalog") {
    state.view = VIEW_CATALOG;
    saveState();
    navigateHash("#/");
    return;
  }
  if (button.dataset.action === "next") setStage(state.stage + 1, stage.type === "lesson");
  if (button.dataset.action === "back") goBack(stage);
  if (button.dataset.action === "detail") setStage(state.stage - 1);
  if (button.dataset.action === "overview") setStage(0, true);
  if (button.dataset.action === "goto-final") setStage(stages.length - 1);
  if (button.dataset.action === "retry") {
    state.question = 0;
    state.answers[stage.lesson.id] = [];
    saveState();
    navigateHash(hashForStage(currentCourse(), state.stage), { replace: true });
    return;
  }
  if (button.dataset.action === "retry-wrong") {
    const answers = currentAnswers(stage.lesson);
    const firstWrong = stage.lesson.questions.findIndex((question, index) => answers[index] !== question.answer);
    stage.lesson.questions.forEach((question, index) => {
      if (answers[index] !== question.answer) answers[index] = null;
    });
    state.question = firstWrong;
    saveState();
    navigateHash(hashForStage(currentCourse(), state.stage), { replace: true });
    return;
  }
  if (button.dataset.action === "next-lesson") setStage(state.stage + 1, true);
  if (button.dataset.action === "next-question") {
    state.question += 1;
    saveState();
    navigateHash(hashForStage(currentCourse(), state.stage), { replace: true });
  }
  if (button.dataset.choice !== undefined) {
    const question = stage.lesson.questions[state.question];
    const idx = Number(button.dataset.choice);
    const course = currentCourse();
    const wasLocked = finalStatusFor(course).label === "未解放";
    currentAnswers(stage.lesson)[state.question] = idx;
    recordReviewResult(question, idx === question.answer);
    if (wasLocked && finalStatusFor(course).label !== "未解放") justUnlockedCourseId = course.id;
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
    setStage(targetStage, target.type === "lesson");
  }
});

window.addEventListener("hashchange", () => {
  applyHashRoute();
  render(true);
});
window.addEventListener("popstate", () => {
  applyHashRoute();
  render(true);
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
    getPayload: () => persistedState(),
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
  if (changed) {
    applyHashRoute();
    render(true);
  }
}

boot();
