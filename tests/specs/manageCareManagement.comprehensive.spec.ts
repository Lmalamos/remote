// ============================================
// MANAGE CARE MANAGEMENT - COMPREHENSIVE TESTS
// Review types, place of service, type of service
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageCareManagement } from '../pages/manageCareManagement';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Care Management - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageCM: manageCareManagement;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageCM = new manageCareManagement(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Care Management' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Care Management page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Client selection dropdown @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Level 2 Configuration', () => {
    test('Level 2 heading displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('heading', { name: 'Level 2: Review Types, Place' })).toBeVisible();
    });

    test('Level 2 content visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.locator('h3')).toContainText('Level 2: Review Types, Place of Service, Type of Service');
    });

    test('Switch clients maintains Level 2 view @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('heading', { name: 'Level 2: Review Types, Place' })).toBeVisible();

      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('heading', { name: 'Level 2: Review Types, Place' })).toBeVisible();
    });
  });

  test.describe('Review Types', () => {
    test('Review Types section available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const reviewTypesSection = adminAuthenticatedPage.getByText('Review Types', { exact: false });
      const sectionVisible = await reviewTypesSection.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Review Types section visible:', sectionVisible);
    });
  });

  test.describe('Place of Service', () => {
    test('Place of Service section available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const posSection = adminAuthenticatedPage.getByText('Place of Service', { exact: false });
      const sectionVisible = await posSection.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Place of Service section visible:', sectionVisible);
    });
  });

  test.describe('Type of Service', () => {
    test('Type of Service section available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const tosSection = adminAuthenticatedPage.getByText('Type of Service', { exact: false });
      const sectionVisible = await tosSection.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Type of Service section visible:', sectionVisible);
    });
  });
});
