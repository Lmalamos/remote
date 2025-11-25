import { expect, Page } from '@playwright/test';

export class manageConnect {
  readonly page: Page;
  
//   readonly panelHeader: Locator;
//   readonly caseManagementButton: Locator;
//   readonly careTransitionsButton: Locator;
//   readonly caseManagementStatus: Locator;
//   readonly careTransitionsStatus: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.panelHeader = this.page.locator('h3:has-text("Care Management")');
    // this.caseManagementButton = this.page.locator('#btnMenuCMSolution i');
    // this.careTransitionsButton = this.page.locator('#btnMenuCTSolution i');
    // this.caseManagementStatus = this.page.locator('text=Case Management Active Please Select Primary Program Suspended Criteria Not Met ');
    // this.careTransitionsStatus = this.page.locator('text=Care Transitions Active Please Select Primary Program Suspended Criteria Not Met');
  }

async manageConnect() {
    await this.page.getByRole('link', { name: 'Manage Connect' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByText('Please select a client from')).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import CSV' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Member Id Header info-circle' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Email Header info-circle' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(this.page.locator('#turnleafReferralTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await expect(this.page.locator('#turnleafClientProgramModuleTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await expect(this.page.locator('#turnleafPreferenceTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.locator('#snackbar0').getByText('CSV File is a required field')).toBeVisible();
    }
}