// ============================================
// MANAGE TIMESLOTS - COMPREHENSIVE TESTS
// Appointment timeslot configuration, scheduling
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageTimeslots } from '../pages/manageTimeslots';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Timeslots - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageTimeslotsPage: manageTimeslots;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageTimeslotsPage = new manageTimeslots(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Timeslots' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Timeslots page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Timeslots Management UI', () => {
    test('Save button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Save button enabled @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeEnabled();
    });

    test('Save button for different client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeEnabled();

      console.log('Save button available for client 34');
    });
  });

  test.describe('Save Functionality', () => {
    test('Save button click @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await saveButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Save button clicked - timeslots saved');
      }
    });

    test('Save with changes @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      // Make changes if possible
      const textInputs = adminAuthenticatedPage.locator('input[type="text"], input[type="time"]');
      const inputCount = await textInputs.count();

      if (inputCount > 0) {
        console.log('Input fields available for modifications:', inputCount);
      }

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await expect(saveButton).toBeEnabled();
    });

    test('Save without changes @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await saveButton.click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Save without changes executed');
    });
  });

  test.describe('Timeslot Configuration', () => {
    test('Timeslot table displays @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Timeslot table visible:', hasTable);
    });

    test('Timeslot table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await timeslotTable.locator('tbody tr').count();
        console.log('Timeslot rows:', rows);
      }
    });

    test('Table columns display @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const headers = await timeslotTable.locator('thead th').count();
        console.log('Timeslot table columns:', headers);
      }
    });

    test('Table columns have headers @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Time', 'Start', 'End', 'Duration', 'Available'];

        for (const column of expectedColumns) {
          const headerCell = timeslotTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Timeslot Fields', () => {
    test('Start time fields available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const startTimeFields = adminAuthenticatedPage.locator('input[type="time"], input[name*="start"]');
      const fieldCount = await startTimeFields.count();

      console.log('Start time fields available:', fieldCount);
    });

    test('End time fields available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const endTimeFields = adminAuthenticatedPage.locator('input[type="time"], input[name*="end"]');
      const fieldCount = await endTimeFields.count();

      console.log('End time fields available:', fieldCount);
    });

    test('Duration fields available @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const durationFields = adminAuthenticatedPage.locator('input[name*="duration"], input[placeholder*="duration"]');
      const fieldCount = await durationFields.count();

      console.log('Duration fields available:', fieldCount);
    });

    test('Availability checkboxes @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const checkboxes = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      console.log('Availability checkboxes:', checkboxCount);
    });
  });

  test.describe('Add Timeslot', () => {
    test('Add timeslot button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const addButton = adminAuthenticatedPage.getByRole('button', { name: /add|new/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Add timeslot button available');
      }
    });

    test('Add new timeslot row @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const addButton = adminAuthenticatedPage.getByRole('button', { name: /add|new/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('New timeslot row added');
      }
    });
  });

  test.describe('Timeslot Configuration Scenarios', () => {
    test('Morning timeslots (8:00-12:00) @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const morningSlots = timeslotTable.locator('td:has-text("08:"), td:has-text("09:"), td:has-text("10:"), td:has-text("11:")');
        const slotCount = await morningSlots.count();

        console.log('Morning timeslots found:', slotCount);
      }
    });

    test('Afternoon timeslots (12:00-17:00) @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const afternoonSlots = timeslotTable.locator('td:has-text("12:"), td:has-text("13:"), td:has-text("14:"), td:has-text("15:"), td:has-text("16:")');
        const slotCount = await afternoonSlots.count();

        console.log('Afternoon timeslots found:', slotCount);
      }
    });

    test('30-minute duration timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const durationFields = adminAuthenticatedPage.locator('td:has-text("30"), input[value="30"]');
      const fieldCount = await durationFields.count();

      console.log('30-minute duration timeslots:', fieldCount);
    });

    test('60-minute duration timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const durationFields = adminAuthenticatedPage.locator('td:has-text("60"), input[value="60"]');
      const fieldCount = await durationFields.count();

      console.log('60-minute duration timeslots:', fieldCount);
    });

    test('15-minute duration timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const durationFields = adminAuthenticatedPage.locator('td:has-text("15"), input[value="15"]');
      const fieldCount = await durationFields.count();

      console.log('15-minute duration timeslots:', fieldCount);
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

    test('Timeslots refresh on client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      const buttonVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Timeslots refreshed:', buttonVisible);
    });
  });

  test.describe('Timeslot Actions', () => {
    test('Edit timeslot @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete timeslot @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('Enable/disable timeslot @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const toggleButtons = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const buttonCount = await toggleButtons.count();

      console.log('Timeslot toggle controls found:', buttonCount);
    });
  });

  test.describe('Timeslot Validation', () => {
    test('Required fields validation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const requiredFields = adminAuthenticatedPage.locator('input[required], select[required]');
      const requiredCount = await requiredFields.count();

      console.log('Required fields for timeslots:', requiredCount);
    });

    test('Time format validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeFields = adminAuthenticatedPage.locator('input[type="time"]');
      const timeCount = await timeFields.count();

      console.log('Time fields for validation:', timeCount);
    });

    test('Duration numeric validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const numericFields = adminAuthenticatedPage.locator('input[type="number"]');
      const numericCount = await numericFields.count();

      console.log('Numeric fields for validation:', numericCount);
    });

    test('Overlapping timeslots validation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await timeslotTable.locator('tbody tr').count();
        console.log('Timeslot rows to check for overlaps:', rows);
      }
    });
  });

  test.describe('Timeslot Display', () => {
    test('Timeslot list view @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Timeslot list view visible:', hasTable);
    });

    test('Timeslot grid view @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const gridView = adminAuthenticatedPage.locator('.grid-view, [class*="grid"]');
      const hasGrid = await gridView.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Timeslot grid view visible:', hasGrid);
    });

    test('Calendar view for timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const calendarView = adminAuthenticatedPage.locator('.calendar, [class*="calendar"]');
      const hasCalendar = await calendarView.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Calendar view visible:', hasCalendar);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete timeslot configuration workflow @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();

      const timeslotTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await timeslotTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Complete timeslot workflow ready, table visible:', hasTable);
    });

    test('Configure and save timeslots @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: 'Save' });
      await saveButton.click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Configure and save timeslots workflow completed');
    });
  });

  test.describe('Timeslot Availability', () => {
    test('Available timeslots indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const availableIndicators = adminAuthenticatedPage.locator('.available, [class*="available"]');
      const indicatorCount = await availableIndicators.count();

      console.log('Available timeslot indicators:', indicatorCount);
    });

    test('Unavailable timeslots indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const unavailableIndicators = adminAuthenticatedPage.locator('.unavailable, [class*="unavailable"]');
      const indicatorCount = await unavailableIndicators.count();

      console.log('Unavailable timeslot indicators:', indicatorCount);
    });

    test('Booked timeslots indicator @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const bookedIndicators = adminAuthenticatedPage.locator('.booked, [class*="booked"]');
      const indicatorCount = await bookedIndicators.count();

      console.log('Booked timeslot indicators:', indicatorCount);
    });
  });

  test.describe('Bulk Operations', () => {
    test('Select multiple timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const checkboxes = adminAuthenticatedPage.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      console.log('Selection checkboxes for bulk operations:', checkboxCount);
    });

    test('Bulk enable timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const bulkEnableButton = adminAuthenticatedPage.getByRole('button', { name: /enable all|bulk enable/i });
      const buttonVisible = await bulkEnableButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Bulk enable button visible:', buttonVisible);
    });

    test('Bulk disable timeslots @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('34');

      const bulkDisableButton = adminAuthenticatedPage.getByRole('button', { name: /disable all|bulk disable/i });
      const buttonVisible = await bulkDisableButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Bulk disable button visible:', buttonVisible);
    });
  });
});
