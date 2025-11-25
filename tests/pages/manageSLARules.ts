import { expect, Page } from '@playwright/test';

export class manageSLARules {
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

async manageSLARules() {
    await this.page.getByRole('link', { name: 'Manage SLA Rules' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Display Form' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Display SLA Appeal Window' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Display Form' }).click();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export To CSV' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Set Default Hours' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Display Layered View' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Set Default Hours' }).click();
    await this.page.getByRole('button', { name: 'Close modal' }).click();
    await this.page.getByRole('button', { name: 'Display Layered View' }).click();
    }
}