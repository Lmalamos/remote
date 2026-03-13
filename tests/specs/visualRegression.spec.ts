
// ============================================
// 1. VISUAL REGRESSION TESTING
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test.skip('Homepage visual comparison', async ({ page }) => {
    // Go to page
    await page.goto('https://playwright.dev/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare to baseline
    // First run: Creates baseline in tests/visual/visualRegression.spec.ts-snapshots/
    // Subsequent runs: Compares to baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test.skip('Specific element visual comparison', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Screenshot just the navigation bar
    const navbar = page.locator('nav').first();
    await expect(navbar).toHaveScreenshot('navbar.png');
  });

  test.skip('Button hover state visual', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    const getStartedButton = page.getByRole('link', { name: 'Get started' }).first();
    
    // Screenshot normal state
    await expect(getStartedButton).toHaveScreenshot('button-normal.png');
    
    // Hover and screenshot hover state
    await getStartedButton.hover();
    await expect(getStartedButton).toHaveScreenshot('button-hover.png');
  });

  test.skip('Responsive visual - Mobile vs Desktop', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveScreenshot('homepage-desktop.png');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });

  test.skip('Full page screenshot with scroll', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Takes screenshot of entire page (scrolls automatically)
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true
    });
  });

  test.skip('Visual comparison with threshold', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Allow 5% pixel difference (useful for slight rendering differences)
    await expect(page).toHaveScreenshot('homepage-with-threshold.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test.skip('Hide dynamic content before screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Hide elements that change (dates, random content, ads)
    await page.addStyleTag({
      content: `
        .dynamic-content,
        .advertisement,
        .timestamp {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-stable.png');
  });
});

/*
HOW TO RUN VISUAL TESTS:
------------------------

1. First run (creates baseline):
   npx playwright test visual --update-snapshots

2. Subsequent runs (compares to baseline):
   npx playwright test visual

3. If intentional UI change, update baseline:
   npx playwright test visual --update-snapshots

4. View visual differences:
   - Failed tests create a diff image
   - Look in: test-results/visual-[test-name]/[screenshot]-diff.png
   - Shows red highlights where differences are

TIPS:
-----
✅ Run on same OS (screenshots differ slightly between OS)
✅ Use Docker for consistent screenshots in CI/CD
✅ Hide dynamic content (dates, ads, random elements)
✅ Use maxDiffPixelRatio for minor acceptable differences
✅ Test specific components, not just full pages
*/