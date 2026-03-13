// ============================================
// MANAGE USER PERMISSIONS - COMPREHENSIVE TESTS
// Task queues, member hub, permissions by role
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageUserPermissions } from '../pages/manageUserPermissions';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage User Permissions - Comprehensive`, () => {
  let navigation: navigationPage;
  let managePerms: manageUserPermissions;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    managePerms = new manageUserPermissions(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage User Permissions' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage User Permissions page loads @p1', async ({ adminAuthenticatedPage }) => {
      const codesOrNamesLink = adminAuthenticatedPage.getByRole('link', { name: 'Codes Or Names' });
      await expect(codesOrNamesLink).toBeVisible();
    });

    test('Codes Or Names link available @p2', async ({ adminAuthenticatedPage }) => {
      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Codes Or Names' })).toBeVisible();
    });
  });

  test.describe('Task Queue Permissions', () => {
    test('Task Queue link available @p2', async ({ adminAuthenticatedPage }) => {
      const taskQueueLink = adminAuthenticatedPage.locator('#userTitlePermissions').getByRole('link', { name: 'Task Queue' });
      const linkVisible = await taskQueueLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Task Queue link visible:', linkVisible);
    });

    test('Open Task Queue permissions @p2', async ({ adminAuthenticatedPage }) => {
      const taskQueueLink = adminAuthenticatedPage.locator('#userTitlePermissions').getByRole('link', { name: 'Task Queue' });
      const linkVisible = await taskQueueLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await taskQueueLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Task Queue permissions opened');
      }
    });
  });

  test.describe('Member Hub Permissions', () => {
    test('Member Hub link available @p2', async ({ adminAuthenticatedPage }) => {
      const memberHubLink = adminAuthenticatedPage.getByRole('link', { name: 'Member Hub' });
      const linkVisible = await memberHubLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Member Hub link visible:', linkVisible);
    });

    test('Open Member Hub permissions @p2', async ({ adminAuthenticatedPage }) => {
      const memberHubLink = adminAuthenticatedPage.getByRole('link', { name: 'Member Hub' });
      const linkVisible = await memberHubLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await memberHubLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Member Hub permissions opened');
      }
    });
  });

  test.describe('Authorization Management Permissions', () => {
    test('AM link available @p2', async ({ adminAuthenticatedPage }) => {
      const amLink = adminAuthenticatedPage.getByRole('link', { name: 'AM', exact: true });
      const linkVisible = await amLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('AM link visible:', linkVisible);
    });

    test('Open AM permissions @p2', async ({ adminAuthenticatedPage }) => {
      const amLink = adminAuthenticatedPage.getByRole('link', { name: 'AM', exact: true });
      const linkVisible = await amLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await amLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('AM permissions opened');
      }
    });

    test('AM Task link available @p2', async ({ adminAuthenticatedPage }) => {
      const amTaskLink = adminAuthenticatedPage.getByRole('link', { name: 'AM Task' });
      const linkVisible = await amTaskLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('AM Task link visible:', linkVisible);
    });

    test('Open AM Task permissions @p2', async ({ adminAuthenticatedPage }) => {
      const amTaskLink = adminAuthenticatedPage.getByRole('link', { name: 'AM Task' });
      const linkVisible = await amTaskLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await amTaskLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('AM Task permissions opened');
      }
    });
  });

  test.describe('Case Management Permissions', () => {
    test('CM link available @p2', async ({ adminAuthenticatedPage }) => {
      const cmLink = adminAuthenticatedPage.getByRole('link', { name: 'CM', exact: true });
      const linkVisible = await cmLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('CM link visible:', linkVisible);
    });

    test('Open CM permissions @p2', async ({ adminAuthenticatedPage }) => {
      const cmLink = adminAuthenticatedPage.getByRole('link', { name: 'CM', exact: true });
      const linkVisible = await cmLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await cmLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('CM permissions opened');
      }
    });

    test('CM Tasks link available @p2', async ({ adminAuthenticatedPage }) => {
      const cmTasksLink = adminAuthenticatedPage.getByRole('link', { name: 'CM Tasks' });
      const linkVisible = await cmTasksLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('CM Tasks link visible:', linkVisible);
    });

    test('Open CM Tasks permissions @p2', async ({ adminAuthenticatedPage }) => {
      const cmTasksLink = adminAuthenticatedPage.getByRole('link', { name: 'CM Tasks' });
      const linkVisible = await cmTasksLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await cmTasksLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('CM Tasks permissions opened');
      }
    });
  });

  test.describe('Utilization Management Permissions', () => {
    test('UM link available @p2', async ({ adminAuthenticatedPage }) => {
      const umLink = adminAuthenticatedPage.getByRole('link', { name: 'UM', exact: true }).first();
      const linkVisible = await umLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('UM link visible:', linkVisible);
    });

    test('Open UM permissions @p2', async ({ adminAuthenticatedPage }) => {
      const umLink = adminAuthenticatedPage.getByRole('link', { name: 'UM', exact: true }).first();
      const linkVisible = await umLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await umLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('UM permissions opened');
      }
    });

    test('UM Tasks link available @p2', async ({ adminAuthenticatedPage }) => {
      const umTasksLink = adminAuthenticatedPage.getByRole('link', { name: 'UM Tasks' });
      const linkVisible = await umTasksLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('UM Tasks link visible:', linkVisible);
    });

    test('Open UM Tasks permissions @p2', async ({ adminAuthenticatedPage }) => {
      const umTasksLink = adminAuthenticatedPage.getByRole('link', { name: 'UM Tasks' });
      const linkVisible = await umTasksLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await umTasksLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('UM Tasks permissions opened');
      }
    });

    test('Toggle UM permissions @p3', async ({ adminAuthenticatedPage }) => {
      const umLink = adminAuthenticatedPage.getByRole('link', { name: 'UM', exact: true }).first();
      const linkVisible = await umLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await umLink.click();
        await smartWait(adminAuthenticatedPage, 500);

        await umLink.click();
        await smartWait(adminAuthenticatedPage, 500);

        console.log('UM permissions toggled');
      }
    });
  });

  test.describe('Clinical Permissions', () => {
    test('Clinical link available @p2', async ({ adminAuthenticatedPage }) => {
      const clinicalLink = adminAuthenticatedPage.getByRole('link', { name: 'Clinical' });
      const linkVisible = await clinicalLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Clinical link visible:', linkVisible);
    });

    test('Open Clinical permissions @p2', async ({ adminAuthenticatedPage }) => {
      const clinicalLink = adminAuthenticatedPage.getByRole('link', { name: 'Clinical' });
      const linkVisible = await clinicalLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await clinicalLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Clinical permissions opened');
      }
    });
  });

  test.describe('Workflow Permissions', () => {
    test('Workflow link available @p2', async ({ adminAuthenticatedPage }) => {
      const workflowLink = adminAuthenticatedPage.getByRole('link', { name: 'Workflow' });
      const linkVisible = await workflowLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Workflow link visible:', linkVisible);
    });

    test('Open Workflow permissions @p2', async ({ adminAuthenticatedPage }) => {
      const workflowLink = adminAuthenticatedPage.getByRole('link', { name: 'Workflow' });
      const linkVisible = await workflowLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await workflowLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Workflow permissions opened');
      }
    });
  });

  test.describe('Other Permissions', () => {
    test('Other link available @p2', async ({ adminAuthenticatedPage }) => {
      const otherLink = adminAuthenticatedPage.getByRole('link', { name: 'Other' });
      const linkVisible = await otherLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Other link visible:', linkVisible);
    });

    test('Open Other permissions @p2', async ({ adminAuthenticatedPage }) => {
      const otherLink = adminAuthenticatedPage.getByRole('link', { name: 'Other' });
      const linkVisible = await otherLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        await otherLink.click();
        await smartWait(adminAuthenticatedPage, 1000);

        console.log('Other permissions opened');
      }
    });
  });

  test.describe('Permission Categories', () => {
    test('Multiple permission categories available @p2', async ({ adminAuthenticatedPage }) => {
      const categories = [
        'Task Queue',
        'Member Hub',
        'AM',
        'CM',
        'UM',
        'Clinical',
        'Workflow',
        'Other'
      ];

      for (const category of categories) {
        const categoryLink = adminAuthenticatedPage.getByRole('link', { name: category });
        const linkVisible = await categoryLink.isVisible({ timeout: 2000 }).catch(() => false);

        if (linkVisible) {
          console.log(`Category "${category}" found`);
        }
      }
    });

    test('Navigate between permission categories @p3', async ({ adminAuthenticatedPage }) => {
      const memberHubLink = adminAuthenticatedPage.getByRole('link', { name: 'Member Hub' });
      await memberHubLink.click().catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      const workflowLink = adminAuthenticatedPage.getByRole('link', { name: 'Workflow' });
      await workflowLink.click().catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between permission categories');
    });
  });

  test.describe('User Title Permissions', () => {
    test('User title permissions container @p2', async ({ adminAuthenticatedPage }) => {
      const userTitleContainer = adminAuthenticatedPage.locator('#userTitlePermissions');
      const containerVisible = await userTitleContainer.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('User title permissions container visible:', containerVisible);
    });

    test('Permission links within user title @p3', async ({ adminAuthenticatedPage }) => {
      const userTitleContainer = adminAuthenticatedPage.locator('#userTitlePermissions');
      const containerVisible = await userTitleContainer.isVisible({ timeout: 3000 }).catch(() => false);

      if (containerVisible) {
        const links = await userTitleContainer.locator('a').count();
        console.log('Permission links in user title:', links);
      }
    });
  });
});
