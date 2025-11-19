import { expect, Locator, Page } from '@playwright/test';

export class vitalsPanel {
    readonly page: Page;

    readonly vitalsHeader: Locator;
    readonly addVitalsButton: Locator;
    readonly vitalsDate: Locator;
    readonly systolic: Locator;
    readonly diastolic: Locator;
    readonly bloodPressure: Locator;
    readonly heightInFeet: Locator;
    readonly heightInInches: Locator;
    readonly unableToObtain: Locator;
    readonly weight: Locator;
    readonly bmi: Locator;
    readonly waistSize: Locator;
    readonly whtr: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.vitalsHeader = page.locator('h3:has-text("Vitals")');
        this.addVitalsButton = page.locator('#addVitalBtn');
        this.vitalsDate = page.locator('.input-group-addon.calendar-btn');
        this.systolic = page.locator('#txtSystolicBP');
        this.diastolic = page.locator('#txtDiastolicBP');
        this.bloodPressure = page.locator('#txtBP');
        this.heightInFeet = page.locator('#txtHeightFeet');
        this.heightInInches = page.locator('#txtHeightInches');
        this.unableToObtain = page.locator('#chkUnableToObtainWeightCheckbox');
        this.weight = page.locator('#txtWeight');
        this.bmi = page.locator('#txtBMI');
        this.waistSize = page.locator('#txtWaist');
        this.whtr = page.locator('#txtWaistHeightRatio');
        this.cancelButton = page.locator('#vitalCancelBtn');
    }

    async addVitals(searchTerm: string) {
        await this.vitalsHeader.click();
    }

    async verifyVitalsData() {
        await this.vitalsHeader.click();
        await this.addVitalsButton.click();
        await this.vitalsDate.click();
        await this.systolic.fill('120');
        await expect(this.systolic).toHaveValue('120');
        await this.diastolic.fill('80');
        await expect(this.diastolic).toHaveValue('80');
        await this.heightInFeet.fill('5');
        await expect(this.heightInFeet).toHaveValue('5');
        await this.heightInInches.fill('9');
        await expect(this.heightInInches).toHaveValue('9');
        await expect(this.unableToObtain).not.toBeChecked();
        await this.weight.fill('160');
        await expect(this.weight).toHaveValue('160');
        await this.waistSize.fill('33');
        await expect(this.waistSize).toHaveValue('33');
        await expect(this.bloodPressure).toHaveValue('120/80');
        await this.bloodPressure.isDisabled();
        await this.bmi.isDisabled();
        await this.whtr.isDisabled();
        await this.cancelButton.click();        
    }
}