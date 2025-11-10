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
        this.memberScreeningSection = page.locator('text=Member Screening 1 Last Completed: 08/25/2022');
        this.stressScaleSection = page.locator('text=Perceived Stress Scale (PSS10) Assessment 2 Last Completed: 08/25/2022');
        this.accountableHealthLink = page.locator('#assessmentTableMember_Screening >> text=Accountable Health Communities');
        this.caseManagementLink = page.locator('#assessmentTablePerceived_Stress_Scale__PSS10__Assessment >> text=Case Management');
    }

    async expandPanel() {
        await this.assessmentsPanelHeader.click();
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
        await popup.waitForTimeout(1000);
        await expect(popup.locator('text=Myself')).toBeDisabled();
        
        await popup.mouse.wheel(0, 300);
        await popup.locator('text=Mold').highlight();
        await popup.waitForTimeout(1000);
        await expect(popup.locator('text=Mold')).toBeDisabled();
        
        await popup.mouse.wheel(0, 400);
        await popup.waitForTimeout(1000);
        await popup.locator('text=Close').click();
    }

    async verifyStressScaleAssessment() {
        await this.stressScaleSection.click();
        await this.stressScaleSection.click();
        await this.page.mouse.wheel(0, 100);
    }
}