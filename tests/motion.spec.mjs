import { test, expect } from "@playwright/test";

const STORAGE_KEY = "englishGrammarLearning.v3";

async function freshHome(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function seedProgress(page, progress) {
  await page.goto("/");
  await page.evaluate(({ key, value }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: STORAGE_KEY, value: progress });
  await page.reload();
}

async function openInversionLesson(page) {
  await freshHome(page);
  // 仮定法の倒置（3節、最初のみopen）。未着手のためユニット一覧から直接遷移する。
  await page.locator(".unitList .unitRow").nth(5).click();
}

const subjunctiveVersions = {
  "past-perfect-subjunctive": 2,
  "future-subjunctive-should": 1,
  "future-subjunctive-were-to": 1,
  "subjunctive-inversion": 1,
  "if-it-were-not-for": 1,
  "as-if-subjunctive": 1,
  "it-is-time-subjunctive-past": 1
};

// 「It is time + 仮定法過去」だけを未着手のまま残した、あと1単元でマスターのfixture。
const almostMasteredAnswers = {
  "past-subjunctive": [3, 1, 2],
  "past-perfect-subjunctive": [3, 2, 2],
  "mixed-subjunctive": [2, 2, 0],
  "future-subjunctive-should": [0, 2, 3],
  "future-subjunctive-were-to": [0, 2, 1],
  "subjunctive-inversion": [1, 2, 3],
  "if-it-were-not-for": [1, 2, 1],
  "as-if-subjunctive": [1, 2, 3]
};

test.describe("正誤フィードバックのモーション", () => {
  test("正解の選択肢にsettle、不正解の選択肢にshakeのアニメーションが設定される", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").nth(1).click(); // 正解はindex3（were）。誤答を選び correct/wrong を同時に出す。

    await expect(page.locator(".choice.correct")).toBeVisible();
    await expect(page.locator(".choice.wrong")).toBeVisible();

    const anim = await page.evaluate(() => {
      const correct = document.querySelector(".choice.correct");
      const wrong = document.querySelector(".choice.wrong");
      return {
        correctAfter: getComputedStyle(correct, "::after").animationName,
        wrongName: getComputedStyle(wrong).animationName
      };
    });
    expect(anim.correctAfter).not.toBe("none");
    expect(anim.wrongName).not.toBe("none");
  });

  test("アニメーションの完了を待たずに次の問題へ進める", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();
    await page.getByRole("button", { name: "次の問題" }).click();
    await expect(page.getByText(/問題 2 \/ 3/)).toBeVisible();
  });

  test("回答直後はfeedbackへフォーカスが移り、role=statusを持つ", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();
    const feedback = page.locator(".feedback");
    await expect(feedback).toHaveAttribute("role", "status");
    await expect(feedback).toBeFocused();
  });
});

test.describe("各論のAccordion", () => {
  test("最初の節はopenで矢印が回転し、以降の節はclosedで矢印は初期状態", async ({ page }) => {
    await openInversionLesson(page);
    const sections = page.locator("details.section");
    await expect(sections).toHaveCount(3);
    expect(await sections.nth(0).evaluate(el => el.open)).toBe(true);
    expect(await sections.nth(1).evaluate(el => el.open)).toBe(false);
    expect(await sections.nth(2).evaluate(el => el.open)).toBe(false);

    const transforms = await sections.evaluateAll(els =>
      els.map(el => getComputedStyle(el.querySelector("summary"), "::before").transform)
    );
    expect(transforms[0]).not.toBe("none");
    expect(transforms[1]).toBe("none");
    expect(transforms[2]).toBe("none");
  });

  test("summaryクリックで開閉し、矢印の回転がopen属性と一致する", async ({ page }) => {
    await openInversionLesson(page);
    const second = page.locator("details.section").nth(1);
    const summaryTransform = () => second.locator("summary").evaluate(el => getComputedStyle(el, "::before").transform);

    await second.locator("summary").click();
    expect(await second.evaluate(el => el.open)).toBe(true);
    // 回転はtransition中のため、最終状態に落ち着くまでポーリングする。
    await expect.poll(summaryTransform).not.toBe("none");

    await second.locator("summary").click();
    expect(await second.evaluate(el => el.open)).toBe(false);
    await expect.poll(summaryTransform).toBe("none");
  });

  test("Spaceキーで開閉できる", async ({ page }) => {
    await openInversionLesson(page);
    const third = page.locator("details.section").nth(2);
    await third.locator("summary").focus();
    await page.keyboard.press("Space");
    expect(await third.evaluate(el => el.open)).toBe(true);
    await page.keyboard.press("Space");
    expect(await third.evaluate(el => el.open)).toBe(false);
  });

  test("節を持たない各論ではdetails.sectionが存在せず本文がそのまま表示される", async ({ page }) => {
    await freshHome(page);
    await page.getByRole("button", { name: "仮定法過去へ" }).click();
    await expect(page.locator("details.section")).toHaveCount(0);
    await expect(page.locator(".flashCard")).toContainText("仮定法過去は");
  });

  test("320pxで全節を開いても横スクロールが発生しない", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openInversionLesson(page);
    const summaries = page.locator("details.section summary");
    const count = await summaries.count();
    for (let i = 0; i < count; i++) {
      const details = page.locator("details.section").nth(i);
      if (!(await details.evaluate(el => el.open))) await summaries.nth(i).click();
    }
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth);
  });
});

test.describe("Step Progress", () => {
  test("各論段階ではactiveが1つ、それより先の段階はlockedになる", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    const steps = page.locator(".stepBar .step");
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toHaveClass(/cleared/);
    await expect(steps.nth(1)).toHaveClass(/active/);
    await expect(steps.nth(1)).toHaveAttribute("aria-current", "step");
    await expect(steps.nth(2)).toHaveClass(/locked/);
    await expect(steps.nth(2)).toHaveAttribute("aria-disabled", "true");
    await expect(steps.nth(3)).toHaveClass(/locked/);
  });

  test("練習問題へ進むと各論がcleared、練習がactiveになる", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    const steps = page.locator(".stepBar .step");
    await expect(steps.nth(1)).toHaveClass(/cleared/);
    await expect(steps.nth(2)).toHaveClass(/active/);
  });

  test("ホームからセッションへ最初に入るときはsettleモーションを再生しない", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await expect(page.locator(".stepBar .step.active")).not.toHaveClass(/is-settling/);
  });

  test("段階が進んだ瞬間だけ新しいactive stepにsettleモーションが付く", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await expect(page.locator(".stepBar .step.active")).toHaveClass(/is-settling/);
  });

  test("同じ段階内で再描画してもsettleモーションを再演しない", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click(); // practice段階のまま再描画
    await expect(page.locator(".stepBar .step.active")).not.toHaveClass(/is-settling/);
  });
});

test.describe("修了テスト解放のunlock", () => {
  test("最後の1単元が全問正解した瞬間だけ修了テスト行にis-unlockingが付く", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: almostMasteredAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(almostMasteredAnswers)
    });

    await page.locator("#homePanel .recommend button").click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").nth(1).click(); // q1 正解 index1
    await page.getByRole("button", { name: "次の問題" }).click();
    await page.locator(".choice").nth(2).click(); // q2 正解 index2
    await page.getByRole("button", { name: "次の問題" }).click();
    await page.locator(".choice").nth(1).click(); // q3 正解 index1（ここでコース全体がマスターになる）
    await page.getByRole("button", { name: "結果を見る" }).click();

    await page.getByRole("button", { name: "修了テストへ" }).click();
    await page.getByRole("button", { name: "一覧へ戻る" }).click();

    const finalRow = page.locator(".unitRow").last();
    await expect(finalRow).toHaveClass(/is-unlocking/);
    await expect(finalRow).toContainText("修了テストが解放されました");
  });

  test("リロード後は同じ解放状態でもunlockモーションを再演しない", async ({ page }) => {
    const masteredAll = { ...almostMasteredAnswers, "it-is-time-subjunctive-past": [1, 2, 1] };
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredAll,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredAll)
    });

    const finalRow = page.locator(".unitRow").last();
    await expect(finalRow).not.toHaveClass(/is-unlocking/);
    await expect(finalRow).toContainText("挑戦可能");
  });
});

test.describe("保存状態のモーション", () => {
  test("匿名時は端末保存の文言のまま、保存settleクラスを持たない", async ({ page }) => {
    await freshHome(page);
    const status = page.locator("#save-status");
    await expect(status).toHaveText("端末に自動保存済み");
    await expect(status).not.toHaveClass(/save-status-saved/);
  });

  test("クラウド保存成功でsave-status-savedが付く", async ({ page }) => {
    await page.route("**/vendor/harness/cloud.js", route => route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: ""
    }));
    await page.addInitScript(() => {
      window.createCloud = options => ({
        init: async () => {
          options.onStatus("保存中…", "syncing");
          options.onStatus("保存済み", "ok");
          return { enabled: true, studentId: "student-a" };
        },
        isEnabled: () => true,
        queueSave: () => {}
      });
    });
    await page.goto("/?s=student-a&t=token");
    await expect(page.locator("#save-status")).toHaveClass(/save-status-saved/);
  });
});

test.describe("reduced motion", () => {
  // test.use({ reducedMotion: "reduce" }) はこの環境のPlaywright(1.62.1)では
  // matchMedia に反映されないため、各テストで明示的に emulateMedia を呼ぶ。
  test("prefers-reduced-motionでは正誤・feedback・step・ボタンのアニメーション/トランジションが0sになる", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();

    const durations = await page.evaluate(() => {
      const targets = [".choice.correct", ".choice.wrong", ".feedback", ".step.active", ".cta"];
      return targets.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const style = getComputedStyle(el);
        return { sel, animation: style.animationDuration, transition: style.transitionDuration };
      }).filter(Boolean);
    });
    expect(durations.length).toBeGreaterThan(0);
    for (const d of durations) {
      expect(d.animation, `${d.sel} animation-duration`).toBe("0s");
      expect(d.transition, `${d.sel} transition-duration`).toBe("0s");
    }
  });

  test("各論のdetails開閉（矢印のtransition）が即時になる", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openInversionLesson(page);
    const second = page.locator("details.section").nth(1);
    await second.locator("summary").click();
    expect(await second.evaluate(el => el.open)).toBe(true);
    const transitionDuration = await second.locator("summary").evaluate(
      el => getComputedStyle(el, "::before").transitionDuration
    );
    expect(transitionDuration).toBe("0s");
  });
});
