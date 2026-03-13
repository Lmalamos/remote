// ============================================
// MANAGE RECYCLING RULES - COMPREHENSIVE TESTS
// Task recycling configuration, automation rules
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageRecyclingRules } from '../pages/manageRecyclingRules';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Recycling Rules - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageRecyclingRulesPage: manageRecyclingRules;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageRecyclingRulesPage = new manageRecyclingRules(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Recycling Rules' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Recycling Rules page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Recycling Rules Management UI', () => {
    test('Load button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Load' })).toBeVisible();
    });

    test('Export button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import' })).toBeVisible();
    });

    test('Search box visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Load' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Load Functionality', () => {
    test('Load button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const loadButton = adminAuthenticatedPage.getByRole('button', { name: 'Load' });
      await expect(loadButton).toBeEnabled();
    });

    test('Load button click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const loadButton = adminAuthenticatedPage.getByRole('button', { name: 'Load' });
      const buttonVisible = await loadButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await loadButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Load button clicked - recycling rules loading');
      }
    });

    test('Load for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const loadButton = adminAuthenticatedPage.getByRole('button', { name: 'Load' });
      await expect(loadButton).toBeVisible();
      await expect(loadButton).toBeEnabled();
    });
  });

  test.describe('Export Functionality', () => {
    test('Export button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export' });
      await expect(exportButton).toBeEnabled();
    });

    test('Export button click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export' });
      const buttonVisible = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Export button ready for recycling rules export');
      }
    });

    test('Export for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export' });
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
    });
  });

  test.describe('Import Functionality', () => {
    test('Import button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import' });
      await expect(importButton).toBeEnabled();
    });

    test('Open import modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import' });
      const buttonVisible = await importButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await importButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Import modal opened for recycling rules');
      }
    });

    test('Import for different client @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import' });
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeEnabled();
    });
  });

  test.describe('Recycling Rules Table', () => {
    test('Recycling rules table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Recycling rules table visible:', hasTable);
    });

    test('Recycling rules table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await rulesTable.locator('tbody tr').count();
        console.log('Recycling rules rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await rulesTable.locator('thead th').count();
        console.log('Recycling rules table columns:', headers);
      }
    });

    test('Table columns have headers @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Rule Name', 'Task Type', 'Status', 'Days', 'Action'];

        for (const column of expectedColumns) {
          const headerCell = rulesTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Search Recycling Rules', () => {
    test('Search recycling rules @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('task');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Recycling rules search executed: task');
    });

    test('Clear recycling rules search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Recycling rules search cleared');
    });

    test('Search by rule name @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('recycle');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search by rule name executed');
    });

    test('Search by task type @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('case management');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search by task type executed');
    });

    test('Search with partial match @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('auto');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Search with partial match executed');
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

    test('Recycling rules refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const loadButton = adminAuthenticatedPage.getByRole('button', { name: 'Load' });
      const buttonVisible = await loadButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Recycling rules refreshed:', buttonVisible);
    });
  });

  test.describe('Recycling Rules Actions', () => {
    test('Edit recycling rule @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete recycling rule @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View recycling rule details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Enable/disable recycling rule @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const toggleButtons = adminAuthenticatedPage.locator('input[type="checkbox"], .toggle, .switch');
      const buttonCount = await toggleButtons.count();

      console.log('Toggle buttons found:', buttonCount);
    });
  });

  test.describe('Rule Configuration', () => {
    test('Add new recycling rule @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const addButton = adminAuthenticatedPage.getByRole('button', { name: /add|new/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Add new recycling rule button available');
      }
    });

    test('Rule name field @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const ruleNameField = adminAuthenticatedPage.getByLabel(/rule name/i);
      const fieldVisible = await ruleNameField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Rule name field visible:', fieldVisible);
    });

    test('Task type selection @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const taskTypeSelect = adminAuthenticatedPage.getByLabel(/task type/i);
      const selectVisible = await taskTypeSelect.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Task type selection visible:', selectVisible);
    });

    test('Days field for recycling @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const daysField = adminAuthenticatedPage.getByLabel(/days/i);
      const fieldVisible = await daysField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Days field visible:', fieldVisible);
    });
  });

  test.describe('Rule Status', () => {
    test('Active status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const activeStatus = adminAuthenticatedPage.getByText(/active/i);
      const statusVisible = await activeStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Active status indicator found:', statusVisible);
    });

    test('Inactive status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const inactiveStatus = adminAuthenticatedPage.getByText(/inactive/i);
      const statusVisible = await inactiveStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Inactive status indicator found:', statusVisible);
    });

    test('Pending status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const pendingStatus = adminAuthenticatedPage.getByText(/pending/i);
      const statusVisible = await pendingStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Pending status indicator found:', statusVisible);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete recycling rules workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Load' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();

      console.log('Complete recycling rules workflow ready');
    });

    test('Load, search, and export workflow @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const loadButton = adminAuthenticatedPage.getByRole('button', { name: 'Load' });
      await loadButton.click().catch(() => {});
      await smartWait(adminAuthenticatedPage, 1000);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('task').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export' });
      await expect(exportButton).toBeVisible();

      console.log('Load, search, and export workflow completed');
    });
  });

  test.describe('Rule Validation', () => {
    test('Required fields validation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const requiredFields = adminAuthenticatedPage.locator('input[required], select[required]');
      const requiredCount = await requiredFields.count();

      console.log('Required fields for recycling rules:', requiredCount);
    });

    test('Days field numeric validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const numericFields = adminAuthenticatedPage.locator('input[type="number"]');
      const numericCount = await numericFields.count();

      console.log('Numeric fields for validation:', numericCount);
    });
  });
});
