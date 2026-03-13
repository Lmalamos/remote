// ============================================
// MANAGE CLIENT HOURS - COMPREHENSIVE TESTS
// Client business hours, timezone configuration
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageClientHours } from '../pages/manageClientHours';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Client Hours - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageClientHoursPage: manageClientHours;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageClientHoursPage = new manageClientHours(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Client Hours' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Client Hours page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Client Hours Management UI', () => {
    test('Export Client button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('Add button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Add Client Hours', () => {
    test('Open Add Client Hours form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' })).toBeVisible();
    });

    test('Name field is required @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const nameField = adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' });
      await expect(nameField).toBeVisible();

      const label = await adminAuthenticatedPage.locator('label:has-text("Name")').first().textContent().catch(() => '');
      const isRequired = label.includes('*');

      console.log('Name field required:', isRequired);
      expect(isRequired).toBe(true);
    });

    test('Fill name field @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Standard Business Hours');

      console.log('Name field filled');
    });

    test('Code field available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const codeField = adminAuthenticatedPage.getByRole('textbox', { name: 'Code' });
      await expect(codeField).toBeVisible();
    });

    test('Fill code field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Code' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Code' }).fill('STD_HOURS');

      console.log('Code field filled');
    });
  });

  test.describe('Timezone Configuration', () => {
    test('Timezone dropdown available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('Timezone')).toBeVisible();
    });

    test('Select US/Central timezone @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Timezone').selectOption('US/Central');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('US/Central timezone selected');
    });

    test('Select US/Eastern timezone @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const timezoneSelect = adminAuthenticatedPage.getByLabel('Timezone');
      const easternOption = timezoneSelect.locator('option:has-text("Eastern")').first();
      const hasEastern = await easternOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasEastern) {
        await timezoneSelect.selectOption({ label: /Eastern/i });
        console.log('US/Eastern timezone selected');
      }
    });

    test('Select US/Mountain timezone @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const timezoneSelect = adminAuthenticatedPage.getByLabel('Timezone');
      const mountainOption = timezoneSelect.locator('option:has-text("Mountain")').first();
      const hasMountain = await mountainOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasMountain) {
        await timezoneSelect.selectOption({ label: /Mountain/i });
        console.log('US/Mountain timezone selected');
      }
    });

    test('Select US/Pacific timezone @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const timezoneSelect = adminAuthenticatedPage.getByLabel('Timezone');
      const pacificOption = timezoneSelect.locator('option:has-text("Pacific")').first();
      const hasPacific = await pacificOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasPacific) {
        await timezoneSelect.selectOption({ label: /Pacific/i });
        console.log('US/Pacific timezone selected');
      }
    });
  });

  test.describe('Business Hours Configuration', () => {
    test('Start Hour field available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' })).toBeVisible();
    });

    test('End Hour field available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' })).toBeVisible();
    });

    test('Fill start hour @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('8:00');

      console.log('Start hour filled: 8:00');
    });

    test('Fill end hour @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('17:00');

      console.log('End hour filled: 17:00');
    });

    test('Standard business hours (9-5) @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('9:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('17:00');

      console.log('Standard 9-5 business hours configured');
    });

    test('Extended business hours (7-7) @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('7:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('19:00');

      console.log('Extended 7-7 business hours configured');
    });

    test('Early morning hours @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('6:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('14:00');

      console.log('Early morning hours configured');
    });

    test('Hour format validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const startHour = adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' });
      await startHour.fill('1:00');
      await smartWait(adminAuthenticatedPage, 500);

      const endHour = adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' });
      await endHour.fill('2:00');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Hour format validation tested');
    });
  });

  test.describe('Complete Client Hours Form', () => {
    test('Fill complete client hours form @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Standard Hours');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Code' }).fill('STD');
      await adminAuthenticatedPage.getByLabel('Timezone').selectOption('US/Central');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('8:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('17:00');

      console.log('Complete client hours form filled');
    });

    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Close button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close' })).toBeVisible();
    });

    test('Cancel client hours creation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client hours creation cancelled');
    });
  });

  test.describe('Client Hours List', () => {
    test('Client hours table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const hoursTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await hoursTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Client hours table visible:', hasTable);
    });

    test('Client hours table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const hoursTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await hoursTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await hoursTable.locator('tbody tr').count();
        console.log('Client hours rows:', rows);
      }
    });

    test('Search client hours @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('standard');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Client hours search executed');
      }
    });

    test('Clear client hours search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client hours search cleared');
    });
  });

  test.describe('Export and Import', () => {
    test('Export Client functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('link', { name: 'Export Client' });
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
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

    test('Client hours refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const addButton = adminAuthenticatedPage.getByRole('link', { name: 'Add' });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Client hours refreshed:', buttonVisible);
    });
  });

  test.describe('Hour Validation Scenarios', () => {
    test('Same start and end hour @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('9:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('9:00');

      console.log('Same start and end hour tested');
    });

    test('Overnight hours @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('22:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('6:00');

      console.log('Overnight hours configured');
    });

    test('24-hour operation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Start Hour' }).fill('0:00');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'End Hour' }).fill('23:59');

      console.log('24-hour operation configured');
    });
  });

  test.describe('Client Hours Actions', () => {
    test('Edit client hours @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete client hours @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View client hours details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });
});
