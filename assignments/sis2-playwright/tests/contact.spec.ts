import { test, expect } from '@playwright/test';

test.describe('Suite 5: Contact validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByTestId('contact-submit')).toBeVisible();
  });

  test('CONTACT-01 empty fields are rejected', async ({ page }) => {
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('first-name-error')).toBeVisible();
    await expect(page.getByTestId('last-name-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('subject-error')).toBeVisible();
    await expect(page.getByTestId('message-error')).toBeVisible();
  });

  test('CONTACT-02 invalid email is rejected', async ({ page }) => {
    await page.getByTestId('first-name').fill('Playwright');
    await page.getByTestId('last-name').fill('Tester');
    await page.getByTestId('email').fill('invalid-email');
    await page.getByTestId('subject').selectOption('customer-service');
    await page.getByTestId('message').fill(
      'This is a sample message with more than fifty characters for validation.'
    );
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('email-error')).toBeVisible();
  });
});
