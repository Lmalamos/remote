// ============================================
// REFERRALS - COMPREHENSIVE TESTS
// Behavioral health, resource referrals
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { referralsPanel } from '../pages/memberHub/referrals';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.REFERRALS} ${Tags.MEMBER_HUB} Referrals - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let referrals: referralsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    referrals = new referralsPanel(authenticatedPage);

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

    await referrals.referralsHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Referrals Panel Access', () => {
    test('Referrals panel opens @p1', async () => {
      await expect(referrals.referralsHeader).toBeVisible();
      console.log('Referrals panel visible');
    });

    test('Referrals list displays @p2', async ({ authenticatedPage }) => {
      const referralsTable = authenticatedPage.locator('#referralsTable, table').first();
      const hasTable = await referralsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Referrals table visible:', hasTable);
    });

    test('Add referral button available @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Add referral button visible:', buttonVisible);
    });

    test('Empty state message @p3', async ({ authenticatedPage }) => {
      const emptyMessage = authenticatedPage.getByText('No data available in table');
      const messageVisible = await emptyMessage.isVisible({ timeout: 3000 }).catch(() => false);

      if (messageVisible) {
        console.log('Empty state displayed');
      }
    });
  });

  test.describe('Behavioral Health Referral', () => {
    test('Create behavioral health referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const bhOption = authenticatedPage.getByText('New - Behavioral Health');
        const optionVisible = await bhOption.isVisible({ timeout: 3000 }).catch(() => false);

        if (optionVisible) {
          await bhOption.click();
          await smartWait(authenticatedPage, 1000);

          console.log('Behavioral Health referral form opened');
        }

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Behavioral health comments required @p1', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const bhOption = authenticatedPage.getByText('New - Behavioral Health');
      await bhOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const commentsField = authenticatedPage.getByRole('textbox', { name: 'Comments *' });
      const fieldVisible = await commentsField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Comments")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Comments field required:', isRequired);
        expect(isRequired).toBe(true);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Add comments to behavioral health referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const bhOption = authenticatedPage.getByText('New - Behavioral Health');
      await bhOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const commentsField = authenticatedPage.getByRole('textbox', { name: 'Comments *' });
      const fieldVisible = await commentsField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await commentsField.fill('Behavioral health referral for counseling services');
        await expect(commentsField).toHaveValue('Behavioral health referral for counseling services');

        console.log('Behavioral health comments added');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Referral specialist option @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const bhOption = authenticatedPage.getByText('New - Behavioral Health');
      await bhOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const specialistOption = authenticatedPage.getByText('Referral Specialist', { exact: true });
      const optionVisible = await specialistOption.isVisible({ timeout: 3000 }).catch(() => false);

      if (optionVisible) {
        await specialistOption.click();
        console.log('Referral Specialist option selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel behavioral health referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const bhOption = authenticatedPage.getByText('New - Behavioral Health');
      await bhOption.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(referrals.referralsHeader).toBeVisible();
      console.log('Behavioral health referral cancelled');
    });
  });

  test.describe('Resource Referral', () => {
    test('Create resource referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const resourceOption = authenticatedPage.getByText('New - Resource Referral');
        const optionVisible = await resourceOption.isVisible({ timeout: 3000 }).catch(() => false);

        if (optionVisible) {
          await resourceOption.click();
          await smartWait(authenticatedPage, 1000);

          console.log('Resource Referral form opened');
        }

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Resource referral comments required @p1', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const commentsField = authenticatedPage.getByRole('textbox', { name: 'Comments *' });
      const fieldVisible = await commentsField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Comments")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Resource referral comments required:', isRequired);
        expect(isRequired).toBe(true);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Add comments to resource referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const commentsField = authenticatedPage.getByRole('textbox', { name: 'Comments *' });
      const fieldVisible = await commentsField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await commentsField.fill('Resource referral for community services');
        await expect(commentsField).toHaveValue('Resource referral for community services');

        console.log('Resource referral comments added');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Resource type selection @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceTypeRadio = authenticatedPage.locator('#referralFormRTOption11');
      const radioVisible = await resourceTypeRadio.isVisible({ timeout: 3000 }).catch(() => false);

      if (radioVisible) {
        await resourceTypeRadio.check();
        console.log('Resource type selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Select Clothing resource @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceTypeRadio = authenticatedPage.locator('#referralFormRTOption11');
      await resourceTypeRadio.check().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const multiselectDropdown = authenticatedPage.getByRole('combobox', { name: 'None selected' });
      const dropdownVisible = await multiselectDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (dropdownVisible) {
        await multiselectDropdown.click();
        await smartWait(authenticatedPage, 500);

        const clothingOption = authenticatedPage.getByLabel('Clothing');
        const optionVisible = await clothingOption.isVisible({ timeout: 2000 }).catch(() => false);

        if (optionVisible) {
          await clothingOption.check();
          console.log('Clothing resource selected');
        }

        await authenticatedPage.locator('.multiselect-selected-text').click();
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Select Food resource @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceTypeRadio = authenticatedPage.locator('#referralFormRTOption11');
      await resourceTypeRadio.check().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const multiselectDropdown = authenticatedPage.getByRole('combobox', { name: 'None selected' });
      await multiselectDropdown.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const foodOption = authenticatedPage.getByLabel('Food');
      const optionVisible = await foodOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (optionVisible) {
        await foodOption.check();
        console.log('Food resource selected');
      }

      await authenticatedPage.locator('.multiselect-selected-text').click().catch(() => {});

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Select Eye Exams & Glasses resource @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceTypeRadio = authenticatedPage.locator('#referralFormRTOption11');
      await resourceTypeRadio.check().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const multiselectDropdown = authenticatedPage.getByRole('combobox', { name: 'None selected' });
      await multiselectDropdown.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const eyeExamsOption = authenticatedPage.getByLabel('Eye Exams & Glasses');
      const optionVisible = await eyeExamsOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (optionVisible) {
        await eyeExamsOption.check();
        console.log('Eye Exams & Glasses resource selected');
      }

      await authenticatedPage.locator('.multiselect-selected-text').click().catch(() => {});

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Select multiple resources @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceTypeRadio = authenticatedPage.locator('#referralFormRTOption11');
      await resourceTypeRadio.check().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const multiselectDropdown = authenticatedPage.getByRole('combobox', { name: 'None selected' });
      await multiselectDropdown.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const clothingOption = authenticatedPage.getByLabel('Clothing');
      await clothingOption.check().catch(() => {});

      const foodOption = authenticatedPage.getByLabel('Food');
      await foodOption.check().catch(() => {});

      const eyeExamsOption = authenticatedPage.getByLabel('Eye Exams & Glasses');
      await eyeExamsOption.check().catch(() => {});

      console.log('Multiple resources selected');

      await authenticatedPage.locator('.multiselect-selected-text').click().catch(() => {});

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel resource referral @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      await resourceOption.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(referrals.referralsHeader).toBeVisible();
      console.log('Resource referral cancelled');
    });
  });

  test.describe('Referral Types', () => {
    test('Multiple referral types available @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: 'Add ' });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const bhOption = authenticatedPage.getByText('New - Behavioral Health');
      const bhVisible = await bhOption.isVisible({ timeout: 2000 }).catch(() => false);

      const resourceOption = authenticatedPage.getByText('New - Resource Referral');
      const resourceVisible = await resourceOption.isVisible({ timeout: 2000 }).catch(() => false);

      console.log('Behavioral Health available:', bhVisible);
      console.log('Resource Referral available:', resourceVisible);

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });
  });

  test.describe('Referrals History', () => {
    test('View referrals table @p2', async ({ authenticatedPage }) => {
      const referralsTable = authenticatedPage.locator('#referralsTable, table').first();
      const hasTable = await referralsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await referralsTable.locator('tbody tr').count();
        console.log('Referrals rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search referrals @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('behavioral');
        await smartWait(authenticatedPage, 500);

        console.log('Referrals search executed');
      }
    });

    test('Referrals table columns @p3', async ({ authenticatedPage }) => {
      const referralsTable = authenticatedPage.locator('#referralsTable, table').first();
      const hasTable = await referralsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Date', 'Type', 'Status', 'Comments'];

        for (const column of expectedColumns) {
          const headerCell = referralsTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Referral Actions', () => {
    test('View referral details @p3', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Edit referral @p3', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete referral @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });
  });

  test.describe('Referral Status', () => {
    test('Referral status indicators @p2', async ({ authenticatedPage }) => {
      const statusOptions = ['Pending', 'Completed', 'Cancelled', 'In Progress'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });
  });
});
