import { expect, Page } from '@playwright/test';

export class manageNextDayFlags {
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

async manageNextDayFlags() {
    await this.page.getByRole('link', { name: 'Manage Next Day Flags' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Add' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Name' }).click();
    await this.page.getByRole('textbox', { name: 'Name' }).fill('test');
    await this.page.getByRole('checkbox', { name: 'Start of Next Business Day' }).check();
    await this.page.getByRole('checkbox', { name: 'End of Business Day' }).check();
    await this.page.getByRole('checkbox', { name: 'Instant First Day' }).check();
    await expect(this.page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Close' }).click();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Add' })).toBeVisible();
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('test');
    await expect(this.page.getByRole('link', { name: 'download' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Copy To' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Deactivate' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Deactivate' }).click();
    await expect(this.page.getByRole('button', { name: 'No' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('link', { name: 'TEST', exact: true }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
    }
}