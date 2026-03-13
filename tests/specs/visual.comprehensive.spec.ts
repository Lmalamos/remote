// ============================================
// VISUAL REGRESSION TESTS
// ============================================
import { test, expect } from '../fixtures/auth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { Tags, combineTags } from '../tags';
import { VisualTester, VISUAL_THRESHOLDS, DYNAMIC_ELEMENTS } from '../visual/visualConfig';
import { createStandardMemberSearch } from '../factories/memberFactory';
import { TEST_MEMBER } from '../constants';

test.describe(combineTags(Tags.VISUAL, Tags.REGRESSION), () => {
  test('Login page visual regression @visual-regression @p1', async ({ page }) => {
    const visual = new VisualTester(page);

    await page.goto('/');

    // Prepare page and wait for ready
    await visual.waitForReady();
    await visual.preparePage();

    // Take screenshot
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      threshold: 0.2, // 20% threshold for minor rendering differences
    });
  });

  test('Dashboard visual regression @visual-regression @smoke', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);
    const nav = new navigationPage(page);

    await nav.goToDashboard();
    await visual.waitForReady();
    await visual.preparePage();

    // Hide dynamic elements
    await visual.hideElements([
      ...DYNAMIC_ELEMENTS.TIMESTAMPS,
      ...DYNAMIC_ELEMENTS.DATES,
      ...DYNAMIC_ELEMENTS.NOTIFICATIONS,
    ]);

    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      ...VISUAL_THRESHOLDS.MODERATE,
    });
  });

  test('Member search page visual regression @visual-regression @member-search', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);
    const nav = new navigationPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();

    await visual.waitForReady();
    await visual.preparePage();

    await expect(page).toHaveScreenshot('member-search-page.png', {
      fullPage: true,
      ...VISUAL_THRESHOLDS.STRICT,
    });
  });

  test('Member search results visual regression @visual-regression @member-search', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);
    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();

    await memberSearch.searchMember(createStandardMemberSearch());
    await memberSearch.verifySearchResults();

    await visual.waitForReady();
    await visual.hideElements(DYNAMIC_ELEMENTS.TIMESTAMPS);

    await expect(page).toHaveScreenshot('member-search-results.png', {
      fullPage: true,
      ...VISUAL_THRESHOLDS.LENIENT,
    });
  });

  test('Member hub visual regression @visual-regression @member-hub @slow', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);
    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();

    await memberSearch.searchMember(createStandardMemberSearch());
    await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);

    await visual.waitForReady();
    await visual.preparePage();
    await visual.hideElements([
      ...DYNAMIC_ELEMENTS.TIMESTAMPS,
      ...DYNAMIC_ELEMENTS.DATES,
    ]);

    await expect(page).toHaveScreenshot('member-hub.png', {
      fullPage: true,
      ...VISUAL_THRESHOLDS.MODERATE,
    });
  });

  test('Navigation menu visual regression @visual-regression @fast', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);
    const nav = new navigationPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();

    await visual.waitForReady();

    // Screenshot just the menu element
    await expect(page.locator('[role="menu"]')).toHaveScreenshot('navigation-menu.png', {
      ...VISUAL_THRESHOLDS.STRICT,
    });
  });
});

// Responsive visual tests
test.describe(combineTags(Tags.VISUAL, Tags.VISUAL_REGRESSION, 'responsive'), () => {
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'tablet', width: 768, height: 1024 },
  ];

  for (const viewport of viewports) {
    test(`Login page on ${viewport.name} @visual-regression`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const visual = new VisualTester(page);

      await page.goto('/');
      await visual.waitForReady();
      await visual.preparePage();

      await expect(page).toHaveScreenshot(`login-${viewport.name}.png`, {
        ...VISUAL_THRESHOLDS.LENIENT,
      });
    });

    test(`Dashboard on ${viewport.name} @visual-regression`, async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const visual = new VisualTester(page);
      const nav = new navigationPage(page);

      await nav.goToDashboard();
      await visual.waitForReady();
      await visual.preparePage();
      await visual.hideElements(DYNAMIC_ELEMENTS.TIMESTAMPS);

      await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
        ...VISUAL_THRESHOLDS.MODERATE,
      });
    });
  }
});

// Component-level visual tests
test.describe(combineTags(Tags.VISUAL, 'components'), () => {
  test('Profile dropdown visual @visual-regression @fast', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const visual = new VisualTester(page);

    // Open profile dropdown
    await page.locator('#userProfileHeader').click();

    await visual.waitForReady();

    await expect(page.locator('.dropdown-menu')).toHaveScreenshot('profile-dropdown.png', {
      ...VISUAL_THRESHOLDS.STRICT,
    });
  });

  test('Search button states visual @visual-regression @fast', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const nav = new navigationPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();

    const searchButton = page.locator('button:has-text("Search")');

    // Normal state
    await expect(searchButton).toHaveScreenshot('search-button-normal.png');

    // Hover state
    await searchButton.hover();
    await expect(searchButton).toHaveScreenshot('search-button-hover.png');

    // Focus state
    await searchButton.focus();
    await expect(searchButton).toHaveScreenshot('search-button-focus.png');
  });
});
