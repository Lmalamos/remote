import { expect, Page } from '@playwright/test';

export class manageClientToggle {
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

async manageClientToggle() {
    await this.page.getByRole('link', { name: 'Manage Client Toggle' }).click();
    await this.page.getByLabel('Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await this.page.getByRole('link', { name: 'General' }).click();
    await this.page.getByRole('link', { name: 'Assessment Management' }).click();
    await this.page.getByRole('link', { name: 'QK Feature Toggle' }).click();
    await this.page.getByRole('link', { name: 'File Processing' }).click();
    await this.page.getByRole('link', { name: 'Third Party' }).click();
    await this.page.getByRole('link', { name: 'Connect Mobile' }).click();
    await this.page.getByRole('link', { name: 'Care Management' }).click();
    await this.page.getByRole('link', { name: 'UM Request' }).click();
    await this.page.getByRole('link', { name: 'Logging' }).click();
    await this.page.getByRole('link', { name: 'AI', exact: true }).click();
    await this.page.getByRole('link', { name: 'Correspondence' }).click();
    await this.page.getByLabel('Select Client').selectOption('34');
    await this.page.goto('https://stage-aws.myqualitrac.com/qt/admin/manage_client_toggle/manage_client_toggle?clientId=34');
    await expect(this.page.locator('#clientSelectWrapper').getByRole('button', { name: 'View' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await this.page.getByRole('link', { name: 'General' }).click();
    await this.page.getByRole('link', { name: 'Assessment Management' }).click();
    await this.page.getByRole('link', { name: 'QK Feature Toggle' }).click();
    await this.page.getByRole('link', { name: 'File Processing' }).click();
    await this.page.getByRole('link', { name: 'Third Party' }).click();
    await this.page.getByRole('link', { name: 'Connect Mobile' }).click();
    await this.page.getByRole('link', { name: 'Care Management' }).click();
    await this.page.getByRole('link', { name: 'UM Request' }).click();
    await this.page.getByRole('link', { name: 'Logging' }).click();
    await this.page.getByRole('link', { name: 'AI', exact: true }).click();
    await this.page.getByRole('link', { name: 'Correspondence' }).click();
    }
}