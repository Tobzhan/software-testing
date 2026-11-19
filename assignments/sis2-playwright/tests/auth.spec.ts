import { test, expect } from '@playwright/test';

test.describe('Suite 2: Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('AUTH-01 valid customer credentials allow login', async ({ page }) => {
    const { TEST_CUSTOMER_EMAIL: email, TEST_CUSTOMER_PASSWORD: password } = process.env;
    if (!email || !password) {
      throw new Error('Set TEST_CUSTOMER_EMAIL and TEST_CUSTOMER_PASSWORD before running this test.');
    }
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
