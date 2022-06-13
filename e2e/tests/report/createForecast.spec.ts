import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");
  // Click text=login
  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=login").click(),
  ]);
  // Testing Autofocus on input[name="email"]
  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill("admin@epr.local");
  // Press Tab
  await page.locator('input[name="email"]').press("Tab");
  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("Admin1234");
  // Click type=submit
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/");

  // Go to http://localhost:3000/report/forecast/add
  await page.goto("http://localhost:3000/report/forecast/add");

  return new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });
  // Click text=Next >> nth=0
  await page.locator("text=Next").first().click();

  // Click text=Packaging group *Packaging group * >> [aria-label="Open"]
  await page
    .locator('text=Packaging group *Packaging group * >> [aria-label="Open"]')
    .click();

  // Click text=Group 1
  await page.locator("text=Group 1").click();

  // Click text=Material *Material * >> [aria-label="Open"]
  await page
    .locator('text=Material *Material * >> [aria-label="Open"]')
    .click();

  // Click text=Material 1
  await page.locator("text=Material 1").click();

  // Click text=kgQuantity * >> input[type="text"]
  await page.locator('text=kgQuantity * >> input[type="text"]').click();

  // Fill text=kgQuantity * >> input[type="text"]
  await page.locator('text=kgQuantity * >> input[type="text"]').fill("10");

  // Click text=Add new entry
  await page.locator("text=Add new entry").click();

  // Click input[role="combobox"] >> nth=3
  await page.locator('input[role="combobox"]').nth(3).click();

  // Click [aria-label="Close"]
  await page.locator('[aria-label="Close"]').click();

  // Click [aria-label="Open"] >> nth=3
  await page.locator('[aria-label="Open"]').nth(3).click();

  // Click text=Group 2
  await page.locator("text=Group 2").click();

  // Click [aria-label="Open"] >> nth=4
  await page.locator('[aria-label="Open"]').nth(4).click();

  // Click text=Material 2
  await page.locator("text=Material 2").click();

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

  // Click button:has-text("Submit")
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/report/forecast/add/success' }*/),
    page.locator('button:has-text("Submit")').click(),
  ]);

  // Click h1:has-text("Report Successful")
  await page.locator('h1:has-text("Report Successful")').click();

  // Click text=Thank you for reporting
  await page.locator("text=Thank you for reporting").click();
});
