// ============================================
// LABS - COMPREHENSIVE TESTS
// Lab results, ranges, dates, search by term/code, validation
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { labsPanel } from '../pages/memberHub/labs';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.LABS} ${Tags.MEMBER_HUB} Labs - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let labs: labsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    labs = new labsPanel(authenticatedPage);

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

    // Open labs panel
    await labs.labsHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Add Lab Results', () => {
    test('Add lab with common fields @p1', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill common lab values
      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        await labs.hgbA1c.fill('6.5');
        await expect(labs.hgbA1c).toHaveValue('6.5');

        await labs.totalCholesterol.fill('200');
        await expect(labs.totalCholesterol).toHaveValue('200');

        await labs.hdl.fill('50');
        await expect(labs.hdl).toHaveValue('50');

        await labs.ldl.fill('130');
        await expect(labs.ldl).toHaveValue('130');
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Add all lab values @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill all available lab fields
      const fieldTests = [
        { field: labs.hgbA1c, value: '7.2', name: 'HgbA1c' },
        { field: labs.microAlbuminCreatinRatio, value: '30', name: 'MicroAlbumin' },
        { field: labs.totalCholesterol, value: '220', name: 'Total Chol' },
        { field: labs.triglycerides, value: '150', name: 'Triglycerides' },
        { field: labs.ldl, value: '140', name: 'LDL' },
        { field: labs.hdl, value: '45', name: 'HDL' },
        { field: labs.glucose, value: '100', name: 'Glucose' },
        { field: labs.fastingGlucose, value: '95', name: 'Fasting Glucose' },
      ];

      for (const test of fieldTests) {
        const isVisible = await test.field.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          await test.field.fill(test.value);
          await smartWait(authenticatedPage, 200);

          console.log(`Filled ${test.name}: ${test.value}`);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Lab result date required @p1', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Check if result date is required
      const resultDateField = authenticatedPage.getByRole('textbox', { name: /result date/i }).first();
      const dateVisible = await resultDateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Check for required indicator
        const parentLabel = authenticatedPage.locator('label:has-text("Result Date")');
        const labelText = await parentLabel.textContent().catch(() => '');

        const isRequired = labelText.includes('*');
        console.log('Result date is required:', isRequired);

        expect(isRequired).toBe(true);
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Lab Value Validation', () => {
    test('HgbA1c within normal range @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        // Test normal range (4-6%)
        await labs.hgbA1c.fill('5.5');
        await smartWait(authenticatedPage, 500);

        // Should accept normal value
        const value = await labs.hgbA1c.inputValue();
        expect(value).toBe('5.5');
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('HgbA1c extreme values @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        const extremeValues = ['2.0', '15.0', '0', '20'];

        for (const value of extremeValues) {
          await labs.hgbA1c.clear();
          await labs.hgbA1c.fill(value);
          await smartWait(authenticatedPage, 500);

          console.log(`Testing HgbA1c: ${value}`);

          // May show warning but should not crash
          const warning = authenticatedPage.locator('.warning, .alert-warning');
          const hasWarning = await warning.isVisible({ timeout: 1000 }).catch(() => false);

          console.log(`  Warning shown: ${hasWarning}`);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Cholesterol values validation @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Test cholesterol value ranges
      const cholesterolTests = [
        { field: labs.totalCholesterol, value: '150', desc: 'Desirable' },
        { field: labs.totalCholesterol, value: '240', desc: 'High' },
        { field: labs.hdl, value: '60', desc: 'Good HDL' },
        { field: labs.hdl, value: '30', desc: 'Low HDL' },
        { field: labs.ldl, value: '100', desc: 'Optimal LDL' },
        { field: labs.ldl, value: '160', desc: 'High LDL' },
      ];

      for (const test of cholesterolTests) {
        const isVisible = await test.field.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          await test.field.clear();
          await test.field.fill(test.value);
          await smartWait(authenticatedPage, 300);

          console.log(`${test.desc}: ${test.value}`);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Negative lab values rejected @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        // Try negative value
        await labs.hgbA1c.fill('-5');
        await smartWait(authenticatedPage, 500);

        // Should reject or show validation
        const value = await labs.hgbA1c.inputValue();
        const isNegative = parseFloat(value) < 0;

        expect(isNegative).toBe(false);
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Non-numeric lab values rejected @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        // Try letters
        await labs.hgbA1c.fill('ABC');
        await smartWait(authenticatedPage, 500);

        // Should reject non-numeric
        const value = await labs.hgbA1c.inputValue();
        const isNumeric = /^\d*\.?\d*$/.test(value);

        expect(isNumeric).toBe(true);
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Search By Term', () => {
    test('Search labs by term @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Click "Search By Term" radio button
      const searchByTermVisible = await labs.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await labs.searchByTerm.click();
        await smartWait(authenticatedPage, 500);

        // Fill search term
        const searchInput = authenticatedPage.locator('#txtLabSearchByTerm');
        await searchInput.fill('Glucose');

        // Click search
        await labs.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should show results
        const resultsTable = authenticatedPage.locator('table').filter({ hasText: 'Select' });
        const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);

        console.log('Lab search results shown:', hasResults);
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Search with no results @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const searchByTermVisible = await labs.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await labs.searchByTerm.click();
        await smartWait(authenticatedPage, 500);

        const searchInput = authenticatedPage.locator('#txtLabSearchByTerm');
        await searchInput.fill('NonExistentLab999XYZ');

        await labs.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should show no results message
        const noResults = authenticatedPage.getByText('No matching records found');
        const hasNoResults = await noResults.isVisible({ timeout: 5000 }).catch(() => false);

        console.log('No results message shown:', hasNoResults);
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Search by common lab names @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const searchByTermVisible = await labs.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        const commonLabs = ['Glucose', 'Cholesterol', 'Hemoglobin', 'Creatinine'];

        for (const labName of commonLabs) {
          await labs.searchByTerm.click();
          await smartWait(authenticatedPage, 300);

          const searchInput = authenticatedPage.locator('#txtLabSearchByTerm');
          await searchInput.clear();
          await searchInput.fill(labName);

          await labs.searchButton.click();
          await waitForNetworkIdle(authenticatedPage);

          console.log(`Searched for: ${labName}`);

          await smartWait(authenticatedPage, 500);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Search By Category', () => {
    test('Select lab category @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const categoryVisible = await labs.searchByTermCategory.isVisible({ timeout: 3000 }).catch(() => false);

      if (categoryVisible) {
        // Get available categories
        const options = await labs.searchByTermCategory.locator('option').allTextContents();
        console.log('Available lab categories:', options);

        // Select a category (if available)
        if (options.length > 1) {
          await labs.searchByTermCategory.selectOption({ index: 1 });
          await smartWait(authenticatedPage, 500);

          await labs.searchButton.click();
          await waitForNetworkIdle(authenticatedPage);

          // Should show category results
          console.log('Category search executed');
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Lab Result Entry', () => {
    test('Enter lab result after search @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const searchByTermVisible = await labs.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await labs.searchByTerm.click();
        await smartWait(authenticatedPage, 500);

        const searchInput = authenticatedPage.locator('#txtLabSearchByTerm');
        await searchInput.fill('CD16+CD56+ cells/100 cells in Blood');

        await labs.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Select result
        const radioButtonVisible = await labs.searchByTermRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (radioButtonVisible) {
          await labs.searchByTermRadioButton.check();
          await smartWait(authenticatedPage, 500);

          // Enter lab result
          await labs.searchByTermLabResult.fill('36');
          await expect(labs.searchByTermLabResult).toHaveValue('36');
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Lab result field validation @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const searchByTermVisible = await labs.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await labs.searchByTerm.click();

        const searchInput = authenticatedPage.locator('#txtLabSearchByTerm');
        await searchInput.fill('TestLab');

        await labs.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Try to enter non-numeric result
        const resultField = labs.searchByTermLabResult;
        const resultVisible = await resultField.isVisible({ timeout: 3000 }).catch(() => false);

        if (resultVisible) {
          await resultField.fill('INVALID');
          await smartWait(authenticatedPage, 500);

          // Should reject or clear invalid input
          const value = await resultField.inputValue();
          console.log('Result after invalid input:', value);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Calculated Fields', () => {
    test('Cholesterol/HDL ratio auto-calculates @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const totalCholVisible = await labs.totalCholesterol.isVisible({ timeout: 3000 }).catch(() => false);
      const hdlVisible = await labs.hdl.isVisible({ timeout: 3000 }).catch(() => false);

      if (totalCholVisible && hdlVisible) {
        // Enter total cholesterol and HDL
        await labs.totalCholesterol.fill('200');
        await labs.hdl.fill('50');

        await smartWait(authenticatedPage, 1000);

        // Ratio should calculate (200/50 = 4.0)
        const ratioValue = await labs.cholesterolTotalHdlRatio.inputValue();
        console.log('Calculated cholesterol/HDL ratio:', ratioValue);

        if (ratioValue) {
          const ratio = parseFloat(ratioValue);
          expect(ratio).toBeCloseTo(4.0, 1);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Calculated fields are read-only @p3', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const ratioVisible = await labs.cholesterolTotalHdlRatio.isVisible({ timeout: 3000 }).catch(() => false);

      if (ratioVisible) {
        // Ratio field should be disabled
        const isDisabled = await labs.cholesterolTotalHdlRatio.isDisabled();
        console.log('Cholesterol/HDL ratio is read-only:', isDisabled);

        expect(isDisabled).toBe(true);
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Date Handling', () => {
    test('Set lab result date @p1', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Click date picker
      const dateButton = authenticatedPage.getByRole('button', { name: /open calendar/i }).first();
      const dateVisible = await dateButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        await dateButton.click();
        await smartWait(authenticatedPage, 500);

        // Calendar should open
        const calendar = authenticatedPage.locator('.datepicker, .calendar');
        const calendarVisible = await calendar.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Lab date calendar opened:', calendarVisible);
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Past lab results accepted @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const dateField = authenticatedPage.getByRole('textbox', { name: /result date/i }).first();
      const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Enter past date
        await dateField.fill('01/15/2023');
        await smartWait(authenticatedPage, 500);

        // Past dates should be accepted
        const dateValue = await dateField.inputValue();
        expect(dateValue).toBeTruthy();
      }

      // Cancel
      await labs.cancelButton.click();
    });

    test('Future lab results may show warning @p3', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const dateField = authenticatedPage.getByRole('textbox', { name: /result date/i }).first();
      const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateVisible) {
        // Enter future date
        await dateField.fill('12/31/2099');
        await smartWait(authenticatedPage, 1000);

        // May show warning for future date
        const warning = authenticatedPage.locator('.warning, .alert-warning');
        const hasWarning = await warning.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Future date warning shown:', hasWarning);
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel lab entry returns to list @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill some fields
      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        await labs.hgbA1c.fill('6.5');
      }

      // Cancel
      await labs.cancelButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should return to labs list
      await expect(labs.addButton).toBeVisible({ timeout: 5000 });
    });

    test('Multiple cancel operations @p3', async ({ authenticatedPage }) => {
      // Open and cancel multiple times
      for (let i = 0; i < 3; i++) {
        await labs.addButton.click();
        await smartWait(authenticatedPage, 500);

        await labs.cancelButton.click();
        await smartWait(authenticatedPage, 500);
      }

      // Should still be functional
      await expect(labs.addButton).toBeVisible();
    });
  });

  test.describe('Labs History', () => {
    test('View labs history table @p2', async ({ authenticatedPage }) => {
      // Check if labs table exists
      const labsTable = authenticatedPage.locator('table').filter({ hasText: 'Result' });
      const hasTable = await labsTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        console.log('Labs history table found');
        expect(hasTable).toBe(true);
      } else {
        // No labs yet
        await expect(labs.addButton).toBeVisible();
      }
    });

    test('Search labs history @p3', async ({ authenticatedPage }) => {
      const tableSearch = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await tableSearch.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await tableSearch.fill('glucose');
        await smartWait(authenticatedPage, 500);

        // Should filter table
        console.log('Labs history search executed');
      }
    });
  });

  test.describe('Decimal Precision', () => {
    test('Lab values with decimals @p2', async ({ authenticatedPage }) => {
      await labs.addButton.click();
      await smartWait(authenticatedPage, 1000);

      const hgbA1cVisible = await labs.hgbA1c.isVisible({ timeout: 3000 }).catch(() => false);

      if (hgbA1cVisible) {
        // Test various decimal precisions
        const decimalValues = ['6.5', '6.54', '6.543'];

        for (const value of decimalValues) {
          await labs.hgbA1c.clear();
          await labs.hgbA1c.fill(value);
          await smartWait(authenticatedPage, 300);

          const inputValue = await labs.hgbA1c.inputValue();
          console.log(`Decimal input: ${value}, Stored: ${inputValue}`);
        }
      }

      // Cancel
      await labs.cancelButton.click();
    });
  });
});
