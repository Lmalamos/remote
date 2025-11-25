import { expect, Page } from '@playwright/test';

export class manageSystemMessages {
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

async manageSystemMessages() {
    await this.page.getByRole('link', { name: 'Manage System Messages' }).click();
    await this.page.getByRole('button', { name: 'Add Message' }).click();
    await this.page.getByLabel('Client', { exact: true }).selectOption('34');
    await this.page.getByRole('textbox', { name: 'Message *' }).click();
    await this.page.getByRole('textbox', { name: 'Message *' }).fill('test message');
    await this.page.locator('.input-group-addon').first().click();
    await this.page.locator('#divInputMessageEndDate > .input-group-addon').click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
}