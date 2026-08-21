import { test, expect } from "@playwright/test";

const STORAGE_KEY = "englishGrammarLearning.v3";
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

async function freshHome(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function switchCourse(page, courseId) {
  await page.goto(`/#/c/${courseId}`);
}

async function openUnit(page, index) {
  await freshHome(page);
  await switchCourse(page, "subjunctive");
  await page.locator(".unitList .lessonCard").nth(index).click();
}

async function seedProgress(page, progress) {
  await page.goto("/");
  await page.evaluate(({ key, value }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: STORAGE_KEY, value: progress });
  await page.reload();
}

async function answerQuestions(page, questions) {
  for (const [index, expected] of questions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(expected.answer).click();
    await expect(page.locator(".feedback")).toContainText("正解");
    await expect(page.locator(".feedback")).toContainText(expected.explanationContains);
    await page.getByRole("button", { name: index === questions.length - 1 ? "結果を見る" : "次の問題" }).click();
  }
}

test("仮定法コースは12単元を指定順で持ち、修了テストは単元一覧から独立している", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "subjunctive");

  await expect(page.locator(".unitList .lessonTitle")).toHaveText([
    "条件文と仮定法の違い",
    "仮定法過去",
    "仮定法過去完了",
    "I wish + 仮定法",
    "If only + 仮定法",
    "ミックス仮定法",
    "If it were not for",
    "as if + 仮定法",
    "It is time + 仮定法過去",
    "仮定法未来（should）",
    "仮定法未来（were to）",
    "仮定法の倒置"
  ]);
  await expect(page.locator(".courseAssessment")).toContainText("修了テスト");
});

test("概論は通常の条件文との対比と到達範囲を示す", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "subjunctive");
  await expect(page.locator("#homePanel")).toContainText("if を使う文がすべて仮定法ではありません");
  await expect(page.locator("#homePanel")).toContainText("If I have time tonight, I will read this book.");
  await expect(page.locator("#homePanel")).toContainText("I wish");
  await expect(page.locator("#homePanel")).toContainText("If only");
});

test("条件文と仮定法の違いを3問で確認できる", async ({ page }) => {
  await openUnit(page, 0);
  await expect(page.locator("#sessionPanel")).toContainText("現実に起こり得る条件");
  await expect(page.locator("#sessionPanel")).toContainText("現実から距離を置いた仮定");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "The forecast says rain is likely tomorrow. If it (　　), we will stay home.",
      choices: ["rains", "rained", "had rained", "would rain"],
      answer: 0,
      explanationContains: "現実的な条件"
    },
    {
      text: "I do not know her number. If I (　　) it, I would call her.",
      choices: ["know", "knew", "had known", "will know"],
      answer: 1,
      explanationContains: "現実から距離を置いた仮定"
    },
    {
      text: "「現実に起こり得る未来の条件を表す文」を選びなさい。",
      choices: [
        "If I were you, I would apologize.",
        "If she had studied, she would have passed.",
        "If the train is late, I will call you.",
        "If I had more time, I could help."
      ],
      answer: 2,
      explanationContains: "現実的な条件"
    }
  ]);
  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("仮定法過去・過去完了は時点と標準形を説明する", async ({ page }) => {
  await openUnit(page, 1);
  await expect(page.locator("#sessionPanel")).toContainText("were");
  await expect(page.locator("#sessionPanel")).toContainText("If I was");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "If I (　　) you, I would accept the offer.",
      choices: ["am", "was", "have been", "were"],
      answer: 3,
      explanationContains: "標準"
    },
    {
      text: "If I had enough money, I (　　) a new bicycle.",
      choices: ["will buy", "could buy", "bought", "could have bought"],
      answer: 1,
      explanationContains: "現在の反事実"
    },
    {
      text: "I still have my key. If I lost it, I (　　) able to lock the door.",
      choices: ["will be", "would have been", "wouldn’t be", "am not"],
      answer: 2,
      explanationContains: "現実から距離"
    }
  ]);

  await openUnit(page, 2);
  await expect(page.locator("#sessionPanel")).toContainText("結果の時点");
  await expect(page.locator("#sessionPanel")).toContainText("ミックス仮定法");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "If she (　　) earlier, she would have caught the train.",
      choices: ["leaves", "left", "would leave", "had left"],
      answer: 3,
      explanationContains: "条件節"
    },
    {
      text: "If he had listened to the advice, he (　　) the mistake.",
      choices: ["would avoid", "will avoid", "would have avoided", "avoided"],
      answer: 2,
      explanationContains: "結果節"
    },
    {
      text: "If I had won the lottery last year, I (　　) a new car immediately, but I did not win.",
      choices: ["would buy", "bought", "would have bought", "would have been buying"],
      answer: 2,
      explanationContains: "last year"
    }
  ]);
});

test("I wishとIf onlyを別単元として時点別に練習できる", async ({ page }) => {
  await openUnit(page, 3);
  await expect(page.locator("#sessionPanel")).toContainText("現在の事実に反する願望");
  await expect(page.locator("#sessionPanel")).toContainText("現在の能力");
  await expect(page.locator("#sessionPanel")).toContainText("過去への後悔");
  await expect(page.locator("#sessionPanel")).toContainText("状況の変化");
  await expect(page.locator("#sessionPanel")).not.toContainText("万能");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "I wish I (　　) more free time now.",
      choices: ["have", "had", "had had", "will have"],
      answer: 1,
      explanationContains: "現在の願望"
    },
    {
      text: "I wish I (　　) harder for yesterday’s test.",
      choices: ["study", "studied", "had studied", "would study"],
      answer: 2,
      explanationContains: "過去への後悔"
    },
    {
      text: "I wish it (　　) raining soon.",
      choices: ["stops", "stopped", "would stop", "had stopped"],
      answer: 2,
      explanationContains: "状況の変化"
    }
  ]);

  await openUnit(page, 4);
  await expect(page.locator("#sessionPanel")).toContainText("主節なし");
  await expect(page.locator("#sessionPanel")).toContainText("強く感情的");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "If only she (　　) here with us now!",
      choices: ["is", "were", "had been", "will be"],
      answer: 1,
      explanationContains: "現在の強い願望"
    },
    {
      text: "If only I (　　) play the piano better!",
      choices: ["can", "could", "had", "would have"],
      answer: 1,
      explanationContains: "能力"
    },
    {
      text: "If only we (　　) the earlier train yesterday!",
      choices: ["catch", "caught", "had caught", "would catch"],
      answer: 2,
      explanationContains: "過去の強い後悔"
    }
  ]);
});

test("ミックス仮定法と定型表現の本文・問題を同期する", async ({ page }) => {
  await openUnit(page, 5);
  await expect(page.locator("#sessionPanel")).toContainText("then");
  await expect(page.locator("#sessionPanel")).toContainText("now");
  await expect(page.locator("#sessionPanel")).toContainText("would live");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await expect(page.locator(".questionText")).toHaveText("If I had taken that job, I (　　) in London now.");
  await expect(page.locator(".choice").nth(2)).toContainText("would live");

  await openUnit(page, 6);
  await expect(page.locator("#sessionPanel")).toContainText("Without");
  await expect(page.locator("#sessionPanel")).toContainText("主節と文脈");

  await openUnit(page, 7);
  await expect(page.locator("#sessionPanel")).toContainText("通常の時制");
  await expect(page.locator("#sessionPanel")).toContainText("as if it is going to rain");
  await expect(page.locator("#sessionPanel")).toContainText("but in fact");

  await openUnit(page, 8);
  await expect(page.locator("#sessionPanel")).toContainText("It is time to start the meeting.");
  await expect(page.locator("#sessionPanel")).toContainText("It is time for us to start the meeting.");
  await expect(page.locator("#sessionPanel")).toContainText("まだ始めていない");
});

test("未来のshould・were toと倒置を区別し、倒置を最後に置く", async ({ page }) => {
  await openUnit(page, 9);
  await expect(page.locator("#sessionPanel")).toContainText("慎重・控えめ・改まった");
  await expect(page.locator("#sessionPanel")).not.toContainText("常に客観的確率が低い");
  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await answerQuestions(page, [
    {
      text: "If you (　　) any help, please contact me.",
      choices: ["should need", "should needed", "would need", "had needed"],
      answer: 0,
      explanationContains: "万一"
    },
    {
      text: "If the weather should (　　) worse, we will cancel the game.",
      choices: ["gets", "got", "get", "getting"],
      answer: 2,
      explanationContains: "原形"
    },
    {
      text: "If the train (　　) be delayed, please call me.",
      choices: ["should", "would", "had", "was"],
      answer: 0,
      explanationContains: "義務"
    }
  ]);

  await openUnit(page, 10);
  await expect(page.locator("#sessionPanel")).toContainText("現実的な仮案");
  await expect(page.locator("#sessionPanel")).toContainText("単純な確率の順位");
  await expect(page.locator("#sessionPanel")).toContainText("If we were to reduce the price");

  await openUnit(page, 11);
  await expect(page.locator("#sessionPanel")).toContainText("疑問ではありません");
  await expect(page.locator("#sessionPanel")).toContainText("もし真実を知っていたなら、あなたに伝えていただろうに");
});

test("仮定法コースは36問で、各問題の選択肢と解説が空でない", async ({ page }) => {
  await seedProgress(page, {
    courseId: "subjunctive",
    stage: 0,
    question: 0,
    answers: masteredSubjunctiveAnswers,
    versions: subjunctiveVersions,
    visitedLessons: Object.keys(masteredSubjunctiveAnswers),
    courseStructureVersions: { subjunctive: 2 }
  });
  await page.goto("/#/c/subjunctive");
  await page.locator(".assessmentCard").click();
  await expect(page.locator("#sessionPanel")).toContainText("全36問からランダムに出題します。");

  const content = await page.evaluate(() => curriculum.courses.find(course => course.id === "subjunctive"));
  expect(content.lessons).toHaveLength(12);
  expect(content.lessons.flatMap(lesson => lesson.questions)).toHaveLength(36);
  for (const lesson of content.lessons) {
    expect(Number.isInteger(lesson.version)).toBeTruthy();
    expect(lesson.version).toBeGreaterThan(0);
    for (const question of lesson.questions) {
      expect(question.text.trim()).not.toBe("");
      expect(question.explanation.trim()).not.toBe("");
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices.every(choice => choice.trim())).toBeTruthy();
    }
  }
});

test("構造バージョン不一致では仮定法の位置だけを概論へ戻す", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(({ key, versions }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      courseId: "subjunctive",
      stage: 11,
      question: 1,
      answers: { "past-subjunctive": [3, 1, 2] },
      versions,
      visitedLessons: ["past-subjunctive"],
      coursePositions: {
        subjunctive: { stage: 11, question: 1 },
        participles: { stage: 2, question: 1 }
      },
      courseStructureVersions: { subjunctive: 1 }
    }));
  }, { key: STORAGE_KEY, versions: subjunctiveVersions });
  await page.reload();

  await expect(page.locator("#current-path")).toHaveText("カタログ");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.coursePositions.subjunctive).toEqual({ stage: 0, question: 0 });
  expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
  expect(saved.courseStructureVersions.subjunctive).toBe(2);
  expect(saved.answers["past-subjunctive"]).toEqual([3, 1, 2]);
});

test("クラウド由来の旧構造も仮定法の位置だけを概論へ戻す", async ({ page }) => {
  const cloudProgress = {
    courseId: "subjunctive",
    stage: 11,
    question: 1,
    answers: { "past-subjunctive": [3, 1, 2] },
    versions: subjunctiveVersions,
    visitedLessons: ["past-subjunctive"],
    coursePositions: {
      subjunctive: { stage: 11, question: 1 },
      participles: { stage: 2, question: 1 }
    },
    courseStructureVersions: { subjunctive: 1 }
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

  await expect(page.locator("#current-path")).toHaveText("カタログ");
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.coursePositions.subjunctive).toEqual({ stage: 0, question: 0 });
  expect(saved.coursePositions.participles).toEqual({ stage: 2, question: 1 });
  expect(saved.courseStructureVersions.subjunctive).toBe(2);
  expect(saved.answers["past-subjunctive"]).toEqual([3, 1, 2]);
  expect(pageErrors).toEqual([]);
});
