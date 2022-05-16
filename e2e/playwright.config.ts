// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test';
import * as os from "os";

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  timeout: 120 * 1000,
  retries: process.env.CI ? 2 : 0,
  workers: Math.min(os.cpus().length, 4),
  expect: {
    /**
    * Maximum time expect() should wait for the condition to be met.
    * For example in `await expect(locator).toHaveText();`
    */
    timeout: 100000,
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['junit', { outputFile: 'test-results/junit.xml' }], ['list']]
    : 'list',
  use: {
    trace: 'on-first-retry',
    actionTimeout: 30 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};
export default config;
