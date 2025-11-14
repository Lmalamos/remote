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

    async verifyNotes() {
    }
}