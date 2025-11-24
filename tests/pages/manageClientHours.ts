import { test, expect, Locator, Page } from '@playwright/test';

export class manageClientHours {
  readonly page: Page;
  
//   readonly panelHeader: Locator;
//   readonly caseManagementButton: Locator;
//   readonly careTransitionsButton: Locator;
//   readonly caseManagementStatus: Locator;
//   readonly careTransitionsStatus: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.panelHeader = page.locator('h3:has-text("Care Management")');
    // this.caseManagementButton = page.locator('#btnMenuCMSolution i');
    // this.careTransitionsButton = page.locator('#btnMenuCTSolution i');
    // this.caseManagementStatus = page.locator('text=Case Management Active Please Select Primary Program Suspended Criteria Not Met ');
    // this.careTransitionsStatus = page.locator('text=Care Transitions Active Please Select Primary Program Suspended Criteria Not Met');
  }

async manageClientHours() {
    await this.page.getByRole('link', { name: 'Manage Client Hours' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toHaveValue('0');
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Add' })).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Add' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Name *' }).click();
    await this.page.getByRole('textbox', { name: 'Name *' }).fill('test');
    await this.page.getByRole('textbox', { name: 'Code' }).click();
    await this.page.getByLabel('Timezone').selectOption('US/Central');
    await this.page.getByRole('textbox', { name: 'Start Hour' }).click();
    await this.page.getByRole('textbox', { name: 'Start Hour' }).fill('1:00');
    await this.page.getByRole('textbox', { name: 'End Hour' }).click();
    await this.page.getByRole('textbox', { name: 'End Hour' }).fill('2:00');
    await expect(this.page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Close' })).toBeVisible();
    }
}