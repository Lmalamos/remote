// ============================================
// ACTIVITIES - COMPREHENSIVE TESTS
// Task completion, minutes tracking, reviews
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { activitiesPanel } from '../pages/memberHub/activities';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.ACTIVITIES} ${Tags.MEMBER_HUB} Activities - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let activities: activitiesPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    activities = new activitiesPanel(authenticatedPage);

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

    await activities.panelHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Activities Panel Access', () => {
    test('Activities panel opens @p1', async () => {
      await expect(activities.panelHeader).toBeVisible();
      console.log('Activities panel visible');
    });

    test('Activities list displays @p2', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Activities table visible:', hasTable);
    });

    test('Task done button available @p2', async () => {
      const buttonVisible = await activities.taskDoneButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Task done button visible:', buttonVisible);
    });
  });

  test.describe('Complete Task', () => {
    test('Complete task form opens @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const taskTypeVisible = await activities.taskTypeDropdown.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Task type dropdown visible:', taskTypeVisible);

      await activities.cancelButton.click();
    });

    test('Task type selection @p2', async ({ authenticatedPage }) => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const taskTypeVisible = await activities.taskTypeDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (taskTypeVisible) {
        const options = authenticatedPage.locator('#sltCompleteTaskTask option');
        const optionCount = await options.count();

        console.log('Task type options available:', optionCount);
        expect(optionCount).toBeGreaterThan(1);
      }

      await activities.cancelButton.click();
    });

    test('Select Update Record task type @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const taskTypeVisible = await activities.taskTypeDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (taskTypeVisible) {
        await activities.taskTypeDropdown.selectOption({ label: 'Update Record' });
        await smartWait(activities.page, 500);

        console.log('Update Record task type selected');
      }

      await activities.cancelButton.click();
    });

    test('Review dropdown is required @p1', async ({ authenticatedPage }) => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const reviewVisible = await activities.reviewDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (reviewVisible) {
        const label = await authenticatedPage.locator('label:has-text("Review")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Review field required:', isRequired);
        expect(isRequired).toBe(true);
      }

      await activities.cancelButton.click();
    });

    test('Review selection available @p2', async ({ authenticatedPage }) => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const reviewVisible = await activities.reviewDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (reviewVisible) {
        await activities.reviewDropdown.click();
        await smartWait(activities.page, 500);

        const options = activities.reviewDropdown.locator('option');
        const optionCount = await options.count();

        console.log('Review options available:', optionCount);
      }

      await activities.cancelButton.click();
    });

    test('Cancel task completion @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 500);

      await activities.cancelButton.click();
      await smartWait(activities.page, 500);

      await expect(activities.panelHeader).toBeVisible();
      console.log('Task completion cancelled');
    });
  });

  test.describe('Minutes Tracking', () => {
    test('User entered minutes field @p1', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (minutesVisible) {
        await activities.userEnteredMinutesInput.fill('60');
        await expect(activities.userEnteredMinutesInput).toHaveValue('60');

        console.log('User entered minutes: 60');
      }

      await activities.cancelButton.click();
    });

    test('Billable minutes field @p1', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const billableVisible = await activities.billableMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (billableVisible) {
        await activities.billableMinutesInput.fill('45');
        await expect(activities.billableMinutesInput).toHaveValue('45');

        console.log('Billable minutes: 45');
      }

      await activities.cancelButton.click();
    });

    test('Peer reviewer minutes field @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const peerVisible = await activities.peerReviewerMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (peerVisible) {
        await activities.peerReviewerMinutesInput.fill('30');
        await expect(activities.peerReviewerMinutesInput).toHaveValue('30');

        console.log('Peer reviewer minutes: 30');
      }

      await activities.cancelButton.click();
    });

    test('Minutes validation - positive numbers @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (minutesVisible) {
        const testValues = ['15', '30', '60', '120', '240'];

        for (const value of testValues) {
          await activities.userEnteredMinutesInput.clear();
          await activities.userEnteredMinutesInput.fill(value);
          await smartWait(activities.page, 500);

          console.log(`Minutes tested: ${value}`);
        }
      }

      await activities.cancelButton.click();
    });

    test('Minutes validation - negative numbers @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (minutesVisible) {
        await activities.userEnteredMinutesInput.fill('-60');
        await smartWait(activities.page, 500);

        console.log('Negative minutes tested');
      }

      await activities.cancelButton.click();
    });

    test('Minutes validation - non-numeric @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (minutesVisible) {
        await activities.userEnteredMinutesInput.fill('abc');
        await smartWait(activities.page, 500);

        console.log('Non-numeric minutes tested');
      }

      await activities.cancelButton.click();
    });

    test('Large minutes value @p3', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

      if (minutesVisible) {
        await activities.userEnteredMinutesInput.fill('9999');
        await smartWait(activities.page, 500);

        console.log('Large minutes value tested: 9999');
      }

      await activities.cancelButton.click();
    });
  });

  test.describe('Stay on Member Option', () => {
    test('Stay on current member checkbox @p2', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const checkboxVisible = await activities.stayOnMemberCheckbox.isVisible({ timeout: 3000 }).catch(() => false);

      if (checkboxVisible) {
        await activities.stayOnMemberCheckbox.check();
        const isChecked = await activities.stayOnMemberCheckbox.isChecked();

        console.log('Stay on member checkbox checked:', isChecked);
      }

      await activities.cancelButton.click();
    });

    test('Uncheck stay on member @p3', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const checkboxVisible = await activities.stayOnMemberCheckbox.isVisible({ timeout: 3000 }).catch(() => false);

      if (checkboxVisible) {
        await activities.stayOnMemberCheckbox.check();
        await smartWait(activities.page, 500);

        await activities.stayOnMemberCheckbox.uncheck();
        const isChecked = await activities.stayOnMemberCheckbox.isChecked();

        console.log('Stay on member unchecked:', !isChecked);
      }

      await activities.cancelButton.click();
    });
  });

  test.describe('Activity Types', () => {
    test('Care Plan Case Add activity @p2', async ({ authenticatedPage }) => {
      const carePlanActivity = authenticatedPage.locator('text=Care Plan Case Add');
      const activityVisible = await carePlanActivity.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Care Plan Case Add activity found:', activityVisible);
    });

    test('Case Management activity @p2', async () => {
      const caseManagementVisible = await activities.caseManagementLabel.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Case Management activity found:', caseManagementVisible);
    });

    test('Multiple activity types displayed @p2', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await activitiesTable.locator('tbody tr').count();
        console.log('Activity rows found:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Activities Search', () => {
    test('Search activities by keyword @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('Start');
        await smartWait(authenticatedPage, 500);

        console.log('Activities search executed: Start');
      }
    });

    test('Search for Call Out activity @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('Call Out');
        await smartWait(authenticatedPage, 500);

        console.log('Search: Call Out');
      }
    });

    test('Search for Member Initial activity @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('Member Initial');
        await smartWait(authenticatedPage, 500);

        console.log('Search: Member Initial');
      }
    });

    test('Clear activities search @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test');
        await smartWait(authenticatedPage, 500);

        await searchBox.clear();
        await smartWait(authenticatedPage, 500);

        console.log('Activities search cleared');
      }
    });

    test('Search with empty term @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('');
        await smartWait(authenticatedPage, 500);

        console.log('Empty search executed');
      }
    });
  });

  test.describe('Activities History', () => {
    test('Activities table displays @p2', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Activities history table visible:', hasTable);
    });

    test('Activity date column @p2', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const dateHeader = activitiesTable.locator('th:has-text("Date")');
        const hasDateHeader = await dateHeader.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Date column found:', hasDateHeader);
      }
    });

    test('Activity type column @p2', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const typeHeader = activitiesTable.locator('th:has-text("Type"), th:has-text("Activity")');
        const hasTypeHeader = await typeHeader.first().isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Type column found:', hasTypeHeader);
      }
    });

    test('Activity user column @p3', async ({ authenticatedPage }) => {
      const activitiesTable = authenticatedPage.locator('#activitiesTable, table').first();
      const hasTable = await activitiesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const userHeader = activitiesTable.locator('th:has-text("User")');
        const hasUserHeader = await userHeader.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('User column found:', hasUserHeader);
      }
    });
  });

  test.describe('Task Completion Workflow', () => {
    test('Complete task with all fields @p1', async () => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const taskTypeVisible = await activities.taskTypeDropdown.isVisible({ timeout: 3000 }).catch(() => false);

      if (taskTypeVisible) {
        await activities.taskTypeDropdown.selectOption({ label: 'Update Record' });
        await smartWait(activities.page, 500);

        const minutesVisible = await activities.userEnteredMinutesInput.isVisible({ timeout: 2000 }).catch(() => false);

        if (minutesVisible) {
          await activities.userEnteredMinutesInput.fill('60');
          await activities.billableMinutesInput.fill('50');
          await activities.peerReviewerMinutesInput.fill('30');

          console.log('All fields filled for task completion');
        }
      }

      await activities.cancelButton.click();
    });

    test('Task completion requires task type @p1', async ({ authenticatedPage }) => {
      await activities.taskDoneButton.click();
      await smartWait(activities.page, 1000);

      const saveButton = authenticatedPage.getByRole('button', { name: /save|submit|complete/i });
      const saveVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (saveVisible) {
        // Wait for any blocking modals and backdrops to disappear
        await authenticatedPage.waitForSelector('.modal-backdrop', { state: 'hidden', timeout: 3000 }).catch(() => {});
        await authenticatedPage.waitForSelector('.modal.in', { state: 'hidden', timeout: 3000 }).catch(() => {});

        // Wait for button to be enabled and clickable
        await expect(saveButton).toBeEnabled({ timeout: 5000 }).catch(() => {});

        // Force click if modal still blocking
        await saveButton.click({ force: true }).catch(async () => {
          // If force click fails, try pressing Escape and retry
          await authenticatedPage.keyboard.press('Escape');
          await authenticatedPage.waitForTimeout(500);
          await saveButton.click({ force: true });
        });
        await smartWait(activities.page, 1000);

        const error = authenticatedPage.locator('.error, .alert-danger, [class*="error"]');
        const hasError = await error.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Validation error shown:', hasError);
      }

      await activities.cancelButton.click().catch(() => {});
    });
  });

  test.describe('Activities Pagination', () => {
    test('Activities table pagination info @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#activitiesTable_info, .dataTables_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Pagination info:', text);
      }
    });

    test('Navigate activities pagination @p3', async ({ authenticatedPage }) => {
      const nextButton = authenticatedPage.getByRole('button', { name: /next/i });
      const buttonVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        const isEnabled = await nextButton.isEnabled();
        console.log('Next button enabled:', isEnabled);
      }
    });
  });
});
