import { test, expect } from "@playwright/test";

async function freshHome(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function switchCourse(page, courseId) {
  await page.goto(`/#/c/${courseId}`);
}

test("不定詞カテゴリから名詞的用法の3問まで進められる", async ({ page }) => {
  await freshHome(page);

  await switchCourse(page, "infinitives");
  await expect(page.getByRole("heading", { name: "不定詞", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "不定詞とは", exact: true })).toBeVisible();
  await expect(page.locator("#homePanel")).toContainText("使役動詞と知覚動詞の後ろに");

  await page.getByRole("button", { name: "不定詞の名詞的用法へ" }).click();
  await expect(page.getByRole("heading", { name: "不定詞の名詞的用法" })).toBeVisible();
  await expect(page.locator(".flashCard").getByText("形式主語")).toHaveCount(0);

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await expect(page.locator(".quiz")).toHaveCount(1);
  await expect(page.locator(".choice")).toHaveCount(4);
});

test("不定詞の単元は前提知識が積み上がる順に並ぶ", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "infinitives");

  await expect(page.locator(".unitList .lessonTitle")).toHaveText([
    "不定詞の名詞的用法",
    "不定詞の形容詞的用法",
    "不定詞の副詞的用法（目的）",
    "不定詞の副詞的用法（原因・理由）",
    "不定詞の副詞的用法（結果）",
    "不定詞の副詞的用法（程度・結果）",
    "不定詞の意味上の主語",
    "人の性質を表す形容詞と不定詞",
    "形式主語構文",
    "形式目的語構文",
    "使役動詞と原形不定詞",
    "知覚動詞と原形不定詞",
    "不定詞の否定形",
    "完了不定詞"
  ]);
  await expect(page.locator(".courseAssessment")).toContainText("修了テスト");
});

test("名詞的用法には既存アプリで使用済みの主語・目的語・補語の問題を使う", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "infinitives");
  await page.getByRole("button", { name: "不定詞の名詞的用法へ" }).click();
  await page.getByRole("button", { name: "3問に挑戦" }).click();

  const expectedQuestions = [
    {
      text: "To read books is useful. の To read books の働きは？",
      choices: ["名詞句として主語", "動詞isの目的語", "名詞booksを修飾する形容詞", "前置詞句"],
      answer: 0
    },
    {
      text: "空所に入る最も適切な語句を選びなさい。Fast food restaurants are popular because many people want (    ).",
      choices: ["to eat quickly and cheaply", "eat quickly and cheaply", "eaten quickly and cheaply", "the eating quickly and cheaply"],
      answer: 0
    },
    {
      text: "空所に入る最も適切な語句を選びなさい。My dream is (    ) a lot of sick people in the hospital.",
      choices: ["helped with", "taking care", "to be needed", "to look after"],
      answer: 3
    }
  ];

  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(expected.answer).click();
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) {
      await expect(page.locator(".quiz")).toBeVisible();
    }
  }

  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("形式主語構文はto不定詞を中心に学び、that節を発展として開ける", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "infinitives");
  await page.getByRole("button", { name: /形式主語構文/ }).click();

  await expect(page.getByRole("heading", { name: "形式主語構文" })).toBeVisible();
  await expect(page.getByText("It is + 形容詞 + to + 動詞の原形", { exact: true })).toBeVisible();
  const advanced = page.locator("details.section").filter({ hasText: "that節を使う形（発展）" });
  await expect(advanced.locator("summary")).toHaveText("that節を使う形（発展）");
  await expect(advanced.locator(".formula")).toBeHidden();
  await advanced.locator("summary").click();
  await expect(advanced.locator(".formula")).toBeVisible();

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const expectedQuestions = [
    {
      text: "It is important to check the answer. の It の働きは？",
      choices: ["内容上の主語を後ろへ送る形式主語", "天候だけを表す形式上の主語", "動詞checkが直接取る目的語", "前置詞toが取る目的語"]
    },
    {
      text: "It is difficult (　　) the answer.",
      choices: ["to find", "finding", "find", "found"]
    },
    {
      text: "形式主語構文が使われている文を選びなさい。",
      choices: [
        "It is raining now.",
        "I found it on the desk.",
        "It is useful to read every day.",
        "It is my new bag."
      ]
    }
  ];

  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(index === 2 ? 2 : 0).click();
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) await expect(page.locator(".quiz")).toBeVisible();
  }

  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("形式目的語構文の解説と3問を確認できる", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "infinitives");
  await page.getByRole("button", { name: /形式目的語構文/ }).click();

  await expect(page.getByRole("heading", { name: "形式目的語構文" })).toBeVisible();
  await expect(page.getByText("主語 + 動詞 + it + 形容詞 + to + 動詞の原形", { exact: true })).toBeVisible();
  await expect(page.getByText("it が形式目的語", { exact: false }).first()).toBeVisible();
  await expect(page.locator("#session-content blockquote").filter({ hasText: "私には、その質問に答えるのが難しいと分かりました。" })).toBeVisible();
  const advanced = page.locator("details.section").filter({ hasText: "that節を使う形（発展）" });
  await expect(advanced.locator("summary")).toHaveText("that節を使う形（発展）");
  await expect(advanced.locator(".formula")).toBeHidden();
  await advanced.locator("summary").click();
  await expect(advanced.locator(".formula")).toBeVisible();

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const expectedQuestions = [
    {
      text: "A lot of people may feel it easy (    ) this question.",
      choices: ["answer", "to answer", "answering", "for answering"],
      answer: 1
    },
    {
      text: "Lisa thinks it important (    ) up halfway.",
      choices: ["not to give", "not give", "not giving", "not to giving"],
      answer: 0
    },
    {
      text: "An unexpected snowstorm made it (    ) for them to reach the summit.",
      choices: ["possible", "impossible", "easy", "important"],
      answer: 1
    }
  ];

  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(expected.answer).click();
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) await expect(page.locator(".quiz")).toBeVisible();
  }

  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("不定詞の形容詞的用法の解説と3問を確認できる", async ({ page }) => {
  await freshHome(page);
  await switchCourse(page, "infinitives");
  await page.getByRole("button", { name: /不定詞の形容詞的用法/ }).click();

  await expect(page.getByRole("heading", { name: "不定詞の形容詞的用法" })).toBeVisible();
  await expect(page.getByText("名詞 + to + 動詞の原形", { exact: true })).toBeVisible();
  await expect(page.locator("#session-content").getByText("to drink", { exact: true })).toBeVisible();
  await expect(page.locator("#session-content")).toContainText("I need a book to read.");
  await expect(page.locator("#session-content")).not.toContainText("I need a book to study.");

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const expectedQuestions = [
    {
      text: "I need something (　　) before the trip.",
      choices: ["eat", "to eat", "eating", "eaten"],
      answer: 1
    },
    {
      text: "I need someone (　　) me with this work.",
      choices: ["to help", "helping", "helped", "to be helped"],
      answer: 0
    },
    {
      text: "不定詞の形容詞的用法が使われている文を選びなさい。",
      choices: [
        "To get enough sleep is important.",
        "She went to bed early to get enough sleep.",
        "I have a lot of homework to do.",
        "He wants to get enough sleep."
      ],
      answer: 2
    }
  ];

  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").nth(expected.answer).click();
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) await expect(page.locator(".quiz")).toBeVisible();
  }

  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("不定詞の各単元を学び、それぞれの3問に取り組める", async ({ page }) => {
  const lessons = [
    {
      title: "不定詞の副詞的用法（目的）",
      marker: "主語 + 動詞 ... + to + 動詞の原形",
      questions: [
        {
          text: "She went to the library (　　) English.",
          choices: ["study", "to study", "studying", "studied"],
          answer: 1
        },
        {
          text: "She spoke quietly so as (　　) the baby.",
          choices: ["not to wake", "not wake", "to not waking", "not waking"],
          answer: 0
        },
        {
          text: "目的を表す副詞的用法が使われている文を選びなさい。",
          choices: [
            "I have homework to do.",
            "To read books is useful.",
            "He went outside to get some fresh air.",
            "I need a pen to write with."
          ],
          answer: 2
        }
      ]
    },
    {
      title: "不定詞の副詞的用法（原因・理由）",
      marker: "主語 + be動詞 + 感情を表す形容詞 + to + 動詞の原形",
      questions: [
        {
          text: "I am glad (　　) you again.",
          choices: ["see", "to see", "seeing", "saw"],
          answer: 1
        },
        {
          text: "She was surprised (　　) the result.",
          choices: ["hear", "to hear", "hearing", "heard"],
          answer: 1
        },
        {
          text: "He was sorry to keep us waiting. の to keep us waiting の働きは？",
          choices: ["目的", "sorry の理由", "名詞を修飾する説明", "結果"],
          answer: 1
        }
      ]
    },
    {
      title: "不定詞の副詞的用法（結果）",
      marker: "grow up to be ...",
      bodyText: ["何のために", "その後、実際にどうなったか", "He went to the library to study."],
      questions: [
        {
          text: "He grew up (　　) a scientist.",
          choices: ["be", "to be", "being", "been"],
          answer: 1
        },
        {
          text: "She hurried to the station, only (　　) that the train had left.",
          choices: ["find", "to find", "finding", "found"],
          answer: 1
        },
        {
          text: "結果を表す副詞的用法が使われている文を選びなさい。",
          choices: [
            "He went to the store to buy milk.",
            "I need a bag to carry books.",
            "She opened the door to find nobody there.",
            "To travel abroad is exciting."
          ],
          answer: 2
        }
      ]
    },
    {
      title: "不定詞の副詞的用法（程度・結果）",
      marker: "too + 形容詞 + to + 動詞の原形",
      questions: [
        {
          text: "This bag is too heavy (　　) carry.",
          choices: ["to", "for", "that", "as"],
          answer: 0
        },
        {
          text: "The room is large enough (　　) hold fifty people.",
          choices: ["to", "for", "that", "than"],
          answer: 0
        },
        {
          text: "This problem is too difficult (　　) me to solve.",
          choices: ["for", "to", "of", "with"],
          answer: 0
        }
      ]
    },
    {
      title: "不定詞の意味上の主語",
      marker: "for + 人 + to + 動詞の原形",
      questions: [
        {
          text: "It is important (　　) to study.",
          choices: ["for him", "him", "he", "to him"],
          answer: 0
        },
        {
          text: "It is difficult for children (　　) the rule.",
          choices: ["to understand", "understanding", "understand", "understood"],
          answer: 0
        },
        {
          text: "正しい英文を選びなさい。",
          choices: [
            "It is important for he to study.",
            "It is important him to study.",
            "It is important for him to study.",
            "It is important of him to study."
          ],
          answer: 2
        }
      ]
    },
    {
      title: "人の性質を表す形容詞と不定詞",
      marker: "It is + 形容詞 + of + 人 + to + 動詞の原形",
      bodyText: ["It is important for students to study.", "It was careless of him to forget the key."],
      questions: [
        {
          text: "It was kind (　　) you to help me.",
          choices: ["for", "of", "from", "with"],
          answer: 1
        },
        {
          text: "正しい英文を選びなさい。",
          choices: [
            "It was nice of he to help us.",
            "It was nice of him to help us.",
            "It was nice him to help us.",
            "It was nice of him helping us."
          ],
          answer: 1
        },
        {
          text: "人の性質や行動を評価している文を選びなさい。",
          choices: [
            "It is important for students to study.",
            "It is difficult for me to answer.",
            "It was careless of him to forget the key.",
            "It is possible for her to join us."
          ],
          answer: 2
        }
      ]
    },
    {
      title: "使役動詞と原形不定詞",
      marker: "動詞 + 人 + 動詞の原形",
      bodyText: [
        "My parents let me go out.",
        "I had him check the report.",
        "We were made to clean the room by the teacher.",
        "can play"
      ],
      questions: [
        {
          text: "The teacher made us (　　) the room.",
          choices: ["clean", "to clean", "cleaning", "cleaned"],
          answer: 0
        },
        {
          text: "My parents let me (　　) out.",
          choices: ["go", "to go", "going", "gone"],
          answer: 0
        },
        {
          text: "I had him (　　) the report.",
          choices: ["check", "to check", "checking", "checked"],
          answer: 0
        }
      ]
    },
    {
      title: "知覚動詞と原形不定詞",
      marker: "知覚動詞 + 人・もの + 動詞の原形",
      bodyText: ["I saw him cross the street.", "I saw him crossing the street.", "We heard her sing."],
      questions: [
        {
          text: "I saw him (　　) the street.",
          choices: ["cross", "to cross", "crossed", "to crossed"],
          answer: 0
        },
        {
          text: "We heard her (　　).",
          choices: ["sing", "to sing", "singing", "sang"],
          answer: 0
        },
        {
          text: "動作の途中を表す文を選びなさい。",
          choices: [
            "I saw him cross the street.",
            "I saw him crossing the street.",
            "I heard her sing.",
            "My parents let me go out."
          ],
          answer: 1
        }
      ]
    },
    {
      title: "不定詞の否定形",
      marker: "not to + 動詞の原形",
      questions: [
        {
          text: "I decided (　　　) the invitation.",
          choices: ["not accepting", "not to accept", "to not accepting", "to accept not"],
          answer: 1
        },
        {
          text: "He left home early in order (　　　) the train.",
          choices: ["not missing", "not to miss", "to not missing", "not miss"],
          answer: 1
        },
        {
        text: "She tried not to laugh. の意味として正しいものを選びなさい。",
          choices: [
            "彼女は笑わないように努めた。",
            "彼女は笑うことを決めなかった。",
            "彼女は笑わなかったことを後悔した。",
            "彼女は笑ってはいけないと約束した。"
          ],
          answer: 0
        }
      ]
    },
    {
      title: "完了不定詞",
      marker: "to have + 過去分詞",
      questions: [
        {
          text: "I met you last year, and I am happy (　　　) you.",
          choices: ["to meet", "meeting", "to have met", "to have meet"],
          answer: 2
        },
        {
          text: "She seems (　　　) the key.",
          choices: ["to forget", "to have forgotten", "to have forget", "forgetting"],
          answer: 1
        },
        {
          text: "She was proud (　　　) for the team.",
          choices: ["to choose", "to have chosen", "to have been chosen", "to be choosing"],
          answer: 2
        }
      ]
    }
  ];

  for (const lesson of lessons) {
    await freshHome(page);
    await switchCourse(page, "infinitives");
    await page.getByRole("button", { name: new RegExp(lesson.title) }).click();
    await expect(page.getByRole("heading", { name: lesson.title })).toBeVisible();
    await expect(page.getByText(lesson.marker, { exact: true }).first()).toBeVisible();
    for (const bodyText of lesson.bodyText ?? []) {
      await expect(page.locator("#session-content p, #session-content blockquote, #session-content li").filter({ hasText: bodyText }).first()).toBeVisible();
    }
    if (lesson.title === "使役動詞と原形不定詞") {
      await expect(page.locator(".flashCard details.section > summary").filter({ hasText: "使役動詞の基本" })).toBeVisible();
    }
    if (lesson.title === "知覚動詞と原形不定詞") {
      await expect(page.locator(".flashCard details.section > summary").filter({ hasText: "知覚動詞の基本" })).toBeVisible();
      await expect(page.locator("#session-content")).toContainText("動作の全体");
      await expect(page.locator("#session-content")).toContainText("動作の途中");
    }

    await page.getByRole("button", { name: "3問に挑戦" }).click();
    for (const [index, expected] of lesson.questions.entries()) {
      await expect(page.locator(".questionText")).toHaveText(expected.text);
      await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
        buttons.map(button => button.querySelectorAll("span")[1].textContent)
      )).toEqual(expected.choices);
      await page.locator(".choice").nth(expected.answer).click();
      await page.locator('[data-action="next-question"]').click();
      if (index < lesson.questions.length - 1) await expect(page.locator(".quiz")).toBeVisible();
    }
    await expect(page.locator(".score")).toHaveText("3 / 3");
  }
});
