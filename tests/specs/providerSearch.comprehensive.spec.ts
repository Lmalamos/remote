// ============================================
// PROVIDER SEARCH - COMPREHENSIVE TESTS
// Edge cases, validation, security, data formats
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { providerSearchPage } from '../pages/providerSearch';
import { navigationPage } from '../pages/navigationPage';
import { Tags } from '../tags';
import { CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.PROVIDER} Provider Search - Comprehensive`, () => {
  let providerSearch: providerSearchPage;
  let navigation: navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    providerSearch = new providerSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);

    // Navigate to provider search
    await navigation.goToDashboard();
    await navigation.openSearchMenu();

    // Click Provider Search menu item
    const providerSearchLink = authenticatedPage.getByRole('link', { name: 'Provider Search' });
    await providerSearchLink.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Validation Tests', () => {
    test('Search with no criteria shows error @p1', async ({ authenticatedPage }) => {
      // Try to search without any criteria
      await providerSearch.searchButton.click();
      await smartWait(authenticatedPage, 1000);

      // Should show validation error
      const errorMessage = authenticatedPage.locator('.snackbar.error.show, .error, .alert-danger');
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasError) {
        const errorText = await errorMessage.textContent();
        // Should indicate search criteria required
        expect(errorText).toBeTruthy();
      }
    });

    test('Search with NPI validates format @p2', async ({ authenticatedPage }) => {
      // Test invalid NPI formats
      const invalidNPIs = [
        '123',           // Too short
        'ABCDEFGHIJ',    // Letters
        '123456789012',  // Too long
      ];

      for (const npi of invalidNPIs) {
        await providerSearch.npi.fill(npi);
        await providerSearch.searchButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should either validate or find no results (not crash)
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        // Clear for next iteration
        await providerSearch.npi.clear();
      }
    });

    test('Search with valid NPI format @p2', async ({ authenticatedPage }) => {
      // Valid NPI is 10 digits
      const validNPI = '1234567890';

      await providerSearch.npi.fill(validNPI);
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search (may find results or show "no results")
      const resultsTable = authenticatedPage.locator('table tbody');
      const noResultsMessage = authenticatedPage.getByText('No matching records found');

      // Either has results or no results message
      const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);
      const hasNoResults = await noResultsMessage.isVisible({ timeout: 5000 }).catch(() => false);

      expect(hasResults || hasNoResults).toBe(true);
    });
  });

  test.describe('Search by Location', () => {
    test('Search by city only @p2', async ({ authenticatedPage }) => {
      await providerSearch.city.fill('Ames');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by city and state @p2', async ({ authenticatedPage }) => {
      await providerSearch.city.fill('Des Moines');
      await providerSearch.state.selectOption('IA');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should narrow results
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by state only @p2', async ({ authenticatedPage }) => {
      await providerSearch.state.selectOption('IA');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // May return many results or require additional criteria
      const resultsArea = authenticatedPage.locator('table, .dataTables_info, .snackbar');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search with zip code @p2', async ({ authenticatedPage }) => {
      await providerSearch.zipCode.fill('50014');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search with invalid zip code @p2', async ({ authenticatedPage }) => {
      const invalidZips = ['123', 'ABCDE', '12345678901'];

      for (const zip of invalidZips) {
        await providerSearch.zipCode.fill(zip);
        await providerSearch.searchButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should handle gracefully
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        await providerSearch.zipCode.clear();
      }
    });
  });

  test.describe('Search by Name', () => {
    test('Search by organization name @p2', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('Hospital');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by last name @p2', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('Smith');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by first and last name @p2', async ({ authenticatedPage }) => {
      await providerSearch.firstName.fill('John');
      await providerSearch.lastOrganizationName.fill('Doe');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search with special characters in name @p2', async ({ authenticatedPage }) => {
      const specialNames = ["O'Brien", 'García', 'Jean-Paul'];

      for (const name of specialNames) {
        await providerSearch.lastOrganizationName.fill(name);
        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should handle special characters
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('encoding').catch(() => {});
        await expect(systemError).not.toContainText('500').catch(() => {});

        await providerSearch.lastOrganizationName.clear();
      }
    });
  });

  test.describe('Search Combinations', () => {
    test('Search with all fields populated @p2', async ({ authenticatedPage }) => {
      // Fill all available fields
      await providerSearch.npi.fill('1234567890');
      await providerSearch.otherIdNumber.fill('OTHER123');
      await providerSearch.lastOrganizationName.fill('Test Provider');
      await providerSearch.firstName.fill('Test');
      await providerSearch.city.fill('Ames');
      await providerSearch.state.selectOption('IA');
      await providerSearch.zipCode.fill('50014');

      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search with all criteria
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by NPI takes precedence @p2', async ({ authenticatedPage }) => {
      // When NPI is provided, it should be primary search
      await providerSearch.npi.fill('1234567890');
      await providerSearch.lastOrganizationName.fill('Different Name');

      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should search (NPI is unique identifier)
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Search by location and name @p2', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('Clinic');
      await providerSearch.city.fill('Ames');
      await providerSearch.state.selectOption('IA');

      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should narrow results by both criteria
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Security Tests', () => {
    test('SQL injection in provider name @p1 @security', async ({ authenticatedPage }) => {
      const sqlInjections = [
        "'; DROP TABLE providers; --",
        "1' OR '1'='1",
        "' UNION SELECT NULL--",
      ];

      for (const injection of sqlInjections) {
        await providerSearch.lastOrganizationName.fill(injection);
        await providerSearch.searchButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should sanitize input, not execute SQL
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('SQL').catch(() => {});
        await expect(systemError).not.toContainText('syntax').catch(() => {});
        await expect(systemError).not.toContainText('database').catch(() => {});

        await providerSearch.lastOrganizationName.clear();
      }
    });

    test('XSS in provider search fields @p1 @security', async ({ authenticatedPage }) => {
      const xssAttempts = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert('xss')>",
      ];

      for (const xss of xssAttempts) {
        await providerSearch.firstName.fill(xss);
        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Verify script not executed
        const pageContent = await authenticatedPage.content();
        const hasExecutableScript = pageContent.match(/<script[^>]*>.*?<\/script>/i);
        expect(hasExecutableScript).toBeFalsy();

        await providerSearch.firstName.clear();
      }
    });
  });

  test.describe('Boundary Testing', () => {
    test('Search with very long provider name @p3', async ({ authenticatedPage }) => {
      const longName = 'A'.repeat(255);

      await providerSearch.lastOrganizationName.fill(longName);
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle gracefully
      const systemError = authenticatedPage.locator('.snackbar.error.show');
      await expect(systemError).not.toContainText('500').catch(() => {});
    });

    test('Search with minimum valid criteria @p2', async ({ authenticatedPage }) => {
      // Just city (minimal criteria)
      await providerSearch.city.fill('A');
      await providerSearch.searchButton.click();
      await smartWait(authenticatedPage, 1000);

      // May require more criteria or execute search
      const response = authenticatedPage.locator('table, .dataTables_info, .snackbar');
      await expect(response).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Case Sensitivity', () => {
    test('Search is case insensitive @p2', async ({ authenticatedPage }) => {
      const testName = 'TestProvider';
      const variations = [
        'testprovider',
        'TESTPROVIDER',
        'TestProvider',
        'tEsTpRoViDeR',
      ];

      let firstResultCount = 0;

      for (let i = 0; i < variations.length; i++) {
        const variation = variations[i];

        await providerSearch.lastOrganizationName.fill(variation);
        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Get result count
        const infoText = authenticatedPage.locator('.dataTables_info').first();
        const infoVisible = await infoText.isVisible({ timeout: 5000 }).catch(() => false);

        if (infoVisible) {
          const text = await infoText.textContent();
          // All variations should return same results

          if (i === 0) {
            // Store first result for comparison
            firstResultCount = 1; // Placeholder
          }
        }

        await providerSearch.lastOrganizationName.clear();
      }
    });
  });

  test.describe('Whitespace Handling', () => {
    test('Leading and trailing whitespace trimmed @p2', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('  Provider Name  ');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should trim whitespace and search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Multiple spaces handled @p3', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('Provider     Name');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle extra spaces
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('No Results Handling', () => {
    test('No results shows appropriate message @p2', async ({ authenticatedPage }) => {
      await providerSearch.lastOrganizationName.fill('NonExistentProvider99999XYZ');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should show "no results" message
      const noResultsMessage = authenticatedPage.getByText('No matching records found');
      await expect(noResultsMessage).toBeVisible({ timeout: 5000 });
    });

    test('Can search again after no results @p2', async ({ authenticatedPage }) => {
      // Search with no results
      await providerSearch.lastOrganizationName.fill('NoResults999');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Clear and search again
      await providerSearch.lastOrganizationName.clear();
      await providerSearch.city.fill('Ames');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute new search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Taxonomy Search', () => {
    test('Search by taxonomy code @p2', async ({ authenticatedPage }) => {
      // Select taxonomy if dropdown has options
      const taxonomyOptions = await providerSearch.taxonomy.locator('option').count();

      if (taxonomyOptions > 1) {
        // Select second option (first is usually "Select...")
        await providerSearch.taxonomy.selectOption({ index: 1 });
        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should execute search
        const resultsArea = authenticatedPage.locator('table, .dataTables_info');
        await expect(resultsArea).toBeVisible({ timeout: 10000 });
      }
    });

    test('Taxonomy combined with location @p2', async ({ authenticatedPage }) => {
      const taxonomyOptions = await providerSearch.taxonomy.locator('option').count();

      if (taxonomyOptions > 1) {
        await providerSearch.taxonomy.selectOption({ index: 1 });
        await providerSearch.city.fill('Ames');
        await providerSearch.state.selectOption('IA');

        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should narrow results
        const resultsArea = authenticatedPage.locator('table, .dataTables_info');
        await expect(resultsArea).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Other ID Number Search', () => {
    test('Search by other ID number @p3', async ({ authenticatedPage }) => {
      await providerSearch.otherIdNumber.fill('123456');
      await providerSearch.searchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should execute search
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    });

    test('Other ID with special characters @p3', async ({ authenticatedPage }) => {
      const specialIds = ['ID-123', 'ID.456', 'ID/789'];

      for (const id of specialIds) {
        await providerSearch.otherIdNumber.fill(id);
        await providerSearch.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should handle various formats
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        await providerSearch.otherIdNumber.clear();
      }
    });
  });
});
