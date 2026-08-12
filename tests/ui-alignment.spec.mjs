import { test, expect } from "@playwright/test";

// kobun-vocab-learning と同じ役割トークン値（styles.css の正本と一致させる）。
const EXPECTED_TOKENS = {
  "--color-canvas": "#faf9f5",
  "--color-surface-primary": "#efe9de",
  "--color-surface-subtle": "#f5f0e8",
  "--color-ink-primary": "#141413",
  "--color-ink-secondary": "#615c54",
  "--color-accent": "#a9583e",
  "--color-success": "#136b31",
  "--color-danger": "#b42318",
};
const EXPECTED_RADII = {
  "--radius-container": "12px",
  "--radius-control": "8px",
  "--radius-pill": "999px",
};

async function freshHome(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe("デザイントークン", () => {
  test("kobun-vocab-learningと同じ役割トークン値を:rootに持つ", async ({ page }) => {
    await freshHome(page);
    const values = await page.evaluate((names) => {
      const style = getComputedStyle(document.documentElement);
      const out = {};
      for (const name of names) out[name] = style.getPropertyValue(name).trim();
      return out;
    }, Object.keys(EXPECTED_TOKENS));
    for (const [name, expected] of Object.entries(EXPECTED_TOKENS)) {
      expect(values[name], `${name} の値`).toBe(expected);
    }
  });

  test("コンテナ12px・操作8px・番号円形のradius体系を持つ", async ({ page }) => {
    await freshHome(page);
    const values = await page.evaluate((names) => {
      const style = getComputedStyle(document.documentElement);
      const out = {};
      for (const name of names) out[name] = style.getPropertyValue(name).trim();
      return out;
    }, Object.keys(EXPECTED_RADII));
    for (const [name, expected] of Object.entries(EXPECTED_RADII)) {
      expect(values[name], `${name} の値`).toBe(expected);
    }
  });

  test("内容レールの上限が920pxである", async ({ page }) => {
    await freshHome(page);
    const containerMax = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--container-max").trim()
    );
    expect(containerMax).toBe("920px");
  });
});

test.describe("シェル", () => {
  test(".wrap, .top, #homePanel, #sessionPanel が存在する", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator(".wrap")).toHaveCount(1);
    await expect(page.locator(".top")).toHaveCount(1);
    await expect(page.locator("#homePanel")).toHaveCount(1);
    await expect(page.locator("#sessionPanel")).toHaveCount(1);
  });

  test("ホーム表示時はsessionPanelが隠れ、homePanelだけが見える", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator("#homePanel")).toBeVisible();
    await expect(page.locator("#sessionPanel")).toBeHidden();
  });

  test("セッション表示時はhomePanelが隠れ、sessionPanelだけが見える", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await expect(page.locator("#sessionPanel")).toBeVisible();
    await expect(page.locator("#homePanel")).toBeHidden();
  });
});

test.describe("ホームとセッション", () => {
  test("ホームに「まずはここから」の主CTAがある", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator("#homePanel .recommend")).toBeVisible();
    await expect(page.getByText("まずはここから")).toBeVisible();
  });

  test("ホームに4指標がある", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator("#homePanel .stats")).toBeVisible();
    await expect(page.locator("#homePanel .stats .stat")).toHaveCount(4);
  });

  test("ホームに単元一覧がある", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator("#homePanel [data-stage]").first()).toBeVisible();
  });

  test("学習画面にsessionHeadとstepBarがある", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await expect(page.locator("#sessionPanel .sessionHead")).toBeVisible();
    await expect(page.locator("#sessionPanel .stepBar")).toBeVisible();
  });
});

test.describe("キーボード操作とレスポンシブCTA", () => {
  test("1〜4キーとEnterだけで練習問題を3問進められる", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();

    for (let i = 0; i < 3; i++) {
      await expect(page.locator(".quiz")).not.toHaveClass(/quiz--answered/);
      await page.keyboard.press("2");
      await expect(page.locator(".quiz")).toHaveClass(/quiz--answered/);
      await expect(page.locator(".feedback")).toBeFocused();
      await page.keyboard.press("Enter");
    }
    await expect(page.getByRole("heading", { name: "単元結果" })).toBeVisible();
  });

  test("IME変換中・修飾キー併用・ボタンフォーカス中はショートカットが発火しない", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();

    await page.locator(".choice").first().focus();
    await page.keyboard.press("2");
    await expect(page.locator(".quiz")).not.toHaveClass(/quiz--answered/);

    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "2", isComposing: true, bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true, bubbles: true }));
    });
    await expect(page.locator(".quiz")).not.toHaveClass(/quiz--answered/);
  });

  test("1280pxでは次への操作が画面下部に固定され、390pxでは固定されない", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();
    await expect(page.locator(".quizNextAction")).toHaveCSS("position", "fixed");

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(".quizNextAction")).toHaveCSS("position", "static");
    const width = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth);
  });
});

test.describe("レスポンシブ・状態・アクセシビリティ", () => {
  for (const width of [320, 390, 768, 1280]) {
    test(`${width}pxで横スクロールが発生せず、コンソール・ページエラーが0件`, async ({ page }) => {
      const consoleMessages = [];
      const pageErrors = [];
      page.on("console", message => { if (["warning", "error"].includes(message.type())) consoleMessages.push(message.text()); });
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await freshHome(page);
      await page.locator('[data-stage="1"]').first().click();
      const width2 = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
      expect(width2.scrollWidth).toBeLessThanOrEqual(width2.clientWidth);
      expect(consoleMessages).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }

  test("画面高760px以下のセッション中は共通ヘッダーを隠す", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await expect(page.locator(".top")).toBeHidden();
    await page.locator('[data-action="go-home"]').click();
    await expect(page.locator(".top")).toBeVisible();
  });

  test("ホームは読み込み後にaria-busyが外れる", async ({ page }) => {
    await freshHome(page);
    await expect(page.locator("#homePanel")).not.toHaveAttribute("aria-busy", "true");
  });

  test("主要な操作要素は44px以上の高さを持つ", async ({ page }) => {
    await freshHome(page);
    const heights = await page.evaluate(() => {
      const targets = [".cta", ".categorySelect", ".unitRow", ".card > summary"];
      return targets.map(sel => {
        const el = document.querySelector(sel);
        return { sel, height: el ? el.getBoundingClientRect().height : null };
      });
    });
    for (const { sel, height } of heights) {
      expect(height, `${sel} の高さ`).not.toBeNull();
      expect(height, `${sel} の高さ`).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("操作ボタンの配置", () => {
  test("1280pxでは.actionsがflexで折り返し・間隔12px・戻るボタンと主CTAが重ならない", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();

    const actions = page.locator("#sessionPanel .actions").first();
    await expect(actions).toBeVisible();
    const style = await actions.evaluate(el => {
      const computed = getComputedStyle(el);
      return { display: computed.display, flexWrap: computed.flexWrap, gap: computed.gap };
    });
    expect(style.display).toBe("flex");
    expect(style.flexWrap).toBe("wrap");
    expect(style.gap).toBe("12px");

    const buttons = actions.locator(":scope > button");
    const backBox = await buttons.nth(0).boundingBox();
    const ctaBox = await buttons.nth(1).boundingBox();
    expect(backBox.x + backBox.width).toBeLessThanOrEqual(ctaBox.x);
  });

  test("640px以下では.actionsが縦並びになり、ボタン・決定操作グループが幅いっぱいになる", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    for (let i = 0; i < 3; i++) {
      await page.locator(".choice").first().click();
      const nextButton = page.getByRole("button", { name: /次の問題|結果を見る/ });
      await nextButton.click();
    }
    await expect(page.getByRole("heading", { name: "単元結果" })).toBeVisible();

    const actions = page.locator("#sessionPanel .actions").first();
    const flexDirection = await actions.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe("column");

    const actionsBox = await actions.boundingBox();
    const topButtons = actions.locator(":scope > button");
    const topCount = await topButtons.count();
    for (let i = 0; i < topCount; i++) {
      const box = await topButtons.nth(i).boundingBox();
      expect(box.width).toBeCloseTo(actionsBox.width, 0);
    }

    const decision = actions.locator(".actionsDecision");
    const decisionBox = await decision.boundingBox();
    expect(decisionBox.width).toBeCloseTo(actionsBox.width, 0);

    const decisionButtons = decision.locator(":scope > button");
    const firstButtonClass = await decisionButtons.first().getAttribute("class");
    expect(firstButtonClass).toContain("cta");

    const width = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth);
  });
});
