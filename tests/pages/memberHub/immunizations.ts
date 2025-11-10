import { test, expect, Locator, Page } from '@playwright/test';

export class immunizationPanel {
    readonly page: Page;

    readonly immunizationsHeader: Locator;
    readonly immunizationsAddButton: Locator;
    readonly immunizationsSearchInput: Locator;
    readonly immunizationsSearchByTermButton: Locator;
    readonly immunizationsCancelSearchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.immunizationsHeader = page.locator('h3:has-text("Immunizations")');
        this.immunizationsAddButton = page.locator('#addImmunizationsBtn'); //page.locator('text=Immunizations Add Show All >> a[role="button"]');
        this.immunizationsSearchInput = page.locator('[placeholder="Enter\\ Search\\ Term"]');
        this.immunizationsSearchByTermButton = page.locator('#immunizationSearchByTermButton');
        this.immunizationsCancelSearchButton = page.locator('text=Cancel');
    }

    async addImmunization(searchTerm: string) {
        await this.immunizationsHeader.click();
        await this.immunizationsAddButton.click();
        await this.immunizationsSearchInput.click();
        await this.immunizationsSearchInput.fill(searchTerm);
        await this.immunizationsSearchByTermButton.click();
        await this.immunizationsCancelSearchButton.click();
    }

    async verifyImmunization() {
        await expect(this.page.getByRole('button', { name: '252417001' })).toBeVisible();
        await expect(this.page.getByRole('cell', { name: '252417001' })).toBeVisible();
        await expect(this.page.locator('#immunizationsTable')).toContainText('252417001');
    }
}