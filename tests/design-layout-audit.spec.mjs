import { test, expect } from "@playwright/test";

async function freshCatalog(page) {
  await page.goto("/#/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/#/");
}

async function openLesson(page) {
  await freshCatalog(page);
  await page.locator('.courseCard[data-course="subjunctive"]').click();
  await page.getByRole("button", { name: "条件文と仮定法の違いへ" }).click();
}

test.describe("デザイン監査の修正項目", () => {
  test("カテゴリ詳細では概論の見出しと冒頭段落が初回表示領域に入り、主要見出しとして扱われる", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await freshCatalog(page);
    await page.locator('.courseCard[data-course="subjunctive"]').click();

    const heading = page.locator(".courseOverview h3");
    const firstParagraph = page.locator(".courseOverview > p:not(.hint)").first();
    await expect(heading).toBeVisible();
    await expect(firstParagraph).toBeVisible();
    const metrics = await heading.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { top: rect.top, fontSize: parseFloat(style.fontSize), fontFamily: style.fontFamily };
    });
    const paragraphMetrics = await firstParagraph.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    });
    expect(metrics.top + 31.25).toBeLessThanOrEqual(900);
    expect(paragraphMetrics.top).toBeLessThan(900);
    expect(paragraphMetrics.bottom).toBeLessThanOrEqual(900);
    expect(metrics.fontSize).toBeGreaterThanOrEqual(25);
    expect(metrics.fontFamily).toContain("Georgia");
  });

  test("カテゴリ詳細のカタログ退出ラベルを一覧へ戻るに統一する", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await freshCatalog(page);
    await page.locator('.courseCard[data-course="subjunctive"]').click();

    await expect(page.getByRole("button", { name: "一覧へ戻る", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "カタログへ戻る", exact: true })).toHaveCount(0);
  });

  test("デスクトップと本文内の目次リンクは36px以上の操作領域を持つ", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openLesson(page);
    const desktopHeights = await page.locator(".lessonToc .lessonTocLink").evaluateAll(elements =>
      elements.map(element => element.getBoundingClientRect().height)
    );
    expect(desktopHeights.length).toBe(3);
    for (const height of desktopHeights) expect(height).toBeGreaterThanOrEqual(36);

    await page.setViewportSize({ width: 1000, height: 900 });
    const inlineHeights = await page.locator(".lessonTocInline .lessonTocLink").evaluateAll(elements =>
      elements.map(element => element.getBoundingClientRect().height)
    );
    expect(inlineHeights.length).toBe(3);
    for (const height of inlineHeights) expect(height).toBeGreaterThanOrEqual(36);
  });

  test("320pxの各論セッションバーは意図した2段グリッドになる", async ({ page }) => {
    await openLesson(page);

    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await expect(page.locator(".sessionBar")).toHaveCSS("display", "grid");
      const rows = await page.evaluate(() => {
        const label = document.querySelector(".sessionBar .label").getBoundingClientRect();
        const next = document.querySelector(".sessionBar .sessionNextAction").getBoundingClientRect();
        return { labelTop: label.top, labelHeight: label.height, nextTop: next.top };
      });
      expect(rows.labelHeight).toBeLessThanOrEqual(28);
      expect(rows.nextTop).toBeGreaterThan(rows.labelTop);
    }
  });

  test("選択中カテゴリカードは罫線幅を変えずに状態を示す", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await freshCatalog(page);

    const metrics = await page.locator(".courseCard").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { height: rect.height, borderTopWidth: style.borderTopWidth };
    }));
    expect(metrics[0].borderTopWidth).toBe("1px");
    expect(new Set(metrics.map(item => item.height)).size).toBe(1);
  });
});
