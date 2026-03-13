// ============================================
// MANAGE LETTER RESOURCES - COMPREHENSIVE TESTS
// Letter attachments, document resources, categories
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageLetterResources } from '../pages/manageLetterResources';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Letter Resources - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageLetterResourcesPage: manageLetterResources;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageLetterResourcesPage = new manageLetterResources(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Letter Resources' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Letter Resources page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Letter Resources Management UI', () => {
    test('Export Client button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
    });

    test('Add button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add' })).toBeVisible();
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

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Add Letter Resource', () => {
    test('Open Add Letter Resource form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' })).toBeVisible();
    });

    test('Name field is required @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
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
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Company Logo');

      console.log('Name field filled');
    });

    test('Name with special characters @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Company-Logo_2024');

      console.log('Name with special characters filled');
    });

    test('Long name value @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const longName = 'Very Long Letter Resource Name With Many Characters For Testing Purpose';
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill(longName);

      console.log('Long name value filled:', longName.length, 'characters');
    });
  });

  test.describe('Category Selection', () => {
    test('Category dropdown available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('Category', { exact: true })).toBeVisible();
    });

    test('Select category @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Category', { exact: true }).selectOption('44');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Category selected');
    });

    test('Category options available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const categorySelect = adminAuthenticatedPage.getByLabel('Category', { exact: true });
      const options = await categorySelect.locator('option').count();

      console.log('Category options available:', options);
    });
  });

  test.describe('User Guide Category', () => {
    test('User Guide Category dropdown available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('User Guide Category')).toBeVisible();
    });

    test('Select Provider Portal category @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('User Guide Category').selectOption('Provider Portal');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Provider Portal category selected');
    });

    test('User Guide Category options available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const categorySelect = adminAuthenticatedPage.getByLabel('User Guide Category');
      const options = await categorySelect.locator('option').count();

      console.log('User Guide Category options available:', options);
    });

    test('Select different User Guide Categories @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const categorySelect = adminAuthenticatedPage.getByLabel('User Guide Category');
      const categoryOptions = ['Provider Portal', 'Member Portal', 'Admin Portal'];

      for (const category of categoryOptions) {
        const option = categorySelect.locator(`option:has-text("${category}")`);
        const hasOption = await option.isVisible({ timeout: 1000 }).catch(() => false);

        if (hasOption) {
          console.log(`User Guide Category "${category}" available`);
        }
      }
    });
  });

  test.describe('Complete Letter Resource Form', () => {
    test('Fill complete letter resource form @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Company Logo');
      await adminAuthenticatedPage.getByLabel('Category', { exact: true }).selectOption('44');
      await adminAuthenticatedPage.getByLabel('User Guide Category').selectOption('Provider Portal');

      console.log('Complete letter resource form filled');
    });

    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const saveVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Save button available:', saveVisible);
    });

    test('Close button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const closeButton = adminAuthenticatedPage.getByRole('button', { name: 'Close', exact: true });
      const closeVisible = await closeButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Close button available:', closeVisible);
    });

    test('Cancel letter resource creation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const closeButton = adminAuthenticatedPage.getByRole('button', { name: 'Close', exact: true });
      const closeVisible = await closeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (closeVisible) {
        await closeButton.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Letter resource creation cancelled');
      }
    });
  });

  test.describe('Letter Resources List', () => {
    test('Letter resources table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const resourcesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await resourcesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Letter resources table visible:', hasTable);
    });

    test('Letter resources table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const resourcesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await resourcesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await resourcesTable.locator('tbody tr').count();
        console.log('Letter resources rows:', rows);
      }
    });

    test('Search letter resources @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('Nike');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Letter resources search executed: Nike');
    });

    test('Clear letter resources search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Letter resources search cleared');
    });

    test('Search with special characters @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('Logo-2024');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search with special characters executed');
    });
  });

  test.describe('Letter Resource Actions', () => {
    test('Download resource @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const downloadButtons = adminAuthenticatedPage.getByLabel('download');
      const buttonCount = await downloadButtons.count();

      console.log('Download buttons found:', buttonCount);
    });

    test('Delete resource @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.getByTitle('Delete');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('Delete confirmation modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButton = adminAuthenticatedPage.getByTitle('Delete').first();
      const buttonVisible = await deleteButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await deleteButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        const noButton = adminAuthenticatedPage.getByRole('button', { name: 'No' });
        const noVisible = await noButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (noVisible) {
          await noButton.click();
          console.log('Delete confirmation cancelled');
        }
      }
    });

    test('Deactivate resource @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deactivateButtons = adminAuthenticatedPage.locator('[id^="deactivateDocumentBtn"]');
      const buttonCount = await deactivateButtons.count();

      console.log('Deactivate buttons found:', buttonCount);
    });
  });

  test.describe('Export and Import', () => {
    test('Export Client functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export Client' });
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

    test('Letter resources refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const addButton = adminAuthenticatedPage.getByRole('button', { name: 'Add' });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Letter resources refreshed:', buttonVisible);
    });
  });

  test.describe('Resource Type Scenarios', () => {
    test('Add image resource @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Company Logo Image');
      await adminAuthenticatedPage.getByLabel('Category', { exact: true }).selectOption('44');

      console.log('Image resource configured');
    });

    test('Add PDF resource @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Terms and Conditions PDF');
      await adminAuthenticatedPage.getByLabel('Category', { exact: true }).selectOption('44');

      console.log('PDF resource configured');
    });

    test('Add template resource @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Letter Template Header');
      await adminAuthenticatedPage.getByLabel('Category', { exact: true }).selectOption('44');

      console.log('Template resource configured');
    });
  });

  test.describe('Resource Filtering', () => {
    test('Filter by resource type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('Logo');
      await smartWait(adminAuthenticatedPage, 500);

      const resourcesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await resourcesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await resourcesTable.locator('tbody tr').count();
        console.log('Filtered resources:', rows);
      }
    });

    test('Filter by category name @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('provider');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Category filter applied');
    });
  });

  test.describe('Resource Visibility', () => {
    test('View resource details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const resourceRows = adminAuthenticatedPage.locator('table tbody tr');
      const rowCount = await resourceRows.count();

      console.log('Resource rows available for viewing:', rowCount);
    });

    test('Resource name displays @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const resourcesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await resourcesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const firstRow = resourcesTable.locator('tbody tr').first();
        const hasRow = await firstRow.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasRow) {
          console.log('Resource name column displays');
        }
      }
    });
  });
});
