import { test, expect, Locator, Page } from '@playwright/test';

export class navigationPage {
    readonly page: Page;

    readonly dashboardLink: Locator;
    readonly searchButton: Locator;
    readonly memberSearchLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dashboardLink = page.locator('text=Dashboard');
        this.searchButton = page.locator('a[role="button"]:has-text("Search")');
        this.memberSearchLink = page.locator('text=Member Search');
    }

    async goToDashboard() {
        await this.page.locator('text=Dashboard').click();
    }

    async openSearchMenu() {
        await this.page.locator('a[role="button"]:has-text("Search")').click();
    }

    async openMemberSearch() {
        await this.page.locator('text=Member Search').click();
    }

    async openProviderSearch() {
        await this.page.locator('text=Provider Search').click();
    }

    async openCaseSearch() {
        await this.page.locator('text=Case Search').click();
    }
}