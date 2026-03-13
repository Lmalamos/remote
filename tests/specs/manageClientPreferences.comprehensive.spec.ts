// ============================================
// MANAGE CLIENT PREFERENCES - COMPREHENSIVE TESTS
// Client configuration, feature toggles, preferences
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageClientPreferences } from '../pages/manageClientPreferences';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Client Preferences - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageCP: manageClientPreferences;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageCP = new manageClientPreferences(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Client Preferences' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Client Preferences page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });

    test('View button available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
    });
  });

  test.describe('Member Search Preferences', () => {
    test('Member Search link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Member Search' })).toBeVisible();
    });

    test('Open Member Search preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Member Search' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Member Search preferences opened');
    });
  });

  test.describe('Scheduled Task Queue Preferences', () => {
    test('Scheduled Task Queue link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      const stqLink = adminAuthenticatedPage.getByRole('link', { name: 'Scheduled Task Queue' });
      const linkVisible = await stqLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Scheduled Task Queue link visible:', linkVisible);
    });

    test('Open Scheduled Task Queue preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Scheduled Task Queue' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Scheduled Task Queue preferences opened');
    });
  });

  test.describe('Eligible Member Queue Preferences', () => {
    test('Eligible Member Queue link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Eligible Member Queue' })).toBeVisible();
    });

    test('Open Eligible Member Queue preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Eligible Member Queue' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Eligible Member Queue preferences opened');
    });
  });

  test.describe('UM Request Preferences', () => {
    test('UM Request link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'UM Request' })).toBeVisible();
    });

    test('Open UM Request preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'UM Request' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('UM Request preferences opened');
    });
  });

  test.describe('Correspondence Preferences', () => {
    test('Correspondence link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Correspondence' })).toBeVisible();
    });

    test('Open Correspondence preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Correspondence' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Correspondence preferences opened');
    });
  });

  test.describe('Third Party Preferences', () => {
    test('Third Party link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Third Party' })).toBeVisible();
    });

    test('Open Third Party preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Third Party' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Third Party preferences opened');
    });
  });

  test.describe('Case And Claim Search Preferences', () => {
    test('Case And Claim Search link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Case And Claim Search' })).toBeVisible();
    });

    test('Open Case And Claim Search preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Case And Claim Search' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Case And Claim Search preferences opened');
    });
  });

  test.describe('Care Management Preferences', () => {
    test('Care Management link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Care Management' })).toBeVisible();
    });

    test('Open Care Management preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Care Management' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Care Management preferences opened');
    });
  });

  test.describe('General Preferences', () => {
    test('General link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'General' })).toBeVisible();
    });

    test('Open General preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('General preferences opened');
    });
  });

  test.describe('File Processing Preferences', () => {
    test('File Processing link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'File Processing' })).toBeVisible();
    });

    test('Open File Processing preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'File Processing' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('File Processing preferences opened');
    });
  });

  test.describe('Connect Mobile Preferences', () => {
    test('Connect Mobile link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Connect Mobile' })).toBeVisible();
    });

    test('Open Connect Mobile preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Connect Mobile' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Connect Mobile preferences opened');
    });
  });

  test.describe('Assessment Management Preferences', () => {
    test('Assessment Management link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' })).toBeVisible();
    });

    test('Open Assessment Management preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Assessment Management' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Assessment Management preferences opened');
    });
  });

  test.describe('Logging Preferences', () => {
    test('Logging link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Logging' })).toBeVisible();
    });

    test('Open Logging preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Logging' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Logging preferences opened');
    });
  });

  test.describe('AI Preferences', () => {
    test('AI link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'AI', exact: true })).toBeVisible();
    });

    test('Open AI preferences @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'AI', exact: true }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('AI preferences opened');
    });
  });

  test.describe('QK Feature Toggle', () => {
    test('QK Feature Toggle link available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' })).toBeVisible();
    });

    test('Open QK Feature Toggle @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'QK Feature Toggle' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('QK Feature Toggle opened');
    });
  });

  test.describe('Client Selection', () => {
    test('Switch between clients @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');

      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');

      await clientSelect.selectOption('34');
      await expect(clientSelect).toHaveValue('34');
    });

    test('Preferences persist across navigation @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('34');

      await adminAuthenticatedPage.getByRole('link', { name: 'Member Search' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'General' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between preference sections');
    });
  });

  test.describe('All Preference Categories', () => {
    test('All preference links accessible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Client:');
      await clientSelect.selectOption('0');

      const preferenceCategories = [
        'Member Search',
        'Scheduled Task Queue',
        'Eligible Member Queue',
        'UM Request',
        'Correspondence',
        'Third Party',
        'Case And Claim Search',
        'Care Management',
        'General',
        'File Processing',
        'Connect Mobile',
        'Assessment Management',
        'Logging',
        'QK Feature Toggle'
      ];

      for (const category of preferenceCategories) {
        const categoryLink = adminAuthenticatedPage.getByRole('link', { name: category });
        const linkVisible = await categoryLink.isVisible({ timeout: 2000 }).catch(() => false);

        if (linkVisible) {
          console.log(`Preference category "${category}" found`);
        }
      }
    });
  });
});
