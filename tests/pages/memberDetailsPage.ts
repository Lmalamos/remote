import { Locator, Page } from '@playwright/test';

export class memberDetailsPage {
    readonly page: Page;

    readonly memberIdLabel: Locator;
    readonly dobLabel: Locator;
    readonly viewMoreDetailsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.memberIdLabel = page.locator('#memberDetailsGeneralInfo');
        this.dobLabel = page.locator('#dobSpan');
        this.viewMoreDetailsLink = page.locator('text=View Even More Member Details');
    }

    async verifyMemberInfo(memberId: string) {
        await this.memberIdLabel.locator(`text=${memberId}`).highlight();
        await this.page.waitForTimeout(1000);
        await this.dobLabel.highlight();
        await this.page.waitForTimeout(1000);
    }

    async openExtendedDetails() {
        const popup = this.page.waitForEvent('popup');
        await this.viewMoreDetailsLink.click();
        return await popup;
    }

    async verifyExtendedDetails(popup: Page) {
        await this.page.mouse.wheel(0, 100);
        await this.page.locator('text=XXX-XX-1111').highlight();
        await this.page.waitForTimeout(1000);
        await this.page.locator('text=Junior Jabroni').highlight();
        await this.page.waitForTimeout(1000);
        await this.page.locator('h3:has-text("Member Details")').highlight();
        await this.page.waitForTimeout(1000);
    }

    async scrollToSection(offset: number = 100) {
        await this.page.mouse.wheel(0, offset);
    }
}