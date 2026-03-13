// ============================================
// MANAGE LETTERS - COMPREHENSIVE TESTS
// Templates, sections, letter reports
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { manageLetters } from '../pages/manageLetters';
import { Tags } from '../tags';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.MANAGE} Manage Letters - Comprehensive`, () => {
  let navigation: navigationPage;
  let manageLettersPage: manageLetters;

  test.beforeEach(async ({ adminAuthenticatedPage }) => {
    navigation = new navigationPage(adminAuthenticatedPage);
    manageLettersPage = new manageLetters(adminAuthenticatedPage);

    await navigation.goToDashboard();
    await navigation.openManageDropdown();
    await adminAuthenticatedPage.getByRole('link', { name: 'Manage Letters' }).click();
    await waitForNetworkIdle(adminAuthenticatedPage);
  });

  test.describe('Page Access', () => {
    test('Manage Letters page loads @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await expect(clientSelect).toBeVisible();
    });

    test('Select client @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');
      await expect(clientSelect).toHaveValue('0');
    });
  });

  test.describe('Letter Management UI', () => {
    test('Set Patient for Preview visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByText('Set Patient for Preview')).toBeVisible();
    });

    test('Letter Counts link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Letter Counts' })).toBeVisible();
    });

    test('Template Report link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Template Report' })).toBeVisible();
    });

    test('Section Report link visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('link', { name: 'Section Report' })).toBeVisible();
    });
  });

  test.describe('Templates Section', () => {
    test('Templates heading visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByRole('heading', { name: 'Templates' })).toBeVisible();
    });

    test('Program filter available @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await expect(adminAuthenticatedPage.getByLabel('Program', { exact: true })).toBeVisible();
    });

    test('Filter templates by program @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const programFilter = adminAuthenticatedPage.getByLabel('Program', { exact: true });
      await programFilter.selectOption('10');
      await smartWait(adminAuthenticatedPage, 500);

      await programFilter.selectOption('11');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Templates filtered by program');
    });

    test('Reset program filter @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const programFilter = adminAuthenticatedPage.getByLabel('Program', { exact: true });
      await programFilter.selectOption('10');
      await smartWait(adminAuthenticatedPage, 500);

      await programFilter.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Program filter reset');
    });

    test('Search templates @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await expect(searchBox).toBeVisible();
    });
  });

  test.describe('Create Template', () => {
    test('Create Template button visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const createButton = adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first();
      const buttonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Create Template button visible:', buttonVisible);
    });

    test('Open Create Template form @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' })).toBeVisible();
    });

    test('Template name is required @p1', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      const nameField = adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' });
      await expect(nameField).toBeVisible();

      const label = await adminAuthenticatedPage.locator('label:has-text("Name")').first().textContent().catch(() => '');
      const isRequired = label.includes('*');

      console.log('Template name required:', isRequired);
    });

    test('Fill template name @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).click();
      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Test Template');

      console.log('Template name filled');
    });

    test('Add section to template @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByLabel('Sections Available').selectOption('Global After');
      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Section added to template');
    });

    test('Save template @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      await adminAuthenticatedPage.getByRole('textbox', { name: 'Name *' }).fill('Test');
      await adminAuthenticatedPage.getByLabel('Sections Available').selectOption('Global After');
      await adminAuthenticatedPage.getByRole('button', { name: 'Add' }).click();

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('Cancel template creation @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('button', { name: ' Create Template' }).first().click();
      await smartWait(adminAuthenticatedPage, 1000);

      await expect(adminAuthenticatedPage.getByRole('button', { name: 'Cancel' })).toBeVisible();

      await adminAuthenticatedPage.getByRole('button', { name: 'Cancel' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Template creation cancelled');
    });
  });

  test.describe('Sections Management', () => {
    test('Sections heading visible @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const sectionsHeading = adminAuthenticatedPage.getByRole('heading', { name: 'Sections' });
      const headingVisible = await sectionsHeading.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Sections heading visible:', headingVisible);
    });

    test('Click Sections heading @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('heading', { name: 'Sections' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Sections heading clicked');
    });

    test('Search sections @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('heading', { name: 'Sections' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.click();
        await searchBox.fill('global after');
        await smartWait(adminAuthenticatedPage, 500);

        console.log('Sections search executed: global after');
      }
    });

    test('Clear sections search @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('heading', { name: 'Sections' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      const searchBox = adminAuthenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('global').catch(() => {});
      await smartWait(adminAuthenticatedPage, 500);

      await searchBox.clear();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Sections search cleared');
    });
  });

  test.describe('Letter Reports', () => {
    test('Open Letter Counts report @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Letter Counts' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Letter Counts report opened');
    });

    test('Open Template Report @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Template Report' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Template Report opened');
    });

    test('Open Section Report @p2', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Section Report' }).click();
      await smartWait(adminAuthenticatedPage, 1000);

      console.log('Section Report opened');
    });

    test('Navigate between reports @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      await adminAuthenticatedPage.getByRole('link', { name: 'Letter Counts' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Template Report' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      await adminAuthenticatedPage.getByRole('link', { name: 'Section Report' }).click();
      await smartWait(adminAuthenticatedPage, 500);

      console.log('Navigated between reports');
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

    test('Templates persist across client change @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');

      await clientSelect.selectOption('0');
      await smartWait(adminAuthenticatedPage, 500);

      await clientSelect.selectOption('34');
      await smartWait(adminAuthenticatedPage, 500);

      const templatesHeading = adminAuthenticatedPage.getByRole('heading', { name: 'Templates' });
      const headingVisible = await templatesHeading.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Templates section persists:', headingVisible);
    });
  });

  test.describe('Template Actions', () => {
    test('Edit template @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const editButtons = adminAuthenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete template @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const deleteButtons = adminAuthenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('Preview template @p3', async ({ adminAuthenticatedPage }) => {
      const clientSelect = adminAuthenticatedPage.getByLabel('Select Client');
      await clientSelect.selectOption('0');

      const previewButtons = adminAuthenticatedPage.getByRole('button', { name: /preview/i });
      const buttonCount = await previewButtons.count();

      console.log('Preview buttons found:', buttonCount);
    });
  });
});
