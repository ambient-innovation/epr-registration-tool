import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");

  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=login").click(),
  ]);

  await page.locator('input[name="email"]').fill("regular@epr.local");
  await page.locator('input[name="email"]').press("Tab");
  await page.locator('input[name="password"]').fill("Admin1234");
  await page.locator('button[type="submit"]').click();

  // user will be redirected to dashboard
  await page.waitForURL("**/dashboard");

  //click on submit report to navigate to the report form
  await page.locator("text=Submit new report").click();
  await page.waitForURL("**/report/forecast/add");

  // navigate to second step as first step is already prefilled
  await page.locator("text=Next").first().click();

  await page
    .locator('text=Packaging group *Packaging group * >> [aria-label="Open"]')
    .click();
  await page.locator("text=Food packaging").click();

  await page
    .locator('text=Material *Material * >> [aria-label="Open"]')
    .click();
  await page.locator("text=PET").click();

  await page.locator('text=kgQuantity * >> input[type="text"]').click();
  await page.locator('text=kgQuantity * >> input[type="text"]').fill("10");

  // Click text=Add new entry
  await page.locator("text=Add new entry").click();

  // Click [aria-label="Open"] >> nth=3
  await page.locator('[aria-label="Open"]').nth(3).click();
  await page.locator("text=Service packaging").click();

  await page.locator('[aria-label="Open"]').nth(4).click();
  await page.locator("text=Metal cans").click();

  // Click text=Delete entryPackaging group *Packaging group *Material *Material *Quantity *kgQu >> input[type="text"] >> nth=2
  await page
    .locator(
      'text=Delete entryPackaging group *Packaging group *Material *Material *Quantity *kgQu >> input[type="text"]'
    )
    .nth(2)
    .click();

  // Fill text=Delete entryPackaging group *Packaging group *Material *Material *Quantity *kgQu >> input[type="text"] >> nth=2
  await page
    .locator(
      'text=Delete entryPackaging group *Packaging group *Material *Material *Quantity *kgQu >> input[type="text"]'
    )
    .nth(2)
    .fill("5");

  // Click text=Next >> nth=1
  await page.locator("text=Next").nth(1).click();

  await page.locator('button:has-text("Submit")').click();
  await page.waitForURL("**/report/forecast/add/success");

  await expect(page.locator('h1:has-text("Report Successful")')).toBeVisible();
  await expect(page.locator("text=Thank you for reporting")).toBeVisible();
});
