import { test, expect } from '@playwright/test';

const email = process.env.TEST_CUSTOMER_EMAIL || 'customer@practicesoftwaretesting.com';
const password = process.env.TEST_CUSTOMER_PASSWORD || 'welcome01';

test.describe('Suite 2: Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('AUTH-01 valid customer credentials allow login', async ({ page }) => {
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('nav-menu')).toBeVisible();
    await expect(page.getByTestId('nav-sign-in')).toHaveCount(0);
  });

  test('AUTH-02 invalid credentials show login error', async ({ page }) => {
    await page.getByTestId('email').fill('nonexistent-user@example.invalid');
    await page.getByTestId('password').fill('definitely-wrong-password');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();
  });
});
