import { test, expect, Locator, Page } from '@playwright/test';

export class diagnosisPanel {
    readonly page: Page;

    readonly diagnosisHeader: Locator;
    //readonly immunizationsAddButton: Locator;
    //readonly immunizationsSearchInput: Locator;
    //readonly immunizationsSearchByTermButton: Locator;
    //readonly immunizationsCancelSearchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.diagnosisHeader = page.locator('h3:has-text("Diagnosis")');
        //this.immunizationsAddButton = page.locator('#addImmunizationsBtn'); //page.locator('text=Immunizations Add Show All >> a[role="button"]');
        //this.immunizationsSearchInput = page.locator('[placeholder="Enter\\ Search\\ Term"]');
        //this.immunizationsSearchByTermButton = page.locator('#immunizationSearchByTermButton');
        //this.immunizationsCancelSearchButton = page.locator('text=Cancel');
    }

    async addDiagnosis(searchTerm: string) {
        await this.diagnosisHeader.click();
        //await this.immunizationsAddButton.click();
        //await this.immunizationsSearchInput.click();
        //await this.immunizationsSearchInput.fill(searchTerm);
        //await this.immunizationsSearchByTermButton.click();
        //await this.immunizationsCancelSearchButton.click();
    }

    async verifyDiagnosisData() {
        // await expect(this.page.getByRole('button', { name: '252417001' })).toBeVisible();
        // await expect(this.page.getByRole('cell', { name: '252417001' })).toBeVisible();
        // await expect(this.page.locator('#immunizationsTable')).toContainText('252417001');
    }
}