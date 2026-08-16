import { test, expect } from "@playwright/test";

const STORAGE_KEY = "englishGrammarLearning.v3";
const participlesVersions = {
  "participles-as-adjectives-present": 2,
  "participles-as-adjectives-past": 2,
  "emotion-verb-participles": 2,
  "participle-complements": 1,
  "perception-verb-participles": 1
};
const subjunctiveVersions = {
  "conditionals-vs-subjunctive": 1,
  "past-subjunctive": 2,
  "past-perfect-subjunctive": 3,
  "wish-subjunctive": 1,
  "if-only-subjunctive": 1,
  "mixed-subjunctive": 2,
  "if-it-were-not-for": 2,
  "as-if-subjunctive": 2,
  "it-is-time-subjunctive-past": 2,
  "future-subjunctive-should": 2,
  "future-subjunctive-were-to": 2,
  "subjunctive-inversion": 2
};
const masteredSubjunctiveAnswers = {
  "conditionals-vs-subjunctive": [0, 1, 2],
  "past-subjunctive": [3, 1, 2],
  "past-perfect-subjunctive": [3, 2, 2],
  "wish-subjunctive": [1, 2, 2],
  "if-only-subjunctive": [1, 1, 2],
  "mixed-subjunctive": [2, 2, 0],
  "if-it-were-not-for": [1, 2, 1],
  "as-if-subjunctive": [1, 2, 3],
  "it-is-time-subjunctive-past": [1, 2, 1],
  "future-subjunctive-should": [0, 2, 0],
  "future-subjunctive-were-to": [0, 2, 1],
  "subjunctive-inversion": [1, 2, 3]
};

async function seedProgress(page, progress) {
  await page.goto("/");
  await page.evaluate(({ key, value }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: STORAGE_KEY, value: progress });
  await page.reload();
}

async function switchCourse(page, courseId) {
  await page.locator(".courseNavigator > summary").click();
  await page.locator(`.courseCard[data-course="${courseId}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("概論がエラーなく表示される", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "仮定法とは" })).toBeVisible();
  await expect(page.locator("#current-path")).toHaveText("仮定法 ＞ 概論");
});

test("coursePositionsのない旧v3データを現在位置から移行する", async ({ page }) => {
  await seedProgress(page, {
    courseId: "participles",
    stage: 2,
    question: 1,
    answers: { "participles-as-adjectives-present": [1] },
    versions: participlesVersions,
    visitedLessons: ["participles-as-adjectives-present"]
  });

  await expect(page.locator("#current-path")).toContainText("分詞 ＞ 分詞の形容詞的用法（現在分詞） ＞ 練習問題");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
});

test("保存されたstageとquestionをコース範囲内へ補正する", async ({ page }) => {
  await seedProgress(page, {
    courseId: "participles",
    stage: 999,
    question: 999,
    answers: {},
    coursePositions: {
      participles: { stage: 999, question: 999 },
      subjunctive: { stage: 2, question: -3 },
      unknown: { stage: 1, question: 1 }
    }
  });

  await expect(page.locator("#current-path")).toHaveText("分詞 ＞ 修了テスト");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.coursePositions.unknown).toBeUndefined();
  expect(saved.coursePositions.participles.question).toBe(0);
  expect(saved.coursePositions.subjunctive.question).toBe(0);
});

test("コースを切り替えても各コースの位置を独立に保持する", async ({ page }) => {
  // カテゴリ切替はホームからのみ行える設計のため、切替直前の位置（通常は概論）が
  // そのカテゴリの位置として保存される。深い位置（各論・練習途中）の保持はリロード時に検証する。
  await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();
  await expect(page.locator("#current-path")).toContainText("条件文と仮定法の違い ＞ 各論");
  await page.getByRole("button", { name: "概論へ戻る" }).click();

  await switchCourse(page, "participles");
  await page.getByRole("button", { name: /分詞の形容詞的用法（現在分詞）へ/ }).click();
  await expect(page.locator("#current-path")).toContainText("分詞の形容詞的用法（現在分詞） ＞ 各論");

  // 分詞は各論の位置に留まったままリロード：深い位置が保存・復元されることを確認する。
  await page.reload();
  await expect(page.locator("#current-path")).toContainText("分詞の形容詞的用法（現在分詞） ＞ 各論");

  // カテゴリ切替はホームからのみ行えるため、一度概論へ戻る。
  await page.getByRole("button", { name: "概論へ戻る" }).click();

  // 仮定法は概論へ戻ってから切り替えたので、独立して概論のまま保持されている。
  await switchCourse(page, "subjunctive");
  await expect(page.locator("#current-path")).toContainText("仮定法 ＞ 概論");
});

test("未着手なら最初の各論を案内する", async ({ page }) => {
  await expect(page.getByRole("button", { name: "条件文と仮定法の違いへ" })).toBeVisible();
});

test("問題途中なら概論から続きの問題へ戻れる", async ({ page }) => {
  await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await page.getByRole("button", { name: /1.*rains/ }).click();
  await page.getByRole("button", { name: "次の問題" }).click();
  await page.getByRole("button", { name: "各論へ戻る" }).click();
  await page.getByRole("button", { name: "概論へ戻る" }).click();

  const action = page.getByRole("button", { name: "続きから：条件文と仮定法の違い 練習問題" });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.locator(".sessionHead")).toContainText("条件文と仮定法の違い");
  await expect(page.getByText(/問題 2 \/ 3/)).toBeVisible();
});

test("全単元回答済みで要復習なら最初の弱点結果へ案内する", async ({ page }) => {
  await seedProgress(page, {
    courseId: "subjunctive",
    stage: 0,
    question: 0,
    answers: { ...masteredSubjunctiveAnswers, "past-subjunctive": [0, 1, 2] },
    versions: subjunctiveVersions,
    visitedLessons: Object.keys(masteredSubjunctiveAnswers)
  });

  const action = page.getByRole("button", { name: "復習する：仮定法過去" });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.locator(".sessionHead")).toContainText("仮定法過去");
  await expect(page.getByRole("heading", { name: "単元結果" })).toBeVisible();
});

test("全単元マスター済みなら修了テストへ案内する", async ({ page }) => {
  await seedProgress(page, {
    courseId: "subjunctive",
    stage: 0,
    question: 0,
    answers: masteredSubjunctiveAnswers,
    versions: subjunctiveVersions,
    visitedLessons: Object.keys(masteredSubjunctiveAnswers)
  });

  const action = page.getByRole("button", { name: "修了テストへ", exact: true });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.locator(".sessionHead")).toContainText("仮定法");
  await expect(page.getByRole("heading", { name: "修了テスト", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "修了テストを始める" })).toBeVisible();
});

test("コース切替で回答・復習・修了記録を保持する", async ({ page }) => {
  const review = { "past-subjunctive-q1": { wrongCount: 1, leitnerStage: 0, nextReviewAt: null, lastAnsweredAt: "2026-08-11" } };
  const finalChecks = { subjunctive: { bestScore: 20, lastScore: 20, cleared: true, bestTotal: 36 } };
  await seedProgress(page, {
    courseId: "subjunctive",
    stage: 0,
    question: 0,
    answers: { "past-subjunctive": [3, 1, 2] },
    versions: subjunctiveVersions,
    visitedLessons: ["past-subjunctive"],
    review,
    finalChecks
  });

  await switchCourse(page, "participles");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.answers["past-subjunctive"]).toEqual([3, 1, 2]);
  expect(saved.review).toEqual(review);
  expect(saved.finalChecks).toEqual(finalChecks);
});

test("クラウドからの旧形式データもコース位置を補完する", async ({ page }) => {
  const cloudProgress = {
    courseId: "participles",
    stage: 2,
    question: 1,
    answers: { "participles-as-adjectives-present": [1] },
    versions: participlesVersions,
    visitedLessons: ["participles-as-adjectives-present"]
  };
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.route("**/vendor/harness/cloud.js", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: ""
  }));
  await page.addInitScript(progress => {
    window.createCloud = options => ({
      init: async () => {
        options.applyLoaded(progress);
        return { enabled: true, studentId: "student-a" };
      },
      isEnabled: () => true,
      queueSave: () => {}
    });
  }, cloudProgress);
  await page.goto("/?s=student-a&t=token");

  await expect(page.locator("#current-path")).toContainText("分詞 ＞ 分詞の形容詞的用法（現在分詞） ＞ 練習問題");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
  expect(pageErrors).toEqual([]);
});

test("375pxでも概論CTAをキーボードで実行でき横にはみ出さない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const action = page.getByRole("button", { name: "条件文と仮定法の違いへ" });
  await action.focus();
  await expect(action).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#current-path")).toContainText("条件文と仮定法の違い");
  const width = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth);
});

test("1280pxでは内容レールが920px以下の1カラムになる", async ({ page }) => {
  const consoleMessages = [];
  const pageErrors = [];
  page.on("console", message => {
    if (["warning", "error"].includes(message.type())) consoleMessages.push(message.text());
  });
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const metrics = await page.evaluate(() => ({
    sidebarExists: !!document.querySelector(".sidebar"),
    wrapWidth: document.querySelector(".wrap").getBoundingClientRect().width
  }));
  expect(metrics.sidebarExists).toBe(false);
  expect(metrics.wrapWidth).toBeLessThanOrEqual(920);
  expect(consoleMessages).toEqual([]);
  expect(pageErrors).toEqual([]);
});
