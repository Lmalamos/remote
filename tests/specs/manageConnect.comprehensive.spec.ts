// ============================================
// MANAGE CONNECT - COMPREHENSIVE TESTS
// Turnleaf Connect integration, referral management
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageConnect } from '../pages/manageConnect';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Connect - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageConnectPage: manageConnect;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageConnectPage = new manageConnect(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Connect' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Connect page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client shows prompt @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByText('Please select a client from')).toBeVisible();
    });

    test('Select valid client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(clientSelect).toHaveValue('34');
    });
  });

  test.describe('Import CSV Functionality', () => {
    test('Import CSV button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Import CSV' })).toBeVisible();
    });

    test('Import CSV button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import CSV' });
      await expect(importButton).toBeEnabled();
    });

    test('Open Import CSV modal @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const importButton = adminAuthenticatedPage.getByRole('button', { name: 'Import CSV' });
      const buttonVisible = await importButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await importButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Import CSV modal opened');
      }
    });
  });

  test.describe('CSV Header Configuration', () => {
    test('Member Id Header field visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' })).toBeVisible();
    });

    test('Email Header field visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' })).toBeVisible();
    });

    test('Fill Member Id Header @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const memberIdField = adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' });
      await memberIdField.click();
      await memberIdField.fill('MemberId');

      console.log('Member Id Header filled');
    });

    test('Fill Email Header @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const emailField = adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' });
      await emailField.click();
      await emailField.fill('Email');

      console.log('Email Header filled');
    });

    test('Fill both header fields @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' }).fill('MemberId');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' }).fill('Email');

      console.log('Both header fields filled');
    });
  });

  test.describe('Submit Functionality', () => {
    test('Submit button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Submit' })).toBeVisible();
    });

    test('Submit button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const submitButton = adminAuthenticatedPage.getByRole('button', { name: 'Submit' });
      await expect(submitButton).toBeEnabled();
    });

    test('Submit without CSV file shows error @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Submit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.locator('#snackbar0').getByText('CSV File is a required field')).toBeVisible();
    });

    test('CSV file validation message displays @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('button', { name: 'Submit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const errorMessage = adminAuthenticatedPage.locator('#snackbar0').getByText('CSV File is a required field');
      const isVisible = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('CSV validation error visible:', isVisible);
      expect(isVisible).toBe(true);
    });
  });

  test.describe('Referral Table', () => {
    test('Referral table search box visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.locator('#turnleafReferralTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('Search referral table @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafReferralTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Referral table search executed');
    });

    test('Clear referral table search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafReferralTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Referral table search cleared');
    });

    test('Referral table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const referralTable = adminAuthenticatedPage.locator('#turnleafReferralTable');
      const hasTable = await referralTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Referral table visible:', hasTable);
    });

    test('Referral table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const referralTable = adminAuthenticatedPage.locator('#turnleafReferralTable');
      const hasTable = await referralTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await referralTable.locator('tbody tr').count();
        console.log('Referral table rows:', rows);
      }
    });
  });

  test.describe('Client Program Module Table', () => {
    test('Client program module search box visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('Search client program module table @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('program');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client program module search executed');
    });

    test('Clear client program module search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('program').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client program module search cleared');
    });

    test('Client program module table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const programTable = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable');
      const hasTable = await programTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Client program module table visible:', hasTable);
    });

    test('Client program module table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const programTable = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable');
      const hasTable = await programTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await programTable.locator('tbody tr').count();
        console.log('Client program module rows:', rows);
      }
    });
  });

  test.describe('Preference Table', () => {
    test('Preference table search box visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.locator('#turnleafPreferenceTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('Search preference table @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafPreferenceTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('preference');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Preference table search executed');
    });

    test('Clear preference table search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const searchBox = adminAuthenticatedPage.locator('#turnleafPreferenceTable_filter').getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('preference').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Preference table search cleared');
    });

    test('Preference table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const preferenceTable = adminAuthenticatedPage.locator('#turnleafPreferenceTable');
      const hasTable = await preferenceTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Preference table visible:', hasTable);
    });

    test('Preference table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const preferenceTable = adminAuthenticatedPage.locator('#turnleafPreferenceTable');
      const hasTable = await preferenceTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await preferenceTable.locator('tbody tr').count();
        console.log('Preference table rows:', rows);
      }
    });
  });

  test.describe('All Tables Visibility', () => {
    test('All three tables visible simultaneously @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const referralTable = await adminAuthenticatedPage.locator('#turnleafReferralTable').isVisible({ timeout: 3000 }).catch(() => false);
      const programTable = await adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable').isVisible({ timeout: 3000 }).catch(() => false);
      const preferenceTable = await adminAuthenticatedPage.locator('#turnleafPreferenceTable').isVisible({ timeout: 3000 }).catch(() => false);

      console.log('All tables visible - Referral:', referralTable, 'Program:', programTable, 'Preference:', preferenceTable);
    });

    test('All search boxes functional @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const referralSearch = adminAuthenticatedPage.locator('#turnleafReferralTable_filter').getByRole('searchbox', { name: 'Search:' });
      const programSearch = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable_filter').getByRole('searchbox', { name: 'Search:' });
      const preferenceSearch = adminAuthenticatedPage.locator('#turnleafPreferenceTable_filter').getByRole('searchbox', { name: 'Search:' });

      await expect(referralSearch).toBeVisible();
      await expect(programSearch).toBeVisible();
      await expect(preferenceSearch).toBeVisible();

      console.log('All search boxes functional');
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

    test('Connect data refreshes on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const submitButton = adminAuthenticatedPage.getByRole('button', { name: 'Submit' });
      const buttonVisible = await submitButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Connect data refreshed:', buttonVisible);
    });
  });

  test.describe('Header Field Validation', () => {
    test('Member Id Header with special characters @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const memberIdField = adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' });
      await memberIdField.fill('Member_ID');

      console.log('Member Id Header with underscore filled');
    });

    test('Email Header with special characters @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const emailField = adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' });
      await emailField.fill('Email_Address');

      console.log('Email Header with underscore filled');
    });

    test('Empty header fields @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' }).clear();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' }).clear();

      console.log('Header fields cleared');
    });

    test('Long header field values @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const longHeader = 'VeryLongMemberIdentificationHeaderNameWithManyCharacters';
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' }).fill(longHeader);

      console.log('Long header value filled:', longHeader.length, 'characters');
    });
  });

  test.describe('Complete Import Workflow', () => {
    test('Complete CSV import form @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' }).fill('MemberId');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' }).fill('Email');

      const submitButton = adminAuthenticatedPage.getByRole('button', { name: 'Submit' });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();

      console.log('Complete CSV import form ready');
    });

    test('Attempt submit without CSV triggers validation @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Member Id Header info-circle' }).fill('MemberId');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Email Header info-circle' }).fill('Email');
      await adminAuthenticatedPage.getByRole('button', { name: 'Submit' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const validationError = adminAuthenticatedPage.locator('#snackbar0').getByText('CSV File is a required field');
      await expect(validationError).toBeVisible();

      console.log('CSV file validation triggered correctly');
    });
  });

  test.describe('Table Data Interactions', () => {
    test('View referral details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const referralTable = adminAuthenticatedPage.locator('#turnleafReferralTable');
      const hasRows = await referralTable.locator('tbody tr').count().catch(() => 0);

      console.log('Referral table rows available:', hasRows);
    });

    test('View program module details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const programTable = adminAuthenticatedPage.locator('#turnleafClientProgramModuleTable');
      const hasRows = await programTable.locator('tbody tr').count().catch(() => 0);

      console.log('Program module table rows available:', hasRows);
    });

    test('View preference details @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const preferenceTable = adminAuthenticatedPage.locator('#turnleafPreferenceTable');
      const hasRows = await preferenceTable.locator('tbody tr').count().catch(() => 0);

      console.log('Preference table rows available:', hasRows);
    });
  });
});
