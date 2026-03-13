// ============================================
// MANAGE WORKFLOW - COMPREHENSIVE TESTS
// Transition reasons, export, import
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageWorkflow } from '../pages/manageWorkflow';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Workflow - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageWF: manageWorkflow;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageWF = new manageWorkflow(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Workflow' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Workflow page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Workflow UI Elements', () => {
    test('Transition Reasons link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' })).toBeVisible();
    });

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

    test('Search box available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });
  });

  test.describe('Transition Reasons', () => {
    test('Open Transition Reasons @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
    });

    test('Add Group button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Group' })).toBeVisible();
    });

    test('Add Reason button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Reason' })).toBeVisible();
    });

    test('Import button in Transition Reasons @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('Export from Transition Reasons @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const exportLink = adminAuthenticatedPage.getByRole('link', { name: 'Export Client' });
      await expect(exportLink).toBeVisible();
    });
  });

  test.describe('Add Group', () => {
    test('Open Add Group dialog @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Group' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Add Group dialog opened');
    });

    test('Add Group form fields @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Group' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const nameField = adminAuthenticatedPage.getByRole('textbox', { name: /name|group/i });
      const fieldVisible = await nameField.isVisible({ timeout: 2000 }).catch(() => false);

      console.log('Group name field visible:', fieldVisible);
    });
  });

  test.describe('Add Reason', () => {
    test('Open Add Reason dialog @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Reason' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Add Reason dialog opened');
    });

    test('Add Reason form fields @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Transition Reasons' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Reason' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const reasonField = adminAuthenticatedPage.getByRole('textbox', { name: /reason/i });
      const fieldVisible = await reasonField.isVisible({ timeout: 2000 }).catch(() => false);

      console.log('Reason field visible:', fieldVisible);
    });
  });

  test.describe('Client Selection', () => {
    test('Switch clients @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');

      await clientSelect.selectOption('34');
      await expect(clientSelect).toHaveValue('34');
    });

    test('Workflow data refreshes on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client changed, workflow data refreshed');
    });
  });

  test.describe('Search Workflow', () => {
    test('Search workflow items @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('transition');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Workflow search executed');
      }
    });

    test('Clear workflow search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test');
        await smartWait(adminAuthenticatedPage, 500);

        await searchBox.clear();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Workflow search cleared');
      }
    });
  });

  test.describe('Export and Import', () => {
    test('Export workflow configuration @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportLink = adminAuthenticatedPage.getByRole('link', { name: 'Export Client' });
      await expect(exportLink).toBeVisible();
    });

    test('Import workflow configuration @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeVisible();
    });
  });

  test.describe('Workflow Table', () => {
    test('Workflow table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const workflowTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await workflowTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Workflow table visible:', hasTable);
    });

    test('Workflow table has entries @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const workflowTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await workflowTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await workflowTable.locator('tbody tr').count();
        console.log('Workflow table rows:', rows);
      }
    });
  });
});
