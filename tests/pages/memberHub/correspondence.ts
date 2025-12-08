import { test, expect, Locator, Page } from '@playwright/test';

export class correspondencePanel {
    readonly page: Page;

    readonly correspondenceHeader: Locator;
    readonly addButton: Locator;
    readonly solutionType: Locator;
    readonly addLetter: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.correspondenceHeader = page.locator('h3:has-text("Correspondence")');
        this.addButton = page.locator('#addCorrespondenceBtn');
        this.solutionType = page.locator('#sltSolutionType');
        this.addLetter = page.locator('#addLetter');
        this.cancelButton = page.locator('#correspondenceCancelBtn');
    }

    async addCorrespondence(searchTerm: string) {
        await this.correspondenceHeader.click();
    }

    async verifyCorrespondenceData() {
        await this.page.getByRole('button', { name: 'Correspondence' }).click();
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
}