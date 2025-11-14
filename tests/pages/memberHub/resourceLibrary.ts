import { test, expect, Locator, Page } from '@playwright/test';

export class resourceLibraryPanel {
    readonly page: Page;

    readonly resourceLibraryHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.resourceLibraryHeader = page.locator('h3:has-text("Resource Library")');
    }

    async addPResourceLibrary(searchTerm: string) {
        await this.resourceLibraryHeader.click();
    }

    async verifyResourceLibrary() {
    }
}