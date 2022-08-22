import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  // Click text=login
  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=login").click(),
  ]);

  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill("abc@gg.wp");
  // Press Tab
  await page.locator('input[name="email"]').press("Tab");
  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("abcabc");
  // Check input[name="rememberMe"]
  await page.locator('input[name="rememberMe"]').check();
  // Click button:has-text("Sign in")
  await page.locator('button:has-text("Sign in")').click();
  await page.waitForURL("**/login");
  // Check if error message is displayed

  await expect(
    page.locator("text=The credentials you provided are invalid.")
  ).toBeTruthy();
});
