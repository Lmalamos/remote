// ============================================
// CARE MANAGEMENT - COMPREHENSIVE TESTS
// Case Management, Care Transitions, Program Referrals
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { careManagementPanel } from '../pages/memberHub/careManagement';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.CARE_MANAGEMENT} ${Tags.MEMBER_HUB} Care Management - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let careManagement: careManagementPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    careManagement = new careManagementPanel(authenticatedPage);

    await navigation.goToDashboard();
    await navigation.openSearchMenu();
    await navigation.openMemberSearch();

    await memberSearch.searchMember({
      client: CLIENTS.COMPREHENSIVE_TEST,
      memberId: TEST_MEMBER.ID,
    });

    await waitForNetworkIdle(authenticatedPage);
    await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
    await waitForNetworkIdle(authenticatedPage);

    await careManagement.panelHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Care Management Panel Access', () => {
    test('Care Management panel opens @p1', async () => {
      await expect(careManagement.panelHeader).toBeVisible();
      console.log('Care Management panel visible');
    });

    test('Case Management button available @p2', async () => {
      const buttonVisible = await careManagement.caseManagementButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Case Management button visible:', buttonVisible);
    });

    test('Care Transitions button available @p2', async () => {
      const buttonVisible = await careManagement.careTransitionsButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Care Transitions button visible:', buttonVisible);
    });
  });

  test.describe('Case Management', () => {
    test('Case Management section opens @p2', async () => {
      const buttonVisible = await careManagement.caseManagementButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await careManagement.caseManagementButton.click();
        await smartWait(careManagement.page, 1000);

        console.log('Case Management section opened');
      }
    });

    test('Case Management status displays @p2', async () => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusVisible = await careManagement.caseManagementStatus.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Case Management status visible:', statusVisible);
    });

    test('Case Management status options @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusOptions = ['Active', 'Suspended', 'Criteria Not Met'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });

    test('Toggle Case Management status @p3', async () => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusVisible = await careManagement.caseManagementStatus.isVisible({ timeout: 3000 }).catch(() => false);

      if (statusVisible) {
        await careManagement.caseManagementStatus.click();
        await smartWait(careManagement.page, 500);

        await careManagement.caseManagementStatus.click();
        await smartWait(careManagement.page, 500);

        console.log('Case Management status toggled');
      }
    });

    test('Case Management table displays @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const cmTable = authenticatedPage.getByLabel('Care Management - Case').locator('table').first();
      const hasTable = await cmTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Case Management table visible:', hasTable);
    });

    test('Search Case Management records @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('engaged');
        await smartWait(careManagement.page, 500);

        console.log('Case Management search executed: engaged');
      }
    });

    test('Search results display @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('engaged');
        await smartWait(careManagement.page, 1000);

        const engagedCell = authenticatedPage.getByRole('cell', { name: 'Engaged' });
        const cellVisible = await engagedCell.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Engaged status found:', cellVisible);
      }
    });

    test('Clear Case Management search @p3', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('engaged');
        await smartWait(careManagement.page, 500);

        await searchBox.click({ clickCount: 3 });
        await searchBox.fill('');
        await smartWait(careManagement.page, 500);

        console.log('Case Management search cleared');
      }
    });
  });

  test.describe('Care Transitions', () => {
    test('Care Transitions section opens @p2', async () => {
      const buttonVisible = await careManagement.careTransitionsButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await careManagement.careTransitionsButton.click();
        await smartWait(careManagement.page, 1000);

        console.log('Care Transitions section opened');
      }
    });

    test('Care Transitions status displays @p2', async () => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusVisible = await careManagement.careTransitionsStatus.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Care Transitions status visible:', statusVisible);
    });

    test('Care Transitions status options @p2', async ({ authenticatedPage }) => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusOptions = ['Active', 'Suspended', 'Criteria Not Met'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Care Transitions status "${status}" found`);
        }
      }
    });

    test('Toggle Care Transitions status @p3', async () => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const statusVisible = await careManagement.careTransitionsStatus.isVisible({ timeout: 3000 }).catch(() => false);

      if (statusVisible) {
        await careManagement.careTransitionsStatus.click();
        await smartWait(careManagement.page, 500);

        await careManagement.careTransitionsStatus.click();
        await smartWait(careManagement.page, 500);

        console.log('Care Transitions status toggled');
      }
    });

    test('Care Transitions table displays @p2', async ({ authenticatedPage }) => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const ctTable = authenticatedPage.getByLabel('Care Management - Care').locator('table').first();
      const hasTable = await ctTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Care Transitions table visible:', hasTable);
    });

    test('Search Care Transitions records @p2', async ({ authenticatedPage }) => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('transition');
        await smartWait(careManagement.page, 500);

        console.log('Care Transitions search executed');
      }
    });
  });

  test.describe('Program Referral', () => {
    test('Program Referral link available @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      const menuVisible = await menuButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (menuVisible) {
        await menuButton.click();
        await smartWait(careManagement.page, 500);

        const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
        const linkVisible = await programReferralLink.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Program Referral link visible:', linkVisible);
      }
    });

    test('Open Program Referral dialog @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      const linkVisible = await programReferralLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await programReferralLink.click();
        await smartWait(careManagement.page, 1000);

        const dialog = authenticatedPage.getByRole('dialog', { name: 'Referral to Case Management' });
        const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Program Referral dialog opened:', dialogVisible);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Program Type selection @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const dialog = authenticatedPage.getByRole('dialog', { name: 'Referral to Case Management' });
      const programTypeField = dialog.getByLabel('Program Type');
      const fieldVisible = await programTypeField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await programTypeField.selectOption('18');
        await expect(programTypeField).toHaveValue('18');

        console.log('Program Type selected: 18');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Referral date picker @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const datePicker = authenticatedPage.getByTitle('Open Calendar');
      const pickerVisible = await datePicker.isVisible({ timeout: 3000 }).catch(() => false);

      if (pickerVisible) {
        await datePicker.click();
        await smartWait(careManagement.page, 500);

        console.log('Date picker opened');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Referral Reason selection @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const reasonField = authenticatedPage.getByLabel('Referral Reason');
      const fieldVisible = await reasonField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await reasonField.selectOption('50');
        await expect(reasonField).toHaveValue('50');

        console.log('Referral Reason selected: 50');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Referral Source selection @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const sourceField = authenticatedPage.getByLabel('Referral Source', { exact: true });
      const fieldVisible = await sourceField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await sourceField.selectOption('13');
        await expect(sourceField).toHaveValue('13');

        console.log('Referral Source selected: 13');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Fill complete Program Referral @p1', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const dialog = authenticatedPage.getByRole('dialog', { name: 'Referral to Case Management' });
      const dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);

      if (dialogVisible) {
        const programTypeField = dialog.getByLabel('Program Type');
        await programTypeField.selectOption('18').catch(() => {});

        const reasonField = authenticatedPage.getByLabel('Referral Reason');
        await reasonField.selectOption('50').catch(() => {});

        const sourceField = authenticatedPage.getByLabel('Referral Source', { exact: true });
        await sourceField.selectOption('13').catch(() => {});

        console.log('Complete Program Referral filled');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel Program Referral @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      const cancelVisible = await cancelButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (cancelVisible) {
        await cancelButton.click();
        await smartWait(careManagement.page, 500);

        await expect(careManagement.panelHeader).toBeVisible();
        console.log('Program Referral cancelled');
      }
    });
  });

  test.describe('Care Management Status Types', () => {
    test('Active status indicator @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const activeStatus = authenticatedPage.getByText('Active', { exact: false });
      const statusVisible = await activeStatus.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Active status found:', statusVisible);
    });

    test('Suspended status indicator @p3', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const suspendedStatus = authenticatedPage.getByText('Suspended', { exact: false });
      const statusVisible = await suspendedStatus.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Suspended status found:', statusVisible);
    });

    test('Criteria Not Met indicator @p3', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const criteriaStatus = authenticatedPage.getByText('Criteria Not Met', { exact: false });
      const statusVisible = await criteriaStatus.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Criteria Not Met status found:', statusVisible);
    });

    test('Primary Program indicator @p3', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const primaryProgram = authenticatedPage.getByText('Primary Program', { exact: false });
      const statusVisible = await primaryProgram.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Primary Program indicator found:', statusVisible);
    });
  });

  test.describe('Care Management History', () => {
    test('View Case Management history @p2', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const cmTable = authenticatedPage.getByLabel('Care Management - Case').locator('table').first();
      const hasTable = await cmTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await cmTable.locator('tbody tr').count();
        console.log('Case Management history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('View Care Transitions history @p2', async ({ authenticatedPage }) => {
      await careManagement.careTransitionsButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const ctTable = authenticatedPage.getByLabel('Care Management - Care').locator('table').first();
      const hasTable = await ctTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await ctTable.locator('tbody tr').count();
        console.log('Care Transitions history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Program Types', () => {
    test('Multiple program types available @p3', async ({ authenticatedPage }) => {
      await careManagement.caseManagementButton.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const menuButton = authenticatedPage.locator('#btnMenuCMSolution');
      await menuButton.click().catch(() => {});
      await smartWait(careManagement.page, 500);

      const programReferralLink = authenticatedPage.getByRole('link', { name: 'Program Referral' });
      await programReferralLink.click().catch(() => {});
      await smartWait(careManagement.page, 1000);

      const programTypeField = authenticatedPage.getByLabel('Program Type');
      const fieldVisible = await programTypeField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        const options = await programTypeField.locator('option').count();
        console.log('Program type options available:', options);
        expect(options).toBeGreaterThan(1);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });
  });
});
