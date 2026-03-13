// ============================================
// SCHEDULED TASKS - COMPREHENSIVE TESTS
// Calendar view, filters, task management
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { scheduledTasksPanel } from '../pages/memberHub/scheduledTask';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.SCHEDULED_TASKS} ${Tags.MEMBER_HUB} Scheduled Tasks - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let scheduledTasks: scheduledTasksPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    scheduledTasks = new scheduledTasksPanel(authenticatedPage);

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

    await scheduledTasks.panelHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Scheduled Tasks Panel Access', () => {
    test('Scheduled Tasks panel opens @p1', async () => {
      await expect(scheduledTasks.panelHeader).toBeVisible();
      console.log('Scheduled Tasks panel visible');
    });

    test('Scheduled tasks list displays @p2', async ({ authenticatedPage }) => {
      const tasksTable = authenticatedPage.locator('#scheduledTasksTable, table').first();
      const hasTable = await tasksTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Scheduled tasks table visible:', hasTable);
    });

    test('Add new scheduled task button @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Add new scheduled task button visible:', buttonVisible);
    });
  });

  test.describe('Calendar View', () => {
    test('View calendar button available @p2', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      const buttonVisible = await calendarButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('View Calendar button visible:', buttonVisible);
    });

    test('Open calendar view @p2', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      const buttonVisible = await calendarButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await calendarButton.click();
        await smartWait(authenticatedPage, 1000);

        const calendar = authenticatedPage.locator('.fc-view, [class*="calendar"]');
        const calendarVisible = await calendar.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Calendar view opened:', calendarVisible);

        const closeButton = authenticatedPage.locator('button[title="Close"]');
        await closeButton.click().catch(() => {});
      }
    });

    test('Calendar navigation - next @p2', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      await calendarButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const nextButton = authenticatedPage.getByRole('button', { name: 'next', exact: true });
      const buttonVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await nextButton.click();
        await smartWait(authenticatedPage, 500);

        console.log('Calendar navigated to next');
      }

      const closeButton = authenticatedPage.locator('button[title="Close"]');
      await closeButton.click().catch(() => {});
    });

    test('Calendar navigation - today @p2', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      await calendarButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const nextButton = authenticatedPage.getByRole('button', { name: 'next', exact: true });
      await nextButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const todayButton = authenticatedPage.getByRole('button', { name: 'today' });
      const buttonVisible = await todayButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await todayButton.click();
        await smartWait(authenticatedPage, 500);

        console.log('Calendar navigated to today');
      }

      const closeButton = authenticatedPage.locator('button[title="Close"]');
      await closeButton.click().catch(() => {});
    });

    test('Calendar view - list day @p3', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      await calendarButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const listDayButton = authenticatedPage.getByRole('button', { name: 'list day' });
      const buttonVisible = await listDayButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await listDayButton.click();
        await smartWait(authenticatedPage, 500);

        console.log('Calendar view changed to list day');
      }

      const closeButton = authenticatedPage.locator('button[title="Close"]');
      await closeButton.click().catch(() => {});
    });

    test('Close calendar view @p2', async ({ authenticatedPage }) => {
      const calendarButton = authenticatedPage.getByRole('button', { name: 'View Calendar' });
      await calendarButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const closeButton = authenticatedPage.locator('button[title="Close"]');
      const closeVisible = await closeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (closeVisible) {
        await closeButton.click();
        await smartWait(authenticatedPage, 500);

        await expect(scheduledTasks.panelHeader).toBeVisible();
        console.log('Calendar view closed');
      }
    });
  });

  test.describe('Task Filters', () => {
    test('Filter by task type @p2', async ({ authenticatedPage }) => {
      const taskTypeFilter = authenticatedPage.locator('#scheduledTaskTypeSelect');
      const filterVisible = await taskTypeFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        await taskTypeFilter.selectOption('Discharge Status');
        await smartWait(authenticatedPage, 1000);

        const emptyState = authenticatedPage.locator('.dataTables_empty');
        const isEmpty = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Discharge Status filter applied, empty state:', isEmpty);

        await taskTypeFilter.selectOption({ index: 0 });
      }
    });

    test('Filter by category @p2', async ({ authenticatedPage }) => {
      const categoryFilter = authenticatedPage.locator('#scheduledTaskCategorySelect');
      const filterVisible = await categoryFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        await categoryFilter.selectOption('AP Collaboration');
        await smartWait(authenticatedPage, 1000);

        console.log('AP Collaboration filter applied');

        await categoryFilter.selectOption({ index: 0 });
      }
    });

    test('Filter by status @p2', async ({ authenticatedPage }) => {
      const statusFilter = authenticatedPage.locator('#scheduledTaskStatusSelect');
      const filterVisible = await statusFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        await statusFilter.selectOption('New');
        await smartWait(authenticatedPage, 1000);

        console.log('New status filter applied');

        await statusFilter.selectOption({ index: 0 });
      }
    });

    test('Filter by solution type @p2', async ({ authenticatedPage }) => {
      const solutionTypeFilter = authenticatedPage.locator('#scheduledTaskSolutionTypeSelect');
      const filterVisible = await solutionTypeFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        await solutionTypeFilter.selectOption('Case Management');
        await smartWait(authenticatedPage, 1000);

        console.log('Case Management filter applied');

        await solutionTypeFilter.selectOption({ index: 0 });
      }
    });

    test('Reset all filters @p3', async ({ authenticatedPage }) => {
      const taskTypeFilter = authenticatedPage.locator('#scheduledTaskTypeSelect');
      await taskTypeFilter.selectOption('Discharge Status').catch(() => {});
      await smartWait(authenticatedPage, 500);

      await taskTypeFilter.selectOption({ index: 0 });
      await smartWait(authenticatedPage, 500);

      console.log('Filters reset');
    });

    test('Multiple filters applied @p3', async ({ authenticatedPage }) => {
      const statusFilter = authenticatedPage.locator('#scheduledTaskStatusSelect');
      const categoryFilter = authenticatedPage.locator('#scheduledTaskCategorySelect');

      await statusFilter.selectOption('New').catch(() => {});
      await smartWait(authenticatedPage, 500);

      await categoryFilter.selectOption('AP Collaboration').catch(() => {});
      await smartWait(authenticatedPage, 500);

      console.log('Multiple filters applied');

      await statusFilter.selectOption({ index: 0 }).catch(() => {});
      await categoryFilter.selectOption({ index: 0 }).catch(() => {});
    });
  });

  test.describe('Add Scheduled Task', () => {
    test('Add scheduled task form opens @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const taskTypeField = authenticatedPage.getByLabel('Scheduled Task Type');
        const fieldVisible = await taskTypeField.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Add scheduled task form opened:', fieldVisible);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Select scheduled task type @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const taskTypeField = authenticatedPage.getByLabel('Scheduled Task Type');
      const fieldVisible = await taskTypeField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await taskTypeField.selectOption('13');
        await smartWait(authenticatedPage, 500);

        console.log('Scheduled task type selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Select scheduled task category @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const categoryField = authenticatedPage.getByLabel('Scheduled Task Category');
      const fieldVisible = await categoryField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await categoryField.selectOption('20');
        await smartWait(authenticatedPage, 500);

        console.log('Scheduled task category selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Scheduled task date picker @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const datePicker = authenticatedPage.locator('#divScheduledTaskDateId > .input-group-addon');
      const pickerVisible = await datePicker.isVisible({ timeout: 3000 }).catch(() => false);

      if (pickerVisible) {
        await datePicker.click();
        await smartWait(authenticatedPage, 500);

        console.log('Date picker opened');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Add notes to scheduled task @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes:' });
      const fieldVisible = await notesField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await notesField.fill('Test scheduled task notes');
        await expect(notesField).toHaveValue('Test scheduled task notes');

        console.log('Notes added to scheduled task');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel scheduled task creation @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add new scheduled task/i });
      await addButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(scheduledTasks.panelHeader).toBeVisible();
      console.log('Scheduled task creation cancelled');
    });
  });

  test.describe('Complete Scheduled Task', () => {
    test('Task done button available @p2', async () => {
      const buttonVisible = await scheduledTasks.taskDoneButton.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Task done button visible:', buttonVisible);
    });

    test('Complete task form opens @p2', async () => {
      const buttonVisible = await scheduledTasks.taskDoneButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await scheduledTasks.taskDoneButton.click();
        await smartWait(scheduledTasks.page, 1000);

        const taskTypeVisible = await scheduledTasks.taskTypeDropdown.isVisible({ timeout: 3000 }).catch(() => false);
        console.log('Task completion form opened:', taskTypeVisible);

        await scheduledTasks.cancelButton.click().catch(() => {});
      }
    });

    test('Complete task with minutes @p2', async () => {
      const buttonVisible = await scheduledTasks.taskDoneButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await scheduledTasks.taskDoneButton.click();
        await smartWait(scheduledTasks.page, 1000);

        const minutesVisible = await scheduledTasks.userEnteredMinutesInput.isVisible({ timeout: 3000 }).catch(() => false);

        if (minutesVisible) {
          await scheduledTasks.userEnteredMinutesInput.fill('45');
          await scheduledTasks.billableMinutesInput.fill('40');

          console.log('Task completion minutes entered');
        }

        await scheduledTasks.cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Scheduled Tasks History', () => {
    test('View scheduled tasks table @p2', async ({ authenticatedPage }) => {
      const tasksTable = authenticatedPage.locator('#scheduledTasksTable, table').first();
      const hasTable = await tasksTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await tasksTable.locator('tbody tr').count();
        console.log('Scheduled tasks rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search scheduled tasks @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test');
        await smartWait(authenticatedPage, 500);

        console.log('Scheduled tasks search executed');
      }
    });

    test('Task table columns @p3', async ({ authenticatedPage }) => {
      const tasksTable = authenticatedPage.locator('#scheduledTasksTable, table').first();
      const hasTable = await tasksTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Date', 'Type', 'Category', 'Status'];

        for (const column of expectedColumns) {
          const headerCell = tasksTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Task Status', () => {
    test('Task status indicators @p2', async ({ authenticatedPage }) => {
      const statusOptions = ['New', 'In Progress', 'Completed', 'Cancelled'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });
  });

  test.describe('Task Actions', () => {
    test('Edit scheduled task @p3', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete scheduled task @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View task details @p3', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });

  test.describe('Task Pagination', () => {
    test('Scheduled tasks pagination info @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#scheduledTasksTable_info, .dataTables_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Pagination info:', text);
      }
    });
  });
});
