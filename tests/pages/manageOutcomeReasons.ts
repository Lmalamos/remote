import { expect, Page } from '@playwright/test';

export class manageOutcomeReasons {
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

async manageOutcomeReasons() {
    await this.page.getByRole('link', { name: 'Manage Outcome Reasons' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Outcome Mapping' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Reason Groups' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add Row' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Add Row' }).click();
    await this.page.getByLabel('Choose a Review Type(s)').selectOption('NS');
    await this.page.getByLabel('Checkbox field').first().check();
    await this.page.getByLabel('Checkbox field').nth(1).check();
    await this.page.getByLabel('Checkbox field').nth(2).check();
    await this.page.locator('.btn.btn-secondary.save').click();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByRole('link', { name: 'Outcome Mapping' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Reason Groups' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add Row' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Add Row' }).click();
    await this.page.locator('.btn.btn-secondary.save').click();
    }
}