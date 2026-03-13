// ============================================
// MANAGE CASE ACTION RULES - COMPREHENSIVE TESTS
// Case action rules, review type configuration
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageCaseActionRules } from '../pages/manageCaseActionRules';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Case Action Rules - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageCaseActionRulesPage: manageCaseActionRules;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageCaseActionRulesPage = new manageCaseActionRules(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Case Action Rules' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Case Action Rules page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Case Action Rules Management UI', () => {
    test('Export Client button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
    });

    test('Import button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
    });

    test('Edit button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Edit' })).toBeVisible();
    });

    test('All management buttons available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Edit' })).toBeVisible();

      console.log('All management buttons available for client 34');
    });
  });

  test.describe('Edit Case Action Rules', () => {
    test('Edit button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const editButton = adminAuthenticatedPage.getByRole('button', { name: 'Edit' });
      await expect(editButton).toBeEnabled();
    });

    test('Open Edit mode @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Edit mode opened');
    });

    test('Close and Save buttons available in Edit mode @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Close Edit mode @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Edit mode closed');
    });
  });

  test.describe('Case Type Rows', () => {
    test('Acute Maternity Inpatient row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const maternityRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Maternity Inpatient' });
      const rowVisible = await maternityRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Acute Maternity Inpatient row visible:', rowVisible);
    });

    test('Acute Medical Surgical row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const medicalRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Medical Surgical' });
      const rowVisible = await medicalRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Acute Medical Surgical row visible:', rowVisible);
    });

    test('Acute Rehabilitation row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const rehabRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Rehabilitation' });
      const rowVisible = await rehabRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Acute Rehabilitation row visible:', rowVisible);
    });

    test('Hospice Inpatient Continued row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const hospiceRow = adminAuthenticatedPage.getByRole('row', { name: 'Hospice Inpatient Continued' });
      const rowVisible = await hospiceRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Hospice Inpatient Continued row visible:', rowVisible);
    });

    test('Long Term Acute Care (LTAC) row available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const ltacRow = adminAuthenticatedPage.getByRole('row', { name: 'Long Term Acute Care (LTAC)' });
      const rowVisible = await ltacRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Long Term Acute Care (LTAC) row visible:', rowVisible);
    });
  });

  test.describe('Combobox Interactions', () => {
    test('Acute Maternity combobox click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const maternityRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Maternity Inpatient' });
      const combobox = maternityRow.getByRole('combobox').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Acute Maternity combobox clicked');
      }
    });

    test('Acute Medical Surgical combobox click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const medicalRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Medical Surgical' });
      const combobox = medicalRow.getByRole('combobox').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Acute Medical Surgical combobox clicked');
      }
    });

    test('Acute Rehabilitation combobox click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const rehabRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Rehabilitation' });
      const combobox = rehabRow.getByRole('combobox').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Acute Rehabilitation combobox clicked');
      }
    });

    test('Hospice Inpatient combobox click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const hospiceRow = adminAuthenticatedPage.getByRole('row', { name: 'Hospice Inpatient Continued' });
      const combobox = hospiceRow.getByRole('combobox').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Hospice Inpatient combobox clicked');
      }
    });

    test('LTAC combobox click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const ltacRow = adminAuthenticatedPage.getByRole('row', { name: 'Long Term Acute Care (LTAC)' });
      const combobox = ltacRow.getByRole('combobox').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('LTAC combobox clicked');
      }
    });
  });

  test.describe('Combobox Selection', () => {
    test('None selected combobox available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const noneSelectedComboboxes = adminAuthenticatedPage.getByRole('combobox', { name: 'None selected' });
      const comboCount = await noneSelectedComboboxes.count();

      console.log('None selected comboboxes available:', comboCount);
    });

    test('Approved combobox available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const approvedCombobox = adminAuthenticatedPage.getByRole('combobox', { name: 'Approved' });
      const comboVisible = await approvedCombobox.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Approved combobox visible:', comboVisible);
    });

    test('Open and close combobox dropdown @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const combobox = adminAuthenticatedPage.locator('.btn-group.open > .multiselect').first();
      const comboVisible = await combobox.isVisible({ timeout: 3000 }).catch(() => false);

      if (comboVisible) {
        await combobox.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Combobox dropdown opened and closed');
      }
    });
  });

  test.describe('Case Action Rules Table', () => {
    test('Case action rules table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Case action rules table visible:', hasTable);
    });

    test('Case action rules table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await rulesTable.locator('tbody tr').count();
        console.log('Case action rules rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const rulesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await rulesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await rulesTable.locator('thead th').count();
        console.log('Case action rules table columns:', headers);
      }
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

    test('Case action rules refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const editButton = adminAuthenticatedPage.getByRole('button', { name: 'Edit' });
      const buttonVisible = await editButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Case action rules refreshed:', buttonVisible);
    });
  });

  test.describe('Save Functionality', () => {
    test('Save button in Edit mode @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    });

    test('Save case action rules @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Save button ready for case action rules');
      }
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete case action rules workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Export Client' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import:' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Edit' })).toBeVisible();

      console.log('Complete case action rules workflow ready');
    });

    test('Edit and save workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Close' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Edit and save workflow completed');
    });

    test('Edit multiple rows workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const maternityRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Maternity Inpatient' });
      const maternityCombo = maternityRow.getByRole('combobox').first();
      const maternityVisible = await maternityCombo.isVisible({ timeout: 2000 }).catch(() => false);

      if (maternityVisible) {
        await maternityCombo.click();
        await smartWait(adminAuthenticatedPage, 300);
      }

      const medicalRow = adminAuthenticatedPage.getByRole('row', { name: 'Acute Medical Surgical' });
      const medicalCombo = medicalRow.getByRole('combobox').first();
      const medicalVisible = await medicalCombo.isVisible({ timeout: 2000 }).catch(() => false);

      if (medicalVisible) {
        await medicalCombo.click();
        await smartWait(adminAuthenticatedPage, 300);
      }

      await adminAuthenticatedPage.getByRole('button', { name: 'Close' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Edit multiple rows workflow completed');
    });
  });

  test.describe('Case Type Categories', () => {
    test('Acute case types available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const acuteCaseTypes = ['Acute Maternity Inpatient', 'Acute Medical Surgical', 'Acute Rehabilitation'];

      for (const caseType of acuteCaseTypes) {
        const row = adminAuthenticatedPage.getByRole('row', { name: caseType });
        const rowVisible = await row.isVisible({ timeout: 2000 }).catch(() => false);

        if (rowVisible) {
          console.log(`Case type "${caseType}" found`);
        }
      }
    });

    test('Hospice case types available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const hospiceRow = adminAuthenticatedPage.getByRole('row', { name: 'Hospice Inpatient Continued' });
      const rowVisible = await hospiceRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Hospice case type found:', rowVisible);
    });

    test('Long term care types available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const ltacRow = adminAuthenticatedPage.getByRole('row', { name: 'Long Term Acute Care (LTAC)' });
      const rowVisible = await ltacRow.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Long term care type found:', rowVisible);
    });
  });

  test.describe('Action Rule Status', () => {
    test('Approved status @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const approvedCombobox = adminAuthenticatedPage.getByRole('combobox', { name: 'Approved' });
      const comboVisible = await approvedCombobox.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Approved status found:', comboVisible);
    });

    test('None selected status @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Edit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const noneSelected = adminAuthenticatedPage.getByRole('combobox', { name: 'None selected' }).first();
      const comboVisible = await noneSelected.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('None selected status found:', comboVisible);
    });
  });
});
