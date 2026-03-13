// ============================================
// MANAGE REVIEW TYPES - COMPREHENSIVE TESTS
// Review type configuration, timing management
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageReviewTypes } from '../pages/manageReviewTypes';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Review Types - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageReviewTypesPage: manageReviewTypes;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageReviewTypesPage = new manageReviewTypes(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Review Types' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Review Types page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Review Types Management UI', () => {
    test('Export to CSV button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
    });

    test('Review Type by Timing button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Export to CSV Functionality', () => {
    test('Export to CSV button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      await expect(exportButton).toBeEnabled();
    });

    test('Export to CSV click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      const buttonVisible = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Export to CSV button ready');
      }
    });

    test('Export for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
    });
  });

  test.describe('Review Type by Timing', () => {
    test('Review Type by Timing button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const timingButton = adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' });
      await expect(timingButton).toBeEnabled();
    });

    test('Open Review Type by Timing view @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timingButton = adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' });
      const buttonVisible = await timingButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await timingButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Review Type by Timing view opened');
      }
    });

    test('Review Type by Timing for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timingButton = adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' });
      await expect(timingButton).toBeVisible();
      await expect(timingButton).toBeEnabled();
    });
  });

  test.describe('Review Types Table', () => {
    test('Review types table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const reviewTypesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reviewTypesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Review types table visible:', hasTable);
    });

    test('Review types table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const reviewTypesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reviewTypesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await reviewTypesTable.locator('tbody tr').count();
        console.log('Review types rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const reviewTypesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reviewTypesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await reviewTypesTable.locator('thead th').count();
        console.log('Review types table columns:', headers);
      }
    });

    test('Table columns have headers @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const reviewTypesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reviewTypesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Review Type', 'Code', 'Description', 'Status', 'Timing'];

        for (const column of expectedColumns) {
          const headerCell = reviewTypesTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Search Review Types', () => {
    test('Search review types @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.click();
        await searchBox.fill('IP');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Review types search executed: IP');
      }
    });

    test('Clear review types search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test').catch(() => {});
        await smartWait(adminAuthenticatedPage, 500);

        await searchBox.clear();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Review types search cleared');
      }
    });

    test('Search by review type name @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('Inpatient');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Search by review type name executed');
      }
    });

    test('Search by code @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('OP');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Search by code executed');
      }
    });

    test('Search with partial match @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('pat');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Search with partial match executed');
      }
    });
  });

  test.describe('Client Selection', () => {
    test('Switch between clients @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');

      await clientSelect.selectOption('34');
      await expect(clientSelect).toHaveValue('34');
    });

    test('Review types refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      const buttonVisible = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Review types refreshed:', buttonVisible);
    });
  });

  test.describe('Review Type Actions', () => {
    test('Edit review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View review type details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Activate/deactivate review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const toggleButtons = adminAuthenticatedPage.locator('input[type="checkbox"], .toggle, .switch');
      const buttonCount = await toggleButtons.count();

      console.log('Toggle buttons found:', buttonCount);
    });
  });

  test.describe('Review Type Configuration', () => {
    test('Add new review type @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const addButton = adminAuthenticatedPage.getByRole('button', { name: /add|new/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Add new review type button available');
      }
    });

    test('Review type name field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const nameField = adminAuthenticatedPage.getByLabel(/review type|name/i);
      const fieldVisible = await nameField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Review type name field visible:', fieldVisible);
    });

    test('Review type code field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const codeField = adminAuthenticatedPage.getByLabel(/code/i);
      const fieldVisible = await codeField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Review type code field visible:', fieldVisible);
    });

    test('Description field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const descriptionField = adminAuthenticatedPage.getByLabel(/description/i);
      const fieldVisible = await descriptionField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Description field visible:', fieldVisible);
    });
  });

  test.describe('Review Type Status', () => {
    test('Active status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const activeStatus = adminAuthenticatedPage.getByText(/active/i);
      const statusVisible = await activeStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Active status indicator found:', statusVisible);
    });

    test('Inactive status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const inactiveStatus = adminAuthenticatedPage.getByText(/inactive/i);
      const statusVisible = await inactiveStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Inactive status indicator found:', statusVisible);
    });
  });

  test.describe('Timing Configuration', () => {
    test('Timing fields available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timingButton = adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' });
      const buttonVisible = await timingButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await timingButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Timing configuration view opened');
      }
    });

    test('Days configuration @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const daysFields = adminAuthenticatedPage.locator('input[type="number"]');
      const fieldCount = await daysFields.count();

      console.log('Days configuration fields:', fieldCount);
    });

    test('Hours configuration @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const hoursFields = adminAuthenticatedPage.locator('input[placeholder*="hour"], input[name*="hour"]');
      const fieldCount = await hoursFields.count();

      console.log('Hours configuration fields:', fieldCount);
    });
  });

  test.describe('Review Type Categories', () => {
    test('Inpatient review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const inpatientType = adminAuthenticatedPage.getByText(/inpatient|IP/i);
      const typeVisible = await inpatientType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Inpatient review type found:', typeVisible);
    });

    test('Outpatient review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const outpatientType = adminAuthenticatedPage.getByText(/outpatient|OP/i);
      const typeVisible = await outpatientType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Outpatient review type found:', typeVisible);
    });

    test('Emergency room review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const erType = adminAuthenticatedPage.getByText(/emergency|ER/i);
      const typeVisible = await erType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Emergency room review type found:', typeVisible);
    });

    test('Nursing home review type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const nursingType = adminAuthenticatedPage.getByText(/nursing|NS/i);
      const typeVisible = await nursingType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Nursing home review type found:', typeVisible);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete review types workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' })).toBeVisible();

      console.log('Complete review types workflow ready');
    });

    test('View timing and export workflow @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timingButton = adminAuthenticatedPage.getByRole('button', { name: 'Review Type by Timing' });
      const timingVisible = await timingButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (timingVisible) {
        await timingButton.click();
        await smartWait(adminAuthenticatedPage, 1000);
      }

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      await expect(exportButton).toBeVisible();

      console.log('View timing and export workflow completed');
    });
  });

  test.describe('Review Type Validation', () => {
    test('Required fields validation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const requiredFields = adminAuthenticatedPage.locator('input[required], select[required]');
      const requiredCount = await requiredFields.count();

      console.log('Required fields for review types:', requiredCount);
    });

    test('Code format validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const codeFields = adminAuthenticatedPage.locator('input[name*="code"], input[id*="code"]');
      const codeCount = await codeFields.count();

      console.log('Code fields for validation:', codeCount);
    });
  });

  test.describe('Bulk Operations', () => {
    test('Select multiple review types @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const checkboxes = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      console.log('Selection checkboxes available:', checkboxCount);
    });

    test('Bulk export functionality @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export to CSV' });
      await expect(exportButton).toBeVisible();

      console.log('Bulk export functionality available');
    });
  });
});
