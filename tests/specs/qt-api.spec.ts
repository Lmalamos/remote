import { test, expect, Locator } from '@playwright/test';

test.skip('API Test: Sould navigate to the member search page', async ({ request }) => {
  const response = await request.get('/qt/queue#search');

  // Check the response status
  expect(response.status()).toBe(200);
});

test.beforeEach(async ({ request, page }) => {
    await page.goto('/');
    await page.locator('#input28').fill('autosmoke');
    await page.locator('#input36').fill('Playwright!1');
    await page.locator("input[type=submit]").click();
});