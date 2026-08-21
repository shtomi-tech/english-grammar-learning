import { test, expect } from "@playwright/test";

const STORAGE_KEY = "englishGrammarLearning.v3";

async function freshHome(page) {
  await page.goto("/#/c/subjunctive");
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
  "bare-infinitive": 3,
  "perception-bare-infinitive": 1,
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
  "bare-infinitive": [0, 0, 0],
  "perception-bare-infinitive": [0, 0, 1],
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

  test("回答後は判定・正解・完成文・ポイントを分けて表示する", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();

    await expect(page.locator(".feedbackVerdict")).toHaveText("○ 正解");
    await expect(page.locator(".feedbackAnswer")).toContainText("rains");
    await expect(page.locator(".feedbackSentence")).toContainText("rains");
    await expect(page.locator(".feedbackSentence .blankFill")).toHaveText("rains");
    await expect(page.locator(".feedbackPoint h4")).toHaveText("ポイント");
  });

  test("空所のない問題では完成文ブロックを表示しない", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").nth(0).click();
    await page.getByRole("button", { name: "次の問題" }).click();
    await page.locator(".choice").nth(0).click();
    await page.getByRole("button", { name: "次の問題" }).click();
    await expect(page.locator(".questionText")).toContainText("選びなさい");
    await page.locator(".choice").nth(2).click();

    await expect(page.locator(".feedbackSentence")).toHaveCount(0);
    await expect(page.locator(".feedbackPoint")).toBeVisible();
  });

  test("回答後に日本語訳と一行ルールを表示する", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();

    await expect(page.locator(".feedbackTranslation")).toContainText("明日は雨の可能性が高い");
    await expect(page.locator(".feedbackTakeaway")).toContainText("現実に起こり得る未来の条件");
  });

  test("図解を表示し、320pxでは縦積みにする", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    await page.locator(".choice").first().click();

    await expect(page.locator(".feedbackDiagram")).toBeVisible();
    await expect(page.locator(".feedbackDiagram")).toHaveAttribute("role", "group");
    await expect(page.locator(".feedbackDiagramLabel")).toContainText("現実的な条件");
    const columns = await page.locator(".feedbackDiagram").evaluate(element =>
      getComputedStyle(element).gridTemplateColumns.trim().split(/\\s+/).length
    );
    expect(columns).toBe(1);
  });
});

test.describe("各論の常時表示", () => {
  test("各論の節は折りたたみUIを持たず、見出しと本文を表示する", async ({ page }) => {
    await openInversionLesson(page);
    const sections = page.locator(".section");
    await expect(sections).toHaveCount(3);
    await expect(page.locator("details.section")).toHaveCount(0);
    await expect(page.locator(".section summary")).toHaveCount(0);
    for (let i = 0; i < await sections.count(); i++) {
      await expect(sections.nth(i).locator(".sectionHeading")).toBeVisible();
    }
  });

  test("発展内容も操作なしで最初から表示される", async ({ page }) => {
    await openInversionLesson(page);
    const second = page.locator(".section").nth(1);
    await expect(second.locator(".sectionHeading")).toBeVisible();
    await expect(second.locator(".sectionBody")).toBeVisible();
  });

  test("説明の見出しはキーボードで閉じる操作を持たない", async ({ page }) => {
    await openInversionLesson(page);
    const interactiveAttrs = await page.locator(".sectionHeading").evaluateAll(elements => elements.map(element => ({
      role: element.getAttribute("role"),
      tabindex: element.getAttribute("tabindex")
    })));
    expect(interactiveAttrs.every(attrs => attrs.role === null && attrs.tabindex === null)).toBe(true);
  });

  test("節を持たない各論ではdetails.sectionが存在せず本文がそのまま表示される", async ({ page }) => {
    await freshHome(page);
    await page.locator(".unitList .lessonCard").filter({ hasText: "仮定法過去" }).first().click();
    await expect(page.locator("details.section")).toHaveCount(0);
    await expect(page.locator(".flashCard")).toContainText("仮定法過去は");
  });

  test("320pxでも全節が表示され、横スクロールが発生しない", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openInversionLesson(page);
    await expect(page.locator(".section .sectionBody")).toHaveCount(3);
    await expect(page.locator(".section .sectionBody").nth(2)).toBeVisible();
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
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toHaveClass(/active/);
    await expect(steps.nth(0)).toHaveAttribute("aria-current", "step");
    await expect(steps.nth(1)).toHaveClass(/locked/);
    await expect(steps.nth(1)).toHaveAttribute("aria-disabled", "true");
    await expect(steps.nth(2)).toHaveClass(/locked/);
  });

  test("練習問題へ進むと各論がcleared、練習がactiveになる", async ({ page }) => {
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await page.getByRole("button", { name: "3問に挑戦" }).click();
    const steps = page.locator(".stepBar .step");
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toHaveClass(/cleared/);
    await expect(steps.nth(1)).toHaveClass(/active/);
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

  test("単元結果では結果がactiveになり、単元をまたいでも3段階を保つ", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 2,
      question: 3,
      answers: { "conditionals-vs-subjunctive": [0, 1, 2] },
      versions: subjunctiveVersions,
      visitedLessons: ["conditionals-vs-subjunctive"],
      courseStructureVersions: { subjunctive: 2 }
    });
    await expect(page.locator(".stepBar .step")).toHaveCount(3);
    await expect(page.locator(".stepBar .step.active")).toHaveText("結果");

    await page.evaluate(key => {
      const saved = JSON.parse(localStorage.getItem(key));
      saved.stage = 4;
      saved.question = 0;
      localStorage.setItem(key, JSON.stringify(saved));
    }, STORAGE_KEY);
    await page.reload();
    await expect(page.locator(".stepBar .step")).toHaveCount(3);
    await expect(page.locator(".stepBar .step.active")).toHaveText("練習");
  });

  test("今日の復習・修了テストにステップバーを出さない", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 25,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      courseStructureVersions: { subjunctive: 2 }
    });
    await expect(page.locator(".stepBar")).toHaveCount(0);
    await page.getByRole("button", { name: "修了テストを始める" }).click();
    await expect(page.locator(".stepBar")).toHaveCount(0);

    await page.evaluate(key => {
      const saved = JSON.parse(localStorage.getItem(key));
      saved.stage = 0;
      saved.reviewSession = {
        order: ["conditionals-vs-subjunctive-q1"],
        index: 0,
        correctCount: 0,
        answers: []
      };
      localStorage.setItem(key, JSON.stringify(saved));
    }, STORAGE_KEY);
    await page.reload();
    await expect(page.locator(".stepBar")).toHaveCount(0);
  });
});

test.describe("学習セッション画面の構造", () => {
  test("回答直後に正誤パネルがビューポート内へ入り、次の操作はその後ろに来る", async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 1280, height: 900 },
      { width: 375, height: 812 },
      { width: 320, height: 800 }
    ]) {
      await page.setViewportSize(viewport);
      await freshHome(page);
      await page.locator('[data-stage="1"]').first().click();
      await page.getByRole("button", { name: "3問に挑戦" }).click();
      await page.locator(".choice").first().click();

      const verdict = await page.locator(".feedbackVerdict").boundingBox();
      expect(verdict?.y, `${viewport.width}x${viewport.height} feedback top`).toBeGreaterThanOrEqual(0);
      expect(verdict?.y, `${viewport.width}x${viewport.height} feedback bottom`).toBeLessThan(viewport.height);
      const feedback = await page.locator(".feedback").boundingBox();
      const next = await page.locator(".quizNextAction").boundingBox();
      expect(next?.y).toBeGreaterThan(feedback?.y ?? -1);
    }
  });

  test("保存状態はセッション画面内に1つだけ表示される", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await freshHome(page);
    await page.locator('[data-stage="1"]').first().click();
    await expect(page.locator("#save-status")).toBeVisible();
    await expect(page.locator(".sessionBar #save-status")).toHaveCount(1);
    await expect(page.locator(".savedState")).toHaveCount(0);
  });

  test("レビュー中でもstickyの一覧へ戻るでホームへ戻れる", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: {},
      reviewSession: {
        order: ["conditionals-vs-subjunctive-q1"],
        index: 0,
        correctCount: 0,
        answers: []
      }
    });
    await expect(page.locator(".sessionBar")).toContainText("今日の復習");
    await page.getByRole("button", { name: "一覧へ戻る" }).click();
    await expect(page.locator("#homePanel")).toBeVisible();
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
    await page.goto("/#/c/subjunctive");

    const assessmentCard = page.locator(".assessmentCard");
    await expect(assessmentCard).not.toHaveClass(/is-unlocking/);
    await expect(assessmentCard).toContainText("挑戦可能");
  });
});

test.describe("修了後のホーム推薦", () => {
  test("修了テストCLEAR結果から次カテゴリへ直接進める", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 25,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      courseStructureVersions: { subjunctive: 2 },
      finalChecks: { subjunctive: finalRecord(36, 36, true) },
      finalRun: {
        courseId: "subjunctive",
        order: ["conditionals-vs-subjunctive-q1"],
        index: 1,
        correctCount: 1,
        answers: [0]
      }
    });
    await page.goto("/#/c/subjunctive/final");

    const action = page.getByRole("button", { name: "分詞の学習を始める", exact: true });
    await expect(action).toBeVisible();
    await action.click();

    await expect(page).toHaveURL(/#\/c\/participles\/l\/participles-as-adjectives-present$/);
    await expect(page.locator(".sessionBar")).toContainText("分詞");
  });

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
    const action = page.getByRole("button", { name: "分詞の学習を始める" });
    await expect(action).toBeVisible();
    await action.click();
    await expect(page.locator("#current-path")).toContainText("カタログ / 分詞 / 分詞の形容詞的用法（現在分詞） / 各論");
    await expect(page.getByRole("button", { name: "修了テストへ", exact: true })).toHaveCount(0);
  });

  test("ホームの塗りCTAは学習途中・CLEAR後・全カテゴリCLEAR後も1つだけ", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: {
        "conditionals-vs-subjunctive": [0, 1, 2],
        "past-subjunctive": [0]
      },
      versions: subjunctiveVersions,
      visitedLessons: ["conditionals-vs-subjunctive", "past-subjunctive"]
    });
    await expect(page.locator(".recommend .cta")).toHaveCount(1);
    await expect(page.locator(".reviewMission .cta")).toHaveCount(0);

    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: { ...subjunctiveVersions, ...participlesVersions, ...infinitivesVersions },
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      finalChecks: { subjunctive: finalRecord(36, 36, true) }
    });
    await expect(page.locator(".recommend .cta")).toHaveCount(1);
    await expect(page.locator(".reviewMission .cta")).toHaveCount(0);

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
        infinitives: finalRecord(42, 42, true)
      },
      review: reviewForAnswers(masteredAnswers, "past-subjunctive-q1")
    });
    await expect(page.locator(".recommend .cta")).toHaveCount(1);
    await expect(page.locator(".reviewMission .cta")).toHaveCount(0);
  });

  test("復習カードは今日やる量を主表示し、内訳を折りたためる", async ({ page }) => {
    await seedProgress(page, {
      courseId: "subjunctive",
      stage: 0,
      question: 0,
      answers: masteredSubjunctiveAnswers,
      versions: subjunctiveVersions,
      visitedLessons: Object.keys(masteredSubjunctiveAnswers),
      review: reviewForAnswers(masteredSubjunctiveAnswers)
    });

    await expect(page.locator(".reviewMission .reviewTodayCount")).toHaveText("今日やる：0問");
    const breakdown = page.locator(".reviewMission .reviewBreakdown");
    await expect(breakdown).toHaveJSProperty("open", false);
    await expect(breakdown.locator("summary")).toBeVisible();
    await breakdown.locator("summary").click();
    await expect(breakdown.locator(".reviewMetrics")).toBeVisible();
    await expect(breakdown.locator(".intervalGrid")).toBeVisible();
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

    const action = page.getByRole("button", { name: "続きから：分詞", exact: true });
    await expect(action).toBeVisible();
    await action.click();

    await expect(page.locator("#current-path")).toContainText("カタログ / 分詞 / 分詞の形容詞的用法（現在分詞） / 練習問題");
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
        infinitives: finalRecord(42, 42, true)
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
        infinitives: finalRecord(42, 42, true)
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
        infinitives: finalRecord(42, 42, true)
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

  test("各論の説明は常時表示のままである", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openInversionLesson(page);
    await expect(page.locator("details.section")).toHaveCount(0);
    await expect(page.locator(".section .sectionBody")).toHaveCount(3);
    await expect(page.locator(".section .sectionBody").nth(1)).toBeVisible();
  });
});
