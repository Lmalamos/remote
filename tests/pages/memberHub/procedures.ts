import { test, expect, Locator, Page } from '@playwright/test';

export class proceduresPanel {
    readonly page: Page;

    readonly proceduresHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.proceduresHeader = page.locator('h3:has-text("Procedures")');
    }

    async addProcedures(searchTerm: string) {
        await this.proceduresHeader.click();
    }

    async verifyProcedures() {
    }
}