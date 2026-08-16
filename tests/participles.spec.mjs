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
  await page.locator(".courseNavigator > summary").click();
  await page.locator(`.courseCard[data-course="${courseId}"]`).click();
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

  await page.locator(".assessmentCard").click();
  await expect(page.locator("#sessionPanel")).toContainText("全15問からランダムに出題します。");
});
