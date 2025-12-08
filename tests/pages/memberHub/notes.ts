import { test, expect, Locator, Page } from '@playwright/test';

export class notesPanel {
    readonly page: Page;

    readonly notesHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.notesHeader = page.locator('h3:has-text("Notes")');
    }

    async addNotes(searchTerm: string) {
        await this.notesHeader.click();
    }

    async verifyNotesData() {
        await this.page.getByRole('button', { name: 'Notes' }).click();
        await this.page.getByRole('searchbox', { name: 'Search:' }).click();
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('autosmoke');
        await expect(this.page.getByText('Showing 1 to 2 of 2 entries (')).toBeVisible();
        await expect(this.page.locator('#notesTable_info')).toContainText('Showing 1 to 2 of 2 entries (filtered from 6 total entries)');
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('task comments');
        await expect(this.page.getByText('Showing 1 to 1 of 1 entries (')).toBeVisible();
        await expect(this.page.locator('#notesTable_info')).toContainText('Showing 1 to 1 of 1 entries (filtered from 6 total entries)');
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('general note');
        await expect(this.page.getByText('Showing 1 to 2 of 2 entries (')).toBeVisible();
        await expect(this.page.locator('#notesTable_info')).toContainText('Showing 1 to 2 of 2 entries (filtered from 6 total entries)');
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('case');
        await this.page.getByRole('button', { name: 'View note message' }).click();
        await expect(this.page.locator('#txtViewNotes')).toHaveJSProperty('readOnly', true);
        await this.page.getByRole('button', { name: 'Done' }).click();
        await this.page.getByRole('button', { name: 'create note' }).click();

        //GENERAL NOTE:
        await this.page.getByText('New - General Note').click();
        await this.page.getByRole('textbox', { name: 'Notes *' }).click();
        await this.page.getByRole('textbox', { name: 'Notes *' }).fill('test');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'create note' }).click();

        //COLLABORATION NOTE:
        await this.page.getByText('New - Collaboration Note').click();
        await this.page.getByRole('radio', { name: 'Case Management' }).check();
        await this.page.locator('.input-group-addon > .fa').click();
        await this.page.getByText('Method of Contact Connect').click();
        await this.page.getByLabel('Method of Contact').selectOption('32');
        await this.page.getByLabel('Title').selectOption('18');
        await this.page.getByRole('textbox', { name: 'Name *' }).click();
        await this.page.getByRole('textbox', { name: 'Name *' }).fill('Test Tester');
        await this.page.getByRole('textbox', { name: 'Notes *' }).click();
        await this.page.getByRole('textbox', { name: 'Notes *' }).fill('testing');
        await this.page.getByRole('textbox', { name: 'Minutes Spent *' }).click();
        await this.page.getByRole('textbox', { name: 'Minutes Spent *' }).fill('1');
        await this.page.getByRole('button', { name: 'Cancel collaboration note' }).click();
        await this.page.getByRole('button', { name: 'create note' }).click();

        //SENSITIVE NOTE:
        await this.page.getByText('New - Sensitive Note').click();
        await this.page.getByRole('textbox', { name: 'Notes *' }).click();
        await this.page.getByRole('textbox', { name: 'Notes *' }).fill('tests');
        await this.page.getByRole('button', { name: 'Close sensitive note modal' }).click();
    }
}