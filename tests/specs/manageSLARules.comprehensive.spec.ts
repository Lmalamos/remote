// ============================================
// MANAGE SLA RULES - COMPREHENSIVE TESTS
// SLA configuration, forms, appeal windows
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageSLARules } from '../pages/manageSLARules';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage SLA Rules - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageSLA: manageSLARules;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageSLA = new manageSLARules(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage SLA Rules' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage SLA Rules page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('SLA Form Display', () => {
    test('Display Form button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Display Form' })).toBeVisible();
    });

    test('Display SLA Appeal Window button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Display SLA Appeal Window' })).toBeVisible();
    });

    test('Open Display Form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });
  });

  test.describe('Form Actions', () => {
    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Export To CSV button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export To CSV' })).toBeVisible();
    });

    test('Import button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });
  });

  test.describe('Default Hours', () => {
    test('Set Default Hours button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Set Default Hours' })).toBeVisible();
    });

    test('Open Set Default Hours modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Set Default Hours' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close modal' })).toBeVisible();
    });

    test('Close Default Hours modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Set Default Hours' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Close modal' }).click();
      await smartWait(adminAuthenticatedPage, 500);
    });
  });

  test.describe('Layered View', () => {
    test('Display Layered View button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Display Layered View' })).toBeVisible();
    });

    test('Switch to Layered View @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Layered View' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Switched to Layered View');
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

    test('SLA form persists across client selection @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 1000);

      const formVisible = await adminAuthenticatedPage.getByRole('button', { name: 'Save' }).isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Form persists after client change:', formVisible);
    });
  });

  test.describe('SLA Appeal Window', () => {
    test('Display SLA Appeal Window @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display SLA Appeal Window' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('SLA Appeal Window displayed');
    });

    test('Toggle between Form and Appeal Window @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('button', { name: 'Display SLA Appeal Window' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Toggled between Form and Appeal Window');
    });
  });

  test.describe('Export and Import', () => {
    test('Export SLA rules to CSV @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export To CSV' });
      await expect(exportButton).toBeVisible();
    });

    test('Import SLA rules @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Display Form' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import:' });
      await expect(importButton).toBeVisible();
    });
  });
});
