import { test, expect, Locator, Page } from '@playwright/test';

export class supportingDocumentationPanel {
    readonly page: Page;

    readonly supportingDocumentationHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.supportingDocumentationHeader = page.locator('h3:has-text("Supporting Documentation")');
    }

    async addSupportingDocumentation(searchTerm: string) {
        await this.supportingDocumentationHeader.click();
    }

    async verifySupportingDocumentation() {
    }
}