import { expect, Page } from '@playwright/test';

export class manageReviewTypes {
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

async manageReviewTypes() {
    await this.page.getByRole('link', { name: 'Manage Review Types' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Review Type by Timing' })).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Review Type by Timing' })).toBeVisible();
    }
}