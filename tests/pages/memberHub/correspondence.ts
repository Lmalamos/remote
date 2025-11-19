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
        //await this.page.pause();

        await this.page.getByRole('button', { name: 'Correspondence' }).click();
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByRole('combobox', { name: 'Solution Type *' }).click();
        await this.page.getByRole('combobox', { name: 'Solution Type *' }).fill('Case Management');

        // await this.page.getByRole('button', { name: 'Add Letter: Cardiac Lab' }).click();
        // await this.page.waitForTimeout(2000);
        // await this.page.getByRole('combobox', { name: 'Choose who you want to send' }).click();
        // await this.page.getByLabel('Member: Junior, Jabroni').check();
        // const page1Promise = this.page.waitForEvent('popup');
        // const downloadPromise = this.page.waitForEvent('download');
        // await this.page.getByRole('button', { name: 'Preview' }).click();
        // const page1 = await page1Promise;
        // const download = await downloadPromise;
        // await this.page.getByText('Search: Name Name All Lab').click();
        // const page2Promise = this.page.waitForEvent('popup');
        // const download1Promise = this.page.waitForEvent('download');
        // await this.page.getByRole('button', { name: 'Download' }).click();
        // const page2 = await page2Promise;
        // const download1 = await download1Promise;
        
        await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
}