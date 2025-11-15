import { expect, Locator, Page } from '@playwright/test';

export class dmePanel {
    readonly page: Page;

    readonly header: Locator;
    readonly addButton: Locator;
    readonly sectionComboBox: Locator;
    readonly categoryComboBox: Locator;
    readonly searchButton: Locator;
    readonly searchByTerm: Locator;
    readonly searchByCode: Locator;
    readonly searchByTermRadioButton: Locator;
    readonly modifier: Locator;
    readonly units: Locator;
    readonly frequency: Locator;
    readonly frequencyQualifier: Locator;
    readonly unitsQualifier: Locator;
    readonly totalPurchaseCost: Locator;
    readonly searchResult: Locator;
    readonly hcpcsLevel2CodeSearch: Locator;
    readonly searchByCodeRadioButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.header = page.locator('h3:has-text("Durable Medical Equipment")');
        this.addButton = page.getByRole('button', { name: 'Add DME' });
        this.sectionComboBox = page.getByRole('combobox', { name: 'Section' });
        this.categoryComboBox = page.getByRole('combobox', { name: 'Category', exact: true });
        this.searchButton = page.getByRole('button', { name: 'Search by HCPCS code' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.searchByTerm = page.getByRole('button', { name: 'Search by term' });
        this.searchByTermRadioButton = page.getByRole('radio', { name: 'Select DME code B4035' });
        this.modifier = page.getByRole('combobox', { name: 'Modifier' });
        this.units = page.getByRole('textbox', { name: 'Units *' });
        this.unitsQualifier = page.getByLabel('Select Units Qualifier');
        this.frequency = page.getByRole('textbox', { name: 'Frequency *' });
        this.frequencyQualifier = page.getByLabel('Select Frequency Qualifier');
        this.totalPurchaseCost = page.getByRole('textbox', { name: 'Total Purchase Cost *' });
        this.searchResult = page.locator('.input-group-addon > .fa').first();
        this.searchByCodeRadioButton = page.getByRole('radio', { name: 'Search by Code' });
        this.hcpcsLevel2CodeSearch = page.getByRole('textbox', { name: 'HCPCS Level 2 Code' });
        this.searchByCode = page.getByRole('button', { name: 'Search by HCPCS code' });
    }

    async addDME(searchTerm: string) {
        await this.header.click();
    }

    async verifyDMEData() {
        await this.header.click();
        await this.addButton.click();
        await this.sectionComboBox.fill('Enteral and Parenteral Therapy');
        await this.categoryComboBox.fill('Enteral Formulae and Enteral Medical Supplies');
        await this.searchByTerm.click();
        await this.searchByTermRadioButton.check();
        await this.modifier.fill('NU - New equipment');
        await this.units.fill('1');
        await this.unitsQualifier.selectOption('wk');
        await this.frequency.fill('1');
        await this.frequencyQualifier.selectOption('225761000');
        await this.totalPurchaseCost.fill('6345');
        await this.searchResult.click();
        await this.cancelButton.click();
        await this.addButton.click();
        await this.page.getByRole('radio', { name: 'Search by Code' }).check();
        await this.hcpcsLevel2CodeSearch.fill('99590');
        await this.searchByCode.click();
        await expect(this.page.getByLabel('Add Durable Medical Equipment Form').getByText('No data available in table')).toBeVisible();
        await expect(this.page.getByLabel('Add Durable Medical Equipment Form').getByRole('alert')).toContainText('No data available in table');
    }
}