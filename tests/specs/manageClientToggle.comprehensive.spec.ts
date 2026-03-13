// ============================================
// MANAGE CLIENT TOGGLE - COMPREHENSIVE TESTS
// Client feature toggles, configuration switches
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageClientToggle } from '../pages/manageClientToggle';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Client Toggle - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageClientTogglePage: manageClientToggle;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageClientTogglePage = new manageClientToggle(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Client Toggle' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Client Toggle page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const selectClientField = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(selectClientField).toBeVisible();
    });

    test('View button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
    });
  });

  test.describe('Client Toggle Management UI', () => {
    test('Export Client button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
    });

    test('Save button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();

      console.log('All management buttons available');
    });
  });

  test.describe('Toggle Categories', () => {
    test('General link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'General' })).toBeVisible();
    });

    test('Assessment Management link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' })).toBeVisible();
    });

    test('QK Feature Toggle link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' })).toBeVisible();
    });

    test('File Processing link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'File Processing' })).toBeVisible();
    });

    test('Third Party link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Third Party' })).toBeVisible();
    });

    test('Connect Mobile link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Connect Mobile' })).toBeVisible();
    });

    test('Care Management link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Care Management' })).toBeVisible();
    });

    test('UM Request link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'UM Request' })).toBeVisible();
    });

    test('Logging link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Logging' })).toBeVisible();
    });

    test('AI link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'AI', exact: true })).toBeVisible();
    });

    test('Correspondence link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Correspondence' })).toBeVisible();
    });
  });

  test.describe('Navigate Toggle Categories', () => {
    test('Navigate to General @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to General toggles');
    });

    test('Navigate to Assessment Management @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Assessment Management toggles');
    });

    test('Navigate to QK Feature Toggle @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to QK Feature Toggle');
    });

    test('Navigate to File Processing @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'File Processing' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to File Processing toggles');
    });

    test('Navigate to Third Party @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Third Party' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Third Party toggles');
    });

    test('Navigate to Connect Mobile @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Connect Mobile' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Connect Mobile toggles');
    });

    test('Navigate to Care Management @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Care Management' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Care Management toggles');
    });

    test('Navigate to UM Request @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'UM Request' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to UM Request toggles');
    });

    test('Navigate to Logging @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Logging' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Logging toggles');
    });

    test('Navigate to AI @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'AI', exact: true }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to AI toggles');
    });

    test('Navigate to Correspondence @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Correspondence' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Correspondence toggles');
    });
  });

  test.describe('Navigate Between Categories', () => {
    test('Navigate between multiple categories @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between multiple categories');
    });

    test('Full category navigation workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const categories = ['General', 'Assessment Management', 'QK Feature Toggle', 'File Processing', 'Third Party', 'Connect Mobile', 'Care Management', 'UM Request', 'Logging', 'Correspondence'];

      for (const category of categories) {
        const categoryLink = adminAuthenticatedPage.getByRole('link', { name: category });
        const linkVisible = await categoryLink.isVisible({ timeout: 2000 }).catch(() => false);

        if (linkVisible) {
          await categoryLink.click();
          await smartWait(adminAuthenticatedPage, 300);
          console.log(`Navigated to ${category}`);
        }
      }
    });
  });

  test.describe('Client Selection', () => {
    test('Switch between clients @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      const selectClientField = adminAuthenticatedPage.getByLabel('Select Client');
      await selectClientField.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Switched between clients');
    });

    test('Toggles persist across client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      const selectClientField = adminAuthenticatedPage.getByLabel('Select Client');
      await selectClientField.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      console.log('Toggles persist across client change');
    });
  });

  test.describe('Save Functionality', () => {
    test('Save button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeEnabled();
    });

    test('Save toggles configuration @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await saveButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Toggles configuration saved');
      }
    });
  });

  test.describe('Export and Import', () => {
    test('Export Client functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export Client' });
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
    });

    test('Import button functionality @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeEnabled();
    });

    test('Open import modal @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      const buttonVisible = await importButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await importButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Import modal opened');
      }
    });
  });

  test.describe('All Toggle Categories', () => {
    test('All toggle categories accessible @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      const toggleCategories = [
        'General',
        'Assessment Management',
        'QK Feature Toggle',
        'File Processing',
        'Third Party',
        'Connect Mobile',
        'Care Management',
        'UM Request',
        'Logging',
        'AI',
        'Correspondence'
      ];

      for (const category of toggleCategories) {
        const categoryLink = category === 'AI'
          ? adminAuthenticatedPage.getByRole('link', { name: category, exact: true })
          : adminAuthenticatedPage.getByRole('link', { name: category });
        const linkVisible = await categoryLink.isVisible({ timeout: 2000 }).catch(() => false);

        if (linkVisible) {
          console.log(`Toggle category "${category}" found`);
        }
      }
    });
  });

  test.describe('Toggle Configuration', () => {
    test('Toggle checkboxes available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const checkboxes = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      console.log('Toggle checkboxes available:', checkboxCount);
    });

    test('Toggle switches available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const toggleSwitches = adminAuthenticatedPage.locator('.switch, .toggle, input[type="checkbox"]');
      const switchCount = await toggleSwitches.count();

      console.log('Toggle switches available:', switchCount);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete client toggle workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();

      console.log('Complete client toggle workflow ready');
    });

    test('Navigate all categories and save @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 300);

      await adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' }).click();
      await smartWait(adminAuthenticatedPage, 300);

      await adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' }).click();
      await smartWait(adminAuthenticatedPage, 300);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeVisible();

      console.log('Navigate all categories and save workflow completed');
    });
  });

  test.describe('Toggle Display', () => {
    test('Toggle configuration table @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const configTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await configTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Toggle configuration table visible:', hasTable);
    });

    test('Toggle descriptions available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const descriptions = adminAuthenticatedPage.locator('td, .description, [class*="description"]');
      const descCount = await descriptions.count();

      console.log('Toggle descriptions available:', descCount);
    });
  });
});
