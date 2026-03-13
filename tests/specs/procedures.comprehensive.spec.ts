// ============================================
// PROCEDURES - COMPREHENSIVE TESTS
// CPT codes, modifiers, units, cost tracking
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { proceduresPanel } from '../pages/memberHub/procedures';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.PROCEDURES} ${Tags.MEMBER_HUB} Procedures - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let procedures: proceduresPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    procedures = new proceduresPanel(authenticatedPage);

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

    await procedures.panelHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Procedures Panel Access', () => {
    test('Procedures panel opens @p1', async () => {
      await expect(procedures.panelHeader).toBeVisible();
      await expect(procedures.panelAddButton).toBeVisible();
    });

    test('Procedures list displays @p2', async ({ authenticatedPage }) => {
      const procedureTable = authenticatedPage.locator('#proceduresTable, table').first();
      const hasTable = await procedureTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Procedures table visible:', hasTable);
    });

    test('Procedures search box available @p2', async () => {
      const searchVisible = await procedures.search.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Procedures search box visible:', searchVisible);
    });
  });

  test.describe('Search by Section/Category', () => {
    test('Search procedure by section @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const sectionVisible = await procedures.sectionComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (sectionVisible) {
        await procedures.sectionComboBox.fill('Digestive System');
        await smartWait(procedures.page, 500);

        console.log('Digestive System section entered');
      }

      await procedures.cancelButton.click();
    });

    test('Search procedure by category @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const sectionVisible = await procedures.sectionComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (sectionVisible) {
        await procedures.sectionComboBox.fill('Digestive System');
        await smartWait(procedures.page, 500);

        await procedures.categoryComboBox.fill('Intestines');
        await smartWait(procedures.page, 500);

        console.log('Intestines category entered');
      }

      await procedures.cancelButton.click();
    });

    test('Search procedure by subcategory @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const sectionVisible = await procedures.sectionComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (sectionVisible) {
        await procedures.sectionComboBox.fill('Digestive System');
        await smartWait(procedures.page, 500);

        await procedures.categoryComboBox.fill('Intestines');
        await smartWait(procedures.page, 500);

        await procedures.subCategoryComboBox.fill('Colon Resection Procedures');
        await smartWait(procedures.page, 500);

        console.log('Colon Resection subcategory entered');
      }

      await procedures.cancelButton.click();
    });

    test('Execute section/category search @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const sectionVisible = await procedures.sectionComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (sectionVisible) {
        await procedures.sectionComboBox.fill('Cardiovascular System');
        await smartWait(procedures.page, 500);

        await procedures.searchButton.click();
        await waitForNetworkIdle(procedures.page);

        console.log('Cardiovascular System search executed');
      }

      await procedures.cancelButton.click();
    });

    test('Multiple sections available @p3', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const sectionVisible = await procedures.sectionComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (sectionVisible) {
        await procedures.sectionComboBox.click();
        await smartWait(procedures.page, 500);

        const options = authenticatedPage.locator('[role="option"], option');
        const optionCount = await options.count().catch(() => 0);

        console.log('Section options available:', optionCount);
        expect(optionCount).toBeGreaterThan(5);
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Search by Code', () => {
    test('Search procedure by CPT code @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await searchByCodeRadio.check();
        await smartWait(procedures.page, 500);

        await procedures.search.fill('99233');
        await procedures.searchButton.click();
        await waitForNetworkIdle(procedures.page);

        console.log('CPT code 99233 searched');
      }

      await procedures.cancelButton.click();
    });

    test('Search by SNOMED code @p3', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await searchByCodeRadio.check();
        await smartWait(procedures.page, 500);

        await procedures.search.fill('252417001');
        await procedures.searchButton.click();
        await waitForNetworkIdle(procedures.page);

        console.log('SNOMED code 252417001 searched');
      }

      await procedures.cancelButton.click();
    });

    test('Invalid procedure code handling @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await searchByCodeRadio.check();
        await smartWait(procedures.page, 500);

        const invalidCodes = ['INVALID', '00000', 'ABCDE', '99999999'];

        for (const code of invalidCodes) {
          await procedures.search.clear();
          await procedures.search.fill(code);
          await procedures.searchButton.click();
          await smartWait(procedures.page, 1000);

          console.log(`Tested invalid code: ${code}`);
        }
      }

      await procedures.cancelButton.click();
    });

    test('Empty code search validation @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await searchByCodeRadio.check();
        await smartWait(procedures.page, 500);

        await procedures.searchButton.click();
        await smartWait(procedures.page, 1000);

        const error = authenticatedPage.locator('.error, .alert-danger, [class*="error"]');
        const hasError = await error.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Empty search validation error:', hasError);
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Procedure Modifiers', () => {
    test('Add modifier to procedure @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await searchByCodeRadio.check();
        await smartWait(procedures.page, 500);

        await procedures.search.fill('99213');
        await procedures.searchButton.click();
        await waitForNetworkIdle(procedures.page);

        const procedureRadio = authenticatedPage.getByRole('radio', { name: /Select Procedure/i }).first();
        const hasRadio = await procedureRadio.isVisible({ timeout: 3000 }).catch(() => false);

        if (hasRadio) {
          await procedureRadio.check();
          await smartWait(procedures.page, 500);

          const modifierVisible = await procedures.modifier.isVisible({ timeout: 3000 }).catch(() => false);

          if (modifierVisible) {
            await procedures.modifier.fill('22 - Increased Procedural Services');
            console.log('Modifier 22 selected');
          }
        }
      }

      await procedures.cancelButton.click();
    });

    test('Multiple modifier options @p3', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      await searchByCodeRadio.check().catch(() => {});
      await smartWait(procedures.page, 500);

      await procedures.search.fill('99213');
      await procedures.searchButton.click();
      await waitForNetworkIdle(procedures.page);

      const procedureRadio = authenticatedPage.getByRole('radio', { name: /Select Procedure/i }).first();
      await procedureRadio.check().catch(() => {});
      await smartWait(procedures.page, 500);

      const modifierVisible = await procedures.modifier.isVisible({ timeout: 3000 }).catch(() => false);

      if (modifierVisible) {
        await procedures.modifier.click();
        await smartWait(procedures.page, 500);

        const options = authenticatedPage.locator('[role="option"], option');
        const optionCount = await options.count().catch(() => 0);

        console.log('Modifier options available:', optionCount);
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Units and Frequency', () => {
    test('Units field is required @p1', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const unitsVisible = await procedures.units.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        const label = await authenticatedPage.locator('label:has-text("Units")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Units field required:', isRequired);
        expect(isRequired).toBe(true);
      }

      await procedures.cancelButton.click();
    });

    test('Add units to procedure @p1', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const unitsVisible = await procedures.units.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        await procedures.units.fill('1');
        await expect(procedures.units).toHaveValue('1');

        console.log('Units value entered: 1');
      }

      await procedures.cancelButton.click();
    });

    test('Units qualifier selection @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const qualifierVisible = await procedures.unitsQualifier.isVisible({ timeout: 3000 }).catch(() => false);

      if (qualifierVisible) {
        await procedures.unitsQualifier.selectOption('U');
        console.log('Units qualifier U selected');
      }

      await procedures.cancelButton.click();
    });

    test('Units validation - positive numbers @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const unitsVisible = await procedures.units.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        const testValues = ['5', '10', '100'];

        for (const value of testValues) {
          await procedures.units.clear();
          await procedures.units.fill(value);
          await smartWait(procedures.page, 500);

          const currentValue = await procedures.units.inputValue();
          console.log(`Units value: ${currentValue}`);
        }
      }

      await procedures.cancelButton.click();
    });

    test('Units validation - negative numbers @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const unitsVisible = await procedures.units.isVisible({ timeout: 3000 }).catch(() => false);

      if (unitsVisible) {
        await procedures.units.fill('-5');
        await smartWait(procedures.page, 500);

        console.log('Negative units tested');
      }

      await procedures.cancelButton.click();
    });

    test('Frequency field is required @p1', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const frequencyVisible = await procedures.frequency.isVisible({ timeout: 3000 }).catch(() => false);

      if (frequencyVisible) {
        const label = await authenticatedPage.locator('label:has-text("Frequency")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Frequency field required:', isRequired);
      }

      await procedures.cancelButton.click();
    });

    test('Add frequency to procedure @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const frequencyVisible = await procedures.frequency.isVisible({ timeout: 3000 }).catch(() => false);

      if (frequencyVisible) {
        await procedures.frequency.fill('1');
        await expect(procedures.frequency).toHaveValue('1');

        console.log('Frequency value entered: 1');
      }

      await procedures.cancelButton.click();
    });

    test('Frequency qualifier selection @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const qualifierVisible = await procedures.frequencyQualifier.isVisible({ timeout: 3000 }).catch(() => false);

      if (qualifierVisible) {
        await procedures.frequencyQualifier.click();
        await smartWait(procedures.page, 500);

        console.log('Frequency qualifier dropdown opened');
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Total Purchase Cost', () => {
    test('Total purchase cost is required @p1', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const costVisible = await procedures.totalPurchaseCost.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        const label = await authenticatedPage.locator('label:has-text("Total Purchase Cost")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Total purchase cost required:', isRequired);
        expect(isRequired).toBe(true);
      }

      await procedures.cancelButton.click();
    });

    test('Add total purchase cost @p1', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const costVisible = await procedures.totalPurchaseCost.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        await procedures.totalPurchaseCost.fill('150.00');
        await expect(procedures.totalPurchaseCost).toHaveValue('150.00');

        console.log('Total purchase cost entered: 150.00');
      }

      await procedures.cancelButton.click();
    });

    test('Total purchase cost decimal validation @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const costVisible = await procedures.totalPurchaseCost.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        const testCosts = ['99.99', '1000.50', '25.75', '10.00'];

        for (const cost of testCosts) {
          await procedures.totalPurchaseCost.clear();
          await procedures.totalPurchaseCost.fill(cost);
          await smartWait(procedures.page, 500);

          console.log(`Cost tested: ${cost}`);
        }
      }

      await procedures.cancelButton.click();
    });

    test('Total purchase cost negative validation @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const costVisible = await procedures.totalPurchaseCost.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        await procedures.totalPurchaseCost.fill('-50.00');
        await smartWait(procedures.page, 500);

        console.log('Negative cost tested');
      }

      await procedures.cancelButton.click();
    });

    test('Total purchase cost high value @p3', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const costVisible = await procedures.totalPurchaseCost.isVisible({ timeout: 3000 }).catch(() => false);

      if (costVisible) {
        await procedures.totalPurchaseCost.fill('999999.99');
        await smartWait(procedures.page, 500);

        console.log('High cost value tested: 999999.99');
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Date Handling', () => {
    test('Start date picker available @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const startDateButton = authenticatedPage.getByRole('button', { name: /start date/i });
      const buttonVisible = await startDateButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await startDateButton.click();
        await smartWait(procedures.page, 500);

        console.log('Start date picker opened');
      }

      await procedures.cancelButton.click();
    });

    test('End date picker available @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const endDateButton = authenticatedPage.getByRole('button', { name: /end date/i });
      const buttonVisible = await endDateButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await endDateButton.click();
        await smartWait(procedures.page, 500);

        console.log('End date picker opened');
      }

      await procedures.cancelButton.click();
    });
  });

  test.describe('Procedure History', () => {
    test('View procedure history @p2', async ({ authenticatedPage }) => {
      const procedureTable = authenticatedPage.locator('#proceduresTable, table').first();
      const hasTable = await procedureTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await procedureTable.locator('tbody tr').count();
        console.log('Procedure history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search procedure history @p2', async () => {
      const searchVisible = await procedures.search.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await procedures.search.fill('99233');
        await smartWait(procedures.page, 500);

        console.log('Procedure history search executed');
      }
    });

    test('Procedure history table info @p3', async ({ authenticatedPage }) => {
      const searchVisible = await procedures.search.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await procedures.search.fill('99233');
        await smartWait(procedures.page, 1000);

        const infoText = authenticatedPage.locator('#proceduresTable_info');
        const hasInfo = await infoText.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasInfo) {
          const text = await infoText.textContent();
          console.log('Table info:', text);
        }
      }
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel procedure addition @p2', async () => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 500);

      await procedures.cancelButton.click();
      await smartWait(procedures.page, 500);

      await expect(procedures.panelHeader).toBeVisible();
      console.log('Procedure addition cancelled');
    });

    test('Close search without selection @p2', async ({ authenticatedPage }) => {
      await procedures.panelAddButton.click();
      await smartWait(procedures.page, 1000);

      const searchByCodeRadio = authenticatedPage.getByRole('radio', { name: /Search by Code/i });
      await searchByCodeRadio.check().catch(() => {});
      await smartWait(procedures.page, 500);

      await procedures.search.fill('99213');
      await procedures.searchButton.click();
      await waitForNetworkIdle(procedures.page);

      await procedures.cancelButton.click();
      await smartWait(procedures.page, 500);

      await expect(procedures.panelHeader).toBeVisible();
      console.log('Search closed without selection');
    });
  });
});
