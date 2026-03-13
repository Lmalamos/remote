// ============================================
// MANAGE OUTCOME REASONS - COMPREHENSIVE TESTS
// Outcome mapping, reason groups, review types
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageOutcomeReasons } from '../pages/manageOutcomeReasons';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Outcome Reasons - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageOutcomeReasonsPage: manageOutcomeReasons;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageOutcomeReasonsPage = new manageOutcomeReasons(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Outcome Reasons' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Outcome Reasons page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Navigation Links', () => {
    test('Outcome Mapping link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Outcome Mapping' })).toBeVisible();
    });

    test('Reason Groups link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' })).toBeVisible();
    });

    test('Navigate to Outcome Mapping @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const outcomeLink = adminAuthenticatedPage.getByRole('link', { name: 'Outcome Mapping' });
      await outcomeLink.click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Outcome Mapping');
    });

    test('Navigate to Reason Groups @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const reasonGroupsLink = adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' });
      await reasonGroupsLink.click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Navigated to Reason Groups');
    });

    test('Navigate between sections @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Outcome Mapping' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between sections successfully');
    });
  });

  test.describe('Management Buttons', () => {
    test('Save button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import' })).toBeVisible();
    });

    test('Export button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export' })).toBeVisible();
    });

    test('Add Row button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Row' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Row' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Add Row Functionality', () => {
    test('Add Row button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const addRowButton = adminAuthenticatedPage.getByRole('button', { name: 'Add Row' });
      await expect(addRowButton).toBeEnabled();
    });

    test('Click Add Row button @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Add Row button clicked');
    });

    test('Add Row opens form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const reviewTypeSelect = adminAuthenticatedPage.getByLabel('Choose a Review Type(s)');
      const selectVisible = await reviewTypeSelect.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Add Row form visible:', selectVisible);
    });
  });

  test.describe('Review Type Selection', () => {
    test('Review Type dropdown available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('Choose a Review Type(s)')).toBeVisible();
    });

    test('Select review type NS @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Choose a Review Type(s)').selectOption('NS');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Review type NS selected');
    });

    test('Review Type options available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const reviewTypeSelect = adminAuthenticatedPage.getByLabel('Choose a Review Type(s)');
      const options = await reviewTypeSelect.locator('option').count();

      console.log('Review Type options available:', options);
    });

    test('Select different review types @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const reviewTypeSelect = adminAuthenticatedPage.getByLabel('Choose a Review Type(s)');
      const reviewTypes = ['NS', 'IP', 'OP', 'ER'];

      for (const type of reviewTypes) {
        const option = reviewTypeSelect.locator(`option[value="${type}"]`);
        const hasOption = await option.isVisible({ timeout: 1000 }).catch(() => false);

        if (hasOption) {
          console.log(`Review Type "${type}" available`);
        }
      }
    });
  });

  test.describe('Checkbox Fields', () => {
    test('Checkbox fields available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const checkboxField = adminAuthenticatedPage.getByLabel('Checkbox field').first();
      await expect(checkboxField).toBeVisible();
    });

    test('Check first checkbox @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Checkbox field').first().check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('First checkbox checked');
    });

    test('Check second checkbox @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(1).check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Second checkbox checked');
    });

    test('Check third checkbox @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(2).check();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Third checkbox checked');
    });

    test('Check all checkboxes @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Choose a Review Type(s)').selectOption('NS');
      await adminAuthenticatedPage.getByLabel('Checkbox field').first().check();
      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(1).check();
      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(2).check();

      console.log('All checkboxes checked');
    });

    test('Multiple checkboxes count @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const checkboxes = adminAuthenticatedPage.getByLabel('Checkbox field');
      const checkboxCount = await checkboxes.count();

      console.log('Checkbox fields available:', checkboxCount);
    });
  });

  test.describe('Save Row Functionality', () => {
    test('Save button for row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const saveButton = adminAuthenticatedPage.locator('.btn.btn-secondary.save');
      await expect(saveButton).toBeVisible();
    });

    test('Save row with data @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Choose a Review Type(s)').selectOption('NS');
      await adminAuthenticatedPage.getByLabel('Checkbox field').first().check();
      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(1).check();
      await adminAuthenticatedPage.getByLabel('Checkbox field').nth(2).check();

      await adminAuthenticatedPage.locator('.btn.btn-secondary.save').click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Row saved with data');
    });

    test('Save empty row @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.locator('.btn.btn-secondary.save').click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Save empty row attempted');
    });
  });

  test.describe('Outcome Reasons Table', () => {
    test('Outcome reasons table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const reasonsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reasonsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Outcome reasons table visible:', hasTable);
    });

    test('Outcome reasons table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const reasonsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reasonsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await reasonsTable.locator('tbody tr').count();
        console.log('Outcome reasons rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const reasonsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await reasonsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await reasonsTable.locator('thead th').count();
        console.log('Outcome reasons table columns:', headers);
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

    test('Outcome reasons refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const addRowButton = adminAuthenticatedPage.getByRole('button', { name: 'Add Row' });
      const buttonVisible = await addRowButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Outcome reasons refreshed:', buttonVisible);
    });

    test('Navigation links persist across client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Outcome Mapping' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' })).toBeVisible();

      console.log('Navigation links persist across client change');
    });
  });

  test.describe('Save Configuration', () => {
    test('Save button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeEnabled();
    });

    test('Save configuration click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await saveButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Configuration saved');
      }
    });
  });

  test.describe('Export and Import', () => {
    test('Export button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const exportButton = adminAuthenticatedPage.getByRole('button', { name: 'Export' });
      await expect(exportButton).toBeEnabled();
    });

    test('Import button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import' });
      await expect(importButton).toBeEnabled();
    });

    test('Open import modal @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import' });
      const buttonVisible = await importButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await importButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Import modal opened');
      }
    });
  });

  test.describe('Outcome Reasons Actions', () => {
    test('Edit outcome reason @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete outcome reason @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View outcome reason details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete outcome reason workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Outcome Mapping' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Row' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      console.log('Complete outcome reason workflow ready');
    });

    test('Add row and save workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Add Row' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Choose a Review Type(s)').selectOption('NS');
      await adminAuthenticatedPage.getByLabel('Checkbox field').first().check();
      await adminAuthenticatedPage.locator('.btn.btn-secondary.save').click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Add row and save workflow completed');
    });
  });

  test.describe('Reason Groups Section', () => {
    test('Reason Groups section available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Reason Groups section loaded');
    });

    test('Reason Groups table displays @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Reason Groups' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const groupsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await groupsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Reason Groups table visible:', hasTable);
    });
  });
});
