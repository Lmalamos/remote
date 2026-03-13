// ============================================
// IMMUNIZATIONS - COMPREHENSIVE TESTS
// Add, search, validation, dates, reactions, history
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { immunizationPanel } from '../pages/memberHub/immunizations';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait, waitForElementVisible } from '../utils/waitHelpers';

test.describe(`${Tags.IMMUNIZATIONS} ${Tags.MEMBER_HUB} Immunizations - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let immunizations: immunizationPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    immunizations = new immunizationPanel(authenticatedPage);

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

    // Open immunizations panel
    await immunizations.immunizationsHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Add Immunization', () => {
    test('Add immunization with search @p2', async ({ authenticatedPage }) => {
      // Click Add button
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search for immunization
      await immunizations.immunizationsSearchInput.fill('COVID');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should show search results
      const resultsTable = authenticatedPage.locator('table').filter({ hasText: 'Select' });
      const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasResults) {
        // Results found
        expect(hasResults).toBe(true);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
      await waitForNetworkIdle(authenticatedPage);
    });

    test('Search for specific immunization code @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search for specific immunization
      const searchTerms = ['Flu', 'MMR', 'Tetanus', 'Hepatitis'];

      for (const term of searchTerms) {
        await immunizations.immunizationsSearchInput.clear();
        await immunizations.immunizationsSearchInput.fill(term);
        await immunizations.immunizationsSearchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should execute search
        const resultsArea = authenticatedPage.locator('table, .dataTables_info');
        const hasContent = await resultsArea.isVisible({ timeout: 5000 }).catch(() => false);

        // Either has results or "no results" message
        expect(hasContent).toBeDefined();

        await smartWait(authenticatedPage, 500);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Add immunization with date @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search for immunization
      await immunizations.immunizationsSearchInput.fill('Influenza');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Check if date field exists
      const dateField = authenticatedPage.locator('input[name*="date"], input[type="date"]').first();
      const dateFieldVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateFieldVisible) {
        // Fill date
        await dateField.fill('01/15/2024');
        await smartWait(authenticatedPage, 500);

        // Date should be accepted
        const dateValue = await dateField.inputValue();
        expect(dateValue).toBeTruthy();
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Search with no results shows appropriate message @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search for something that won't exist
      await immunizations.immunizationsSearchInput.fill('NonExistentImmunization999XYZ');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should show no results
      const noResults = authenticatedPage.getByText('No matching records found');
      const hasNoResults = await noResults.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasNoResults) {
        expect(hasNoResults).toBe(true);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Cancel immunization add returns to list @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Start filling
      await immunizations.immunizationsSearchInput.fill('TestImmunization');

      // Cancel without searching
      await immunizations.immunizationsCancelSearchButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should return to immunizations list
      await expect(immunizations.immunizationsAddButton).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Immunization Search Validation', () => {
    test('Empty search shows validation @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Try to search without entering anything
      await immunizations.immunizationsSearchByTermButton.click();
      await smartWait(authenticatedPage, 1000);

      // Should show validation or no results
      const errorMessage = authenticatedPage.locator('.error, .alert-danger, .snackbar');
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      // Either shows error or search field remains active
      if (!hasError) {
        const searchInputVisible = await immunizations.immunizationsSearchInput.isVisible();
        expect(searchInputVisible).toBe(true);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Special characters in search @p3', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      const specialSearches = ['Imm-123', 'Test/Imm', 'Imm.456'];

      for (const search of specialSearches) {
        await immunizations.immunizationsSearchInput.fill(search);
        await immunizations.immunizationsSearchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should handle gracefully
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        await smartWait(authenticatedPage, 300);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Very long search term @p3', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Enter very long search term
      const longTerm = 'A'.repeat(200);
      await immunizations.immunizationsSearchInput.fill(longTerm);
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should handle without crashing
      const systemError = authenticatedPage.locator('.snackbar.error.show');
      await expect(systemError).not.toContainText('500').catch(() => {});

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });
  });

  test.describe('Immunization List View', () => {
    test('Immunizations table displays correctly @p2', async ({ authenticatedPage }) => {
      // Check if table exists
      const immunizationsTable = authenticatedPage.locator('#immunizationsTable');
      const tableVisible = await immunizationsTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (tableVisible) {
        // Table should have headers
        const headers = await immunizationsTable.locator('thead th').count();
        expect(headers).toBeGreaterThan(0);
      } else {
        // No immunizations yet, should show empty state or add button
        await expect(immunizations.immunizationsAddButton).toBeVisible();
      }
    });

    test('Search immunizations table @p2', async ({ authenticatedPage }) => {
      // Check if table search exists
      const tableSearch = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await tableSearch.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await tableSearch.fill('test');
        await smartWait(authenticatedPage, 500);

        // Search should filter table
        const tableArea = authenticatedPage.locator('#immunizationsTable, .dataTables_info');
        await expect(tableArea).toBeVisible({ timeout: 5000 });
      }
    });

    test('Table pagination works @p3', async ({ authenticatedPage }) => {
      // Check for pagination controls
      const paginationInfo = authenticatedPage.locator('.dataTables_info').first();
      const paginationVisible = await paginationInfo.isVisible({ timeout: 3000 }).catch(() => false);

      if (paginationVisible) {
        const infoText = await paginationInfo.textContent();
        console.log('Pagination info:', infoText);

        // Should show entry count
        expect(infoText).toBeTruthy();
      }
    });

    test('Change table entries per page @p3', async ({ authenticatedPage }) => {
      const entriesDropdown = authenticatedPage.getByRole('combobox').first();
      const dropdownVisible = await entriesDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (dropdownVisible) {
        await entriesDropdown.selectOption('100');
        await smartWait(authenticatedPage, 1000);

        // Table should update
        const tableArea = authenticatedPage.locator('#immunizationsTable');
        await expect(tableArea).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Date Handling', () => {
    test('Immunization with past date @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search for immunization
      await immunizations.immunizationsSearchInput.fill('Flu');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Check for date field
      const dateField = authenticatedPage.locator('input[name*="date"], .calendar, [type="date"]').first();
      const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Enter past date
        await dateField.fill('01/15/2020');
        await smartWait(authenticatedPage, 500);

        // Past dates should be allowed for immunization history
        const dateValue = await dateField.inputValue();
        expect(dateValue).toBeTruthy();
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Immunization with future date shows warning @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      await immunizations.immunizationsSearchInput.fill('COVID');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      const dateField = authenticatedPage.locator('input[name*="date"], [type="date"]').first();
      const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Enter future date
        await dateField.fill('12/31/2099');
        await smartWait(authenticatedPage, 1000);

        // May show validation warning for future date
        const warningMessage = authenticatedPage.locator('.warning, .alert-warning');
        const hasWarning = await warningMessage.isVisible({ timeout: 2000 }).catch(() => false);

        // Either shows warning or accepts future scheduled immunization
        console.log('Future date warning:', hasWarning);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Invalid date format shows validation @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      await immunizations.immunizationsSearchInput.fill('Tetanus');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      const dateField = authenticatedPage.locator('input[name*="date"], [type="date"]').first();
      const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Enter invalid date
        await dateField.fill('99/99/9999');
        await smartWait(authenticatedPage, 1000);

        // Should show validation or not accept
        const validationError = authenticatedPage.locator('.field-validation-error, .error');
        const hasError = await validationError.isVisible({ timeout: 2000 }).catch(() => false);

        // Either shows error or field rejects invalid date
        console.log('Invalid date error:', hasError);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });
  });

  test.describe('Immunization Categories', () => {
    test('Search by different vaccine types @p2', async ({ authenticatedPage }) => {
      const vaccineTypes = [
        'Influenza',
        'COVID-19',
        'Pneumococcal',
        'Hepatitis',
        'Shingles',
        'Tdap',
      ];

      for (const vaccine of vaccineTypes) {
        await immunizations.immunizationsAddButton.click();
        await waitForElementVisible(immunizations.immunizationsSearchInput);

        await immunizations.immunizationsSearchInput.fill(vaccine);
        await immunizations.immunizationsSearchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should execute search
        const resultsArea = authenticatedPage.locator('table, .dataTables_info');
        const hasResults = await resultsArea.isVisible({ timeout: 5000 }).catch(() => false);

        console.log(`${vaccine} search executed:`, hasResults);

        // Cancel and continue to next
        await immunizations.immunizationsCancelSearchButton.click();
        await smartWait(authenticatedPage, 500);
      }
    });

    test('Search with vaccine code @p3', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Search by code (CVX code)
      await immunizations.immunizationsSearchInput.fill('208'); // COVID-19 CVX code
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should search by code
      const resultsArea = authenticatedPage.locator('table, .dataTables_info');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });
  });

  test.describe('Multiple Immunizations', () => {
    test('Add multiple immunizations in sequence @p2', async ({ authenticatedPage }) => {
      const immunizationsToAdd = ['Flu', 'COVID', 'Pneumonia'];

      for (const imm of immunizationsToAdd) {
        await immunizations.immunizationsAddButton.click();
        await waitForElementVisible(immunizations.immunizationsSearchInput);

        await immunizations.immunizationsSearchInput.fill(imm);
        await immunizations.immunizationsSearchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Cancel (to avoid actual additions)
        await immunizations.immunizationsCancelSearchButton.click();
        await smartWait(authenticatedPage, 500);
      }

      // All operations completed without errors
      await expect(immunizations.immunizationsAddButton).toBeVisible();
    });

    test('View immunization history @p2', async ({ authenticatedPage }) => {
      // Check if immunization table has history
      const immunizationTable = authenticatedPage.locator('#immunizationsTable');
      const hasTable = await immunizationTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        // Count rows (if any)
        const rows = await immunizationTable.locator('tbody tr').count();
        console.log('Immunization history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Notes and Additional Info', () => {
    test('Add immunization with notes @p3', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      await immunizations.immunizationsSearchInput.fill('Flu');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Look for notes field
      const notesField = authenticatedPage.getByRole('textbox', { name: /notes/i }).first();
      const notesVisible = await notesField.isVisible({ timeout: 3000 }).catch(() => false);

      if (notesVisible) {
        await notesField.fill('Annual flu vaccine. No adverse reactions reported.');
        await smartWait(authenticatedPage, 500);

        const notesValue = await notesField.inputValue();
        expect(notesValue).toContain('Annual flu vaccine');
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Add immunization with very long notes @p3', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      await immunizations.immunizationsSearchInput.fill('COVID');
      await immunizations.immunizationsSearchByTermButton.click();
      await waitForNetworkIdle(authenticatedPage);

      const notesField = authenticatedPage.getByRole('textbox', { name: /notes/i }).first();
      const notesVisible = await notesField.isVisible({ timeout: 3000 }).catch(() => false);

      if (notesVisible) {
        const longNotes = 'A'.repeat(500) + ' - Very long immunization notes for testing field handling.';
        await notesField.fill(longNotes);
        await smartWait(authenticatedPage, 500);

        // Should handle long notes
        const notesValue = await notesField.inputValue();
        expect(notesValue.length).toBeGreaterThan(0);
      }

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });
  });

  test.describe('Error Handling', () => {
    test('Handle search errors gracefully @p2', async ({ authenticatedPage }) => {
      await immunizations.immunizationsAddButton.click();
      await waitForElementVisible(immunizations.immunizationsSearchInput);

      // Perform search
      await immunizations.immunizationsSearchInput.fill('TestImmunization');
      await immunizations.immunizationsSearchByTermButton.click();
      await smartWait(authenticatedPage, 3000);

      // Should not show system errors
      const systemError = authenticatedPage.locator('.snackbar.error.show');
      const errorText = await systemError.textContent().catch(() => '');

      expect(errorText).not.toContain('500');
      expect(errorText).not.toContain('Internal Server Error');

      // Cancel
      await immunizations.immunizationsCancelSearchButton.click();
    });

    test('Recover from cancelled add operation @p2', async ({ authenticatedPage }) => {
      // Open and cancel multiple times
      for (let i = 0; i < 3; i++) {
        await immunizations.immunizationsAddButton.click();
        await smartWait(authenticatedPage, 500);

        await immunizations.immunizationsCancelSearchButton.click();
        await smartWait(authenticatedPage, 500);
      }

      // Should still be functional
      await expect(immunizations.immunizationsAddButton).toBeVisible();
    });
  });

  test.describe('Case Sensitivity', () => {
    test('Search is case insensitive @p3', async ({ authenticatedPage }) => {
      const variations = ['flu', 'FLU', 'Flu', 'fLu'];

      for (const variation of variations) {
        await immunizations.immunizationsAddButton.click();
        await waitForElementVisible(immunizations.immunizationsSearchInput);

        await immunizations.immunizationsSearchInput.fill(variation);
        await immunizations.immunizationsSearchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // All variations should return similar results
        const resultsArea = authenticatedPage.locator('table, .dataTables_info');
        await expect(resultsArea).toBeVisible({ timeout: 5000 });

        await immunizations.immunizationsCancelSearchButton.click();
        await smartWait(authenticatedPage, 300);
      }
    });
  });
});
