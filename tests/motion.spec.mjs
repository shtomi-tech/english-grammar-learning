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
  // 単元の位置ではなく名称で開く。順序変更の影響を受けない。
  await page.locator(".unitList .lessonCard").filter({ hasText: "仮定法の倒置" }).click();
}

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

const participlesVersions = {
  "participles-as-adjectives-present": 2,
  "participles-as-adjectives-past": 2,
  "emotion-verb-participles": 2,
  "participle-complements": 1,
  "perception-verb-participles": 1
};

const infinitivesVersions = {
  "infinitive-nominal-use": 2,
  "infinitive-adjective-use": 2,
  "infinitive-adverbial-purpose": 1,
  "infinitive-adverbial-reason": 1,
  "infinitive-adverbial-result": 2,
  "infinitive-adverbial-degree": 1,
  "infinitive-logical-subject-for": 1,
  "infinitive-of-adjective-evaluation": 1,
  "dummy-subject-it": 2,
  "dummy-object-it": 2,
  "bare-infinitive": 1,
  "infinitive-negative-form": 2,
  "infinitive-perfect-form": 2
};

// 最終単元「仮定法の倒置」だけを未着手のまま残した、あと1単元でマスターのfixture。
const almostMasteredAnswers = {
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
  "future-subjunctive-were-to": [0, 2, 1]
};

const masteredSubjunctiveAnswers = {
  ...almostMasteredAnswers,
  "subjunctive-inversion": [1, 2, 3]
};

const masteredParticiplesAnswers = {
  "participles-as-adjectives-present": [1, 1, 2],
  "participles-as-adjectives-past": [1, 2, 2],
  "emotion-verb-participles": [1, 2, 0],
  "participle-complements": [1, 1, 1],
  "perception-verb-participles": [0, 1, 1]
};

const masteredInfinitivesAnswers = {
  "infinitive-nominal-use": [0, 0, 3],
  "infinitive-adjective-use": [1, 0, 2],
  "infinitive-adverbial-purpose": [1, 0, 2],
  "infinitive-adverbial-reason": [1, 1, 1],
  "infinitive-adverbial-result": [1, 1, 2],
  "infinitive-adverbial-degree": [0, 0, 0],
  "infinitive-logical-subject-for": [0, 0, 2],
  "infinitive-of-adjective-evaluation": [1, 1, 2],
  "dummy-subject-it": [0, 0, 2],
  "dummy-object-it": [1, 0, 1],
  "bare-infinitive": [0, 0, 1],
  "infinitive-negative-form": [1, 1, 0],
  "infinitive-perfect-form": [2, 1, 2]
};

function finalRecord(score, total, cleared) {
  return { bestScore: score, lastScore: score, cleared, bestTotal: total };
}

function reviewForAnswers(answers, dueQuestionId = null) {
  return Object.fromEntries(Object.keys(answers).flatMap(lessonId => [1, 2, 3].map(number => {
    const questionId = `${lessonId}-q${number}`;
    return [questionId, {
      wrongCount: 0,
      leitnerStage: 0,
      nextReviewAt: questionId === dueQuestionId ? "2000-01-01" : "2999-12-31",
      lastAnsweredAt: "2026-08-01"
    }];
  })));
}

const masteredAnswers = { ...masteredSubjunctiveAnswers, ...masteredParticiplesAnswers, ...masteredInfinitivesAnswers };

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
  test("各論の節は初期表示ですべてopenになり、矢印も回転する", async ({ page }) => {
    await openInversionLesson(page);
    const sections = page.locator("details.section");
    await expect(sections).toHaveCount(3);

    const statesAndTransforms = await sections.evaluateAll(els => els.map(el => ({
      open: el.open,
      transform: getComputedStyle(el.querySelector("summary"), "::before").transform
    })));
    expect(statesAndTransforms.map(section => section.open)).toEqual([true, true, true]);
    for (const section of statesAndTransforms) {
      expect(section.transform).not.toBe("none");
    }
  });

  test("summaryクリックで開閉し、矢印の回転がopen属性と一致する", async ({ page }) => {
    await openInversionLesson(page);
    const second = page.locator("details.section").nth(1);
    const summaryTransform = () => second.locator("summary").evaluate(el => getComputedStyle(el, "::before").transform);

    await second.locator("summary").click();
    expect(await second.evaluate(el => el.open)).toBe(false);
    // 回転はtransition中のため、最終状態に落ち着くまでポーリングする。
    await expect.poll(summaryTransform).toBe("none");

    await second.locator("summary").click();
    expect(await second.evaluate(el => el.open)).toBe(true);
    await expect.poll(summaryTransform).not.toBe("none");
  });

  test("Spaceキーで開閉できる", async ({ page }) => {
    await openInversionLesson(page);
    const third = page.locator("details.section").nth(2);
    await third.locator("summary").focus();
    await page.keyboard.press("Space");
    expect(await third.evaluate(el => el.open)).toBe(false);
    await page.keyboard.press("Space");
    expect(await third.evaluate(el => el.open)).toBe(true);
  });

  test("節を持たない各論ではdetails.sectionが存在せず本文がそのまま表示される", async ({ page }) => {
    await freshHome(page);
    await page.locator(".unitList .lessonCard").filter({ hasText: "仮定法過去" }).first().click();
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
    await page.locator(".choice").nth(3).click(); // q3 正解 index3（ここでコース全体がマスターになる）
    await page.getByRole("button", { name: "結果を見る" }).click();

    await page.getByRole("button", { name: "修了テストへ" }).click();
    await page.getByRole("button", { name: "一覧へ戻る" }).click();

    const assessmentCard = page.locator(".assessmentCard");
    await expect(assessmentCard).toHaveClass(/is-unlocking/);
    await expect(assessmentCard).toContainText("修了テストが解放されました");
  });

  test("リロード後は同じ解放状態でもunlockモーションを再演しない", async ({ page }) => {
    const masteredAll = { ...almostMasteredAnswers, "subjunctive-inversion": [1, 2, 3] };
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredAll,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredAll)
    });

    const assessmentCard = page.locator(".assessmentCard");
    await expect(assessmentCard).not.toHaveClass(/is-unlocking/);
    await expect(assessmentCard).toContainText("挑戦可能");
  });
});

test.describe("修了後のホーム推薦", () => {
  test("仮定法CLEAR後は未CLEARの分詞を主導線にする", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      finalChecks: { subjunctive: finalRecord(36, 36, true) }
    });

    await expect(page.getByText("仮定法 修了", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "次は「分詞」を学びましょう" })).toBeVisible();
    await expect(page.locator(".recommend")).toContainText("動詞の形を使って");
    await expect(page.getByRole("button", { name: "分詞の学習を始める" })).toBeVisible();
    await expect(page.getByRole("button", { name: "修了テストへ", exact: true })).toHaveCount(0);
  });

  test("推薦先に途中進捗があれば保存位置を復元する", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: { ...masteredSubjunctiveAnswers, "participles-as-adjectives-present": [1] },
      versions: { ...subjunctiveVersions, ...participlesVersions, ...infinitivesVersions },
      visitedLessons: [...Object.keys(masteredSubjunctiveAnswers), "participles-as-adjectives-present"],
      finalChecks: { subjunctive: finalRecord(36, 36, true) },
      coursePositions: {
        subjunctive: { stage: 0, question: 0 },
        participles: { stage: 2, question: 1 }
      }
    });

    const action = page.getByRole("button", { name: "続きから：分詞" });
    await expect(action).toBeVisible();
    await action.click();

    await expect(page.locator("#current-path")).toContainText("分詞 ＞ 分詞の形容詞的用法（現在分詞） ＞ 練習問題");
    await expect(page.getByText("問題 2 / 3")).toBeVisible();
    const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    expect(saved.courseId).toBe("participles");
    expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
  });

  test("修了テスト不合格時は別カテゴリではなく再挑戦を主導線にする", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      finalChecks: { subjunctive: finalRecord(28, 36, false) }
    });

    await expect(page.locator(".recommend")).toContainText("前回の得点：28 / 36");
    await expect(page.getByRole("button", { name: "修了テストにもう一度挑戦する" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /次は「/ })).toHaveCount(0);
  });

  test("問題数が変わった古いCLEARは次カテゴリ推薦に使わない", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      finalChecks: { subjunctive: finalRecord(35, 35, true) }
    });

    await expect(page.getByRole("button", { name: "修了テストにもう一度挑戦する" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /次は「/ })).toHaveCount(0);
  });

  test("全カテゴリCLEARかつ期限到来問題があれば上部から復習を始められる", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredAnswers,
      versions: { ...subjunctiveVersions, ...participlesVersions, ...infinitivesVersions },
      visitedLessons: Object.keys(masteredAnswers),
      finalChecks: {
        subjunctive: finalRecord(36, 36, true),
        participles: finalRecord(15, 15, true),
        infinitives: finalRecord(39, 39, true)
      },
      review: reviewForAnswers(masteredAnswers, "past-subjunctive-q1")
    });

    await expect(page.getByRole("heading", { name: "すべての文法カテゴリを修了しました" })).toBeVisible();
    await page.getByRole("button", { name: "今日の復習を始める" }).click();
    await expect(page.locator("#current-path")).toHaveText("今日の復習");
    await expect(page.getByRole("heading", { name: "今日の復習" })).toBeVisible();
  });

  test("全カテゴリCLEARかつ期限到来問題がなければ無効な復習CTAを置かない", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredAnswers,
      versions: { ...subjunctiveVersions, ...participlesVersions, ...infinitivesVersions },
      visitedLessons: Object.keys(masteredAnswers),
      finalChecks: {
        subjunctive: finalRecord(36, 36, true),
        participles: finalRecord(15, 15, true),
        infinitives: finalRecord(39, 39, true)
      },
      review: reviewForAnswers(masteredAnswers)
    });

    await expect(page.getByRole("heading", { name: "すべての文法カテゴリを修了しました" })).toBeVisible();
    await expect(page.locator('.recommend [data-action="start-review"]')).toHaveCount(0);
    await expect(page.locator(".recommend")).toContainText("今すぐ復習する問題はありません");
  });

  test("320px幅でも完了後のCTAが操作可能で横にはみ出さない", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredAnswers,
      versions: { ...subjunctiveVersions, ...participlesVersions, ...infinitivesVersions },
      visitedLessons: Object.keys(masteredAnswers),
      finalChecks: {
        subjunctive: finalRecord(36, 36, true),
        participles: finalRecord(15, 15, true),
        infinitives: finalRecord(39, 39, true)
      },
      review: reviewForAnswers(masteredAnswers)
    });

    const button = page.getByRole("button", { name: "修了テストにもう一度挑戦する" });
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(48);
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth);
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
    expect(await second.evaluate(el => el.open)).toBe(false);
    const transitionDuration = await second.locator("summary").evaluate(
      el => getComputedStyle(el, "::before").transitionDuration
    );
    expect(transitionDuration).toBe("0s");
  });
});
