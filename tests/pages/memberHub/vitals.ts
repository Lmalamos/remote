import { test, expect, Locator, Page } from '@playwright/test';

export class vitalsPanel {
    readonly page: Page;

    readonly vitalsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.vitalsHeader = page.locator('h3:has-text("Vitals")');
    }

    async addVisits(searchTerm: string) {
        await this.vitalsHeader.click();
    }

    async verifyVitals() {
    }
}