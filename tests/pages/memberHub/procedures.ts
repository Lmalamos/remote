import { test, expect, Locator, Page } from '@playwright/test';

export class proceduresPanel {
    readonly page: Page;

    readonly panelHeader: Locator;
    readonly panelAddButton: Locator;
    readonly panelSearchInput: Locator;
    readonly panelSearchByTermButton: Locator;
    readonly panelSearchByCodeButton: Locator;
    readonly panelCancelSearchButton: Locator;
    readonly search: Locator;
    readonly sectionComboBox: Locator;
    readonly categoryComboBox: Locator;
    readonly subCategoryComboBox: Locator;
    readonly searchButton: Locator;
    readonly cancelButton: Locator;
    readonly modifier: Locator;
    readonly units: Locator;
    readonly unitsQualifier: Locator;
    readonly frequency: Locator;
    readonly frequencyQualifier: Locator;
    readonly totalPurchaseCost: Locator;
    readonly searchResult: Locator

    constructor(page: Page) {
        this.page = page;

        this.panelHeader = page.locator('h3:has-text("Procedures")');
        this.panelAddButton = page.locator('#addProceduresBtn');
        this.panelSearchInput = page.locator('[placeholder="Enter\\ Search\\ Term"]');
        this.panelSearchByTermButton = page.locator('#proceduresSearchByTermButton');
        this.panelSearchByCodeButton = page.locator('#proceduresSearchByCodeButton');
        this.panelCancelSearchButton = page.locator('text=Cancel');
        this.search = page.getByRole('searchbox', { name: 'Search:' });
        this.sectionComboBox = page.getByRole('combobox', { name: 'Section' });
        this.categoryComboBox = page.getByRole('combobox', { name: 'Category', exact: true });
        this.subCategoryComboBox = page.getByRole('combobox', { name: 'Sub-Category' });
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.modifier = page.getByRole('combobox', { name: 'Modifier' });
        this.units = page.getByRole('textbox', { name: 'Units *' });
        this.unitsQualifier = page.getByLabel('Units Qualifier');
        this.frequency = page.getByRole('textbox', { name: 'Frequency *' });
        this.frequencyQualifier = page.getByLabel('Frequency Qualifier');
        this.totalPurchaseCost = page.getByRole('textbox', { name: 'Total Purchase Cost *' });
        this.searchResult = page.locator('.input-group-addon > .fa').first();
    }

    async addProcedures(searchTerm: string) {
        await this.panelHeader.click();
    }

    async verifyProceduresData() {
        await this.panelHeader.click();
        await this.search.fill('99233');
        await expect(this.page.getByText('Showing 1 to 1 of 1 entries (')).toBeVisible();
        await expect(this.page.locator('#proceduresTable_info')).toContainText('Showing 1 to 1 of 1 entries (filtered from 2 total entries)');
        await this.search.click({ clickCount: 3 });
        await this.search.fill('252417001');
        await expect(this.page.getByText('Showing 1 to 1 of 1 entries (')).toBeVisible();
        await expect(this.page.locator('#proceduresTable_info')).toContainText('Showing 1 to 1 of 1 entries (filtered from 2 total entries)');
        await this.panelAddButton.click();
        await this.sectionComboBox.fill('Digestive System');
        await this.categoryComboBox.fill('Intestines');
        await this.subCategoryComboBox.fill('Colon Resection Procedures');
        await this.searchButton.click();
        await this.page.getByRole('radio', { name: 'Select Procedure code 44139' }).check();
        await this.modifier.fill('22 - Increased Procedural Services');
        await this.units.fill('1');
        await this.unitsQualifier.selectOption('U');
        await this.page.getByRole('button', { name: 'Open calendar picker for start date' }).click();
        await this.page.getByRole('button', { name: 'Open calendar picker for end' }).click();
        await this.cancelButton.click();
        await this.panelAddButton.click();
        await this.page.getByRole('radio', { name: 'Please Select One of These Options Search by Code' }).check();
        await this.search.fill('9600');
        await this.searchButton.click();
        await this.cancelButton.click();
    }
}