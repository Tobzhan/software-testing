import { expect, test } from '@playwright/test';

test('temporary check that CI publishes a browser trace after failure', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-home')).toBeVisible();
  expect(await page.getByTestId('nav-home').isVisible(), 'Intentional failure for artifact verification').toBe(false);
});
