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
  await expect(page.getByText("形式主語")).toHaveCount(0);

  await page.getByRole("button", { name: "3問に挑戦" }).click();
  await expect(page.locator(".quiz")).toHaveCount(1);
  await expect(page.locator(".choice")).toHaveCount(4);
});
