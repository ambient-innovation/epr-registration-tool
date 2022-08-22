import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  // Click text=login
  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=login").click(),
  ]);
  // Testing Autofocus on input[name="email"]
  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill("regular@epr.local");
  // Press Tab
  await page.locator('input[name="email"]').press("Tab");
  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("Admin1234");
  // Click type=submit
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/");

  // Assert Login-Button does not exist on page anymore
  await expect(await page.locator("button[text=login]")).toHaveCount(0);
});
