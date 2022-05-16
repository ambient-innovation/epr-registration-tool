import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  // Go to http://127.0.0.1:3000/
  await page.goto('http://127.0.0.1:3000/');
  // Click text=EPR Registration Tool
  const title = page.locator('text=EPR Registration Tool')
  await expect(title).toContainText('EPR Registration Tool')
});
