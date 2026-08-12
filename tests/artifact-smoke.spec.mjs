import { test, expect } from "@playwright/test";

// _site（デプロイ対象の成果物）そのものに対するスモークテスト。
// 開発ツリーではなく実際にPagesへ配布されるファイル一式を検証する。

test.describe("_site 成果物スモークテスト", () => {
  test("/ がHTTP 200で応答する", async ({ request }) => {
    const response = await request.get("/");
    expect(response.status()).toBe(200);
  });

  test("/styles.css?v=0.3.0 がHTTP 200で応答する", async ({ request }) => {
    const response = await request.get("/styles.css?v=0.3.0");
    expect(response.status()).toBe(200);
  });

  test("初期表示でページエラーが発生せず、#homePanelが表示され、CSSが適用される", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    await page.goto("/");
    await expect(page.locator("#homePanel")).toBeVisible();

    const containerMax = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--container-max").trim()
    );
    expect(containerMax).toBe("920px");

    const wrapWidth = await page.locator(".wrap").evaluate(el => el.getBoundingClientRect().width);
    expect(wrapWidth).toBeLessThanOrEqual(920);

    expect(pageErrors).toEqual([]);
  });
});
