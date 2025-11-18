import { expect, Locator, Page } from '@playwright/test';

export class labsPanel {
    readonly page: Page;

    readonly labsHeader: Locator;
    readonly addButton: Locator;
    readonly resultDate: Locator;
    readonly hgbA1c: Locator;
    readonly microAlbuminCreatinRatio: Locator;
    readonly totalCholesterol: Locator;
    readonly triglycerides: Locator;
    readonly ldl: Locator;
    readonly hdl: Locator;
    readonly cholesterolTotalHdlRatio: Locator;
    readonly glucose: Locator;
    readonly fastingGlucose: Locator;
    readonly searchButton: Locator;
    readonly cancelButton: Locator;
    readonly searchByTerm: Locator;
    readonly searchByTermRadioButton: Locator;
    readonly searchByTermLabResult: Locator;
    readonly searchByTermCategory: Locator;

    constructor(page: Page) {
        this.page = page;

        this.labsHeader = page.locator('h3:has-text("Labs")');
        this.addButton = page.locator('#addLabsBtn');
        this.resultDate = page.getByRole('textbox', { name: 'Result Date *' });
        this.resultDate = page.getByRole('button', { name: 'Open calendar picker for lab' });
        this.hgbA1c = page.getByRole('textbox', { name: 'HgbA1c Information about' });
        this.microAlbuminCreatinRatio = page.getByRole('textbox', { name: 'MicroAlbumin/Creatin Ratio' });
        this.totalCholesterol = page.getByRole('textbox', { name: 'Total Cholesterol Information' });
        this.triglycerides = page.getByRole('textbox', { name: 'Triglycerides Information' });
        this.ldl = page.getByRole('textbox', { name: 'LDL Information about LDL:' });
        this.hdl = page.getByRole('textbox', { name: 'HDL Information about HDL:' });
        this.cholesterolTotalHdlRatio = page.getByRole('textbox', { name: 'Cholesterol Total / HDL Ratio' });
        this.glucose = page.getByRole('textbox', { name: 'Glucose Information about Glucose: Glucose [Mass/volume] in Serum or Plasma' });
        this.fastingGlucose = page.getByRole('textbox', { name: 'Fasting Glucose Information' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel adding lab and' });
        this.searchByTerm = page.getByRole('radio', { name: 'Search By Term' });
        this.searchByTermCategory = page.getByLabel('Category');
        this.searchButton = page.getByRole('button', { name: 'Search icon Search' });
        this.searchByTermRadioButton = page.locator('input[type="radio"][value="9329"]');
        this.searchByTermLabResult = page.getByRole('textbox', { name: 'Lab Result *' });
    }

    async addLabs(searchTerm: string) {
        await this.labsHeader.click();
    }

    async verifyLabsData() {        
        await this.labsHeader.click();
        await this.addButton.click();
        await this.resultDate.click();
        await this.hgbA1c.fill('23');
        await this.microAlbuminCreatinRatio.fill('56');
        await this.totalCholesterol.fill('563');
        await this.triglycerides.fill('26');
        await this.ldl.fill('58');
        await this.hdl.fill('25');
        await this.cholesterolTotalHdlRatio.fill('23');
        await this.glucose.fill('36');
        await this.fastingGlucose.fill('35');
        await this.cancelButton.click();
        await this.addButton.waitFor({ state: 'visible' });
        await this.addButton.click();
        await this.searchByTerm.click(); 
        await this.page.locator('#txtLabSearchByTerm').fill('CD16+CD56+ cells/100 cells in Blood');
        await this.searchButton.click();
        await this.searchByTermRadioButton.check();
        await this.searchByTermLabResult.fill('36');
        await this.cancelButton.click();
    }
}