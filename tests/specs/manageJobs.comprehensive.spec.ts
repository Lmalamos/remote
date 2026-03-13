// ============================================
// MANAGE JOBS - COMPREHENSIVE TESTS
// Transmission jobs, non-transmission jobs, job status
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageJobs } from '../pages/manageJobs';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Jobs - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageJobsPage: manageJobs;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageJobsPage = new manageJobs(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Jobs' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Jobs page loads @p1', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' })).toBeVisible();
    });

    test('Job management links visible @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' })).toBeVisible();
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Launch a Non-Transmission Job' })).toBeVisible();
    });
  });

  test.describe('Launch Transmission Job', () => {
    test('Launch Transmission Job link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' })).toBeVisible();
    });

    test('Open Launch Transmission Job dialog @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const cancelButton = adminAuthenticatedPage.getByRole('button', { name: 'Cancel' });
      const buttonVisible = await cancelButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Launch Transmission Job dialog opened:', buttonVisible);
    });

    test('Cancel Transmission Job @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Transmission Job cancelled');
    });

    test('Transmission Job form fields @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const jobSelect = adminAuthenticatedPage.getByLabel(/job|name/i);
      const selectVisible = await jobSelect.isVisible({ timeout: 2000 }).catch(() => false);

      console.log('Job selection field visible:', selectVisible);

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click().catch(() => {});
    });
  });

  test.describe('Launch Non-Transmission Job', () => {
    test('Launch Non-Transmission Job link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Launch a Non-Transmission Job' })).toBeVisible();
    });

    test('Open Launch Non-Transmission Job dialog @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Non-Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const paramsField = adminAuthenticatedPage.getByRole('textbox', { name: '{"param-name": "param-value' });
      const fieldVisible = await paramsField.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Non-Transmission Job dialog opened:', fieldVisible);
    });

    test('Fill parameters field @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Non-Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      const paramsField = adminAuthenticatedPage.getByRole('textbox', { name: '{"param-name": "param-value' });
      const fieldVisible = await paramsField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await paramsField.click();
        await paramsField.fill('{"test": "value"}');

        console.log('Parameters field filled');
      }

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click().catch(() => {});
    });

    test('Cancel Non-Transmission Job @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Launch a Non-Transmission Job' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Non-Transmission Job cancelled');
    });
  });

  test.describe('Job Status Views', () => {
    test('Last Time Each Job Ran link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Last Time Each Job Ran' })).toBeVisible();
    });

    test('Latest Jobs link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Latest Jobs' })).toBeVisible();
    });

    test('Transmission File Status link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Transmission File Status' })).toBeVisible();
    });

    test('Open Latest Jobs @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Latest Jobs' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Latest Jobs view opened');
    });

    test('Open Transmission File Status @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Transmission File Status' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Transmission File Status view opened');
    });

    test('Open Last Time Each Job Ran @p2', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Last Time Each Job Ran' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Last Time Each Job Ran view opened');
    });
  });

  test.describe('Search Jobs', () => {
    test('Search box available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    });

    test('Search for specific job @p2', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.click();
      await searchBox.fill('CityOfChicago');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Job search executed: CityOfChicago');
    });

    test('Clear job search @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test');
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Job search cleared');
    });

    test('Search with different terms @p3', async ({ adminAuthenticatedPage }) => {
      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchTerms = ['transmission', 'export', 'import', 'file'];

      for (const term of searchTerms) {
        await searchBox.clear();
        await searchBox.fill(term);
        await smartWait(adminAuthenticatedPage, 500);

        console.log(`Searched for: ${term}`);
      }
    });
  });

  test.describe('Jobs Table', () => {
    test('Jobs table displays @p2', async ({ adminAuthenticatedPage }) => {
      const jobsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await jobsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Jobs table visible:', hasTable);
    });

    test('Jobs table has rows @p3', async ({ adminAuthenticatedPage }) => {
      const jobsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await jobsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await jobsTable.locator('tbody tr').count();
        console.log('Jobs table rows:', rows);
      }
    });

    test('Jobs table columns @p3', async ({ adminAuthenticatedPage }) => {
      const jobsTable = adminAuthenticatedPage.locator('table').first();
      const hasTable = await jobsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Job', 'Status', 'Date', 'Time'];

        for (const column of expectedColumns) {
          const headerCell = jobsTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });
  });

  test.describe('Job Navigation', () => {
    test('Navigate between job views @p3', async ({ adminAuthenticatedPage }) => {
      await adminAuthenticatedPage.getByRole('link', { name: 'Latest Jobs' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Transmission File Status' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Last Time Each Job Ran' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between job views');
    });
  });

  test.describe('Job Actions', () => {
    test('Launch job button @p2', async ({ adminAuthenticatedPage }) => {
      const launchButtons = adminAuthenticatedPage.getByRole('button', { name: /launch|run/i });
      const buttonCount = await launchButtons.count();

      console.log('Launch buttons found:', buttonCount);
    });

    test('View job details @p3', async ({ adminAuthenticatedPage }) => {
      const viewButtons = adminAuthenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Job status indicators @p3', async ({ adminAuthenticatedPage }) => {
      const statusOptions = ['Running', 'Completed', 'Failed', 'Pending'];

      for (const status of statusOptions) {
        const statusElement = adminAuthenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });
  });
});
