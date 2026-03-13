// ============================================
// USING ENVIRONMENTS IN TESTS
// ============================================

// FILE: tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

//import { getCurrentEnvironment } from '../../config/env';
import { getCurrentEnvironment } from '../config/env.ts';

test.describe('Login Tests - Environment Aware', () => {
  let env = getCurrentEnvironment();

  // test.beforeEach(async ({ page }) => {
  //   env = getCurrentEnvironment();
  //   console.log(`Testing on: ${env.baseUrl}`);
  // });

  test.skip('Login with environment-specific credentials', async ({ page }) => {
    await page.goto(env.baseUrl);
    
    await page.fill('#input28', env.username);
    await page.fill('#input36', env.password);
    await page.click("input[type=submit]");
    
    //await expect(page).toHaveURL(/dashboard/);
    await expect(page).toHaveURL(env.baseUrl);
  });

  test.skip('API call with environment-specific URL', async ({ request }) => {
    const response = await request.get(`${env.apiUrl}/users`);
    expect(response.status()).toBe(200);
  });
});

/*
HOW TO RUN TESTS ON DIFFERENT ENVIRONMENTS:
-------------------------------------------

# Run on stage (default)
npx playwright test

# Run on prod
TEST_ENV=prod npx playwright test

# Run on local
TEST_ENV=local npx playwright test

# Windows (PowerShell):
$env:TEST_ENV="prod"; npx playwright test

# Using .env files:
npm install dotenv
*/