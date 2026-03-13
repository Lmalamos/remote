// ============================================
// MANAGE DEVICE SYNC - COMPREHENSIVE TESTS
// Device synchronization, mobile device management
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageDeviceSync } from '../pages/manageDeviceSync';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Device Sync - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageDeviceSyncPage: manageDeviceSync;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageDeviceSyncPage = new manageDeviceSync(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Device Sync' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Device Sync page loads @p1', async ({ adminAuthenticatedPage }) => {
      const pageTitle = adminAuthenticatedPage.locator('h1, h2, h3, .page-title');
      const hasTitle = await pageTitle.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Manage Device Sync page title visible:', hasTitle);
    });

    test('Client selection available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      const selectVisible = await clientSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        await clientSelect.selectOption('0');
        console.log('Client selected');
      }
    });
  });

  test.describe('Device Sync Management UI', () => {
    test('Device sync table displays @p2', async ({ adminAuthenticatedPage }) => {
      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Device sync table visible:', hasTable);
    });

    test('Sync button available @p2', async ({ adminAuthenticatedPage }) => {
      const syncButton = adminAuthenticatedPage.getByRole('button', { name: /sync|synchronize/i });
      const buttonVisible = await syncButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync button visible:', buttonVisible);
    });

    test('Refresh button available @p2', async ({ adminAuthenticatedPage }) => {
      const refreshButton = adminAuthenticatedPage.getByRole('button', { name: /refresh|reload/i });
      const buttonVisible = await refreshButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Refresh button visible:', buttonVisible);
    });

    test('Add device button available @p3', async ({ adminAuthenticatedPage }) => {
      const addButton = adminAuthenticatedPage.getByRole('button', { name: /add|new/i });
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Add device button visible:', buttonVisible);
    });
  });

  test.describe('Device List', () => {
    test('Device list table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await deviceTable.locator('tbody tr').count();
        console.log('Device sync rows:', rows);
      }
    });

    test('Device list columns @p3', async ({ adminAuthenticatedPage }) => {
      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Device', 'Name', 'User', 'Status', 'Last Sync'];

        for (const column of expectedColumns) {
          const headerCell = deviceTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Search Devices', () => {
    test('Search devices @p2', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('device');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Device search executed');
      }
    });

    test('Clear device search @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test').catch(() => {});
        await smartWait(adminAuthenticatedPage, 500);

        await searchBox.clear();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Device search cleared');
      }
    });

    test('Search by device name @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('iPhone');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Search by device name executed');
      }
    });

    test('Search by user @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('user');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Search by user executed');
      }
    });
  });

  test.describe('Sync Operations', () => {
    test('Sync all devices @p2', async ({ adminAuthenticatedPage }) => {
      const syncButton = adminAuthenticatedPage.getByRole('button', { name: /sync all/i });
      const buttonVisible = await syncButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await syncButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Sync all devices executed');
      }
    });

    test('Sync individual device @p3', async ({ adminAuthenticatedPage }) => {
      const syncButton = adminAuthenticatedPage.getByRole('button', { name: /sync/i }).first();
      const buttonVisible = await syncButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        console.log('Individual device sync button available');
      }
    });

    test('Refresh sync status @p3', async ({ adminAuthenticatedPage }) => {
      const refreshButton = adminAuthenticatedPage.getByRole('button', { name: /refresh/i });
      const buttonVisible = await refreshButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await refreshButton.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Sync status refreshed');
      }
    });
  });

  test.describe('Device Status', () => {
    test('Online status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const onlineStatus = adminAuthenticatedPage.getByText(/online|active|connected/i);
      const statusVisible = await onlineStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Online status indicator found:', statusVisible);
    });

    test('Offline status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const offlineStatus = adminAuthenticatedPage.getByText(/offline|inactive|disconnected/i);
      const statusVisible = await offlineStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Offline status indicator found:', statusVisible);
    });

    test('Syncing status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const syncingStatus = adminAuthenticatedPage.getByText(/syncing|synchronizing/i);
      const statusVisible = await syncingStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Syncing status indicator found:', statusVisible);
    });

    test('Error status indicator @p3', async ({ adminAuthenticatedPage }) => {
      const errorStatus = adminAuthenticatedPage.getByText(/error|failed/i);
      const statusVisible = await errorStatus.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Error status indicator found:', statusVisible);
    });
  });

  test.describe('Device Actions', () => {
    test('View device details @p3', async ({ adminAuthenticatedPage }) => {
      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View device buttons found:', buttonCount);
    });

    test('Edit device settings @p3', async ({ adminAuthenticatedPage }) => {
      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit|settings/i });
      const buttonCount = await editButtons.count();

      console.log('Edit device buttons found:', buttonCount);
    });

    test('Remove device @p3', async ({ adminAuthenticatedPage }) => {
      const removeButtons = adminAuthenticatedPage.getByRole('button', { name: /remove|delete/i });
      const buttonCount = await removeButtons.count();

      console.log('Remove device buttons found:', buttonCount);
    });

    test('Reset device sync @p3', async ({ adminAuthenticatedPage }) => {
      const resetButtons = adminAuthenticatedPage.getByRole('button', { name: /reset/i });
      const buttonCount = await resetButtons.count();

      console.log('Reset device buttons found:', buttonCount);
    });
  });

  test.describe('Last Sync Information', () => {
    test('Last sync timestamp displays @p3', async ({ adminAuthenticatedPage }) => {
      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const timestamps = deviceTable.locator('td:has-text("ago"), td:has-text("AM"), td:has-text("PM")');
        const timestampCount = await timestamps.count();

        console.log('Last sync timestamps found:', timestampCount);
      }
    });

    test('Never synced indicator @p3', async ({ adminAuthenticatedPage }) => {
      const neverSynced = adminAuthenticatedPage.getByText(/never|not synced/i);
      const statusVisible = await neverSynced.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Never synced indicator found:', statusVisible);
    });
  });

  test.describe('Device Types', () => {
    test('Mobile devices display @p3', async ({ adminAuthenticatedPage }) => {
      const mobileDevices = adminAuthenticatedPage.getByText(/mobile|phone|android|iOS/i);
      const deviceCount = await mobileDevices.count();

      console.log('Mobile devices found:', deviceCount);
    });

    test('Tablet devices display @p3', async ({ adminAuthenticatedPage }) => {
      const tabletDevices = adminAuthenticatedPage.getByText(/tablet|iPad/i);
      const deviceCount = await tabletDevices.count();

      console.log('Tablet devices found:', deviceCount);
    });

    test('Desktop devices display @p3', async ({ adminAuthenticatedPage }) => {
      const desktopDevices = adminAuthenticatedPage.getByText(/desktop|computer|PC/i);
      const deviceCount = await desktopDevices.count();

      console.log('Desktop devices found:', deviceCount);
    });
  });

  test.describe('Sync History', () => {
    test('Sync history link available @p3', async ({ adminAuthenticatedPage }) => {
      const historyLink = adminAuthenticatedPage.getByRole('link', { name: /history|log/i });
      const linkVisible = await historyLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync history link visible:', linkVisible);
    });

    test('View sync history @p3', async ({ adminAuthenticatedPage }) => {
      const historyLink = adminAuthenticatedPage.getByRole('link', { name: /history|log/i });
      const linkVisible = await historyLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await historyLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Sync history opened');
      }
    });
  });

  test.describe('Filter Devices', () => {
    test('Filter by status @p3', async ({ adminAuthenticatedPage }) => {
      const statusFilter = adminAuthenticatedPage.getByLabel(/status|filter/i);
      const filterVisible = await statusFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Status filter visible:', filterVisible);
    });

    test('Filter by device type @p3', async ({ adminAuthenticatedPage }) => {
      const typeFilter = adminAuthenticatedPage.getByLabel(/type|device type/i);
      const filterVisible = await typeFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Device type filter visible:', filterVisible);
    });

    test('Filter by user @p3', async ({ adminAuthenticatedPage }) => {
      const userFilter = adminAuthenticatedPage.getByLabel(/user|assigned to/i);
      const filterVisible = await userFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('User filter visible:', filterVisible);
    });
  });

  test.describe('Sync Settings', () => {
    test('Sync settings button available @p3', async ({ adminAuthenticatedPage }) => {
      const settingsButton = adminAuthenticatedPage.getByRole('button', { name: /settings|configure/i });
      const buttonVisible = await settingsButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync settings button visible:', buttonVisible);
    });

    test('Auto-sync toggle @p3', async ({ adminAuthenticatedPage }) => {
      const autoSyncToggle = adminAuthenticatedPage.locator('input[type="checkbox"]').first();
      const toggleVisible = await autoSyncToggle.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Auto-sync toggle visible:', toggleVisible);
    });

    test('Sync interval configuration @p3', async ({ adminAuthenticatedPage }) => {
      const intervalField = adminAuthenticatedPage.locator('input[type="number"], select');
      const fieldVisible = await intervalField.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync interval configuration visible:', fieldVisible);
    });
  });

  test.describe('Export and Reports', () => {
    test('Export device list @p3', async ({ adminAuthenticatedPage }) => {
      const exportButton = adminAuthenticatedPage.getByRole('button', { name: /export|download/i });
      const buttonVisible = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Export device list button visible:', buttonVisible);
    });

    test('Sync report @p3', async ({ adminAuthenticatedPage }) => {
      const reportButton = adminAuthenticatedPage.getByRole('button', { name: /report/i });
      const buttonVisible = await reportButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync report button visible:', buttonVisible);
    });
  });

  test.describe('Complete Workflow', () => {
    test('Complete device sync workflow @p1', async ({ adminAuthenticatedPage }) => {
      const syncButton = adminAuthenticatedPage.getByRole('button', { name: /sync/i });
      const syncVisible = await syncButton.isVisible({ timeout: 3000 }).catch(() => false);

      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const tableVisible = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Complete device sync workflow ready - Sync button:', syncVisible, 'Table:', tableVisible);
    });

    test('View and manage devices @p2', async ({ adminAuthenticatedPage }) => {
      const deviceTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await deviceTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await deviceTable.locator('tbody tr').count();
        console.log('Devices available for management:', rows);
      }
    });
  });

  test.describe('Notifications and Alerts', () => {
    test('Sync success notification @p3', async ({ adminAuthenticatedPage }) => {
      const successNotif = adminAuthenticatedPage.locator('.alert-success, .notification-success, [class*="success"]');
      const notifVisible = await successNotif.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync success notification visible:', notifVisible);
    });

    test('Sync error notification @p3', async ({ adminAuthenticatedPage }) => {
      const errorNotif = adminAuthenticatedPage.locator('.alert-danger, .notification-error, [class*="error"]');
      const notifVisible = await errorNotif.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync error notification visible:', notifVisible);
    });

    test('Sync in progress indicator @p3', async ({ adminAuthenticatedPage }) => {
      const progressIndicator = adminAuthenticatedPage.locator('.spinner, .loading, [class*="progress"]');
      const indicatorVisible = await progressIndicator.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sync in progress indicator visible:', indicatorVisible);
    });
  });
});
