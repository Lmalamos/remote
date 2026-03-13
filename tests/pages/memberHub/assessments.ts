import { expect, Locator, Page } from '@playwright/test';

export class assessmentsPanel {
    readonly page: Page;
    
    readonly assessmentsPanelHeader: Locator;
    readonly memberScreeningSection: Locator;
    readonly stressScaleSection: Locator;
    readonly accountableHealthLink: Locator;
    readonly caseManagementLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.assessmentsPanelHeader = page.locator('h3:has-text("Assessments")');
        this.memberScreeningSection = page.locator('text=/Member Screening.*Last Completed/');
        this.stressScaleSection = page.locator('text=/Perceived Stress Scale.*Last Completed/');
        this.accountableHealthLink = page.locator('#assessmentTableMember_Screening >> text=Accountable Health Communities');
        this.caseManagementLink = page.locator('#assessmentTablePerceived_Stress_Scale__PSS10__Assessment >> text=Case Management');
    }

    async expandPanel() {
        await this.assessmentsPanelHeader.click();
        // Wait for sections to load after expanding
        await this.page.waitForTimeout(1000);
    }

    async verifyMemberScreening() {
        await this.memberScreeningSection.click();
        await this.page.mouse.wheel(0, 100);        
        return await this.openAssessmentDetails();
    }

    async openAssessmentDetails() {
        const popup = this.page.waitForEvent('popup');
        await this.accountableHealthLink.click();
        return await popup;
    }

    async verifyAssessmentDetails(popup: Page) {
        await popup.mouse.wheel(0, 300);
        await popup.locator('text=Myself').highlight();
        await expect(popup.locator('text=Myself')).toBeDisabled();

        await popup.mouse.wheel(0, 300);
        await popup.locator('text=Mold').highlight();
        await expect(popup.locator('text=Mold')).toBeDisabled();

        await popup.mouse.wheel(0, 400);
        await popup.locator('text=Close').click();
    }

    async verifyStressScaleAssessment() {
        await this.stressScaleSection.click();
        await this.stressScaleSection.click();
        await this.page.mouse.wheel(0, 100);
    }

    async performAssessment() {
        await this.page.getByRole('button', { name: 'CSA Assessments', exact: true }).click();
        await this.page.getByRole('button', { name: 'Open Action Menu for CSA' }).click();
        await this.page.getByRole('button', { name: 'Add Assessment Menu' }).click();
        const page2Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'New - Supports Intensity' }).click();
        const page2 = await page2Promise;
        await page2.getByRole('button', { name: 'Cancel' }).click();
        const page3Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'New - Respondent Information' }).click();
        const page3 = await page3Promise;
        await page3.getByRole('textbox', { name: 'First name', exact: true }).click();
        await page3.getByRole('textbox', { name: 'First name', exact: true }).fill('Test');
        await page3.getByRole('textbox', { name: 'Last name', exact: true }).click();
        await page3.getByRole('textbox', { name: 'Last name', exact: true }).fill('Tester');
        await page3.locator('.input-group-addon').first().click();
        await page3.getByRole('textbox', { name: 'Primary Language' }).click();
        await page3.getByRole('textbox', { name: 'Primary Language' }).fill('English');
        await page3.getByRole('textbox', { name: 'Address', exact: true }).click();
        await page3.getByRole('textbox', { name: 'Address', exact: true }).fill('100 Test Drive');
        await page3.getByRole('textbox', { name: 'City', exact: true }).click();
        await page3.getByRole('textbox', { name: 'City', exact: true }).fill('Ames');
        await page3.getByRole('textbox', { name: 'State of residence' }).click();
        await page3.getByRole('textbox', { name: 'State of residence' }).fill('Iowa');
        await page3.getByRole('textbox', { name: 'Postal code' }).click();
        await page3.getByRole('textbox', { name: 'Postal code' }).fill('50014');
        await page3.getByRole('textbox', { name: 'County of residence' }).click();
        await page3.getByRole('textbox', { name: 'County of residence' }).fill('Story');
        await page3.getByTitle('Phone No.').dblclick();
        await page3.getByRole('textbox', { name: 'Medicaid number' }).click();
        await page3.getByRole('textbox', { name: 'Medicaid number' }).fill('348974336');
        await page3.getByRole('textbox', { name: 'First Name', exact: true }).click();
        await page3.getByRole('textbox', { name: 'First Name', exact: true }).fill('Some');
        await page3.getByRole('textbox', { name: 'Last Name', exact: true }).click();
        await page3.getByRole('textbox', { name: 'Last Name', exact: true }).fill('Guy');
        await page3.getByTitle('Phone Number', { exact: true }).dblclick();
        await page3.getByTitle('Agency Email Address').click();
        await page3.getByTitle('Agency Email Address').fill('some@test.com');
        await page3.getByRole('radio', { name: 'Yes for Has CM/SC known' }).check();
        await page3.locator('#asmt-question-91714-6-0 > .input-group > .input-group-addon > .fa').click();
        await page3.getByLabel('Interview Location', { exact: true }).selectOption('IntLocHome');
        await page3.getByRole('textbox', { name: 'Interview Address' }).click();
        await page3.getByRole('textbox', { name: 'Interview Address' }).fill('316 Ocean Ave');
        await page3.getByRole('textbox', { name: 'Interview City' }).click();
        await page3.getByRole('textbox', { name: 'Interview City' }).fill('Des Moines');
        await page3.getByRole('textbox', { name: 'Interview State' }).click();
        await page3.getByRole('textbox', { name: 'Interview State' }).fill('Iowa');
        await page3.getByRole('textbox', { name: 'Interview Zip Code' }).click();
        await page3.getByRole('textbox', { name: 'Interview Zip Code' }).fill('50266');
        await page3.getByTitle('Interview Phone Number').dblclick();
        await page3.getByRole('radio', { name: 'Yes for Will individual' }).click();
        await page3.getByRole('radio', { name: 'No for Interpreter Needed' }).check();
        await page3.getByRole('table', { name: 'Resp01Row1' }).getByLabel('Respondent Name').click();
        await page3.getByRole('table', { name: 'Resp01Row1' }).getByLabel('Respondent Name').fill('Big John');
        await page3.getByRole('row', { name: 'Big John' }).getByLabel('Respondent Type').selectOption('RTypeRes');
        await page3.getByRole('textbox', { name: 'Relationship *' }).click();
        await page3.getByRole('textbox', { name: 'Relationship *' }).fill('friend');
        await page3.getByRole('table', { name: 'Resp01Row2' }).getByPlaceholder('(999) 999-').click();
        await page3.locator('#asmt-question-RirLngthOfRel').getByRole('radio', { name: 'months to 1 year' }).check();
        await page3.getByRole('button', { name: 'Cancel' }).click();
    }
}