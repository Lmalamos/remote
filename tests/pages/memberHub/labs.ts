import { test, expect, Locator, Page } from '@playwright/test';

export class labsPanel {
    readonly page: Page;

    readonly labsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.labsHeader = page.locator('h3:has-text("Labs")');
    }

    async addLabs(searchTerm: string) {
        await this.labsHeader.click();
    }

    async verifyLabs() {
    }
}