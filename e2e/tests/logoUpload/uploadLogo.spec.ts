import { test, expect } from "@playwright/test";

test("test logo upload", async ({ page }) => {
  await page.goto("/");

  // Click text=login
  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=login").click(),
  ]);

  await page.locator('input[name="email"]').fill("regular@epr.local");
  // Press Tab
  await page.locator('input[name="email"]').press("Tab");
  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("Admin1234");

  // Click type=submit
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("/dashboard");

  await expect(page.locator("text=Add logo")).toBeVisible();

  await page.locator("text=Add logo").click();
  await expect(page.locator("text=Upload logo")).toBeVisible();

  // test upload file
  const testFile = "./testFiles/testUploadFile.png";
  await page.setInputFiles("text=Upload logo", testFile);

  // check preview is displayed
  await expect(page.locator("img >> nth=0")).toBeVisible();

  // check delete button is displayed
  await expect(page.locator("text=Delete logo")).toBeVisible();

  await page.locator("text=Save").click();

  // check delete button is not displayed anymore (modal closed)
  await expect(page.locator("text=Delete logo")).not.toBeVisible();

  // check uploaded img is shown in preview
  await expect(page.locator("img >> nth=0")).toBeVisible();
});
