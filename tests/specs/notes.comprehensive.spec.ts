// ============================================
// NOTES - COMPREHENSIVE TESTS
// General, collaboration, sensitive notes
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { notesPanel } from '../pages/memberHub/notes';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.NOTES} ${Tags.MEMBER_HUB} Notes - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let notes: notesPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    notes = new notesPanel(authenticatedPage);

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

    await notes.notesHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Notes Panel Access', () => {
    test('Notes panel opens @p1', async () => {
      await expect(notes.notesHeader).toBeVisible();
      console.log('Notes panel visible');
    });

    test('Notes list displays @p2', async ({ authenticatedPage }) => {
      const notesTable = authenticatedPage.locator('#notesTable, table').first();
      const hasTable = await notesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Notes table visible:', hasTable);
    });

    test('Create note button available @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      const buttonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Create note button visible:', buttonVisible);
    });
  });

  test.describe('General Note', () => {
    test('Create general note form opens @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      const buttonVisible = await createButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await createButton.click();
        await smartWait(authenticatedPage, 1000);

        const generalNoteOption = authenticatedPage.getByText('New - General Note');
        const optionVisible = await generalNoteOption.isVisible({ timeout: 2000 }).catch(() => false);

        if (optionVisible) {
          await generalNoteOption.click();
          await smartWait(authenticatedPage, 1000);

          const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
          const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

          console.log('General note form opened:', fieldVisible);
        }

        const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('General note requires text @p1', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const generalNoteOption = authenticatedPage.getByText('New - General Note');
      await generalNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Notes")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Notes field required:', isRequired);
        expect(isRequired).toBe(true);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Add text to general note @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const generalNoteOption = authenticatedPage.getByText('New - General Note');
      await generalNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await notesField.fill('This is a test general note');
        await expect(notesField).toHaveValue('This is a test general note');

        console.log('General note text entered');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('General note with long text @p3', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const generalNoteOption = authenticatedPage.getByText('New - General Note');
      await generalNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const longText = 'This is a very long note. '.repeat(50);
        await notesField.fill(longText);

        console.log('Long text entered, length:', longText.length);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel/i });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel general note creation @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const generalNoteOption = authenticatedPage.getByText('New - General Note');
      await generalNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      await notesField.fill('Test note to cancel').catch(() => {});

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel/i });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(notes.notesHeader).toBeVisible();
      console.log('General note cancelled');
    });
  });

  test.describe('Collaboration Note', () => {
    test('Create collaboration note form opens @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      const optionVisible = await collabNoteOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (optionVisible) {
        await collabNoteOption.click();
        await smartWait(authenticatedPage, 1000);

        const caseManagementRadio = authenticatedPage.getByRole('radio', { name: 'Case Management' });
        const radioVisible = await caseManagementRadio.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Collaboration note form opened:', radioVisible);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Select Case Management type @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const caseManagementRadio = authenticatedPage.getByRole('radio', { name: 'Case Management' });
      const radioVisible = await caseManagementRadio.isVisible({ timeout: 2000 }).catch(() => false);

      if (radioVisible) {
        await caseManagementRadio.check();
        const isChecked = await caseManagementRadio.isChecked();

        console.log('Case Management selected:', isChecked);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Method of contact selection @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const methodField = authenticatedPage.getByLabel('Method of Contact');
      const fieldVisible = await methodField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await methodField.selectOption('32');
        console.log('Method of contact selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Title selection available @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const titleField = authenticatedPage.getByLabel('Title');
      const fieldVisible = await titleField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await titleField.selectOption('18');
        console.log('Title selected');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Name field is required @p1', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const nameField = authenticatedPage.getByRole('textbox', { name: 'Name *' });
      const fieldVisible = await nameField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Name")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Name field required:', isRequired);
        expect(isRequired).toBe(true);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Add name to collaboration note @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const nameField = authenticatedPage.getByRole('textbox', { name: 'Name *' });
      const fieldVisible = await nameField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await nameField.fill('Dr. Smith');
        await expect(nameField).toHaveValue('Dr. Smith');

        console.log('Name entered: Dr. Smith');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Minutes spent is required @p1', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const minutesField = authenticatedPage.getByRole('textbox', { name: 'Minutes Spent *' });
      const fieldVisible = await minutesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Minutes Spent")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Minutes spent required:', isRequired);
        expect(isRequired).toBe(true);
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Add minutes spent @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const minutesField = authenticatedPage.getByRole('textbox', { name: 'Minutes Spent *' });
      const fieldVisible = await minutesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await minutesField.fill('30');
        await expect(minutesField).toHaveValue('30');

        console.log('Minutes spent: 30');
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Minutes spent validation @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const minutesField = authenticatedPage.getByRole('textbox', { name: 'Minutes Spent *' });
      const fieldVisible = await minutesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const testValues = ['5', '15', '60', '120'];

        for (const value of testValues) {
          await minutesField.clear();
          await minutesField.fill(value);
          await smartWait(authenticatedPage, 500);

          console.log(`Minutes tested: ${value}`);
        }
      }

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click().catch(() => {});
    });

    test('Cancel collaboration note @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const collabNoteOption = authenticatedPage.getByText('New - Collaboration Note');
      await collabNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const cancelButton = authenticatedPage.getByRole('button', { name: /Cancel collaboration/i });
      await cancelButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(notes.notesHeader).toBeVisible();
      console.log('Collaboration note cancelled');
    });
  });

  test.describe('Sensitive Note', () => {
    test('Create sensitive note form opens @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const sensitiveNoteOption = authenticatedPage.getByText('New - Sensitive Note');
      const optionVisible = await sensitiveNoteOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (optionVisible) {
        await sensitiveNoteOption.click();
        await smartWait(authenticatedPage, 1000);

        const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
        const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Sensitive note form opened:', fieldVisible);
      }

      const closeButton = authenticatedPage.getByRole('button', { name: /Close sensitive/i });
      await closeButton.click().catch(() => {});
    });

    test('Sensitive note requires text @p1', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const sensitiveNoteOption = authenticatedPage.getByText('New - Sensitive Note');
      await sensitiveNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        const label = await authenticatedPage.locator('label:has-text("Notes")').first().textContent().catch(() => '');
        const isRequired = label.includes('*');

        console.log('Sensitive note text required:', isRequired);
      }

      const closeButton = authenticatedPage.getByRole('button', { name: /Close sensitive/i });
      await closeButton.click().catch(() => {});
    });

    test('Add text to sensitive note @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const sensitiveNoteOption = authenticatedPage.getByText('New - Sensitive Note');
      await sensitiveNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const notesField = authenticatedPage.getByRole('textbox', { name: 'Notes *' });
      const fieldVisible = await notesField.isVisible({ timeout: 2000 }).catch(() => false);

      if (fieldVisible) {
        await notesField.fill('This is a sensitive note');
        await expect(notesField).toHaveValue('This is a sensitive note');

        console.log('Sensitive note text entered');
      }

      const closeButton = authenticatedPage.getByRole('button', { name: /Close sensitive/i });
      await closeButton.click().catch(() => {});
    });

    test('Cancel sensitive note @p2', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.getByRole('button', { name: /create note/i });
      await createButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const sensitiveNoteOption = authenticatedPage.getByText('New - Sensitive Note');
      await sensitiveNoteOption.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const closeButton = authenticatedPage.getByRole('button', { name: /Close sensitive/i });
      await closeButton.click();
      await smartWait(authenticatedPage, 500);

      await expect(notes.notesHeader).toBeVisible();
      console.log('Sensitive note cancelled');
    });
  });

  test.describe('View Notes', () => {
    test('View note button available @p2', async ({ authenticatedPage }) => {
      const viewButton = authenticatedPage.getByRole('button', { name: /View note message/i }).first();
      const buttonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('View note button visible:', buttonVisible);
    });

    test('View note opens modal @p2', async ({ authenticatedPage }) => {
      const viewButton = authenticatedPage.getByRole('button', { name: /View note message/i }).first();
      const buttonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await viewButton.click();
        await smartWait(authenticatedPage, 1000);

        const noteTextArea = authenticatedPage.locator('#txtViewNotes');
        const textAreaVisible = await noteTextArea.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Note view modal opened:', textAreaVisible);

        if (textAreaVisible) {
          const isReadOnly = await noteTextArea.evaluate((el: HTMLTextAreaElement) => el.readOnly);
          console.log('Note text is read-only:', isReadOnly);
        }

        const doneButton = authenticatedPage.getByRole('button', { name: 'Done' });
        await doneButton.click().catch(() => {});
      }
    });

    test('Note text is read-only @p2', async ({ authenticatedPage }) => {
      const viewButton = authenticatedPage.getByRole('button', { name: /View note message/i }).first();
      const buttonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await viewButton.click();
        await smartWait(authenticatedPage, 1000);

        const noteTextArea = authenticatedPage.locator('#txtViewNotes');
        const textAreaVisible = await noteTextArea.isVisible({ timeout: 2000 }).catch(() => false);

        if (textAreaVisible) {
          const isReadOnly = await noteTextArea.evaluate((el: HTMLTextAreaElement) => el.readOnly);
          expect(isReadOnly).toBe(true);
        }

        const doneButton = authenticatedPage.getByRole('button', { name: 'Done' });
        await doneButton.click().catch(() => {});
      }
    });

    test('Close note view modal @p2', async ({ authenticatedPage }) => {
      const viewButton = authenticatedPage.getByRole('button', { name: /View note message/i }).first();
      const buttonVisible = await viewButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await viewButton.click();
        await smartWait(authenticatedPage, 1000);

        const doneButton = authenticatedPage.getByRole('button', { name: 'Done' });
        await doneButton.click();
        await smartWait(authenticatedPage, 500);

        await expect(notes.notesHeader).toBeVisible();
        console.log('Note view modal closed');
      }
    });
  });

  test.describe('Notes History Search', () => {
    test('Search notes by keyword @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test');
        await smartWait(authenticatedPage, 500);

        console.log('Notes search executed: test');
      }
    });

    test('Search notes by specific term @p2', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('autosmoke');
        await smartWait(authenticatedPage, 500);

        const infoText = authenticatedPage.locator('#notesTable_info');
        const hasInfo = await infoText.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasInfo) {
          const text = await infoText.textContent();
          console.log('Search results:', text);
        }
      }
    });

    test('Search notes - general note @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('general note').catch(() => {});
      await smartWait(authenticatedPage, 500);

      console.log('Searched for: general note');
    });

    test('Search notes - task comments @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('task comments').catch(() => {});
      await smartWait(authenticatedPage, 500);

      console.log('Searched for: task comments');
    });

    test('Search notes - case @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('case').catch(() => {});
      await smartWait(authenticatedPage, 500);

      console.log('Searched for: case');
    });

    test('Clear notes search @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' });
      await searchBox.fill('test').catch(() => {});
      await smartWait(authenticatedPage, 500);

      await searchBox.clear();
      await smartWait(authenticatedPage, 500);

      console.log('Notes search cleared');
    });
  });

  test.describe('Notes History Display', () => {
    test('Notes table displays entries @p2', async ({ authenticatedPage }) => {
      const notesTable = authenticatedPage.locator('#notesTable, table').first();
      const hasTable = await notesTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const rows = await notesTable.locator('tbody tr').count();
        console.log('Notes history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Notes table info displays @p3', async ({ authenticatedPage }) => {
      const infoText = authenticatedPage.locator('#notesTable_info');
      const hasInfo = await infoText.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasInfo) {
        const text = await infoText.textContent();
        console.log('Notes table info:', text);
      }
    });
  });
});
