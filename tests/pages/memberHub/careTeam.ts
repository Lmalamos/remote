import { test, expect, Locator, Page } from '@playwright/test';

export class careTeamPanel {
    readonly page: Page;

    readonly careTeamHeader: Locator;
    //readonly immunizationsAddButton: Locator;
    //readonly immunizationsSearchInput: Locator;
    //readonly immunizationsSearchByTermButton: Locator;
    //readonly immunizationsCancelSearchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.careTeamHeader = page.locator('h3:has-text("Care Team")');
        //this.immunizationsAddButton = page.locator('#addImmunizationsBtn'); //page.locator('text=Immunizations Add Show All >> a[role="button"]');
        //this.immunizationsSearchInput = page.locator('[placeholder="Enter\\ Search\\ Term"]');
        //this.immunizationsSearchByTermButton = page.locator('#immunizationSearchByTermButton');
        //this.immunizationsCancelSearchButton = page.locator('text=Cancel');
    }

    async addCareTeam(searchTerm: string) {
        await this.careTeamHeader.click();
        //await this.immunizationsAddButton.click();
        //await this.immunizationsSearchInput.click();
        //await this.immunizationsSearchInput.fill(searchTerm);
        //await this.immunizationsSearchByTermButton.click();
        //await this.immunizationsCancelSearchButton.click();
    }

    async verifyCareTeamData() {
        // await expect(this.page.getByRole('button', { name: '252417001' })).toBeVisible();
        // await expect(this.page.getByRole('cell', { name: '252417001' })).toBeVisible();
        // await expect(this.page.locator('#immunizationsTable')).toContainText('252417001');
    }
}