import { test, expect, Locator, Page } from '@playwright/test';

export class correspondencePanel {
    readonly page: Page;

    readonly correspondenceHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.correspondenceHeader = page.locator('h3:has-text("Correspondence")');
    }

    async addCorrespondence(searchTerm: string) {
        await this.correspondenceHeader.click();
    }

    async verifyCorrespondenceData() {
    }
}