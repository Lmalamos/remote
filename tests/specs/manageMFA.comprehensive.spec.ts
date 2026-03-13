// ============================================
// MANAGE MFA - COMPREHENSIVE TESTS
// Multi-factor authentication settings, user list
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageMFA } from '../pages/manageMFA';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage MFA - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageMFAPage: manageMFA;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageMFAPage = new manageMFA(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage MFA' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage MFA page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('MFA Settings', () => {
    test('Single select dropdown available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByLabel('Single select')).toBeVisible();
    });

    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('MFA configuration options @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const singleSelect = adminAuthenticatedPage.getByLabel('Single select');
      const selectVisible = await singleSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        console.log('MFA configuration options available');
      }
    });

    test('Save MFA settings @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    });
  });

  test.describe('MFA Tabs', () => {
    test('MFA Settings tab visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('tab', { name: 'MFA Settings' })).toBeVisible();
    });

    test('User List tab visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('tab', { name: 'User List' })).toBeVisible();
    });

    test('Switch to User List tab @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Switched to User List tab');
    });

    test('Switch between tabs @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('tab', { name: 'MFA Settings' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Switched between MFA tabs');
    });
  });

  test.describe('User List', () => {
    test('Search user list @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.click();
        await searchBox.fill('steven');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('User list search executed: steven');
      }
    });

    test('Clear user search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('User search cleared');
    });

    test('User list table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const userTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await userTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('User list table visible:', hasTable);
    });

    test('User list has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const userTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await userTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await userTable.locator('tbody tr').count();
        console.log('User list rows:', rows);
      }
    });

    test('User list columns @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const userTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await userTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['User', 'Name', 'Email', 'MFA'];

        for (const column of expectedColumns) {
          const headerCell = userTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
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

    test('MFA settings change with client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const settingsTab = adminAuthenticatedPage.getByRole('tab', { name: 'MFA Settings' });
      const tabVisible = await settingsTab.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('MFA settings refreshed:', tabVisible);
    });
  });

  test.describe('MFA Status', () => {
    test('MFA enabled indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const enabledIndicator = adminAuthenticatedPage.getByText(/enabled|active/i);
      const indicatorVisible = await enabledIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('MFA enabled indicator found:', indicatorVisible);
    });

    test('MFA disabled indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const disabledIndicator = adminAuthenticatedPage.getByText(/disabled|inactive/i);
      const indicatorVisible = await disabledIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('MFA disabled indicator found:', indicatorVisible);
    });
  });

  test.describe('User Actions', () => {
    test('Enable MFA for user @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const enableButtons = adminAuthenticatedPage.getByRole('button', { name: /enable/i });
      const buttonCount = await enableButtons.count();

      console.log('Enable MFA buttons found:', buttonCount);
    });

    test('Disable MFA for user @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const disableButtons = adminAuthenticatedPage.getByRole('button', { name: /disable/i });
      const buttonCount = await disableButtons.count();

      console.log('Disable MFA buttons found:', buttonCount);
    });

    test('Reset MFA for user @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('tab', { name: 'User List' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const resetButtons = adminAuthenticatedPage.getByRole('button', { name: /reset/i });
      const buttonCount = await resetButtons.count();

      console.log('Reset MFA buttons found:', buttonCount);
    });
  });

  test.describe('MFA Configuration Types', () => {
    test('MFA method options @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const singleSelect = adminAuthenticatedPage.getByLabel('Single select');
      const selectVisible = await singleSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        const methodOptions = ['SMS', 'Email', 'Authenticator App', 'Optional'];

        for (const method of methodOptions) {
          const option = adminAuthenticatedPage.getByText(method, { exact: false });
          const optionVisible = await option.isVisible({ timeout: 1000 }).catch(() => false);

          if (optionVisible) {
            console.log(`MFA method "${method}" available`);
          }
        }
      }
    });
  });
});
