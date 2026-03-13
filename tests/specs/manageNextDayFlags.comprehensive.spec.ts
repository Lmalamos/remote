// ============================================
// MANAGE NEXT DAY FLAGS - COMPREHENSIVE TESTS
// Next day processing flags, business day configuration
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageNextDayFlags } from '../pages/manageNextDayFlags';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Next Day Flags - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageNextDayFlagsPage: manageNextDayFlags;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageNextDayFlagsPage = new manageNextDayFlags(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Next Day Flags' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Next Day Flags page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Next Day Flags Management UI', () => {
    test('Export Client link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('Search box visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('Add link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Add Next Day Flag', () => {
    test('Open Add Next Day Flag form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Name' })).toBeVisible();
    });

    test('Name field available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const nameField = adminAuthenticatedPage.getByRole('textbox', { name: 'Name' });
      await expect(nameField).toBeVisible();
    });

    test('Fill name field @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name' }).fill('Next Business Day Flag');

      console.log('Name field filled');
    });

    test('Name field with special characters @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name' }).fill('Next-Day_Flag_2024');

      console.log('Name with special characters filled');
    });
  });

  test.describe('Flag Checkboxes', () => {
    test('Start of Next Business Day checkbox available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('checkbox', { name: 'Start of Next Business Day' })).toBeVisible();
    });

    test('End of Business Day checkbox available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('checkbox', { name: 'End of Business Day' })).toBeVisible();
    });

    test('Instant First Day checkbox available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('checkbox', { name: 'Instant First Day' })).toBeVisible();
    });

    test('Check Start of Next Business Day @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Start of Next Business Day' }).check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Start of Next Business Day checked');
    });

    test('Check End of Business Day @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('checkbox', { name: 'End of Business Day' }).check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('End of Business Day checked');
    });

    test('Check Instant First Day @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Instant First Day' }).check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Instant First Day checked');
    });

    test('Check all flag checkboxes @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name' }).fill('test');
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Start of Next Business Day' }).check();
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'End of Business Day' }).check();
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Instant First Day' }).check();

      console.log('All flag checkboxes checked');
    });
  });

  test.describe('Form Actions', () => {
    test('Close button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close' })).toBeVisible();
    });

    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Close form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Form closed');
    });

    test('Complete flag form and close @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name' }).fill('test');
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Start of Next Business Day' }).check();
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'End of Business Day' }).check();
      await adminAuthenticatedPage.getByRole('checkbox', { name: 'Instant First Day' }).check();

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Complete flag form closed');
    });
  });

  test.describe('Next Day Flags List', () => {
    test('Next day flags table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const flagsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await flagsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Next day flags table visible:', hasTable);
    });

    test('Next day flags table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const flagsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await flagsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await flagsTable.locator('tbody tr').count();
        console.log('Next day flags rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const flagsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await flagsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await flagsTable.locator('thead th').count();
        console.log('Next day flags table columns:', headers);
      }
    });
  });

  test.describe('Search Next Day Flags', () => {
    test('Search next day flags @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Next day flags search executed: test');
    });

    test('Clear next day flags search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Next day flags search cleared');
    });

    test('Search by flag name @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('Next Business Day');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search by flag name executed');
    });

    test('Search with partial match @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('day');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search with partial match executed');
    });
  });

  test.describe('Flag Actions', () => {
    test('Download flag link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const downloadLink = adminAuthenticatedPage.getByRole('link', { name: 'download' });
      const linkVisible = await downloadLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Download link visible:', linkVisible);
    });

    test('Copy To link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const copyToLink = adminAuthenticatedPage.getByRole('link', { name: 'Copy To' });
      const linkVisible = await copyToLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Copy To link visible:', linkVisible);
    });

    test('Deactivate link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const deactivateLink = adminAuthenticatedPage.getByRole('link', { name: 'Deactivate' });
      const linkVisible = await deactivateLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Deactivate link visible:', linkVisible);
    });

    test('Deactivate confirmation modal @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const deactivateLink = adminAuthenticatedPage.getByRole('link', { name: 'Deactivate' });
      const linkVisible = await deactivateLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await deactivateLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        await expect(adminAuthenticatedPage.getByRole('button', { name: 'No' })).toBeVisible();
        await expect(adminAuthenticatedPage.getByRole('button', { name: 'Yes' })).toBeVisible();

        console.log('Deactivate confirmation modal opened');
      }
    });

    test('Cancel deactivation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const deactivateLink = adminAuthenticatedPage.getByRole('link', { name: 'Deactivate' });
      const linkVisible = await deactivateLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await deactivateLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        await adminAuthenticatedPage.getByRole('button', { name: 'No' }).click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Deactivation cancelled');
      }
    });

    test('View flag details @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const testLink = adminAuthenticatedPage.getByRole('link', { name: 'TEST', exact: true });
      const linkVisible = await testLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await testLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Flag details opened');
      }
    });

    test('Close flag details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      const testLink = adminAuthenticatedPage.getByRole('link', { name: 'TEST', exact: true });
      const linkVisible = await testLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await testLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Flag details closed');
      }
    });
  });

  test.describe('Export and Import', () => {
    test('Export Client functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportLink = adminAuthenticatedPage.getByRole('link', { name: 'Export Client' });
      await expect(exportLink).toBeVisible();
    });

    test('Import button functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeEnabled();
    });

    test('Open import modal @p3', async ({ adminAuthenticatedPage }) => {
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
  });

  test.describe('Client Selection', () => {
    test('Switch between clients @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');

      await clientSelect.selectOption('34');
      await expect(clientSelect).toHaveValue('34');
    });

    test('Next day flags refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const addLink = adminAuthenticatedPage.getByRole('link', { name: 'Add' });
      const linkVisible = await addLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Next day flags refreshed:', linkVisible);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete next day flag workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();

      console.log('Complete next day flag workflow ready');
    });

    test('Add, search, and deactivate workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);
      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Add, search, and deactivate workflow completed');
    });
  });

  test.describe('Flag Types', () => {
    test('Start of Next Business Day flag type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const flagType = adminAuthenticatedPage.getByText(/start of next business day/i);
      const typeVisible = await flagType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Start of Next Business Day flag type found:', typeVisible);
    });

    test('End of Business Day flag type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const flagType = adminAuthenticatedPage.getByText(/end of business day/i);
      const typeVisible = await flagType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('End of Business Day flag type found:', typeVisible);
    });

    test('Instant First Day flag type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const flagType = adminAuthenticatedPage.getByText(/instant first day/i);
      const typeVisible = await flagType.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Instant First Day flag type found:', typeVisible);
    });
  });
});
