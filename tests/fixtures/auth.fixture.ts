// ============================================
// AUTHENTICATION FIXTURE
// ============================================
import { test as base, Page } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { getCurrentEnvironment } from '../config/env';

type AuthFixtures = {
  authenticatedPage: Page;
  adminAuthenticatedPage: Page;
};

/**
 * Extended test fixture that provides pre-authenticated pages
 * Usage in tests:
 *
 * import { test } from '../fixtures/auth.fixture';
 *
 * test('my test', async ({ authenticatedPage }) => {
 *   // Page is already logged in
 * });
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Provides a page that is already authenticated with standard user credentials
   */
  authenticatedPage: async ({ page }, use) => {
    const env = getCurrentEnvironment();
    const login = new loginPage(page);

    await login.goto();
    await login.login(env.username, env.password);

    // Use the authenticated page in the test
    await use(page);

    // Cleanup happens automatically
  },

  /**
   * Provides a page that is already authenticated with admin credentials
   */
  adminAuthenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const env = getCurrentEnvironment();
    const login = new loginPage(page);

    await login.goto();
    // Admin credentials
    await login.login('testaa', 'Password1!');

    await use(page);

    // Cleanup
    await context.close();
  },
});

export { expect } from '@playwright/test';
