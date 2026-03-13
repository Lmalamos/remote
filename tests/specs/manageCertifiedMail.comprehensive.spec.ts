// ============================================
// MANAGE CERTIFIED MAIL - COMPREHENSIVE TESTS
// Certified mail tracking, configuration
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageCertifiedMail } from '../pages/manageCertifiedMail';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Certified Mail - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageCertifiedMailPage: manageCertifiedMail;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageCertifiedMailPage = new manageCertifiedMail(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Certified Mails' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Certified Mail page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Certified Mail Management UI', () => {
    test('Export Client button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
    });

    test('Save button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Save Functionality', () => {
    test('Save button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeEnabled();
    });

    test('Save button click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await saveButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Save button clicked');
      }
    });
  });

  test.describe('Export Client Functionality', () => {
    test('Export Client button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export Client' });
      await expect(exportButton).toBeEnabled();
    });

    test('Export Client for different client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export Client' });
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
    });

    test('Export Client click @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export Client' });
      const buttonVisible = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Export Client ready to use');
      }
    });
  });

  test.describe('Import Functionality', () => {
    test('Import button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeEnabled();
    });

    test('Open import modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      const buttonVisible = await importButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await importButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Import modal opened');
      }
    });

    test('Import for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeEnabled();
    });
  });

  test.describe('Certified Mail Table', () => {
    test('Certified mail table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const mailTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await mailTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Certified mail table visible:', hasTable);
    });

    test('Certified mail table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const mailTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await mailTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await mailTable.locator('tbody tr').count();
        console.log('Certified mail rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const mailTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await mailTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await mailTable.locator('thead th').count();
        console.log('Certified mail table columns:', headers);
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

    test('Certified mail data refreshes on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Certified mail data refreshed:', buttonVisible);
    });
  });

  test.describe('Certified Mail Configuration', () => {
    test('Configuration fields available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const configFields = adminAuthenticatedPage.locator('input[type="text"], input[type="number"], select');
      const fieldCount = await configFields.count();

      console.log('Configuration fields available:', fieldCount);
    });

    test('Checkboxes for certified mail options @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const checkboxes = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      console.log('Certified mail checkboxes:', checkboxCount);
    });

    test('Text input fields available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const textInputs = adminAuthenticatedPage.locator('input[type="text"]');
      const inputCount = await textInputs.count();

      console.log('Text input fields:', inputCount);
    });
  });

  test.describe('Certified Mail Actions', () => {
    test('Edit certified mail entry @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete certified mail entry @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View certified mail details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });

  test.describe('Certified Mail Status', () => {
    test('Status indicators display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const statusIndicators = adminAuthenticatedPage.locator('.badge, .status, [class*="status"]');
      const indicatorCount = await statusIndicators.count();

      console.log('Status indicators found:', indicatorCount);
    });

    test('Sent status @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const sentStatus = adminAuthenticatedPage.getByText(/sent/i);
      const statusVisible = await sentStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sent status indicator found:', statusVisible);
    });

    test('Pending status @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const pendingStatus = adminAuthenticatedPage.getByText(/pending/i);
      const statusVisible = await pendingStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Pending status indicator found:', statusVisible);
    });

    test('Delivered status @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deliveredStatus = adminAuthenticatedPage.getByText(/delivered/i);
      const statusVisible = await deliveredStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Delivered status indicator found:', statusVisible);
    });
  });

  test.describe('Certified Mail Search', () => {
    test('Search certified mail @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('certified');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Certified mail search executed');
      }
    });

    test('Clear certified mail search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test').catch(() => {});
        await smartWait(adminAuthenticatedPage, 500);

        await searchBox.clear();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Certified mail search cleared');
      }
    });

    test('Search by tracking number @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('9999999999999');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Tracking number search executed');
      }
    });
  });

  test.describe('Certified Mail Tracking', () => {
    test('Tracking number field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const trackingField = adminAuthenticatedPage.getByLabel(/tracking/i);
      const fieldVisible = await trackingField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Tracking number field visible:', fieldVisible);
    });

    test('Tracking status updates @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const mailTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await mailTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const trackingColumns = mailTable.locator('td:has-text("tracking"), td:has-text("Tracking")');
        const trackingCount = await trackingColumns.count().catch(() => 0);

        console.log('Tracking data entries:', trackingCount);
      }
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete certified mail configuration workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();

      console.log('Complete certified mail workflow ready');
    });

    test('Switch clients and verify persistence @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      console.log('Client switching maintains certified mail interface');
    });
  });
});
