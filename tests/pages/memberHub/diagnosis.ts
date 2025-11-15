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
        await this.page.getByRole('button', { name: 'Diagnosis' }).click();
        await this.page.getByRole('button', { name: 'Add Diagnosis' }).click();
        await this.page.getByLabel('Section').selectOption('Chapter 10. Diseases of the Respiratory System (J00-J99)');
        await this.page.getByLabel('Category', { exact: true }).selectOption('Other acute lower respiratory infections (J20-J22)');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();

        //await this.page.getByRole('radio', { name: 'Choose J20 diagnosis' }).check();
        await this.page.getByRole('radio', { name: 'Diagnosis code J20', exact: true }).check();

        await this.page.getByTitle('Open Calender').click();
        await this.page.getByRole('link', { name: 'Search For Provider' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await this.page.getByRole('textbox', { name: 'Zip Code' }).click();
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill('50010');
        await this.page.getByLabel('Search', { exact: true }).click();
        await this.page.getByRole('button', { name: 'Close modal' }).click();
        await this.page.getByLabel('Main content area').getByText('Cancel').click();
        await this.page.getByRole('button', { name: 'Add Diagnosis' }).click();
        await this.page.getByRole('radio', { name: 'Please Select One of These Options Search By Code' }).check();
        await this.page.getByRole('textbox', { name: 'Enter Full ICD Code' }).click();
        await this.page.getByRole('textbox', { name: 'Enter Full ICD Code' }).fill('Y00');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();

        //await this.page.getByRole('radio', { name: 'Choose Y00 diagnosis' }).check();
        //await this.page.getByRole('radio', { name: 'Choose Y00 diagnosis', exact: true }).check();
        await this.page.locator('input[type="radio"][value="296428"]').check();

        await this.page.getByTitle('Open Calender').click();
        await this.page.getByLabel('Main content area').getByText('Cancel').click();
        await this.page.getByRole('button', { name: 'Add Diagnosis' }).click();
        await this.page.getByRole('radio', { name: 'Please Select One of These Options Search By Code' }).check();
        await this.page.getByRole('textbox', { name: 'Enter Full ICD Code' }).click();
        await this.page.getByRole('textbox', { name: 'Enter Full ICD Code' }).fill('r51');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();

        //await this.page.getByRole('radio', { name: 'Choose R51 diagnosis', exact: true }).check();
        //await this.page.getByRole('radio', { name: 'Choose R51 diagnosis', exact: true }).check();
        await this.page.locator('input[type="radio"][value="234696"]').check();

        await this.page.getByText('Submit', { exact: true }).click();
        await expect(this.page.getByText('There was an error, please')).toBeVisible();
        await expect(this.page.locator('#diagnosisMessages')).toContainText('There was an error, please review the fields below and try again.');
        await expect(this.page.getByText('Error saving your information.')).toBeVisible();
        await expect(this.page.getByRole('strong')).toContainText('Error saving your information.');
        await expect(this.page.getByText('Identification Date is a')).toBeVisible();
        await expect(this.page.locator('#divDiagnosisIdentificationDate')).toContainText('Identification Date is a required field');
        await this.page.getByLabel('Main content area').getByText('Cancel').click();
    }
}