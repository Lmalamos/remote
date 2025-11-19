import { expect, Locator, Page } from '@playwright/test';

export class visitsPanel {
    readonly page: Page;

    readonly visitsHeader: Locator;
    readonly existingVisits: Locator;
    readonly nextButton: Locator;
    readonly showAllButton: Locator;
    readonly addVisitButton: Locator;
    readonly categoryComboBox: Locator;
    readonly subCategoryComboBox: Locator;
    readonly searchButton: Locator;
    readonly searchByTerm: Locator;
    readonly searchByCode: Locator;
    readonly searchByCodeRadioButton: Locator;
    readonly searchByCodeResult: Locator;
    readonly searchByTermResult: Locator;
    readonly startDate: Locator;
    readonly endDate: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.visitsHeader = page.locator('h3:has-text("Visits")');
        this.existingVisits = page.getByRole('button', { name: '99233' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.showAllButton = page.getByRole('button', { name: 'Show All' });
        this.addVisitButton = page.getByRole('button', { name: 'Add Visit form' });
        this.categoryComboBox = page.getByRole('combobox', { name: 'Category', exact: true });
        this.subCategoryComboBox = page.getByRole('combobox', { name: 'Sub-Category' });
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.searchByTerm = page.locator('#txtVisitSearchByTerm');
        this.searchByCode = page.getByRole('textbox', { name: 'Enter Full CPT or HCPC Code' });
        this.searchByCodeRadioButton = page.getByRole('radio', { name: 'Search By Code' });
        this.searchByCodeResult = page.getByRole('radio', { name: 'Select Visits code' });
        this.searchByTermResult = page.locator('input[type="radio"][value="10908"]');
        this.startDate = page.locator('#visitStartDateDiv').getByTitle('Open Calender');
        this.endDate = page.locator('#visitStartDateDiv').getByTitle('Open Calender');
        this.cancelButton = page.locator('#visitCancelBtn');
    }

    async addVisits(searchTerm: string) {
        await this.visitsHeader.click();
    }

    async verifyVisitsData() {
        await this.visitsHeader.click();

        //check if exists first, otherwise skip this:
        if (await this.existingVisits.isVisible()) {
            await this.existingVisits.click();
            await this.nextButton.click();
            await this.nextButton.click();
            await this.nextButton.click();
            await this.showAllButton.click();
        }

        await this.addVisitButton.click();
        await this.categoryComboBox.fill('Case Management Services');
        await expect(this.categoryComboBox).toHaveValue('Case Management Services');
        await this.subCategoryComboBox.fill('Supervision of Warfarin Therapy');
        await expect(this.subCategoryComboBox).toHaveValue('Supervision of Warfarin Therapy');
        await this.searchByTerm.fill('Anticoagulant management for an outpatient taking warfarin, physician review and interpretation of International Normalized Ratio (INR) testing, patient instructions, dosage adjustment (as needed), and ordering of additional tests; initial 90 days of therapy (must include a minimum of 8 INR measurements)');
        await expect(this.searchByTerm).toHaveValue('Anticoagulant management for an outpatient taking warfarin, physician review and interpretation of International Normalized Ratio (INR) testing, patient instructions, dosage adjustment (as needed), and ordering of additional tests; initial 90 days of therapy (must include a minimum of 8 INR measurements)');
        await this.searchButton.click();
        await this.searchByTermResult.check();
        await this.startDate.click();
        await expect(this.startDate).toBeDefined();
        await this.endDate.click();
        await expect(this.endDate).toBeDefined();
        await this.page.keyboard.press('Escape');
        await this.cancelButton.click();
        await this.page.getByRole('button', { name: 'Add Visit form' }).click();
        await this.searchByCodeRadioButton.check();
        await this.searchByCode.fill('99251');
        await expect(this.searchByCode).toHaveValue('99251');
        await this.searchButton.click();
        await this.searchByCodeResult.check();
        await this.startDate.click();
        await expect(this.startDate).toBeDefined();
        await this.endDate.click();
        await expect(this.endDate).toBeDefined();
        await this.page.keyboard.press('Escape');
        await this.cancelButton.click();
    }
}