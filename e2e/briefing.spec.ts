import { expect, test } from "@playwright/test";

test("non-technical hiring manager briefing", async ({ page }) => {
  await page.goto("/briefings/new");
  await page.getByRole("textbox", { name: "Role", exact: true }).fill("Senior Software Engineer");
  await page.getByLabel("Where are you hiring?").selectOption("UK");
  await page.getByLabel(/Budget/).fill("90000");
  await page.getByRole("button", { name: /Show me where and when/ }).click();
  await expect(page.getByText(/Decision/)).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText(/Recommended city/)).toBeVisible();
  await expect(page.getByText(/does not include LinkedIn Talent Insights/)).toBeVisible();
  await expect(page.getByText("P50", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Cambridge|Manchester|Remote UK/).first()).toBeVisible();
});

test("weekly digest explains relevancy", async ({ page }) => {
  await page.goto("/reports/weekly");
  await expect(page.getByRole("heading", { name: /Only what maps to roles we hire/ })).toBeVisible({
    timeout: 45_000,
  });
  await expect(page.getByText(/sourcing pulse/i).first()).toBeVisible();
});
