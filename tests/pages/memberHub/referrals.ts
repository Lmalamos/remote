import { test, expect, Locator, Page } from '@playwright/test';

export class referralsPanel {
    readonly page: Page;

    readonly referralsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.referralsHeader = page.locator('h3:has-text("Referrals")');
    }

    async addPReferrals(searchTerm: string) {
        await this.referralsHeader.click();
    }

    async verifyReferrals() {
    }
}