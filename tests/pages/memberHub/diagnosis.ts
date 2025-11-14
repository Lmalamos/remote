import { test, expect, Locator, Page } from '@playwright/test';

export class diagnosisPanel {
    readonly page: Page;

    readonly diagnosisHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.diagnosisHeader = page.locator('h3:has-text("Diagnosis")');
    }

    async addDiagnosis(searchTerm: string) {
        await this.diagnosisHeader.click();
    }

    async verifyDiagnosisData() {
    }
}