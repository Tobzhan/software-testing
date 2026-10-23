import { test, expect } from '@playwright/test';

test.describe('Suite 3: Product search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('search-query')).toBeVisible();
  });

  test('SEARCH-01 common query finds products', async ({ page }) => {
    await page.getByTestId('search-query').fill('hammer');
    await page.getByTestId('search-submit').click();
    await expect(page.getByTestId('search-term')).toHaveText('hammer');
    await expect(page.locator('a[data-test^="product-"]').first()).toBeVisible();
    await expect(page.getByTestId('search-result-count')).toBeVisible();
  });

  test('SEARCH-02 nonsense query shows no results', async ({ page }) => {
    const query = 'zzzxxyy-no-such-tool-qa-2026';
    await page.getByTestId('search-query').fill(query);
    await page.getByTestId('search-submit').click();
    await expect(page.getByTestId('search-term')).toHaveText(query);
    await expect(page.getByTestId('no-results')).toBeVisible();
    await expect(page.locator('a[data-test^="product-"]')).toHaveCount(0);
  });
});
