import { expect, test } from "@playwright/test";

test("chat home is the product", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ask where to hire/i })).toBeVisible();
  await expect(page.getByLabel("Ask Talent Intelligence")).toBeVisible();
});

test("typed question opens a live talent dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "UK Senior SWE, £90k" }).click();
  await expect(page.getByText("Recommended city")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByRole("heading", { name: /Talent density/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Market Pulse" })).toBeVisible();
  await expect(page.getByText(/Cambridge|Manchester|Remote UK|London|Cardiff/).first()).toBeVisible();
  await expect(page.getByText("P50", { exact: true }).first()).toBeVisible();
});

test("vague ask still opens the dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Ask Talent Intelligence").fill("where should we hire");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Recommended city")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Composite score")).toBeVisible();
});

test("weekly digest from chat", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Weekly digest" }).click();
  await expect(page.getByRole("heading", { name: /Only what maps to roles we hire/ })).toBeVisible({
    timeout: 60_000,
  });
});

test("non-technical hiring manager form still works", async ({ page }) => {
  await page.goto("/briefings/new");
  await page.getByRole("textbox", { name: "Role", exact: true }).fill("Senior Software Engineer");
  await page.getByLabel("Where are you hiring?").selectOption("UK");
  await page.getByLabel(/Budget/).fill("90000");
  await page.getByRole("button", { name: /Show me where and when/ }).click();
  await expect(page.getByText(/Decision/)).toBeVisible({ timeout: 45_000 });
  await expect(page.getByText(/Recommended city/)).toBeVisible();
});

test("weekly digest page explains relevancy", async ({ page }) => {
  await page.goto("/reports/weekly");
  await expect(page.getByRole("heading", { name: /Only what maps to roles we hire/ })).toBeVisible({
    timeout: 45_000,
  });
  await expect(page.getByText(/sourcing pulse/i).first()).toBeVisible();
});
