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

async function switchCourse(page, courseId) {
  await page.goto(`/#/c/${courseId}`);
}

async function openParticipleUnit(page, index) {
  await freshHome(page);
  await switchCourse(page, "participles");
  await page.locator(".unitList .lessonCard").nth(index).click();
}

// 各問題を順に確認し、正解を選んで解説をチェックしながら回答する。
// 選ばれた正解の選択肢テキストを返すので、能動・受動の対比確認に使える。
async function answerQuizQuestions(page, expectedQuestions) {
  const chosenTexts = [];
  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(expected.answer).click();
    await expect(page.locator(".feedback")).toContainText("正解");
    await expect(page.locator(".feedback")).toContainText(expected.explanationContains);
    chosenTexts.push(expected.choices[expected.answer]);
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) {
      await expect(page.locator(".quiz")).toBeVisible();
    }
  }
  return chosenTexts;
}

const participlesVersions = {
  "participles-as-adjectives-present": 2,
  "participles-as-adjectives-past": 2,
  "emotion-verb-participles": 2,
  "participle-complements": 1,
  "perception-verb-participles": 1
};

const masteredParticiplesAnswers = {
  "participles-as-adjectives-present": [1, 1, 2],
  "participles-as-adjectives-past": [1, 2, 2],
  "emotion-verb-participles": [1, 2, 0],
  "participle-complements": [1, 1, 1],
  "perception-verb-participles": [0, 1, 1]
};

test("分詞コースの単元順は補語・知覚動詞まで拡張されている", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "participles");

  await expect(page.locator(".unitList .lessonTitle")).toHaveText([
    "分詞の形容詞的用法（現在分詞）",
    "分詞の形容詞的用法（過去分詞）",
    "感情動詞の分詞化",
    "補語としての分詞",
    "知覚動詞 + 目的語 + 分詞"
  ]);
  await expect(page.locator(".courseAssessment")).toContainText("修了テスト");
});

test("概論は補語・知覚動詞への到達範囲と、分詞構文を扱わないことを明示する", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "participles");

  await expect(page.locator("#homePanel")).toContainText("補語");
  await expect(page.locator("#homePanel")).toContainText("知覚動詞");
  await expect(page.locator("#homePanel")).toContainText("分詞構文は扱いません");
});

test("分詞概論は説明対象と動作との関係を4段階で図解する", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "participles");

  const visual = page.locator("#homePanel .courseOverview .overviewVisual");
  await expect(visual).toHaveCount(1);
  await expect(visual).toHaveClass(/overviewVisual--decision/);
  await expect(visual.locator(".overviewDecisionAnchor")).toContainText("説明する語");
  await expect(visual.locator(".overviewDecisionAnchor")).toContainText("動作との関係");
  await expect(visual.locator(".overviewVisualLead")).toContainText("何を説明し");
  await expect(visual.locator(".overviewDecisionStep")).toHaveCount(4);
  await expect(visual).toContainText("分詞を見つける");
  await expect(visual).toContainText("する側／受ける側・動作後の状態");
  await expect(visual).toContainText("まず「何を説明しているか」を見る");

  const ids = await visual.evaluate(element => ({
    labelledBy: element.getAttribute("aria-labelledby"),
    leadId: element.querySelector(".overviewVisualLead")?.id,
    hasControls: Boolean(element.querySelector("details, summary, button, input, select"))
  }));
  expect(ids.labelledBy).toBe(ids.leadId);
  expect(ids.hasControls).toBe(false);
});

test("分詞5単元は図解の必須スロットと常時表示の詳説を維持する", async ({ page }) => {
  const expected = [
    { index: 0, headingCount: 4 },
    { index: 1, headingCount: 5 },
    { index: 2, headingCount: 0 },
    { index: 3, headingCount: 4 },
    { index: 4, headingCount: 4 }
  ];

  for (const item of expected) {
    await openParticipleUnit(page, item.index);
    const visual = page.locator("#sessionPanel .lessonVisual");
    await expect(visual).toHaveCount(1);
    await expect(visual.locator(".lessonVisualAnchor")).toHaveCount(1);
    await expect(visual.locator(".lessonVisualLead")).toHaveCount(1);
    await expect(visual.locator(".lessonVisualBody")).toHaveCount(1);
    await expect(visual.locator(".lessonVisualPrompt")).toHaveCount(1);
    await expect(visual.locator("details, summary, button, input, select, .sectionHeading")).toHaveCount(0);
    await expect(page.locator("#sessionPanel section.section")).toHaveCount(item.headingCount);
    await expect(page.locator("#sessionPanel .lessonToc .lessonTocLink")).toHaveCount(item.headingCount);

    const ids = await visual.evaluate(element => ({
      labelledBy: element.getAttribute("aria-labelledby"),
      leadId: element.querySelector(".lessonVisualLead")?.id
    }));
    expect(ids.labelledBy).toBe(ids.leadId);
  }
});

test("分詞各論の図解は単元ごとの判断軸を示す", async ({ page }) => {
  const expected = [
    { index: 0, markers: ["名詞が動作をする", "-ing", "基本"] },
    { index: 1, markers: ["動作を受ける", "動作後の状態", "fallen leaves"] },
    { index: 2, markers: ["感情を起こす側", "感情を感じる側"] },
    { index: 3, markers: ["主語の状態", "目的語の状態"] },
    { index: 4, markers: ["動作の途中", "動作を受ける", "一連の動作"] }
  ];

  for (const item of expected) {
    await openParticipleUnit(page, item.index);
    const visual = page.locator("#sessionPanel .lessonVisual");
    for (const marker of item.markers) {
      await expect(visual).toContainText(marker);
    }
  }
});

test("過去分詞の壊れた窓カードにKoboyo SVGを添え、文法ラベルを保つ", async ({ page }) => {
  await openParticipleUnit(page, 1);
  const card = page.locator("#sessionPanel .lessonVisualCard").filter({ hasText: "a broken window" });
  await expect(card).toHaveCount(1);
  await expect(card).toContainText("動作を受ける");

  const icon = card.locator(".lessonVisualIcon");
  await expect(icon).toHaveCount(1);
  await expect(icon).toHaveAttribute("aria-hidden", "true");
  await expect(icon.locator("svg")).toHaveAttribute("data-koboyo-slug", "window-shown-whole-broken");
  await expect(icon.locator("svg")).toHaveAttribute("viewBox", /\S+/);
});

test("分詞の意味対応が必要な各論カードにKoboyo SVGを添える", async ({ page }) => {
  const expected = [
    { index: 0, text: "the girl dancing on the stage", slug: "person-dancing" },
    { index: 2, text: "The movie was exciting.", slug: "solid-movie-projector" },
    { index: 3, selector: ".lessonVisualAside", text: "window = broken", slug: "window-shown-whole-broken" },
    { index: 4, text: "O が動作する", slug: "dog-running" }
  ];

  for (const item of expected) {
    await openParticipleUnit(page, item.index);
    const target = page.locator("#sessionPanel " + (item.selector || ".lessonVisualCard, #sessionPanel .lessonVisualSlot")).filter({ hasText: item.text });
    await expect(target).toHaveCount(1);
    const asset = target.locator('svg[data-koboyo-slug="' + item.slug + '"]');
    await expect(asset).toHaveCount(1);
    const icon = asset.locator("..");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(asset).toHaveAttribute("data-koboyo-slug", item.slug);
    await expect(asset).toHaveAttribute("viewBox", /\S+/);
  }
});

test("適合度中のKoboyo候補を具体例へ対応付ける", async ({ page }) => {
  const expected = [
    { index: 2, selector: ".lessonVisualCard", text: "I was excited.", slug: "older-person-looking-excited" },
    { index: 3, selector: ".lessonVisualAside", text: "door = locked", slug: "locked-door" },
    { index: 4, selector: "blockquote", text: "We heard someone knocking on the door.", slug: "knocking-door" }
  ];

  for (const item of expected) {
    await openParticipleUnit(page, item.index);
    const target = page.locator("#sessionPanel " + item.selector).filter({ hasText: item.text });
    await expect(target).toHaveCount(1);
    const asset = target.locator('[data-koboyo-slug="' + item.slug + '"]');
    await expect(asset).toHaveCount(1);
    const icon = asset.locator("..");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(asset).toHaveAttribute("data-koboyo-slug", item.slug);
    await expect(asset).toHaveAttribute("src", new RegExp(item.slug + "\\.svg$"));
  }
});

test("分詞図解の一般式と補語関係を正確に示す", async ({ page }) => {
  await openParticipleUnit(page, 3);
  const complementVisual = page.locator("#sessionPanel .lessonVisual");
  await expect(complementVisual).toContainText("S = C");
  await expect(complementVisual).toContainText("O = C");
  await expect(complementVisual).toContainText("Cは主語の状態");
  await expect(complementVisual).toContainText("Cは目的語の状態");
  await expect(complementVisual).not.toContainText("S → C");
  await expect(complementVisual).not.toContainText("O → C");

  await openParticipleUnit(page, 4);
  const perceptionVisual = page.locator("#sessionPanel .lessonVisual");
  await expect(perceptionVisual.locator(".lessonVisualAnchor")).toContainText("知覚動詞 + O + -ing / p.p. / 原形");
  await expect(perceptionVisual.locator(".lessonVisualAnchor")).not.toContainText("see / hear + O");
  await expect(page.locator("#sessionPanel")).toContainText("see / hear / watch / feel / notice");
  await expect(page.locator("#sessionPanel section.section")).toHaveCount(4);
  await expect(page.locator("#sessionPanel .lessonToc .lessonTocLink")).toHaveCount(4);
});

test("分詞の概論と各論図解は主要幅で横スクロールせず、モバイルで収まる", async ({ page }) => {
  const widths = [320, 375, 640, 1280];
  const complexUnits = new Set([1, 3, 4]);

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await freshHome(page);
    await switchCourse(page, "participles");

    const overviewMetrics = await page.locator("#homePanel .overviewVisual").evaluate(element => ({
      height: element.getBoundingClientRect().height,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(overviewMetrics.scrollWidth).toBeLessThanOrEqual(overviewMetrics.clientWidth);
    expect(overviewMetrics.height).toBeLessThanOrEqual(720);

    for (let index = 0; index < 5; index += 1) {
      await openParticipleUnit(page, index);
      const metrics = await page.locator("#sessionPanel .lessonVisual").evaluate(element => {
        const cards = Array.from(element.querySelectorAll(".lessonVisualCard, .lessonVisualSlot"));
        const heights = cards.map(card => card.getBoundingClientRect().height);
        return {
          height: element.getBoundingClientRect().height,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          cardHeightDelta: heights.length > 1 ? Math.max(...heights) - Math.min(...heights) : 0
        };
      });
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
      expect(metrics.height).toBeLessThan(complexUnits.has(index) ? 720 : 650);
      if (width === 320) expect(metrics.cardHeightDelta).toBeLessThanOrEqual(36);
    }
  }
});

test("図解追加後も分詞の回答・復習・既読・修了テスト・位置を保持する", async ({ page }) => {
  const reviewRecord = {
    wrongCount: 1,
    leitnerStage: 2,
    nextReviewAt: "2030-01-01T00:00:00.000Z",
    lastAnsweredAt: "2026-08-23T00:00:00.000Z"
  };
  await seedProgress(page, {
    courseId: "participles",
    stage: 2,
    question: 1,
    answers: masteredParticiplesAnswers,
    versions: participlesVersions,
    visitedLessons: Object.keys(masteredParticiplesAnswers),
    review: { "participles-as-adjectives-present-q1": reviewRecord },
    finalChecks: { participles: { bestScore: 15, lastScore: 15, cleared: true, bestTotal: 15 } },
    coursePositions: { participles: { stage: 2, question: 1 } },
    courseStructureVersions: {}
  });

  await page.goto("/#/c/participles/l/participles-as-adjectives-present");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.answers["participles-as-adjectives-present"]).toEqual(masteredParticiplesAnswers["participles-as-adjectives-present"]);
  expect(saved.review["participles-as-adjectives-present-q1"]).toEqual(reviewRecord);
  expect(saved.visitedLessons).toEqual(Object.keys(masteredParticiplesAnswers));
  expect(saved.finalChecks.participles).toEqual({ bestScore: 15, lastScore: 15, cleared: true, bestTotal: 15 });
  expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
  expect(saved.versions).toMatchObject(participlesVersions);
  expect(saved.courseStructureVersions.participles).toBeUndefined();
});

test("概論と過去分詞単元は動作完了後の状態をfallen leavesで示す", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "participles");
  await expect(page.locator("#homePanel")).toContainText("fallen leaves");
  await expect(page.locator("#homePanel")).toContainText("動作が完了した後の状態");

  await openParticipleUnit(page, 1);
  await expect(page.locator("#sessionPanel")).toContainText("fallen leaves");
  await expect(page.locator("#sessionPanel")).toContainText("動作が完了した後の状態");
});

test("現在分詞・過去分詞単元の前置・後置説明は絶対規則として示さない", async ({ page }) => {
  await openParticipleUnit(page, 0);
  await expect(page.locator("#sessionPanel")).toContainText("通常");
  await expect(page.locator("#sessionPanel")).toContainText("基本形");

  await openParticipleUnit(page, 1);
  await expect(page.locator("#sessionPanel")).toContainText("通常");
  await expect(page.locator("#sessionPanel")).toContainText("基本形");
});

test("感情動詞単元はexciteの本来の意味と自然な訳を示す", async ({ page }) => {
  await openParticipleUnit(page, 2);
  await expect(page.locator("#sessionPanel")).toContainText("人をわくわくさせる");
  await expect(page.locator("#sessionPanel")).toContainText("その映画はわくわくするものでした");
});

test("補語単元は主格補語・目的格補語を説明し、能動・受動を対比する3問を持つ", async ({ page }) => {
  await openParticipleUnit(page, 3);
  await expect(page.locator("#sessionPanel")).toContainText("主格補語");
  await expect(page.locator("#sessionPanel")).toContainText("目的格補語");

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const chosen = await answerQuizQuestions(page, [
    {
      text: "The door remained (　　) all night.",
      choices: ["locking", "locked", "lock", "to lock"],
      answer: 1,
      explanationContains: "door"
    },
    {
      text: "We kept the engine (　　) while we waited.",
      choices: ["run", "running", "ran", "to run"],
      answer: 1,
      explanationContains: "engine"
    },
    {
      text: "Please keep the door (　　) when you leave.",
      choices: ["locking", "locked", "lock", "to locking"],
      answer: 1,
      explanationContains: "door"
    }
  ]);

  await expect(page.locator(".score")).toHaveText("3 / 3");
  expect(chosen).toContain("running");
  expect(chosen).toContain("locked");
});

test("知覚動詞単元は現在分詞・過去分詞・原形不定詞との対比を示し、3問が一意に解ける", async ({ page }) => {
  await openParticipleUnit(page, 4);
  await expect(page.locator("#sessionPanel")).toContainText("現在分詞");
  await expect(page.locator("#sessionPanel")).toContainText("過去分詞");
  await expect(page.locator("#sessionPanel")).toContainText("原形不定詞");

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const chosen = await answerQuizQuestions(page, [
    {
      text: "When I looked outside, I saw a dog (　　) across the yard.",
      choices: ["running", "run", "ran", "to run"],
      answer: 0,
      explanationContains: "dog"
    },
    {
      text: "While I was studying, I heard someone (　　) on the door.",
      choices: ["knocked", "knocking", "to knock", "was knocking"],
      answer: 1,
      explanationContains: "someone"
    },
    {
      text: "I heard my name (　　) from the back of the room.",
      choices: ["calling", "called", "call", "to call"],
      answer: 1,
      explanationContains: "name"
    }
  ]);

  await expect(page.locator(".score")).toHaveText("3 / 3");
  expect(chosen).toContain("running");
  expect(chosen).toContain("called");
});

test("修了テストの総問題数が15問になる", async ({ page }) => {
  await seedProgress(page, {
    courseId: "participles",
    stage: 0,
    question: 0,
    answers: masteredParticiplesAnswers,
    versions: participlesVersions,
    visitedLessons: Object.keys(masteredParticiplesAnswers)
  });

  await page.goto("/#/c/participles");
  await page.locator(".assessmentCard").click();
  await expect(page.locator("#sessionPanel")).toContainText("全15問からランダムに出題します。");
});
