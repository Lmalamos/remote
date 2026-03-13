import { expect, Locator, Page } from '@playwright/test';

export class navigationPage {
    readonly page: Page;

    readonly dashboardLink: Locator;
    readonly searchButton: Locator;
    readonly memberSearchLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dashboardLink = page.locator('text=Dashboard');
        this.searchButton = page.locator('a[role="button"]:has-text("Search")');
        this.memberSearchLink = page.locator('text=Member Search');
    }

    async goToDashboard() {
        await this.page.locator('text=Dashboard').click();
    }

    async openSearchMenu() {
        await this.page.locator('a[role="button"]:has-text("Search")').click();
    }

    async openMemberSearch() {
        await this.page.locator('text=Member Search').click();
    }

    async openProviderSearch() {
        await this.page.locator('text=Provider Search').click();
    }

    async openCaseSearch() {
        await this.page.locator('text=Case Search').click();
    }

    //MENU OPTIONS:
    async scheduledReports() {
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Scheduled Reports' }).click();
        const page1 = await page1Promise;

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(0);

        await page1.close();
    }

    async coachingHub() {
        const page2Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Coaching Hub' }).click();
        const page2 = await page2Promise;

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(0);

        await page2.close();
    }

    async messages() {
        const page3Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Messages' }).click();
        const page3 = await page3Promise;

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(0);

        await page3.close();
    }

    async reports() {
        const page5Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Reports', exact: true }).click();
        const page5 = await page5Promise;

        await expect(page5.getByText('Reports')).toBeVisible();
        await expect(page5.locator('#div_is_landing_page')).toContainText('Reports');

        await page5.close();
    }

    async knowledgeCenter() {
        await this.page.getByRole('link', { name: 'Knowledge Center' }).click();
        await this.page.getByRole('button', { name: 'Welcome Screen' }).click();
        await this.page.getByRole('link', { name: 'Care Management User Guide' }).click();
        await this.page.getByRole('link', { name: 'Peer Reviewer User Guide' }).click();
        await this.page.getByRole('link', { name: 'Provider Portal User Guide' }).click();
        await this.page.getByRole('link', { name: 'Reports User Guide: Care' }).click();
        await this.page.getByRole('link', { name: 'Reports User Guide: Utilization Management' }).click();
        await this.page.getByRole('link', { name: 'Utilization Management User' }).click();
        await this.page.getByRole('link', { name: 'Training Video Playlist' }).click();
        await this.page.getByRole('link', { name: 'Recent Versions' }).click();
        await this.page.getByRole('link', { name: 'Release Notes 2025.3.R261' }).click();
        await this.page.getByRole('link', { name: 'Recent Versions' }).click();
        await this.page.getByRole('link', { name: 'Archived Versions' }).click();
        await this.page.getByRole('link', { name: 'Release Notes 2025.2.R255' }).click();
        await this.page.getByRole('link', { name: 'Archived Versions' }).click();
        
        const page7Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'MCG Guidelines Search - open' }).click();
        const page7 = await page7Promise;
        await page7.close();

        await this.page.getByRole('link', { name: 'Adding Correspondence: Member' }).click();
        await this.page.getByRole('link', { name: 'UM: Edit an Authorization' }).click();
        await this.page.getByRole('link', { name: 'UM: Requesting a Peer-to-Peer' }).click();
        await this.page.getByRole('link', { name: 'UM: Adding a Prior' }).click();
        await this.page.getByRole('link', { name: 'UM: MCG on an Authorization Request - Role: Review Coordinator (RC)' }).click();
        await this.page.getByRole('link', { name: 'UM: MCG on an Authorization Request - Role: Provider Portal Users (PPU)' }).click();
        await this.page.getByRole('link', { name: 'UM: MCG on an Authorization Request - How to Save the Clinical Criteria to a' }).click();
        await this.page.getByRole('link', { name: 'Multi-Factor Authentication' }).click();
        await this.page.getByRole('link', { name: 'Updated: Reports Landing Page' }).click();
        await this.page.getByRole('link', { name: 'Telligen Qualitrac Users -' }).click();
        await this.page.getByRole('link', { name: 'New Workflow: Edit a' }).click();
        await this.page.getByRole('link', { name: 'CM Landing Page' }).click();
        await this.page.getByRole('link', { name: 'Single Sign on Tip Sheet' }).click();
        await this.page.getByRole('link', { name: 'PASRR Workflow Tip Sheet' }).click();
        await this.page.getByRole('link', { name: 'Member Alerts' }).click();
        await this.page.getByRole('link', { name: 'Provider Address Edits' }).click();
    }

    async reportIssueToQualitracSupportTeam() {
        await this.page.getByRole('button', { name: 'Report issue to Qualitrac' }).click();
        await expect(this.page.getByRole('heading', { name: 'Report issue to the Qualitrac' })).toBeVisible();
        await expect(this.page.locator('#globalModalLabelerrorReport')).toContainText('Report issue to the Qualitrac support team');
        await this.page.getByRole('textbox', { name: 'Please provide any additional' }).fill('test');
        await expect(this.page.getByRole('textbox', { name: 'Please provide any additional' })).toHaveValue('test');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
    }

    //CONFIGURATION:
    async openManageDropdown() {  
        await this.page.getByRole('button', { name: 'Configuration' }).click();
    }
}