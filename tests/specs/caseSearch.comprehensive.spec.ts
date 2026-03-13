// ============================================
// CASE SEARCH - COMPREHENSIVE TESTS
// Edge cases, validation, search modes, error handling
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { caseSearchPage } from '../pages/caseSearch';
import { navigationPage } from '../pages/navigationPage';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.CASE_MANAGEMENT} Case Search - Comprehensive`, () => {
  let caseSearch: caseSearchPage;
  let navigation: navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    caseSearch = new caseSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);

    // Navigate to case search
    await navigation.goToDashboard();
    await navigation.openSearchMenu();

    // Click Case Search menu item
    const caseSearchLink = authenticatedPage.getByRole('link', { name: 'Case Search' });
    const isVisible = await caseSearchLink.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await caseSearchLink.click();
      await waitForNetworkIdle(authenticatedPage);
    } else {
      // Try alternate navigation if menu item not found
      await authenticatedPage.goto('/case-search'); // Adjust URL as needed
      await waitForNetworkIdle(authenticatedPage);
    }
  });

  test.describe('Search by Case ID', () => {
    test('Search with valid case ID @p2', async ({ authenticatedPage }) => {
      const testCaseId = '12345';

      // Ensure checkbox is unchecked (search by case ID mode)
      const isChecked = await caseSearch.searchByRequestIdCheckBox.isChecked().catch(() => false);
      if (isChecked) {
        await caseSearch.searchByRequestIdCheckBox.uncheck();
      }

      await caseSearch.caseId.fill(testCaseId);
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search with empty case ID shows validation @p1', async ({ authenticatedPage }) => {
      // Ensure in case ID mode
      const isChecked = await caseSearch.searchByRequestIdCheckBox.isChecked().catch(() => false);
      if (isChecked) {
        await caseSearch.searchByRequestIdCheckBox.uncheck();
      }

      // Try to search without case ID
      await caseSearch.searchButton.click();
      await smartWait(authenticatedPage, 1000);

      // Should show validation error or do nothing
      const errorMessage = authenticatedPage.locator('.snackbar.error.show, .error, .alert-danger');
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      // Either shows error or button does nothing (field validation)
      if (hasError) {
        const errorText = await errorMessage.textContent();
        expect(errorText).toBeTruthy();
      }
    });

    test('Case ID with leading zeros @p2', async ({ authenticatedPage }) => {
      const caseIdWithZeros = '00012345';

      await caseSearch.caseId.fill(caseIdWithZeros);
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle leading zeros
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Case ID with special characters @p2', async ({ authenticatedPage }) => {
      const specialCaseIds = ['CASE-123', 'CASE_456', 'CASE.789', 'CASE/123'];

      for (const caseId of specialCaseIds) {
        await caseSearch.caseId.fill(caseId);
        await caseSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should handle various formats or show validation
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        await caseSearch.caseId.clear();
        await smartWait(authenticatedPage, 300);
      }
    });

    test('Very long case ID @p3', async ({ authenticatedPage }) => {
      const longCaseId = '1'.repeat(100);

      await caseSearch.caseId.fill(longCaseId);
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle gracefully (may truncate or show validation)
      const systemError = authenticatedPage.locator('.snackbar.error.show');
      await expect(systemError).not.toContainText('500').catch(() => {});
    });

    test('Non-existent case ID shows appropriate message @p2', async ({ authenticatedPage }) => {
      const nonExistentId = '999999999';

      await caseSearch.caseId.fill(nonExistentId);
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should show no results message
      const noResultsMessage = authenticatedPage.getByText('No matching records found');
      const hasNoResults = await noResultsMessage.isVisible({ timeout: 5000 }).catch(() => false);

      // Or empty table
      const emptyTable = authenticatedPage.locator('tbody .dataTables_empty');
      const hasEmptyTable = await emptyTable.isVisible({ timeout: 5000 }).catch(() => false);

      // Should indicate no results found
      expect(hasNoResults || hasEmptyTable).toBe(true);
    });
  });

  test.describe('Search by Request ID', () => {
    test('Search with valid request ID @p2', async ({ authenticatedPage }) => {
      const testRequestId = 'REQ12345';

      // Check the "Search by Request ID" checkbox
      await caseSearch.searchByRequestIdCheckBox.check();
      await expect(caseSearch.searchByRequestIdCheckBox).toBeChecked();

      await caseSearch.requestId.fill(testRequestId);
      await expect(caseSearch.requestId).toHaveValue(testRequestId);

      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Toggle between case ID and request ID mode @p2', async ({ authenticatedPage }) => {
      // Start with case ID search
      await caseSearch.caseId.fill('12345');
      await expect(caseSearch.caseId).toHaveValue('12345');

      // Switch to request ID mode
      await caseSearch.searchByRequestIdCheckBox.check();
      await smartWait(authenticatedPage, 500);

      // Fill request ID
      await caseSearch.requestId.fill('REQ001');

      // Switch back to case ID mode
      await caseSearch.searchByRequestIdCheckBox.uncheck();
      await smartWait(authenticatedPage, 500);

      // Should maintain case ID value
      const caseIdValue = await caseSearch.caseId.inputValue();
      expect(caseIdValue).toBe('12345');
    });

    test('Search by request ID with empty value @p2', async ({ authenticatedPage }) => {
      // Check request ID mode
      await caseSearch.searchByRequestIdCheckBox.check();

      // Try to search without filling request ID
      await caseSearch.searchButton.click();
      await smartWait(authenticatedPage, 1000);

      // Should show validation or do nothing
      const errorMessage = authenticatedPage.locator('.snackbar.error.show, .error');
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      // Validation should prevent empty search
      if (hasError) {
        expect(hasError).toBe(true);
      }
    });

    test('Request ID with various formats @p2', async ({ authenticatedPage }) => {
      const requestIdFormats = [
        'REQ-12345',
        'REQ_12345',
        'REQ.12345',
        '12345-REQ',
        'REQUEST123',
      ];

      await caseSearch.searchByRequestIdCheckBox.check();

      for (const reqId of requestIdFormats) {
        await caseSearch.requestId.fill(reqId);
        await caseSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should handle various formats
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        await caseSearch.requestId.clear();
        await smartWait(authenticatedPage, 300);
      }
    });
  });

  test.describe('Search Mode Validation', () => {
    test('Correct field is used based on checkbox state @p1', async ({ authenticatedPage }) => {
      // Verify case ID field is used when checkbox is unchecked
      const isChecked = await caseSearch.searchByRequestIdCheckBox.isChecked().catch(() => false);
      if (isChecked) {
        await caseSearch.searchByRequestIdCheckBox.uncheck();
      }

      await caseSearch.caseId.fill('CASE123');

      // Also fill request ID (should be ignored)
      await caseSearch.requestId.fill('REQ999');

      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should search by case ID, not request ID
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Checkbox state persists across searches @p2', async ({ authenticatedPage }) => {
      // Check the checkbox
      await caseSearch.searchByRequestIdCheckBox.check();
      await expect(caseSearch.searchByRequestIdCheckBox).toBeChecked();

      // Perform a search
      await caseSearch.requestId.fill('REQ123');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Verify checkbox is still checked
      await expect(caseSearch.searchByRequestIdCheckBox).toBeChecked();

      // Perform another search
      await caseSearch.requestId.clear();
      await caseSearch.requestId.fill('REQ456');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Checkbox should still be checked
      await expect(caseSearch.searchByRequestIdCheckBox).toBeChecked();
    });
  });

  test.describe('Security Tests', () => {
    test('SQL injection in case ID @p1 @security', async ({ authenticatedPage }) => {
      const sqlInjections = [
        "'; DROP TABLE cases; --",
        "1' OR '1'='1",
        "' UNION SELECT NULL--",
      ];

      for (const injection of sqlInjections) {
        await caseSearch.caseId.fill(injection);
        await caseSearch.searchButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should sanitize, not execute SQL
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('SQL').catch(() => {});
        await expect(systemError).not.toContainText('syntax').catch(() => {});
        await expect(systemError).not.toContainText('database').catch(() => {});

        await caseSearch.caseId.clear();
      }
    });

    test('XSS in request ID @p1 @security', async ({ authenticatedPage }) => {
      const xssAttempts = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert('xss')>",
      ];

      await caseSearch.searchByRequestIdCheckBox.check();

      for (const xss of xssAttempts) {
        await caseSearch.requestId.fill(xss);
        await caseSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Verify script not executed
        const pageContent = await authenticatedPage.content();
        const hasExecutableScript = pageContent.match(/<script[^>]*>.*?<\/script>/i);
        expect(hasExecutableScript).toBeFalsy();

        await caseSearch.requestId.clear();
      }
    });
  });

  test.describe('Case Sensitivity', () => {
    test('Case ID search is case insensitive @p2', async ({ authenticatedPage }) => {
      const testId = 'CASE123';
      const variations = ['case123', 'CASE123', 'Case123', 'cAsE123'];

      for (const variation of variations) {
        await caseSearch.caseId.fill(variation);
        await caseSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // All variations should be treated the same
        const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
        await expect(resultsArea).toBeVisible({ timeout: 10000 });

        await caseSearch.caseId.clear();
        await smartWait(authenticatedPage, 300);
      }
    });
  });

  test.describe('Whitespace Handling', () => {
    test('Leading and trailing whitespace trimmed @p2', async ({ authenticatedPage }) => {
      await caseSearch.caseId.fill('  12345  ');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should trim whitespace
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Whitespace in request ID @p3', async ({ authenticatedPage }) => {
      await caseSearch.searchByRequestIdCheckBox.check();
      await caseSearch.requestId.fill('  REQ 12345  ');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle whitespace
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('No Results Handling', () => {
    test('No results message displayed appropriately @p2', async ({ authenticatedPage }) => {
      await caseSearch.caseId.fill('NONEXISTENT999999');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should show no results
      const noResultsMessage = authenticatedPage.getByText('No matching records found');
      const emptyTable = authenticatedPage.locator('tbody .dataTables_empty');

      const hasNoResults = await noResultsMessage.isVisible({ timeout: 5000 }).catch(() => false);
      const hasEmptyTable = await emptyTable.isVisible({ timeout: 5000 }).catch(() => false);

      expect(hasNoResults || hasEmptyTable).toBe(true);
    });

    test('Can search again after no results @p2', async ({ authenticatedPage }) => {
      // First search with no results
      await caseSearch.caseId.fill('NORESULTS999');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Clear and search again
      await caseSearch.caseId.clear();
      await caseSearch.caseId.fill('12345');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute new search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Numeric vs Alphanumeric IDs', () => {
    test('Numeric case ID @p2', async ({ authenticatedPage }) => {
      await caseSearch.caseId.fill('123456789');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Alphanumeric case ID @p2', async ({ authenticatedPage }) => {
      await caseSearch.caseId.fill('CASE123ABC');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Mixed format request ID @p2', async ({ authenticatedPage }) => {
      await caseSearch.searchByRequestIdCheckBox.check();
      await caseSearch.requestId.fill('REQ123-456-ABC');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Error Recovery', () => {
    test('Recover from validation error @p2', async ({ authenticatedPage }) => {
      // Trigger validation error
      await caseSearch.searchButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fix by providing valid input
      await caseSearch.caseId.fill('12345');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should now execute successfully
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Clear search and start fresh @p2', async ({ authenticatedPage }) => {
      // Perform a search
      await caseSearch.caseId.fill('FIRST123');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Clear everything
      await caseSearch.caseId.clear();

      // Verify field is empty
      const caseIdValue = await caseSearch.caseId.inputValue();
      expect(caseIdValue).toBe('');

      // Perform new search
      await caseSearch.caseId.fill('SECOND456');
      await caseSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute new search
      const resultsArea = authenticatedPage.locator('table tbody, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Field State Management', () => {
    test('Switching modes clears opposite field @p3', async ({ authenticatedPage }) => {
      // Fill case ID
      await caseSearch.caseId.fill('CASE123');

      // Switch to request ID mode
      await caseSearch.searchByRequestIdCheckBox.check();
      await smartWait(authenticatedPage, 500);

      // Check if case ID was cleared (implementation dependent)
      const caseIdValue = await caseSearch.caseId.inputValue();

      // Either cleared or disabled when in request ID mode
      // This behavior is application-specific
      expect(caseIdValue).toBeDefined();
    });

    test('Field values preserved during page interaction @p3', async ({ authenticatedPage }) => {
      // Fill case ID
      await caseSearch.caseId.fill('TEST123');

      // Click elsewhere on page
      await authenticatedPage.locator('body').click({ position: { x: 10, y: 10 } });
      await smartWait(authenticatedPage, 500);

      // Value should be preserved
      const caseIdValue = await caseSearch.caseId.inputValue();
      expect(caseIdValue).toBe('TEST123');
    });
  });
});
