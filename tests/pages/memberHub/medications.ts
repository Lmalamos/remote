import { test, expect, Locator, Page } from '@playwright/test';

export class medicationsPanel {
    readonly page: Page;

    readonly medicationsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.medicationsHeader = page.locator('h3:has-text("Medications")');
    }

    async addMedications(searchTerm: string) {
        await this.medicationsHeader.click();
    }

    async verifyMedications() {
    }
}