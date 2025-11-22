import { test, expect, Locator, Page } from '@playwright/test';

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
        //await this.page.pause();

        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Scheduled Reports' }).click();
        const page1 = await page1Promise;

        //const rows = this.page.locator('tbody tr');
        //await expect(rows).toHaveCount(0);

        
        // Wait for search results (optional if already awaited)
        //await this.page.waitForSelector('tbody tr');

        // Get the number of rows
        const rowCount = await this.page.locator('tbody tr').count();

        // Assert that there is exactly 0 record
        expect(rowCount).toBe(0);

        await page1.close();
    }

    async coachingHub() {
        //await this.page.pause();

        const page2Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Coaching Hub' }).click();
        const page2 = await page2Promise;

        //const rows = this.page.locator('tbody tr');
        //await expect(rows).toHaveCount(0);

        
        // Wait for search results (optional if already awaited)
        //await this.page.waitForSelector('tbody tr');

        // Get the number of rows
        const rowCount = await this.page.locator('tbody tr').count();

        // Assert that there is exactly 0 record
        expect(rowCount).toBe(0);

        await page2.close();
    }

    async messages() {
        //await this.page.pause();

        const page3Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Messages' }).click();
        const page3 = await page3Promise;

        //const rows = this.page.locator('tbody tr');
        //await expect(rows).toHaveCount(0);

        
        // Wait for search results (optional if already awaited)
        //await this.page.waitForSelector('tbody tr');

        // Get the number of rows
        const rowCount = await this.page.locator('tbody tr').count();

        // Assert that there is exactly 0 record
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
        //await this.page.pause();

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
    async openManageAssessments() {  
        await this.page.getByRole('button', { name: 'Configuration' }).click();
        await this.page.getByRole('link', { name: 'Manage Assessments' }).click();

        //await this.page.pause();

        await expect(this.page.getByLabel('Select Client')).toBeVisible();

        await this.page.getByLabel('Select Client').selectOption('0');
        await expect(this.page.getByLabel('Select Client')).toHaveValue('0');

        //CHECK VISIBILITY OF UI ELEMENTS:
        await expect(this.page.getByRole('link', { name: 'Manage Answer Groups' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Copy to Another Client' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Assessment Report' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
        await expect(this.page.getByLabel('Show entries')).toBeVisible();
        await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
        await expect(this.page.getByText('No data available in table')).toBeVisible();

        await this.page.getByRole('link', { name: 'Manage Answer Groups' }).click();
        await expect(this.page.locator('select[name="answer_length"]')).toBeVisible();
        await expect(this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();

        //await this.page.pause();

        //ANSWER TABLE:
        await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('moderately active');
        let rows = this.page.locator('#answer_filter');
        await expect(rows).toHaveCount(1);

        await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('drug type');
        rows = this.page.locator('#answer_filter');
        await expect(rows).toHaveCount(1);

        await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('birth date');
        rows = this.page.locator('#answer_filter');
        await expect(rows).toHaveCount(1);

        //ANSWER GROUP TABLE:
        await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('accept or decline');
        await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('accept or decline');
        rows = this.page.locator('#answerGroup_filter');
        await expect(rows).toHaveCount(1);

        await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('current source of income');
        await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('current source of income');
        rows = this.page.locator('#answerGroup_filter');
        await expect(rows).toHaveCount(1);

        await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('too old for program');
        await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('too old for program');
        rows = this.page.locator('#answerGroup_filter');
        await expect(rows).toHaveCount(1);

        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByRole('textbox', { name: 'Answer Group Code' }).fill('test');
        await expect(this.page.getByRole('textbox', { name: 'Answer Group Code' })).toHaveValue('test');
        await this.page.getByRole('textbox', { name: 'Answer Group Description' }).fill('test');
        await expect(this.page.getByRole('textbox', { name: 'Answer Group Description' })).toHaveValue('test');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'Manage Assessments' }).click();
        await this.page.getByRole('link', { name: 'Export Client' }).click();
        await expect(this.page.locator('#snackbar0')).toContainText('No assessments found for client');
        await this.page.getByRole('link', { name: 'Copy to Another Client' }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByLabel('Select Client').selectOption('34');
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('activities');
        await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();

        //loop through client list?:
        const options = this.page.locator('#copyToClients option');
        const count = await options.count();

        for (let i = 0; i < count; i++) {
            await options.nth(i).click();
            await this.page.waitForTimeout(100);
        }

        // await this.page.getByLabel('Clients to Copy To').selectOption('78');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('78');
        // await this.page.getByLabel('Clients to Copy To').selectOption('51');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('51');
        // await this.page.getByLabel('Clients to Copy To').selectOption('95');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('95');
        // await this.page.getByLabel('Clients to Copy To').selectOption('71');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('71');
        // await this.page.getByLabel('Clients to Copy To').selectOption('75');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('75');
        // await this.page.getByLabel('Clients to Copy To').selectOption('88');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('88');
        // await this.page.getByLabel('Clients to Copy To').selectOption('39');
        // await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('39');

        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'Deactivate' }).click();
        await this.page.getByRole('button', { name: 'No' }).click();
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('cardiac assessment');
        await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toHaveValue('cardiac assessment');
        await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();
        await this.page.getByLabel('Clients to Copy To').selectOption('49');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('49');
        await this.page.getByLabel('Clients to Copy To').selectOption('78');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('78');
        await this.page.getByLabel('Clients to Copy To').selectOption('51');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('51');
        await this.page.getByLabel('Clients to Copy To').selectOption('95');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('95');
        await this.page.getByLabel('Clients to Copy To').selectOption('71');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('71');
        await this.page.getByLabel('Clients to Copy To').selectOption('75');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('75');
        await this.page.getByLabel('Clients to Copy To').selectOption('88');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('88');
        await this.page.getByLabel('Clients to Copy To').selectOption('39');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('39');
        await this.page.getByLabel('Clients to Copy To').selectOption('54');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('54');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'Deactivate' }).click();
        await this.page.getByRole('button', { name: 'No' }).click();
        await this.page.getByRole('searchbox', { name: 'Search:' }).fill('member screening');
        await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toHaveValue('member screening');
        await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();
        await this.page.getByLabel('Clients to Copy To').selectOption('32');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('32');
        await this.page.getByLabel('Clients to Copy To').selectOption('82');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('82');
        await this.page.getByLabel('Clients to Copy To').selectOption('86');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('86');
        await this.page.getByLabel('Clients to Copy To').selectOption('89');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('89');
        await this.page.getByLabel('Clients to Copy To').selectOption('87');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('87');
        await this.page.getByLabel('Clients to Copy To').selectOption('56');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('56');
        await this.page.getByLabel('Clients to Copy To').selectOption('94');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('94');
        await this.page.getByLabel('Clients to Copy To').selectOption('58');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('58');
        await this.page.getByLabel('Clients to Copy To').selectOption('93');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('93');
        await this.page.getByLabel('Clients to Copy To').selectOption('61');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('61');
        await this.page.getByLabel('Clients to Copy To').selectOption('92');
        await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('92');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'Deactivate' }).click();
        await this.page.getByRole('button', { name: 'No' }).click();
        await this.page.getByRole('link', { name: 'Add' }).click();
        await this.page.getByRole('button', { name: 'Add Question' }).click();
        await this.page.getByRole('textbox', { name: 'Help Text (shows question' }).fill('test');
        await expect(this.page.getByRole('textbox', { name: 'Help Text (shows question' })).toHaveValue('test');
        await this.page.getByRole('checkbox', { name: 'Required?' }).check();
        await this.page.getByRole('checkbox', { name: 'Pass value through to other' }).check();
        await this.page.getByText('Is this control indexed (').click();
        await this.page.getByRole('textbox', { name: 'Min Length' }).fill('1');
        await expect(this.page.getByRole('textbox', { name: 'Min Length' })).toHaveValue('1');
        await this.page.getByRole('textbox', { name: 'Min Value' }).fill('1');
        await expect(this.page.getByRole('textbox', { name: 'Min Value' })).toHaveValue('1');
        await this.page.getByRole('textbox', { name: 'Max Value' }).fill('10');
        await expect(this.page.getByRole('textbox', { name: 'Max Value' })).toHaveValue('10');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'Scripts' }).click();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.locator('#scriptName').fill('test');
        await this.page.getByLabel('Type', { exact: true }).selectOption('js-onload');
        await this.page.getByRole('textbox', { name: 'Text area' }).fill('tests');
        await expect(this.page.getByRole('textbox', { name: 'Text area' })).toHaveValue('tests');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(500);
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'Review Types' }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'Assessment Purposes' }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'Sections' }).click();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.locator('#sectionName').fill('test');
        await this.page.locator('#linkedAssessmentCode').fill('tests');
        await this.page.getByRole('textbox', { name: 'Text area' }).fill('s');
        await expect(this.page.getByRole('textbox', { name: 'Text area' })).toHaveValue('s');
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(500);
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: 'Groups' }).click();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
        await this.page.locator('#controlGroupName').fill('test');
        await expect(this.page.locator('#controlGroupName')).toHaveValue('test');
        await this.page.locator('#controlGroupCode').click();
        await this.page.locator('#controlGroupTemplateCode').fill('test');
        await expect(this.page.locator('#controlGroupTemplateCode')).toHaveValue('test');
        await this.page.getByRole('dialog', { name: 'Control Group Editor' }).getByLabel('Checkbox field').check();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(500);
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByTitle('Scope to Control Group').click();
        await this.page.locator('#assessmentName').fill('test');
        await expect(this.page.locator('#assessmentName')).toHaveValue('test');
        await this.page.locator('#assessmentGroup').fill('test');
        await expect(this.page.locator('#assessmentGroup')).toHaveValue('test');
        await this.page.locator('#suppressInputFlag').check();
        await expect(this.page.locator('#suppressInputFlag')).toBeChecked();
        await this.page.locator('#usesExternalCaseManagerFlag').check();
        await expect(this.page.locator('#usesExternalCaseManagerFlag')).toBeChecked();
        await this.page.locator('#assessmentManagerCancel').click();
    }

    async openManageBusinessRules() {        
        await this.page.getByRole('button', { name: 'Configuration' }).click();
        await this.page.getByRole('link', { name: 'Manage Business Rules' }).click();
        await this.page.getByLabel('Select Client').selectOption('0');
        await expect(this.page.getByLabel('Select Client')).toHaveValue('0');

        //await this.page.pause();
    }
}