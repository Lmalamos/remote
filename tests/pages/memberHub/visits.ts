import { test, expect, Locator, Page } from '@playwright/test';

export class visitsPanel {
    readonly page: Page;

    readonly visitsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.visitsHeader = page.locator('h3:has-text("Visits")');
    }

    async addVisits(searchTerm: string) {
        await this.visitsHeader.click();
    }

    async verifyVisits() {
    }
}