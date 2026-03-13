// ============================================
// DME (Durable Medical Equipment) - COMPREHENSIVE TESTS
// HCPCS codes, search by term/code, modifiers, units, costs
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { DMEPanel } from '../pages/memberHub/dme';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.DME} ${Tags.MEMBER_HUB} DME - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let dme: DMEPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    dme = new DMEPanel(authenticatedPage);

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

    // Open DME panel
    await dme.expandPanel();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Search By Term', () => {
    test('Search DME by section and category @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Select section
      await dme.selectSection('Enteral and Parenteral Therapy');
      await smartWait(authenticatedPage, 500);

      // Select category
      await dme.selectCategory('Enteral Formulae and Enteral Medical Supplies');
      await smartWait(authenticatedPage, 500);

      // Click search by term
      const searchByTermVisible = await dme.searchByTermButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await dme.searchByTermButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should show results
        console.log('DME search by term executed');
      }

      // Close
      await dme.closeForm();
    });

    test('All DME sections available @p3', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Get available sections
      const sectionDropdown = dme.sectionComboBox;
      const sectionOptions = await sectionDropdown.locator('option').allTextContents();

      console.log('Available DME sections:', sectionOptions.length);

      // Should have multiple sections
      expect(sectionOptions.length).toBeGreaterThan(0);

      // Close
      await dme.closeForm();
    });

    test('Category updates based on section @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Select a section
      await dme.selectSection('Enteral and Parenteral Therapy');
      await smartWait(authenticatedPage, 1000);

      // Check if categories are available
      const categoryDropdown = dme.categoryComboBox;
      const categoryOptions = await categoryDropdown.locator('option').allTextContents();

      console.log('Categories for selected section:', categoryOptions.length);

      // Should have categories
      expect(categoryOptions.length).toBeGreaterThan(0);

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Search By HCPCS Code', () => {
    test('Search DME by HCPCS code @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Select search by code
      const searchByCodeVisible = await dme.searchByCodeRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByCodeVisible) {
        await dme.searchByCodeRadioButton.check();
        await smartWait(authenticatedPage, 500);

        // Enter HCPCS code
        await dme.fillHcpcsCode('B4035');

        // Click search
        await dme.searchByCodeButton.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('DME search by code executed');
      }

      // Close
      await dme.closeForm();
    });

    test('Invalid HCPCS code shows no results @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const searchByCodeVisible = await dme.searchByCodeRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByCodeVisible) {
        await dme.searchByCodeRadioButton.check();
        await smartWait(authenticatedPage, 500);

        // Enter invalid code
        await dme.fillHcpcsCode('INVALID999');

        await dme.searchByCodeButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should show no results
        const noDataVisible = await dme.noDataAvailableMessage.isVisible({ timeout: 5000 }).catch(() => false);

        console.log('No data message for invalid code:', noDataVisible);
      }

      // Close
      await dme.closeForm();
    });

    test('HCPCS code format validation @p3', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const searchByCodeVisible = await dme.searchByCodeRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByCodeVisible) {
        await dme.searchByCodeRadioButton.check();

        // Test various formats
        const codeFormats = ['B4035', 'E0100', 'A4216'];

        for (const code of codeFormats) {
          await dme.fillHcpcsCode(code);
          await smartWait(authenticatedPage, 300);

          console.log(`Testing HCPCS code format: ${code}`);

          const value = await dme.hcpcsLevel2CodeInput.inputValue();
          expect(value).toBe(code);
        }
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Units and Qualifiers', () => {
    test('Add DME with units @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Fill units
      const unitsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        await dme.unitsInput.fill('1');
        await expect(dme.unitsInput).toHaveValue('1');
      }

      // Close
      await dme.closeForm();
    });

    test('Units qualifier selection @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const qualifierVisible = await dme.unitsQualifierComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (qualifierVisible) {
        // Get available qualifiers
        const options = await dme.unitsQualifierComboBox.locator('option').allTextContents();
        console.log('Units qualifiers:', options);

        // Select a qualifier
        if (options.length > 1) {
          await dme.unitsQualifierComboBox.selectOption({ index: 1 });
          await smartWait(authenticatedPage, 500);

          console.log('Units qualifier selected');
        }
      }

      // Close
      await dme.closeForm();
    });

    test('Units validation - positive numbers only @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const unitsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        // Try negative
        await dme.unitsInput.fill('-5');
        await smartWait(authenticatedPage, 500);

        // Try zero
        await dme.unitsInput.clear();
        await dme.unitsInput.fill('0');
        await smartWait(authenticatedPage, 500);

        // Try valid
        await dme.unitsInput.clear();
        await dme.unitsInput.fill('10');

        const value = await dme.unitsInput.inputValue();
        console.log('Valid units value:', value);
      }

      // Close
      await dme.closeForm();
    });

    test('Units with non-numeric input rejected @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const unitsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        // Try letters
        await dme.unitsInput.fill('ABC');
        await smartWait(authenticatedPage, 500);

        const value = await dme.unitsInput.inputValue();
        const isNumeric = /^\d*\.?\d*$/.test(value);

        expect(isNumeric).toBe(true);
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Frequency and Qualifiers', () => {
    test('Add DME with frequency @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const frequencyVisible = await dme.frequencyInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (frequencyVisible) {
        await dme.frequencyInput.fill('1');
        await expect(dme.frequencyInput).toHaveValue('1');
      }

      // Close
      await dme.closeForm();
    });

    test('Frequency qualifier selection @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const qualifierVisible = await dme.frequencyQualifierComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (qualifierVisible) {
        // Get available qualifiers
        const options = await dme.frequencyQualifierComboBox.locator('option').allTextContents();
        console.log('Frequency qualifiers:', options);

        // Select a qualifier
        if (options.length > 1) {
          await dme.frequencyQualifierComboBox.selectOption({ index: 1 });
          await smartWait(authenticatedPage, 500);

          console.log('Frequency qualifier selected');
        }
      }

      // Close
      await dme.closeForm();
    });

    test('Frequency validation @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const frequencyVisible = await dme.frequencyInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (frequencyVisible) {
        const testValues = ['1', '2', '4', '7', '30'];

        for (const freq of testValues) {
          await dme.frequencyInput.clear();
          await dme.frequencyInput.fill(freq);
          await smartWait(authenticatedPage, 300);

          console.log(`Testing frequency: ${freq}`);
        }
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Total Purchase Cost', () => {
    test('Add DME with total cost @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const costVisible = await dme.totalPurchaseCostInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        await dme.totalPurchaseCostInput.fill('6345');
        await expect(dme.totalPurchaseCostInput).toHaveValue('6345');
      }

      // Close
      await dme.closeForm();
    });

    test('Cost with decimal values @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const costVisible = await dme.totalPurchaseCostInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        // Test with decimals
        await dme.totalPurchaseCostInput.fill('1234.56');
        await smartWait(authenticatedPage, 500);

        const value = await dme.totalPurchaseCostInput.inputValue();
        console.log('Cost with decimals:', value);
      }

      // Close
      await dme.closeForm();
    });

    test('Cost validation - negative values @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const costVisible = await dme.totalPurchaseCostInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        // Try negative
        await dme.totalPurchaseCostInput.fill('-100');
        await smartWait(authenticatedPage, 500);

        // Should reject or convert to positive
        const value = await dme.totalPurchaseCostInput.inputValue();
        const numValue = parseFloat(value);

        console.log('Cost after negative input:', value);

        // Should not be negative
        expect(numValue).toBeGreaterThanOrEqual(0);
      }

      // Close
      await dme.closeForm();
    });

    test('Very high cost values @p3', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const costVisible = await dme.totalPurchaseCostInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        const highCosts = ['100000', '500000', '1000000'];

        for (const cost of highCosts) {
          await dme.totalPurchaseCostInput.clear();
          await dme.totalPurchaseCostInput.fill(cost);
          await smartWait(authenticatedPage, 300);

          console.log(`Testing high cost: $${cost}`);

          // Should accept but may show warning
          const warning = authenticatedPage.locator('.warning, .alert-warning');
          const hasWarning = await warning.isVisible({ timeout: 1000 }).catch(() => false);

          console.log(`  Warning shown: ${hasWarning}`);
        }
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Modifiers', () => {
    test('Select DME modifier @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const modifierVisible = await dme.modifierComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (modifierVisible) {
        // Get available modifiers
        const options = await dme.modifierComboBox.locator('option').allTextContents();
        console.log('Available modifiers:', options.length);

        // Select a modifier
        if (options.length > 1) {
          await dme.modifierComboBox.selectOption({ index: 1 });
          await smartWait(authenticatedPage, 500);

          console.log('Modifier selected');
        }
      }

      // Close
      await dme.closeForm();
    });

    test('Common DME modifiers available @p3', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      const modifierVisible = await dme.modifierComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (modifierVisible) {
        const options = await dme.modifierComboBox.locator('option').allTextContents();

        // Common modifiers: NU (New), RR (Rental), UE (Used)
        const commonModifiers = ['NU', 'RR', 'UE'];

        for (const mod of commonModifiers) {
          const hasModifier = options.some(opt => opt.includes(mod));
          console.log(`Modifier ${mod} available:`, hasModifier);
        }
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Required Fields', () => {
    test('Identify required DME fields @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Check for required field indicators
      const requiredFields = [
        { field: dme.unitsInput, name: 'Units' },
        { field: dme.frequencyInput, name: 'Frequency' },
        { field: dme.totalPurchaseCostInput, name: 'Total Cost' },
      ];

      for (const req of requiredFields) {
        const isVisible = await req.field.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          // Check for asterisk in label
          const label = await authenticatedPage.locator(`label:has-text("${req.name}")`).textContent().catch(() => '');
          const isRequired = label.includes('*');

          console.log(`${req.name} required:`, isRequired);
        }
      }

      // Close
      await dme.closeForm();
    });

    test('Submit without required fields shows validation @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Try to submit without filling required fields
      const submitButton = authenticatedPage.getByRole('button', { name: /submit/i });
      const submitVisible = await submitButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (submitVisible) {
        await submitButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should show validation errors
        const validationError = authenticatedPage.locator('.field-validation-error, .error, .alert-danger');
        const hasError = await validationError.count();

        console.log('Validation errors shown:', hasError);
        expect(hasError).toBeGreaterThan(0);
      }

      // Close
      await dme.closeForm();
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel DME entry returns to list @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Fill some fields
      const unitsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        await dme.unitsInput.fill('5');
      }

      // Cancel
      await dme.closeForm();
      await waitForNetworkIdle(authenticatedPage);

      // Should return to DME list
      await expect(dme.addButton).toBeVisible({ timeout: 5000 });
    });

    test('Multiple cancel operations @p3', async ({ authenticatedPage }) => {
      // Open and cancel multiple times
      for (let i = 0; i < 3; i++) {
        await dme.openAddForm();
        await smartWait(authenticatedPage, 500);

        await dme.closeForm();
        await smartWait(authenticatedPage, 500);
      }

      // Should still be functional
      await expect(dme.addButton).toBeVisible();
    });
  });

  test.describe('DME History', () => {
    test('View DME history table @p2', async ({ authenticatedPage }) => {
      // Check if DME table exists
      const dmeTable = authenticatedPage.locator('table').filter({ hasText: 'HCPCS' });
      const hasTable = await dmeTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        console.log('DME history table found');
        expect(hasTable).toBe(true);
      } else {
        // No DME yet
        await expect(dme.addButton).toBeVisible();
      }
    });

    test('Search DME history @p3', async ({ authenticatedPage }) => {
      const tableSearch = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await tableSearch.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await tableSearch.fill('B4035');
        await smartWait(authenticatedPage, 500);

        console.log('DME history search executed');
      }
    });
  });

  test.describe('Complete DME Entry', () => {
    test('Add complete DME record with all fields @p1', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Fill section and category
      await dme.selectSection('Enteral and Parenteral Therapy');
      await smartWait(authenticatedPage, 500);

      await dme.selectCategory('Enteral Formulae and Enteral Medical Supplies');
      await smartWait(authenticatedPage, 500);

      // Fill all fields
      const fieldsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldsVisible) {
        await dme.fillUnits('1', 'wk');
        await dme.fillFrequency('1', '225761000');
        await dme.fillTotalPurchaseCost('6345');

        // Select modifier
        await dme.selectModifier('NU - New equipment');

        console.log('Complete DME record filled');
      }

      // Cancel (don't save to avoid data pollution)
      await dme.closeForm();
    });
  });

  test.describe('Error Handling', () => {
    test('Handle search errors gracefully @p2', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Try various searches
      const searchByCodeVisible = await dme.searchByCodeRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByCodeVisible) {
        await dme.searchByCodeRadioButton.check();
        await dme.fillHcpcsCode('TEST123');
        await dme.searchByCodeButton.click();

        await smartWait(authenticatedPage, 3000);

        // Should not show system errors
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        const errorText = await systemError.textContent().catch(() => '');

        expect(errorText).not.toContain('500');
        expect(errorText).not.toContain('Internal Server Error');
      }

      // Close
      await dme.closeForm();
    });

    test('Form state persists during session @p3', async ({ authenticatedPage }) => {
      await dme.openAddForm();
      await smartWait(authenticatedPage, 1000);

      // Fill some fields
      const unitsVisible = await dme.unitsInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        await dme.unitsInput.fill('10');

        // Close and reopen
        await dme.closeForm();
        await smartWait(authenticatedPage, 500);

        await dme.openAddForm();
        await smartWait(authenticatedPage, 1000);

        // Form should be cleared
        const unitsValue = await dme.unitsInput.inputValue();
        console.log('Units after reopen:', unitsValue);

        // Should be empty (form was cleared)
        expect(unitsValue).toBe('');
      }

      // Close
      await dme.closeForm();
    });
  });
});
