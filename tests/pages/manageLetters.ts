import { expect, Page } from '@playwright/test';

export class manageLetters {
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

async manageLetters() {
    await this.page.getByRole('link', { name: 'Manage Letters' }).click();
    //await this.page.pause();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await expect(this.page.getByText('Set Patient for Preview')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Letter Counts' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Template Report' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Section Report' })).toBeVisible();
    await this.page.getByRole('heading', { name: 'Templates' }).click();
    await expect(this.page.getByLabel('Program', { exact: true })).toBeVisible();
    await this.page.getByLabel('Program', { exact: true }).selectOption('10');
    await this.page.getByLabel('Program', { exact: true }).selectOption('11');
    await this.page.getByLabel('Program', { exact: true }).selectOption('12');
    await this.page.getByLabel('Program', { exact: true }).selectOption('0');
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    //await expect(this.page.getByRole('button', { name: ' Create Template' })).toBeVisible();
    await this.page.getByRole('button', { name: ' Create Template' }).first().click();
    await this.page.getByRole('textbox', { name: 'Name *' }).click();
    await this.page.getByRole('textbox', { name: 'Name *' }).fill('est');
    await this.page.getByLabel('Sections Available').selectOption('Global After');
    await this.page.getByRole('button', { name: 'Add' }).click();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('heading', { name: 'Sections' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('global after');
    // await expect(this.page.getByRole('button', { name: 'edit' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'file-image-o' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'file-text-o' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'code' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'copy' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'trash' })).toBeVisible();
    // await this.page.getByRole('button', { name: 'trash' }).first().click();
    // await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'OK' })).toBeVisible();
    // await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
}