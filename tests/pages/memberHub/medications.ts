import { expect, Locator, Page } from '@playwright/test';

export class medicationsPanel {
    readonly page: Page;

    readonly medicationsHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.medicationsHeader = page.locator('h3:has-text("Medications")');
    }

    async addMedications(searchTerm: string) {
        await this.medicationsHeader.click();
    }

    async verifyMedicationsData() {
        await this.page.getByRole('button', { name: 'Medications' }).click();
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.locator('#medRxTerm').fill('Tylenol');
        await this.page.getByRole('option', { name: 'TYLENOL (Oral Pill)' }).click();
        await this.page.locator('#medRxStrength').fill('325 mg Cap');
        await this.page.getByText('mg Cap').click();
        await this.page.locator('#medQuantity').fill('1');
        await this.page.locator('#medFrequencyTypeahead').fill('Every three hours');
        await this.page.getByRole('link', { name: 'Search For Provider' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill('Ames');
        await expect(this.page.getByRole('textbox', { name: 'City' })).toHaveValue('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await expect(this.page.getByLabel('State')).toHaveValue('IA');
        await this.page.getByRole('textbox', { name: 'Zip Code' }).click();
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill('50014');
        await expect(this.page.getByRole('textbox', { name: 'Zip Code' })).toHaveValue('50014');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
        await this.page.getByText('OFF', { exact: true }).click();
        await this.page.keyboard.press('Escape');
        await this.page.getByTitle('Open Calendar').first().click();
        await expect(this.page.getByTitle('Open Calendar').first()).toBeDefined();
        await this.page.getByTitle('Open Calendar').nth(1).click();
        await expect(this.page.getByTitle('Open Calendar').nth(1)).toBeDefined();
        await this.page.locator('#medDivInputConsumptionEndDate').getByTitle('Open Calendar').click();
        await expect(this.page.locator('#medDivInputConsumptionEndDate')).toBeDefined();
        await this.page.getByRole('checkbox', { name: 'Understands Medication' }).check();
        await this.page.getByRole('checkbox', { name: 'Prescribed Medication' }).check();
        await this.page.getByRole('checkbox', { name: 'Currently Taking' }).check();
        await this.page.getByRole('checkbox', { name: 'Compliance with Treatment' }).check();
        await expect(this.page.getByRole('checkbox', { name: 'Understands Medication' })).toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Prescribed Medication' })).toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Currently Taking' })).toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Compliance with Treatment' })).toBeChecked();
        await this.page.getByRole('textbox', { name: 'Notes', exact: true }).click();
        await this.page.getByRole('textbox', { name: 'Notes', exact: true }).fill('test');
        await expect(this.page.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue('test');
        await this.page.getByRole('textbox', { name: 'Member Notes' }).click();
        await this.page.getByRole('textbox', { name: 'Member Notes' }).fill('tests');
        await expect(this.page.getByRole('textbox', { name: 'Member Notes' })).toHaveValue('tests');
        await this.page.getByRole('checkbox', { name: 'Understands Medication' }).uncheck();
        await this.page.getByRole('checkbox', { name: 'Prescribed Medication' }).uncheck();
        await this.page.getByRole('checkbox', { name: 'Currently Taking' }).uncheck();
        await this.page.getByRole('checkbox', { name: 'Compliance with Treatment' }).uncheck();
        await expect(this.page.getByRole('checkbox', { name: 'Understands Medication' })).not.toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Prescribed Medication' })).not.toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Currently Taking' })).not.toBeChecked();
        await expect(this.page.getByRole('checkbox', { name: 'Compliance with Treatment' })).not.toBeChecked();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
}