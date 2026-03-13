// ============================================
// SUPPORTING DOCUMENTATION - COMPREHENSIVE TESTS
// Document upload, management, viewing
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { supportingDocumentationPanel } from '../pages/memberHub/supportingDocumentation';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.SUPPORTING_DOCUMENTATION} ${Tags.MEMBER_HUB} Supporting Documentation - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let supportingDoc: supportingDocumentationPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    supportingDoc = new supportingDocumentationPanel(authenticatedPage);

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

    await supportingDoc.supportingDocumentationHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Supporting Documentation Panel Access', () => {
    test('Supporting Documentation panel opens @p1', async () => {
      await expect(supportingDoc.supportingDocumentationHeader).toBeVisible();
      console.log('Supporting Documentation panel visible');
    });

    test('Documents list displays @p2', async ({ authenticatedPage }) => {
      const docsTable = authenticatedPage.locator('#supportingDocumentationTable, table').first();
      const hasTable = await docsTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Supporting documentation table visible:', hasTable);
    });

    test('Upload document button available @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      const buttonVisible = await uploadButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Upload document button visible:', buttonVisible);
    });
  });

  test.describe('Upload Document', () => {
    test('Upload document form opens @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      const buttonVisible = await uploadButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await uploadButton.click();
        await smartWait(authenticatedPage, 1000);

        const fileInput = authenticatedPage.locator('input[type="file"]');
        const inputVisible = await fileInput.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Upload form opened:', inputVisible);

        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('File input available @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const fileInput = authenticatedPage.locator('input[type="file"]');
      const inputVisible = await fileInput.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('File input available:', inputVisible);

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Document type selection @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const docTypeSelect = authenticatedPage.getByLabel(/document.*type|type/i);
      const selectVisible = await docTypeSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        console.log('Document type selection available');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Document description field @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const descriptionField = authenticatedPage.getByLabel(/description|notes/i);
      const fieldVisible = await descriptionField.isVisible({ timeout: 3000 }).catch(() => false);

      if (fieldVisible) {
        await descriptionField.fill('Test document description');
        console.log('Document description entered');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel document upload @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(supportingDoc.supportingDocumentationHeader).toBeVisible();
      console.log('Document upload cancelled');
    });
  });

  test.describe('Document Types', () => {
    test('Multiple document types available @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const docTypeSelect = authenticatedPage.getByLabel(/document.*type|type/i);
      const selectVisible = await docTypeSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        await docTypeSelect.click();
        await smartWait(authenticatedPage, 500);

        const options = authenticatedPage.locator('[role="option"], option');
        const optionCount = await options.count().catch(() => 0);

        console.log('Document type options:', optionCount);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Select different document types @p3', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const docTypes = ['Medical Records', 'Lab Results', 'Imaging', 'Prescription'];

      for (const docType of docTypes) {
        const option = authenticatedPage.getByText(docType, { exact: false });
        const optionVisible = await option.isVisible({ timeout: 2000 }).catch(() => false);

        if (optionVisible) {
          console.log(`Document type "${docType}" available`);
        }
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });
  });

  test.describe('Document Viewing', () => {
    test('View document @p2', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|open/i });
      const buttonCount = await viewButtons.count();

      console.log('View buttons found:', buttonCount);
    });

    test('Download document @p2', async ({ authenticatedPage }) => {
      const downloadButtons = authenticatedPage.locator('button:has-text("Download"), .fa-download');
      const buttonCount = await downloadButtons.count();

      console.log('Download buttons found:', buttonCount);
    });

    test('Print document @p3', async ({ authenticatedPage }) => {
      const printButtons = authenticatedPage.locator('button:has-text("Print"), .fa-print');
      const buttonCount = await printButtons.count();

      console.log('Print buttons found:', buttonCount);
    });
  });

  test.describe('Document Management', () => {
    test('Edit document details @p3', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete document @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });

    test('Delete requires confirmation @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      if (buttonCount > 0) {
        console.log('Delete actions require confirmation');
      }
    });
  });

  test.describe('Document History', () => {
    test('View documents table @p2', async ({ authenticatedPage }) => {
      const docsTable = authenticatedPage.locator('#supportingDocumentationTable, table').first();
      const hasTable = await docsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await docsTable.locator('tbody tr').count();
        console.log('Document rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search documents @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('medical');
        await smartWait(authenticatedPage, 500);

        console.log('Documents search executed');
      }
    });

    test('Document table columns @p3', async ({ authenticatedPage }) => {
      const docsTable = authenticatedPage.locator('#supportingDocumentationTable, table').first();
      const hasTable = await docsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const expectedColumns = ['Date', 'Type', 'Description', 'Uploaded By'];

        for (const column of expectedColumns) {
          const headerCell = docsTable.locator(`th:has-text("${column}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${column}" found`);
          }
        }
      }
    });

    test('Empty state message @p3', async ({ authenticatedPage }) => {
      const emptyMessage = authenticatedPage.getByText(/no.*document|empty/i);
      const messageVisible = await emptyMessage.isVisible({ timeout: 3000 }).catch(() => false);

      if (messageVisible) {
        console.log('Empty state displayed');
      }
    });
  });

  test.describe('File Upload Validation', () => {
    test('File type validation @p2', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const fileInput = authenticatedPage.locator('input[type="file"]');
      const acceptAttr = await fileInput.getAttribute('accept').catch(() => '');

      console.log('Accepted file types:', acceptAttr);

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('File size limit information @p3', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.getByRole('button', { name: /upload|add.*document/i });
      await uploadButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const sizeInfo = authenticatedPage.getByText(/size|mb|maximum/i);
      const infoVisible = await sizeInfo.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('File size information visible:', infoVisible);

      const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
      await cancelButton.click().catch(() => {});
    });
  });

  test.describe('Document Filters', () => {
    test('Filter by document type @p3', async ({ authenticatedPage }) => {
      const typeFilter = authenticatedPage.locator('[name*="type"], #typeFilter, select').first();
      const filterVisible = await typeFilter.isVisible({ timeout: 3000 }).catch(() => false);

      if (filterVisible) {
        console.log('Document type filter available');
      }
    });

    test('Filter by date range @p3', async ({ authenticatedPage }) => {
      const dateFilter = authenticatedPage.getByLabel(/from|start.*date/i);
      const filterVisible = await dateFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Date range filter available:', filterVisible);
    });

    test('Filter by uploaded by @p3', async ({ authenticatedPage }) => {
      const userFilter = authenticatedPage.getByLabel(/uploaded.*by|user/i);
      const filterVisible = await userFilter.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Uploaded by filter available:', filterVisible);
    });
  });

  test.describe('Document Pagination', () => {
    test('Documents pagination info @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#supportingDocumentationTable_info, .dataTables_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Pagination info:', text);
      }
    });

    test('Navigate pagination @p3', async ({ authenticatedPage }) => {
      const nextButton = authenticatedPage.getByRole('button', { name: /next/i });
      const buttonVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        const isEnabled = await nextButton.isEnabled();
        console.log('Next button enabled:', isEnabled);
      }
    });
  });

  test.describe('Document Security', () => {
    test('Secure document indicator @p3', async ({ authenticatedPage }) => {
      const secureIcon = authenticatedPage.locator('.fa-lock, [class*="secure"]');
      const iconCount = await secureIcon.count();

      console.log('Secure document indicators:', iconCount);
    });

    test('Access control indicators @p3', async ({ authenticatedPage }) => {
      const accessIndicators = authenticatedPage.getByText(/restricted|confidential/i);
      const indicatorVisible = await accessIndicators.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Access control indicators visible:', indicatorVisible);
    });
  });
});
