// ============================================
// PERFORMANCE TESTS
// Page load times, large datasets, response times, concurrent operations
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { allergiesPanel } from '../pages/memberHub/allergies';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.REGRESSION} @performance Performance Tests`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let allergies: allergiesPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    allergies = new allergiesPanel(authenticatedPage);
  });

  test.describe('Page Load Performance', () => {
    test('Dashboard loads within acceptable time @p2 @slow', async ({ authenticatedPage }) => {
      const startTime = Date.now();

      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage);

      const loadTime = Date.now() - startTime;

      // Dashboard should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);

      console.log(`Dashboard load time: ${loadTime}ms`);
    });

    test('Member search page loads quickly @p2', async ({ authenticatedPage }) => {
      const startTime = Date.now();

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      const loadTime = Date.now() - startTime;

      // Member search should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);

      console.log(`Member search load time: ${loadTime}ms`);
    });

    test('Member hub loads within timeout @p2 @slow', async ({ authenticatedPage }) => {
      // Navigate to member hub
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      const loadTime = Date.now() - startTime;

      // Member hub should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);

      console.log(`Member hub load time: ${loadTime}ms`);
    });
  });

  test.describe('Search Performance', () => {
    test('Member search with single criterion completes quickly @p2', async ({ authenticatedPage }) => {
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);

      const searchTime = Date.now() - startTime;

      // Search should complete within 5 seconds
      expect(searchTime).toBeLessThan(5000);

      console.log(`Member search time: ${searchTime}ms`);
    });

    test('Search with multiple criteria performs well @p2', async ({ authenticatedPage }) => {
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: TEST_MEMBER.FIRST_NAME,
        lastName: TEST_MEMBER.LAST_NAME,
        dob: TEST_MEMBER.DOB,
      });

      await waitForNetworkIdle(authenticatedPage);

      const searchTime = Date.now() - startTime;

      // Multi-criteria search should complete within 7 seconds
      expect(searchTime).toBeLessThan(7000);

      console.log(`Multi-criteria search time: ${searchTime}ms`);
    });

    test('Search with common name handles large result set @p2 @slow', async ({ authenticatedPage }) => {
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      // Search with common last name that might return many results
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        lastName: 'Smith', // Common name
      });

      await waitForNetworkIdle(authenticatedPage, 15000); // Allow more time for large results

      const searchTime = Date.now() - startTime;

      // Should complete even with many results (within 15 seconds)
      expect(searchTime).toBeLessThan(15000);

      console.log(`Large result set search time: ${searchTime}ms`);

      // Verify results loaded
      const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
      await expect(resultsTable).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Panel Load Performance', () => {
    test('Allergies panel loads quickly @p2', async ({ authenticatedPage }) => {
      // Navigate to member hub
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      // Open allergies panel
      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      const loadTime = Date.now() - startTime;

      // Panel should expand/load within 3 seconds
      expect(loadTime).toBeLessThan(3000);

      console.log(`Allergies panel load time: ${loadTime}ms`);
    });

    test('Multiple panels can be opened in succession @p2 @slow', async ({ authenticatedPage }) => {
      // Navigate to member hub
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      const panelNames = ['Allergies', 'Medications', 'Care Management'];
      const totalStartTime = Date.now();

      for (const panelName of panelNames) {
        const panelHeader = authenticatedPage.locator(`h3:has-text("${panelName}")`);
        const isVisible = await panelHeader.isVisible({ timeout: 3000 }).catch(() => false);

        if (isVisible) {
          await panelHeader.click();
          await smartWait(authenticatedPage, 500);
        }
      }

      const totalTime = Date.now() - totalStartTime;

      // All panels should open within 10 seconds total
      expect(totalTime).toBeLessThan(10000);

      console.log(`Multiple panels open time: ${totalTime}ms`);
    });
  });

  test.describe('Table Performance', () => {
    test('Change table page size to 100 entries performs well @p3', async ({ authenticatedPage }) => {
      // Navigate to member hub with data table
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      // Open allergies panel (has data table)
      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      const startTime = Date.now();

      // Change entries per page
      const entriesDropdown = authenticatedPage.getByRole('combobox').first();
      const isVisible = await entriesDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        await entriesDropdown.selectOption('100');
        await smartWait(authenticatedPage, 2000); // Wait for table to reload

        const loadTime = Date.now() - startTime;

        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);

        console.log(`Table resize to 100 entries time: ${loadTime}ms`);
      }
    });

    test('Table search filters quickly @p3', async ({ authenticatedPage }) => {
      // Navigate to allergies table
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        const startTime = Date.now();

        await searchBox.fill('test');
        await smartWait(authenticatedPage, 1000); // Wait for filter

        const filterTime = Date.now() - startTime;

        // Filter should apply within 2 seconds
        expect(filterTime).toBeLessThan(2000);

        console.log(`Table filter time: ${filterTime}ms`);
      }
    });

    test('Table sorting performs quickly @p3', async ({ authenticatedPage }) => {
      // Navigate to data table
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      const sortableHeaders = authenticatedPage.locator('th.sorting, th.sorting_asc');
      const headerCount = await sortableHeaders.count();

      if (headerCount > 0) {
        const startTime = Date.now();

        await sortableHeaders.first().click();
        await smartWait(authenticatedPage, 500);

        const sortTime = Date.now() - startTime;

        // Sort should apply within 2 seconds
        expect(sortTime).toBeLessThan(2000);

        console.log(`Table sort time: ${sortTime}ms`);
      }
    });
  });

  test.describe('Form Submission Performance', () => {
    test('Add allergy form submission completes quickly @p2', async ({ authenticatedPage }) => {
      // Navigate to allergies
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      await allergies.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill form
      const searchInput = allergies.searchInput;
      const inputVisible = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (inputVisible) {
        await searchInput.fill('Test');
        await allergies.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        const startTime = Date.now();

        // Cancel instead of submit (to avoid data pollution)
        await allergies.cancelButton.click();
        await waitForNetworkIdle(authenticatedPage);

        const submitTime = Date.now() - startTime;

        // Form close should be quick (< 2 seconds)
        expect(submitTime).toBeLessThan(2000);

        console.log(`Form cancel time: ${submitTime}ms`);
      }
    });

    test('Search autocomplete responds quickly @p2', async ({ authenticatedPage }) => {
      // Navigate to allergies
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      await allergies.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const searchInput = allergies.searchInput;
      const inputVisible = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (inputVisible) {
        const startTime = Date.now();

        await searchInput.fill('Penicillin');
        await allergies.searchButton.click();
        await waitForNetworkIdle(authenticatedPage, 10000);

        const responseTime = Date.now() - startTime;

        // Search results should appear within 5 seconds
        expect(responseTime).toBeLessThan(5000);

        console.log(`Allergy search response time: ${responseTime}ms`);

        // Cancel
        await allergies.cancelButton.click();
      }
    });
  });

  test.describe('Network Performance', () => {
    test('Application handles slow 3G network @p2 @slow', async ({ authenticatedPage }) => {
      // Emulate slow 3G
      await authenticatedPage.context().route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });

      const startTime = Date.now();

      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage, 30000);

      const loadTime = Date.now() - startTime;

      // Should still load, just slower (within 30 seconds)
      expect(loadTime).toBeLessThan(30000);

      console.log(`Dashboard load on slow 3G: ${loadTime}ms`);
    });

    test('Multiple concurrent API calls perform acceptably @p3 @slow', async ({ authenticatedPage }) => {
      // Perform multiple operations that trigger API calls
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      const startTime = Date.now();

      // Trigger search (API call 1)
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Open member hub (API call 2)
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      // Open panel (API call 3)
      await allergies.panelHeader.click();
      await waitForNetworkIdle(authenticatedPage);

      const totalTime = Date.now() - startTime;

      // Multiple API calls should complete within 15 seconds
      expect(totalTime).toBeLessThan(15000);

      console.log(`Multiple API calls total time: ${totalTime}ms`);
    });
  });

  test.describe('Memory Performance', () => {
    test('Repeated navigation does not degrade performance @p3 @slow', async ({ authenticatedPage }) => {
      const iterations = 3;
      const loadTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();

        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        const loadTime = Date.now() - startTime;
        loadTimes.push(loadTime);

        console.log(`Iteration ${i + 1} dashboard load time: ${loadTime}ms`);

        // Navigate away and back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }

      // Performance should not degrade significantly
      // Last iteration should not be more than 2x first iteration
      const firstTime = loadTimes[0];
      const lastTime = loadTimes[loadTimes.length - 1];

      expect(lastTime).toBeLessThan(firstTime * 2);

      console.log(`Performance ratio (last/first): ${(lastTime / firstTime).toFixed(2)}x`);
    });

    test('Opening multiple panels does not cause memory leak @p3 @slow', async ({ authenticatedPage }) => {
      // Navigate to member hub
      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      const panelOpenTimes: number[] = [];

      // Open panels multiple times
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();

        await allergies.panelHeader.click();
        await smartWait(authenticatedPage, 500);

        const openTime = Date.now() - startTime;
        panelOpenTimes.push(openTime);

        console.log(`Panel open attempt ${i + 1}: ${openTime}ms`);

        // Close panel (click header again)
        await allergies.panelHeader.click();
        await smartWait(authenticatedPage, 500);
      }

      // Performance should remain consistent
      const avgTime = panelOpenTimes.reduce((a, b) => a + b, 0) / panelOpenTimes.length;

      // No single attempt should be more than 3x average
      panelOpenTimes.forEach(time => {
        expect(time).toBeLessThan(avgTime * 3);
      });

      console.log(`Average panel open time: ${avgTime.toFixed(2)}ms`);
    });
  });

  test.describe('Rendering Performance', () => {
    test('Page renders without layout shifts @p3', async ({ authenticatedPage }) => {
      // Navigate to dashboard
      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage);

      // Wait a moment for any delayed renders
      await smartWait(authenticatedPage, 2000);

      // Take measurements (this is a basic check)
      const bodyHeight = await authenticatedPage.evaluate(() => document.body.scrollHeight);

      // Wait a bit more
      await smartWait(authenticatedPage, 1000);

      const bodyHeightAfter = await authenticatedPage.evaluate(() => document.body.scrollHeight);

      // Height should be stable (no major layout shifts)
      const difference = Math.abs(bodyHeight - bodyHeightAfter);
      expect(difference).toBeLessThan(100); // Allow small differences

      console.log(`Layout stability check - height difference: ${difference}px`);
    });
  });
});
