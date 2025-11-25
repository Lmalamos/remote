import { expect, Page } from '@playwright/test';

export class viewTransmissionErrorReport {
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

async viewTransmissionErrorReport() {
    await this.page.getByRole('link', { name: 'View Transmission Error Report' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.locator('#transmissionResponseTable_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    }
}