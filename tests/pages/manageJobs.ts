import { expect, Page } from '@playwright/test';

export class manageJobs {
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

async manageJobs() {
    await this.page.getByRole('link', { name: 'Manage Jobs' }).click();
    await expect(this.page.getByRole('link', { name: 'Launch a Transmission Job' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Launch a Non-Transmission Job' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Last Time Each Job Ran' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Latest Jobs' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Transmission File Status' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Launch a Transmission Job' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('link', { name: 'Launch a Non-Transmission Job' }).click();
    await this.page.getByRole('textbox', { name: '{"param-name": "param-value' }).click();
    await this.page.getByRole('textbox', { name: '{"param-name": "param-value' }).fill('test');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('CityOfChicago');
    await this.page.getByRole('link', { name: 'Latest Jobs' }).click();
    await this.page.getByRole('link', { name: 'Transmission File Status' }).click();
    }
}