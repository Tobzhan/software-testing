import { test, expect, type Page } from '@playwright/test';

async function addAvailableProduct(page: Page): Promise<string> {
  await page.goto('/');
  const card = page.locator(
    'a[data-test^="product-"]:not(:has([data-test="out-of-stock"]))'
  ).first();
  await expect(card).toBeVisible();
  const name = (await card.getByTestId('product-name').innerText()).trim();
  await card.click();
  await expect(page.getByTestId('add-to-cart')).toBeEnabled();
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-quantity')).toHaveText('1');
  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('product-title')).toContainText(name);
  return name;
}

test.describe('Suite 4: Cart', () => {
  test('CART-01 add available product', async ({ page }) => {
    await addAvailableProduct(page);
    await expect(page.getByTestId('product-quantity')).toHaveValue('1');
    await expect(page.getByTestId('cart-total')).toBeVisible();
  });

  test('CART-02 remove product', async ({ page }) => {
    const name = await addAvailableProduct(page);
    const row = page.locator('tr').filter({
      has: page.getByTestId('product-title').filter({ hasText: name }),
    });
    await expect(row).toBeVisible();
    await row.locator('a.btn-danger').click();
    await expect(page.getByTestId('product-title')).toHaveCount(0);
    await expect(page.getByTestId('cart-quantity')).toHaveText('0');
  });
});
