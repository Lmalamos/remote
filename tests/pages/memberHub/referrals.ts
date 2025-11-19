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

    async verifyReferralsData() {
        await this.page.getByRole('button', { name: 'Referrals' }).click();
        await expect(this.page.getByText('No data available in table')).toBeVisible();
        await expect(this.page.getByRole('alert')).toContainText('No data available in table');
        await this.page.getByRole('button', { name: 'Add ' }).click();
        await this.page.getByText('New - Behavioral Health').click();
        await this.page.getByRole('textbox', { name: 'Comments *' }).click();
        await this.page.getByRole('textbox', { name: 'Comments *' }).fill('test');
        await this.page.getByText('Referral Specialist', { exact: true }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Add ' }).click();
        await this.page.getByText('New - Resource Referral').click();
        await this.page.getByRole('textbox', { name: 'Comments *' }).click();
        await this.page.getByRole('textbox', { name: 'Comments *' }).fill('tests');
        
        await this.page.locator('#referralFormRTOption11').check();
        await this.page.getByRole('combobox', { name: 'None selected' }).click();
        await this.page.getByLabel('Clothing').check();
        await this.page.getByLabel('Eye Exams & Glasses').check();
        await this.page.getByLabel('Food').check();

        //await this.page.locator('div:nth-child(10)').first().click();
        await this.page.locator('.multiselect-selected-text').click();

        //await this.page.getByRole('button', { name: 'Cancel' }).click({ delay: 1000 });
        //await this.page.getByRole('button', { name: 'Collapse this block' }).click();
        //await this.page.getByLabel('Cancel', { exact: true }).click({ force: true });

        await this.page.getByRole('button', { name: 'Referrals' }).click();
    }
}