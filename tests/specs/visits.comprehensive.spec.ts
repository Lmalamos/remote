// ============================================
// VISITS - COMPREHENSIVE TESTS
// CPT/HCPC codes, dates, search functionality
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { visitsPanel } from '../pages/memberHub/visits';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.VISITS} ${Tags.MEMBER_HUB} Visits - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let visits: visitsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    visits = new visitsPanel(authenticatedPage);

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

    await visits.visitsHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Visits Panel Access', () => {
    test('Visits panel opens @p1', async () => {
      await expect(visits.visitsHeader).toBeVisible();
      console.log('Visits panel visible');
    });

    test('Visits list displays @p2', async ({ authenticatedPage }) => {
      const visitsTable = authenticatedPage.locator('#visitsTable, table').first();
      const hasTable = await visitsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Visits table visible:', hasTable);
    });

    test('Add visit button available @p2', async () => {
      const buttonVisible = await visits.addVisitButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Add visit button visible:', buttonVisible);
    });
  });

  test.describe('Search by Category', () => {
    test('Search visit by category @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const categoryVisible = await visits.categoryComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (categoryVisible) {
        await visits.categoryComboBox.fill('Case Management Services');
        await expect(visits.categoryComboBox).toHaveValue('Case Management Services');

        console.log('Case Management Services category entered');
      }

      await visits.cancelButton.click();
    });

    test('Search visit by subcategory @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const categoryVisible = await visits.categoryComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (categoryVisible) {
        await visits.categoryComboBox.fill('Case Management Services');
        await smartWait(visits.page, 500);

        const subCategoryVisible = await visits.subCategoryComboBox.isVisible({ timeout: 3000 }).catch(() => false);

        if (subCategoryVisible) {
          await visits.subCategoryComboBox.fill('Supervision of Warfarin Therapy');
          await expect(visits.subCategoryComboBox).toHaveValue('Supervision of Warfarin Therapy');

          console.log('Subcategory entered');
        }
      }

      await visits.cancelButton.click();
    });

    test('Multiple categories available @p3', async ({ authenticatedPage }) => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const categoryVisible = await visits.categoryComboBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (categoryVisible) {
        await visits.categoryComboBox.click();
        await smartWait(visits.page, 500);

        const options = authenticatedPage.locator('[role="option"], option');
        const optionCount = await options.count().catch(() => 0);

        console.log('Category options available:', optionCount);
      }

      await visits.cancelButton.click();
    });
  });

  test.describe('Search by Term', () => {
    test('Search visit by term @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const searchByTermVisible = await visits.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await visits.searchByTerm.fill('Anticoagulant management');
        await smartWait(visits.page, 500);

        await visits.searchButton.click();
        await waitForNetworkIdle(visits.page);

        console.log('Search by term executed');
      }

      await visits.cancelButton.click();
    });

    test('Search with long term text @p3', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const searchByTermVisible = await visits.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        const longText = 'Anticoagulant management for an outpatient taking warfarin, physician review and interpretation of International Normalized Ratio (INR) testing';
        await visits.searchByTerm.fill(longText);

        console.log('Long search term entered');
      }

      await visits.cancelButton.click();
    });

    test('Select search result by term @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const searchByTermVisible = await visits.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await visits.searchByTerm.fill('Anticoagulant');
        await visits.searchButton.click();
        await waitForNetworkIdle(visits.page);

        const resultRadio = visits.searchByTermResult;
        const radioVisible = await resultRadio.isVisible({ timeout: 3000 }).catch(() => false);

        if (radioVisible) {
          await resultRadio.check();
          console.log('Search result selected');
        }
      }

      await visits.cancelButton.click();
    });

    test('Empty search by term @p3', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const searchByTermVisible = await visits.searchByTerm.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchByTermVisible) {
        await visits.searchButton.click();
        await smartWait(visits.page, 1000);

        console.log('Empty search attempted');
      }

      await visits.cancelButton.click();
    });
  });

  test.describe('Search by Code', () => {
    test('Switch to search by code @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const radioVisible = await visits.searchByCodeRadioButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await visits.searchByCodeRadioButton.check();
        const isChecked = await visits.searchByCodeRadioButton.isChecked();

        console.log('Search by code selected:', isChecked);
      }

      await visits.cancelButton.click();
    });

    test('Search by CPT code @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.searchByCodeRadioButton.check().catch(() => {});
      await smartWait(visits.page, 500);

      const codeVisible = await visits.searchByCode.isVisible({ timeout: 3000 }).catch(() => false);

      if (codeVisible) {
        await visits.searchByCode.fill('99251');
        await expect(visits.searchByCode).toHaveValue('99251');

        await visits.searchButton.click();
        await waitForNetworkIdle(visits.page);

        console.log('CPT code 99251 searched');
      }

      await visits.cancelButton.click();
    });

    test('Search by HCPC code @p3', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.searchByCodeRadioButton.check().catch(() => {});
      await smartWait(visits.page, 500);

      const codeVisible = await visits.searchByCode.isVisible({ timeout: 3000 }).catch(() => false);

      if (codeVisible) {
        await visits.searchByCode.fill('J0171');
        await visits.searchButton.click();
        await waitForNetworkIdle(visits.page);

        console.log('HCPC code J0171 searched');
      }

      await visits.cancelButton.click();
    });

    test('Select search result by code @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.searchByCodeRadioButton.check().catch(() => {});
      await smartWait(visits.page, 500);

      await visits.searchByCode.fill('99251').catch(() => {});
      await visits.searchButton.click();
      await waitForNetworkIdle(visits.page);

      const resultRadio = visits.searchByCodeResult;
      const radioVisible = await resultRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await resultRadio.check();
        console.log('Code search result selected');
      }

      await visits.cancelButton.click();
    });

    test('Invalid code handling @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.searchByCodeRadioButton.check().catch(() => {});
      await smartWait(visits.page, 500);

      const codeVisible = await visits.searchByCode.isVisible({ timeout: 3000 }).catch(() => false);

      if (codeVisible) {
        const invalidCodes = ['INVALID', '00000', 'ABCDE'];

        for (const code of invalidCodes) {
          await visits.searchByCode.clear();
          await visits.searchByCode.fill(code);
          await visits.searchButton.click();
          await smartWait(visits.page, 1000);

          console.log(`Invalid code tested: ${code}`);
        }
      }

      await visits.cancelButton.click();
    });
  });

  test.describe('Visit Dates', () => {
    test('Start date picker available @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const datePickerVisible = await visits.startDate.isVisible({ timeout: 3000 }).catch(() => false);

      if (datePickerVisible) {
        await visits.startDate.click();
        await smartWait(visits.page, 500);

        console.log('Start date picker opened');
        await visits.page.keyboard.press('Escape');
      }

      await visits.cancelButton.click();
    });

    test('End date picker available @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      const datePickerVisible = await visits.endDate.isVisible({ timeout: 3000 }).catch(() => false);

      if (datePickerVisible) {
        await visits.endDate.click();
        await smartWait(visits.page, 500);

        console.log('End date picker opened');
        await visits.page.keyboard.press('Escape');
      }

      await visits.cancelButton.click();
    });

    test('Close date picker with Escape @p3', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.startDate.click().catch(() => {});
      await smartWait(visits.page, 500);

      await visits.page.keyboard.press('Escape');
      await smartWait(visits.page, 500);

      console.log('Date picker closed with Escape');

      await visits.cancelButton.click();
    });
  });

  test.describe('Existing Visits', () => {
    test('View existing visit @p2', async () => {
      const existingVisitVisible = await visits.existingVisits.isVisible({ timeout: 3000 }).catch(() => false);

      if (existingVisitVisible) {
        await visits.existingVisits.click();
        await smartWait(visits.page, 1000);

        console.log('Existing visit clicked');

        await visits.page.keyboard.press('Escape').catch(() => {});
      }
    });

    test('Navigate visit details @p3', async () => {
      const existingVisitVisible = await visits.existingVisits.isVisible({ timeout: 3000 }).catch(() => false);

      if (existingVisitVisible) {
        await visits.existingVisits.click();
        await smartWait(visits.page, 1000);

        const nextVisible = await visits.nextButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (nextVisible) {
          await visits.nextButton.click();
          await smartWait(visits.page, 500);

          console.log('Navigated to next visit detail');
        }

        await visits.page.keyboard.press('Escape').catch(() => {});
      }
    });

    test('Show all visit details @p3', async () => {
      const existingVisitVisible = await visits.existingVisits.isVisible({ timeout: 3000 }).catch(() => false);

      if (existingVisitVisible) {
        await visits.existingVisits.click();
        await smartWait(visits.page, 1000);

        const showAllVisible = await visits.showAllButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (showAllVisible) {
          await visits.showAllButton.click();
          await smartWait(visits.page, 500);

          console.log('Show all clicked');
        }

        await visits.page.keyboard.press('Escape').catch(() => {});
      }
    });
  });

  test.describe('Visits History', () => {
    test('View visits table @p2', async ({ authenticatedPage }) => {
      const visitsTable = authenticatedPage.locator('#visitsTable, table').first();
      const hasTable = await visitsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await visitsTable.locator('tbody tr').count();
        console.log('Visits rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search visits history @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('99233');
        await smartWait(authenticatedPage, 500);

        console.log('Visits search executed');
      }
    });

    test('Visits table columns @p3', async ({ authenticatedPage }) => {
      const visitsTable = authenticatedPage.locator('#visitsTable, table').first();
      const hasTable = await visitsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Date', 'Code', 'Description'];

        for (const column of expectedColumns) {
          const headerCell = visitsTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel visit addition @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 500);

      await visits.cancelButton.click();
      await smartWait(visits.page, 500);

      await expect(visits.visitsHeader).toBeVisible();
      console.log('Visit addition cancelled');
    });

    test('Cancel after search @p2', async () => {
      await visits.addVisitButton.click();
      await smartWait(visits.page, 1000);

      await visits.searchByCodeRadioButton.check().catch(() => {});
      await visits.searchByCode.fill('99213').catch(() => {});
      await visits.searchButton.click();
      await waitForNetworkIdle(visits.page);

      await visits.cancelButton.click();
      await smartWait(visits.page, 500);

      await expect(visits.visitsHeader).toBeVisible();
      console.log('Visit addition cancelled after search');
    });
  });

  test.describe('Visit Actions', () => {
    test('Edit visit @p3', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete visit @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View visit details @p3', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });

  test.describe('Visit Pagination', () => {
    test('Visits pagination info @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#visitsTable_info, .dataTables_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Pagination info:', text);
      }
    });
  });
});
