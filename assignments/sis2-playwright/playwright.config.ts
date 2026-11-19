import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: isCI
    ? [['list'], ['blob'], ['junit', { outputFile: 'reports/junit.xml' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    testIdAttribute: 'data-test',
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    locale: 'en-US',
    screenshot: 'only-on-failure',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
