// ============================================
// AUTHENTICATION FIXTURE WITH CLEANUP
// ============================================
import { test as base, Page } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { getCurrentEnvironment } from '../config/env';
import { setupCleanupHook, dataTracker } from '../utils/dataCleanup';

type AuthWithCleanupFixtures = {
  authenticatedPage: Page;
  adminAuthenticatedPage: Page;
  testDataTracker: typeof dataTracker;
};

/**
 * Extended test fixture with authentication and automatic cleanup
 *
 * Usage:
 * import { test, expect } from '../fixtures/cleanupAuth.fixture';
 *
 * test('my test', async ({ authenticatedPage, testDataTracker }) => {
 *   // Use authenticatedPage for actions
 *   // Register created data with testDataTracker
 *   testDataTracker.registerMember('TEST123');
 *   // Cleanup happens automatically after test
 * });
 */
export const test = base.extend<AuthWithCleanupFixtures>({
  /**
   * Provides authenticated page with automatic cleanup after each test
   */
  authenticatedPage: async ({ page }, use) => {
    const env = getCurrentEnvironment();
    const login = new loginPage(page);

    await login.goto();
    await login.login(env.username, env.password);

    // Use the authenticated page in the test
    await use(page);

    // Cleanup after test
    await setupCleanupHook(page);
  },

  /**
   * Provides admin authenticated page with automatic cleanup
   */
  adminAuthenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const env = getCurrentEnvironment();
    const login = new loginPage(page);

    await login.goto();
    await login.login('testom', 'Password01!');

    await use(page);

    // Cleanup
    await setupCleanupHook(page);
    await context.close();
  },

  /**
   * Provides access to data tracker for registering test data
   */
  testDataTracker: async ({}, use) => {
    // Clear tracker before test
    dataTracker.clear();

    // Provide tracker to test
    await use(dataTracker);

    // Tracker cleanup is handled by authenticatedPage fixture
  },
});

export { expect } from '@playwright/test';
