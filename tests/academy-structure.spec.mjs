import { test, expect } from "@playwright/test";

const STORAGE_KEY = "englishGrammarLearning.v3";

async function freshCatalog(page) {
  await page.goto("/#/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/#/");
}

test.describe("Academy構造", () => {
  test("初期画面はカタログとして3カテゴリを常設する", async ({ page }) => {
    await freshCatalog(page);

    await expect(page.locator(".catalogPage")).toBeVisible();
    await expect(page.locator(".courseNavigator")).toHaveCount(0);
    await expect(page.locator(".catalogPage .courseCard")).toHaveCount(3);
    await expect(page.locator(".catalogPage .courseCard").first()).toContainText("カテゴリ");
    await expect(page.locator(".catalogPage .courseCard").first()).toContainText("約");
    await expect(page.locator("#current-path")).toHaveText("カタログ");
  });

  test("カテゴリカードから開始前のカテゴリ詳細へ移動できる", async ({ page }) => {
    await freshCatalog(page);

    await page.locator('.courseCard[data-course="subjunctive"]').click();

    await expect(page).toHaveURL(/#\/c\/subjunctive$/);
    await expect(page.locator(".courseDetail")).toBeVisible();
    await expect(page.locator(".courseDetail")).toContainText("学習内容");
    await expect(page.locator(".courseSection")).toHaveCount(4);
    await expect(page.locator(".courseDetail .courseOverview")).toBeVisible();
    await expect(page.locator(".catalogPage")).toHaveCount(0);
  });

  test("カテゴリ詳細の各論は章付きアウトラインと自動目次を持つ", async ({ page }) => {
    await freshCatalog(page);
    await page.locator('.courseCard[data-course="subjunctive"]').click();
    await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();

    await expect(page).toHaveURL(/#\/c\/subjunctive\/l\/conditionals-vs-subjunctive$/);
    await expect(page.locator(".lessonWorkspace")).toBeVisible();
    await expect(page.locator(".lessonOutline")).toBeVisible();
    await expect(page.locator(".lessonOutline .outlineSection")).toHaveCount(4);
    await expect(page.locator(".lessonOutline a[aria-current='page']")).toContainText("条件文と仮定法の違い");
    await expect(page.locator(".lessonToc .lessonTocLink")).toHaveCount(3);
    await expect(page.locator(".lessonTocInline")).toHaveCount(1);
  });

  test("練習画面ではサイドバーを隠しても本文の列位置を保つ", async ({ page }) => {
    await freshCatalog(page);
    await page.locator('.courseCard[data-course="subjunctive"]').click();
    await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();
    const lessonX = await page.locator(".lessonWorkspaceMain").evaluate(el => el.getBoundingClientRect().left);

    await page.getByRole("button", { name: "3問に挑戦" }).click();

    await expect(page.locator(".lessonOutline")).toHaveCount(0);
    await expect(page.locator(".lessonToc")).toHaveCount(0);
    const practiceX = await page.locator(".lessonWorkspaceMain").evaluate(el => el.getBoundingClientRect().left);
    expect(practiceX).toBeCloseTo(lessonX, 0);
  });

  test("ハッシュがクエリと共存し、未知ハッシュはカタログへ戻る", async ({ page }) => {
    await page.goto("/?s=student-a&t=token#/c/participles/l/participles-as-adjectives-past/practice");
    await expect(page.locator(".quiz")).toBeVisible();
    await expect(page.locator("#current-path")).toContainText("分詞");

    await page.goto("/#/unknown-route");
    await expect(page.locator(".catalogPage")).toBeVisible();
    await expect(page).toHaveURL(/#\/$/);
  });

  test("1100px未満では目次とアウトラインが折りたたみに降格する", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 900 });
    await freshCatalog(page);
    await page.locator('.courseCard[data-course="subjunctive"]').click();
    await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();

    await expect(page.locator(".lessonOutline")).toBeVisible();
    await expect(page.locator(".lessonToc")).toBeHidden();
    await expect(page.locator(".lessonTocInline")).toBeVisible();

    await page.setViewportSize({ width: 899, height: 900 });
    await expect(page.locator(".lessonOutline")).toBeHidden();
    await expect(page.locator(".sessionOutlineMobile")).toBeVisible();
    const width = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth);
  });

  test("復習中にブラウザで戻るとカタログへ退出する", async ({ page }) => {
    await page.goto("/#/");
    await page.evaluate(({ key, value }) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify(value));
    }, {
      key: STORAGE_KEY,
      value: {
        courseId: "subjunctive",
        stage: 0,
        question: 0,
        answers: { "conditionals-vs-subjunctive": [0, 1, 2] },
        versions: { "conditionals-vs-subjunctive": 1 },
        visitedLessons: ["conditionals-vs-subjunctive"],
        review: {
          "conditionals-vs-subjunctive-q1": { wrongCount: 1, leitnerStage: 0, nextReviewAt: "2000-01-01", lastAnsweredAt: "2026-08-01" },
          "conditionals-vs-subjunctive-q2": { wrongCount: 0, leitnerStage: 0, nextReviewAt: "2999-12-31", lastAnsweredAt: "2026-08-01" },
          "conditionals-vs-subjunctive-q3": { wrongCount: 0, leitnerStage: 0, nextReviewAt: "2999-12-31", lastAnsweredAt: "2026-08-01" }
        },
        courseStructureVersions: { subjunctive: 2 }
      }
    });
    await page.reload();

    await page.getByRole("button", { name: "今回の1問を復習する" }).click();
    await expect(page).toHaveURL(/#\/review$/);

    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.locator(".catalogPage")).toBeVisible();
    await expect(page.locator("#sessionPanel")).toHaveClass(/hide/);

    await page.reload();
    await expect(page.locator(".catalogPage")).toBeVisible();
    await expect(page.locator("#sessionPanel")).toHaveClass(/hide/);
  });

  test("結果から解き直すとURLも練習へ戻る", async ({ page }) => {
    await page.goto("/#/c/subjunctive/l/conditionals-vs-subjunctive/result");
    await page.evaluate(({ key, value }) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify(value));
    }, {
      key: STORAGE_KEY,
      value: {
        courseId: "subjunctive",
        stage: 2,
        question: 3,
        answers: { "conditionals-vs-subjunctive": [0, 0, 2] },
        versions: { "conditionals-vs-subjunctive": 1 },
        visitedLessons: ["conditionals-vs-subjunctive"],
        courseStructureVersions: { subjunctive: 2 }
      }
    });
    await page.reload();

    await page.getByRole("button", { name: "3問をもう一度解く" }).click();

    await expect(page).toHaveURL(/#\/c\/subjunctive\/l\/conditionals-vs-subjunctive\/practice$/);
    await expect(page.locator(".quiz")).toBeVisible();
    await expect(page.getByText("問題 1 / 3")).toBeVisible();
  });
});
