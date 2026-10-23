import { test, expect } from '@playwright/test';

test.describe('Suite 1: Smoke', () => {
  test('SM-01 homepage navigation is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();
    await expect(page.getByTestId('nav-cart')).toBeVisible();
  });

  test('SM-02 catalog product detail opens', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('a[data-test^="product-"]').first();
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/product\/[^/]+/);
    await expect(page.getByTestId('product-name')).toBeVisible();
    await expect(page.getByTestId('unit-price')).toBeVisible();
  });
});
