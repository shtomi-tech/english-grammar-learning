import { test, expect } from "@playwright/test";

async function freshHome(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test("不定詞カテゴリから名詞的用法の3問まで進められる", async ({ page }) => {
  await freshHome(page);

  await page.getByLabel("文法カテゴリ").selectOption("infinitives");
  await expect(page.getByRole("heading", { name: "不定詞", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "不定詞とは", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "不定詞の名詞的用法へ" }).click();
  await expect(page.getByRole("heading", { name: "不定詞の名詞的用法" })).toBeVisible();
  await expect(page.locator(".flashCard").getByText("形式主語")).toHaveCount(0);

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await expect(page.locator(".quiz")).toHaveCount(1);
  await expect(page.locator(".choice")).toHaveCount(4);
});

test("名詞的用法には既存アプリで使用済みの主語・目的語・補語の問題を使う", async ({ page }) => {
  await freshHome(page);
  await page.getByLabel("文法カテゴリ").selectOption("infinitives");
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

test("形式主語構文の解説を読み、既存アプリで使用済みの3問に取り組める", async ({ page }) => {
  await freshHome(page);
  await page.getByLabel("文法カテゴリ").selectOption("infinitives");
  await page.getByRole("button", { name: /形式主語構文/ }).click();

  await expect(page.getByRole("heading", { name: "形式主語構文" })).toBeVisible();
  await expect(page.getByText("It is + 形容詞 + to + 動詞の原形", { exact: true })).toBeVisible();
  await expect(page.getByText("It is + 形容詞 + for + 人 + to + 動詞の原形", { exact: true })).toBeVisible();
  await expect(page.getByText("It is + 形容詞 + that + 主語 + 動詞", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  const expectedQuestions = [
    {
      text: "It is important to check the answer. の It の働きは？",
      choices: ["内容上の主語を後ろへ送る形式主語", "天候だけを表す形式上の主語", "動詞checkが直接取る目的語", "前置詞toが取る目的語"]
    },
    {
      text: "It is important ___ to study. に入る形は？",
      choices: ["for him", "him", "he", "to him"]
    },
    {
      text: "It is difficult for children ___ the rule. に入る形は？",
      choices: ["to understand", "understanding", "understand", "understood"]
    }
  ];

  for (const [index, expected] of expectedQuestions.entries()) {
    await expect(page.locator(".questionText")).toHaveText(expected.text);
    await expect.poll(() => page.locator(".choice").evaluateAll(buttons =>
      buttons.map(button => button.querySelectorAll("span")[1].textContent)
    )).toEqual(expected.choices);
    await page.locator(".choice").first().click();
    await page.locator('[data-action="next-question"]').click();
    if (index < expectedQuestions.length - 1) await expect(page.locator(".quiz")).toBeVisible();
  }

  await expect(page.locator(".score")).toHaveText("3 / 3");
});

test("形式目的語構文の解説と3問を確認できる", async ({ page }) => {
  await freshHome(page);
  await page.getByLabel("文法カテゴリ").selectOption("infinitives");
  await page.getByRole("button", { name: /形式目的語構文/ }).click();

  await expect(page.getByRole("heading", { name: "形式目的語構文" })).toBeVisible();
  await expect(page.getByText("主語 + 動詞 + it + 形容詞 + to + 動詞の原形", { exact: true })).toBeVisible();
  await expect(page.getByText("主語 + 動詞 + it + 形容詞 + that + 主語 + 動詞", { exact: true })).toBeVisible();
  await expect(page.getByText("it が形式目的語", { exact: false }).first()).toBeVisible();

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
