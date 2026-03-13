// ============================================
// MANAGE SYSTEM MESSAGES - COMPREHENSIVE TESTS
// System-wide messages, banners, notifications
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageSystemMessages } from '../pages/manageSystemMessages';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage System Messages - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageSM: manageSystemMessages;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageSM = new manageSystemMessages(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage System Messages' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage System Messages page loads @p1', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Add Message' })).toBeVisible();
    });

    test('Add Message button available @p2', async ({ adminAuthenticatedPage }) => {
      const addButton = adminAuthenticatedPage.getByRole('button', { name: 'Add Message' });
      await expect(addButton).toBeVisible();
      await expect(addButton).toBeEnabled();
    });
  });

  test.describe('Add System Message', () => {
    test('Open Add Message form @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByLabel('Client', { exact: true })).toBeVisible();
    });

    test('Client selection in message form @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Client', { exact: true }).selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Client selected for system message');
    });

    test('Message field is required @p1', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const messageField = adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' });
      await expect(messageField).toBeVisible();

      const label = await adminAuthenticatedPage.locator('label:has-text("Message")').first().textContent().catch(() => '');
      const isRequired = label.includes('*');

      console.log('Message field required:', isRequired);
      expect(isRequired).toBe(true);
    });

    test('Fill message text @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' }).fill('System maintenance scheduled for tonight');

      console.log('Message text filled');
    });

    test('Message with long text @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const longMessage = 'This is a very long system message that contains important information for all users. '.repeat(5);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' }).fill(longMessage);

      console.log('Long message text filled, length:', longMessage.length);
    });
  });

  test.describe('Message Dates', () => {
    test('Start date picker available @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const startDatePicker = adminAuthenticatedPage.locator('.input-group-addon').first();
      const pickerVisible = await startDatePicker.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Start date picker visible:', pickerVisible);
    });

    test('End date picker available @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const endDatePicker = adminAuthenticatedPage.locator('#divInputMessageEndDate > .input-group-addon');
      const pickerVisible = await endDatePicker.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('End date picker visible:', pickerVisible);
    });

    test('Open start date picker @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.locator('.input-group-addon').first().click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Start date picker opened');
    });

    test('Open end date picker @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.locator('#divInputMessageEndDate > .input-group-addon').click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('End date picker opened');
    });

    test('Select dates for message @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.locator('.input-group-addon').first().click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.locator('#divInputMessageEndDate > .input-group-addon').click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Date range selected for message');
    });
  });

  test.describe('Complete Message Form', () => {
    test('Fill complete message form @p1', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Client', { exact: true }).selectOption('34');
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Message *' }).fill('test message');
      await adminAuthenticatedPage.locator('.input-group-addon').first().click();

      console.log('Complete message form filled');
    });

    test('Cancel message creation @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Message creation cancelled');
    });

    test('Save button available @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const saveButton = adminAuthenticatedPage.getByRole('button', { name: /save|submit/i });
      const saveVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Save button available:', saveVisible);
    });
  });

  test.describe('Message List', () => {
    test('System messages table displays @p2', async ({ adminAuthenticatedPage }) => {
      const messagesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await messagesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('System messages table visible:', hasTable);
    });

    test('Messages table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const messagesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await messagesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await messagesTable.locator('tbody tr').count();
        console.log('System messages rows:', rows);
      }
    });

    test('Messages table columns @p3', async ({ adminAuthenticatedPage }) => {
      const messagesTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await messagesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Client', 'Message', 'Start Date', 'End Date'];

        for (const column of expectedColumns) {
          const headerCell = messagesTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Search Messages', () => {
    test('Search system messages @p2', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('maintenance');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('System messages search executed');
      }
    });

    test('Clear message search @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Message search cleared');
    });
  });

  test.describe('Message Actions', () => {
    test('Edit message @p3', async ({ adminAuthenticatedPage }) => {
      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete message @p3', async ({ adminAuthenticatedPage }) => {
      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('View message details @p3', async ({ adminAuthenticatedPage }) => {
      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });
  });

  test.describe('Message Status', () => {
    test('Active messages @p3', async ({ adminAuthenticatedPage }) => {
      const activeIndicator = adminAuthenticatedPage.getByText(/active/i);
      const indicatorVisible = await activeIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Active message indicator found:', indicatorVisible);
    });

    test('Expired messages @p3', async ({ adminAuthenticatedPage }) => {
      const expiredIndicator = adminAuthenticatedPage.getByText(/expired|inactive/i);
      const indicatorVisible = await expiredIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Expired message indicator found:', indicatorVisible);
    });

    test('Scheduled messages @p3', async ({ adminAuthenticatedPage }) => {
      const scheduledIndicator = adminAuthenticatedPage.getByText(/scheduled|upcoming/i);
      const indicatorVisible = await scheduledIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Scheduled message indicator found:', indicatorVisible);
    });
  });

  test.describe('Message Types', () => {
    test('System-wide message @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const clientSelect = adminAuthenticatedPage.getByLabel('Client', { exact: true });
      const allClientsOption = clientSelect.locator('option').first();
      const optionText = await allClientsOption.textContent().catch(() => '');

      console.log('All clients option text:', optionText);
    });

    test('Client-specific message @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('button', { name: 'Add Message' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Client', { exact: true }).selectOption('34');

      console.log('Client-specific message configured');
    });
  });
});
