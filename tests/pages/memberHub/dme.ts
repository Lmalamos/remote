import { test, expect, Locator, Page } from '@playwright/test';

export class dmePanel {
    readonly page: Page;

    readonly dmeHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dmeHeader = page.locator('h3:has-text("Durable Medical Equipment")');
    }

    async addDME(searchTerm: string) {
        await this.dmeHeader.click();
    }

    async verifyDMEData() {
    }
}