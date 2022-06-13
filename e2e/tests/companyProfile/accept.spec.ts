import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");

  // Click text=Login
  await Promise.all([
    page.waitForNavigation({ url: "**/login" }),
    page.locator("text=Login").click(),
  ]);

  // Click input[name="email"]
  await page.locator('input[name="email"]').click();
  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill("regular@epr.local");
  // Click input[name="password"]
  await page.locator('input[name="password"]').click();
  // Fill input[name="password"]
  await page.locator('input[name="password"]').fill("Admin1234");

  // Click type=submit
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard");

  await expect(
    await page.locator("text=Please complete your profile")
  ).toHaveCount(1);

  // Click text=Please complete your profile
  await page.locator("text=Please complete your profile").click();

  // Click text=Complete Now
  await Promise.all([
    page.waitForNavigation({ url: "**/dashboard/complete" }),
    page.locator("text=Complete Now").click(),
  ]);

  // Click input[name="country"]
  await page.locator('input[name="country"]').click();
  // Fill input[name="country"]
  await page.locator('input[name="country"]').fill("Germany");
  // Press Tab
  await page.locator('input[name="country"]').press("Tab");
  // Fill input[name="postalCode"]
  await page.locator('input[name="postalCode"]').fill("53666");
  // Press Tab
  await page.locator('input[name="postalCode"]').press("Tab");
  // Fill input[name="city"]
  await page.locator('input[name="city"]').fill("Cologne");
  // Press Tab
  await page.locator('input[name="city"]').press("Tab");
  // Fill input[name="street"]
  await page.locator('input[name="street"]').fill("Somestreet");
  // Click input[name="streetNumber"]
  await page.locator('input[name="streetNumber"]').click();
  // Fill input[name="streetNumber"]
  await page.locator('input[name="streetNumber"]').fill("2");
  // Click textarea[name="additionalAddressInfo"]
  await page.locator('textarea[name="additionalAddressInfo"]').click();
  // Fill textarea[name="additionalAddressInfo"]
  await page
    .locator('textarea[name="additionalAddressInfo"]')
    .fill("Additional informations text");
  // Press Tab
  await page.locator('textarea[name="additionalAddressInfo"]').press("Tab");
  // Fill input[name="phoneNumber"]
  await page.locator('input[name="phoneNumber"]').fill("12345566");
  // Click input[name="identificationNumber"]
  await page.locator('input[name="identificationNumber"]').click();
  // Fill input[name="identificationNumber"]
  await page
    .locator('input[name="identificationNumber"]')
    .fill("42343243242342");
  // Click text=Next
  await Promise.all([
    page.waitForNavigation({ url: "**/" }),
    page.locator("text=Next").click(),
  ]);
});
