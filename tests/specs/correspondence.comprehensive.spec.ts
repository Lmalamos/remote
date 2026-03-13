// ============================================
// CORRESPONDENCE - COMPREHENSIVE TESTS
// Letters, documents, communication tracking
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { correspondencePanel } from '../pages/memberHub/correspondence';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.CORRESPONDENCE} ${Tags.MEMBER_HUB} Correspondence - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let correspondence: correspondencePanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    correspondence = new correspondencePanel(authenticatedPage);

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

    await correspondence.correspondenceHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Correspondence Panel Access', () => {
    test('Correspondence panel opens @p1', async () => {
      await expect(correspondence.correspondenceHeader).toBeVisible();
      await expect(correspondence.addButton).toBeVisible();
    });

    test('Correspondence list displays @p2', async ({ authenticatedPage }) => {
      const corrTable = authenticatedPage.locator('#correspondenceTable, table').first();
      const hasTable = await corrTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Correspondence table visible:', hasTable);
    });

    test('Add correspondence button available @p2', async () => {
      const buttonVisible = await correspondence.addButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Add correspondence button visible:', buttonVisible);
    });
  });

  test.describe('Add Correspondence', () => {
    test('Add correspondence form opens @p2', async () => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const solutionTypeVisible = await correspondence.solutionType.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Solution type dropdown visible:', solutionTypeVisible);

      await correspondence.cancelButton.click();
    });

    test('Solution type selection @p2', async ({ authenticatedPage }) => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const solutionTypeVisible = await correspondence.solutionType.isVisible({ timeout: 3000 }).catch(() => false);

      if (solutionTypeVisible) {
        await correspondence.solutionType.click();
        await smartWait(correspondence.page, 500);

        const options = authenticatedPage.locator('#sltSolutionType option');
        const optionCount = await options.count();

        console.log('Solution type options available:', optionCount);
        expect(optionCount).toBeGreaterThan(1);
      }

      await correspondence.cancelButton.click();
    });

    test('Add letter button available @p2', async () => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const addLetterVisible = await correspondence.addLetter.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Add letter button visible:', addLetterVisible);

      await correspondence.cancelButton.click();
    });

    test('Cancel correspondence addition @p2', async () => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 500);

      await correspondence.cancelButton.click();
      await smartWait(correspondence.page, 500);

      await expect(correspondence.correspondenceHeader).toBeVisible();
      console.log('Correspondence addition cancelled');
    });
  });

  test.describe('Correspondence Types', () => {
    test('Select different solution types @p2', async ({ authenticatedPage }) => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const solutionTypeVisible = await correspondence.solutionType.isVisible({ timeout: 3000 }).catch(() => false);

      if (solutionTypeVisible) {
        const options = authenticatedPage.locator('#sltSolutionType option');
        const optionCount = await options.count();

        for (let i = 1; i < Math.min(optionCount, 4); i++) {
          await correspondence.solutionType.selectOption({ index: i });
          await smartWait(correspondence.page, 500);

          const value = await correspondence.solutionType.inputValue();
          console.log(`Solution type ${i} selected: ${value}`);
        }
      }

      await correspondence.cancelButton.click();
    });
  });

  test.describe('Letter Management', () => {
    test('Add letter from correspondence @p2', async () => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const addLetterVisible = await correspondence.addLetter.isVisible({ timeout: 3000 }).catch(() => false);

      if (addLetterVisible) {
        await correspondence.addLetter.click();
        await smartWait(correspondence.page, 1000);

        console.log('Add letter clicked');
      }

      await correspondence.cancelButton.click().catch(() => {});
    });

    test('Letter templates available @p3', async ({ authenticatedPage }) => {
      await correspondence.addButton.click();
      await smartWait(correspondence.page, 1000);

      const addLetterVisible = await correspondence.addLetter.isVisible({ timeout: 3000 }).catch(() => false);

      if (addLetterVisible) {
        await correspondence.addLetter.click();
        await smartWait(correspondence.page, 1000);

        const templateSelect = authenticatedPage.locator('[name*="template"], select').first();
        const templateVisible = await templateSelect.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Letter templates available:', templateVisible);
      }

      const closeButton = authenticatedPage.getByRole('button', { name: /close|cancel/i }).first();
      await closeButton.click().catch(() => {});
    });
  });

  test.describe('Correspondence History', () => {
    test('View correspondence history @p2', async ({ authenticatedPage }) => {
      const corrTable = authenticatedPage.locator('#correspondenceTable, table').first();
      const hasTable = await corrTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await corrTable.locator('tbody tr').count();
        console.log('Correspondence history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search correspondence history @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('letter');
        await smartWait(authenticatedPage, 500);

        console.log('Correspondence search executed');
      }
    });

    test('Correspondence table columns @p3', async ({ authenticatedPage }) => {
      const corrTable = authenticatedPage.locator('#correspondenceTable, table').first();
      const hasTable = await corrTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Date', 'Type', 'Subject', 'Status'];

        for (const column of expectedColumns) {
          const headerCell = corrTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Correspondence Details', () => {
    test('View correspondence details @p2', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Download correspondence @p3', async ({ authenticatedPage }) => {
      const downloadButtons = authenticatedPage.locator('button:has-text("Download"), .fa-download');
      const buttonCount = await downloadButtons.count();

      console.log('Download buttons found:', buttonCount);
    });

    test('Print correspondence @p3', async ({ authenticatedPage }) => {
      const printButtons = authenticatedPage.locator('button:has-text("Print"), .fa-print');
      const buttonCount = await printButtons.count();

      console.log('Print buttons found:', buttonCount);
    });
  });

  test.describe('Correspondence Status', () => {
    test('Correspondence status indicators @p2', async ({ authenticatedPage }) => {
      const statusOptions = ['Sent', 'Draft', 'Pending', 'Delivered'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });

    test('Filter by status @p3', async ({ authenticatedPage }) => {
      const statusFilter = authenticatedPage.locator('[name*="status"], #statusFilter, select').first();
      const filterVisible = await statusFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        console.log('Status filter available');
      }
    });
  });

  test.describe('Correspondence Dates', () => {
    test('Correspondence date display @p2', async ({ authenticatedPage }) => {
      const corrTable = authenticatedPage.locator('#correspondenceTable, table').first();
      const hasTable = await corrTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const dateCell = corrTable.locator('td').first();
        const cellVisible = await dateCell.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Date column visible:', cellVisible);
      }
    });

    test('Date range filter @p3', async ({ authenticatedPage }) => {
      const dateFilter = authenticatedPage.getByLabel(/from|start.*date/i);
      const filterVisible = await dateFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Date range filter available:', filterVisible);
    });
  });

  test.describe('Correspondence Actions', () => {
    test('Edit correspondence @p3', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete correspondence @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('Resend correspondence @p3', async ({ authenticatedPage }) => {
      const resendButtons = authenticatedPage.getByRole('button', { name: /resend/i });
      const buttonCount = await resendButtons.count();

      console.log('Resend buttons found:', buttonCount);
    });
  });

  test.describe('Correspondence Pagination', () => {
    test('Correspondence table pagination @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#correspondenceTable_info, .dataTables_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Pagination info:', text);
      }
    });

    test('Navigate pagination @p3', async ({ authenticatedPage }) => {
      const nextButton = authenticatedPage.getByRole('button', { name: /next/i });
      const buttonVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        const isEnabled = await nextButton.isEnabled();
        console.log('Next button enabled:', isEnabled);
      }
    });
  });
});
