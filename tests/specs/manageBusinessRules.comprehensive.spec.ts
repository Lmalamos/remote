// ============================================
// MANAGE BUSINESS RULES - COMPREHENSIVE TESTS
// Rule creation, conditions, export, copy
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageBusinessRules } from '../pages/manageBusinessRules';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Business Rules - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageBR: manageBusinessRules;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageBR = new manageBusinessRules(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Business Rules' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Business Rules page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('UI Elements', () => {
    test('Export Client link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Export Client' })).toBeVisible();
    });

    test('Copy to Another Client link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Copy to Another Client' })).toBeVisible();
    });

    test('Business Rule Report link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Business Rule Report' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('Add link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Add' })).toBeVisible();
    });
  });

  test.describe('Copy Business Rules', () => {
    test('Open Copy to Another Client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Copy to Another Client' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('Clients to Copy To')).toBeVisible();
    });

    test('Select multiple clients to copy @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Copy to Another Client' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Clients to Copy To').selectOption('51');
      await adminAuthenticatedPage.getByLabel('Clients to Copy To').selectOption('95');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Submit' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Cancel' })).toBeVisible();

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click();
    });
  });

  test.describe('Add Business Rule', () => {
    test('Open Add Business Rule form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'name', exact: true })).toBeVisible();
    });

    test('Fill rule name and code @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'name', exact: true }).fill('test');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'code' }).click();
    });

    test('Select rule type @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('type', { exact: true }).selectOption('5');
    });

    test('Add condition @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('link', { name: 'plus' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.locator('select[name="object1"]').selectOption('request');
      await adminAuthenticatedPage.locator('select[name="property1"]').selectOption('clientProgramReviewTypeLabel');
      await adminAuthenticatedPage.locator('select[name="operator"]').selectOption('equalTo');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Exit' })).toBeVisible();

      await adminAuthenticatedPage.getByRole('link', { name: 'Exit' }).click();
    });

    test('Test business rule @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'name', exact: true }).fill('test');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'data', exact: true }).fill('test');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Test', exact: true })).toBeVisible();
    });
  });

  test.describe('Rule Management', () => {
    test('Search business rules @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('rule');
        console.log('Business rules search executed');
      }
    });

    test('Show entries dropdown @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByLabel('Show entries')).toBeVisible();
    });
  });
});
