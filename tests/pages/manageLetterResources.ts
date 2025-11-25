import { expect, Page } from '@playwright/test';

export class manageLetterResources {
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

async manageLetterResources() {
    await this.page.getByRole('link', { name: 'Manage Letter Resources' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Name *' }).click();
    await this.page.getByRole('textbox', { name: 'Name *' }).fill('test');
    await this.page.getByLabel('Category', { exact: true }).selectOption('44');
    await this.page.getByLabel('User Guide Category').selectOption('Provider Portal');
    //await expect(this.page.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
    //await this.page.getByRole('button', { name: 'Close', exact: true }).click();
    
    // await this.page.getByLabel('Select Client').selectOption('34');
    // await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'Add' })).toBeVisible();
    // await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    // await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    // await expect(this.page.getByRole('row', { name: 'Nike-Logo Letter Resource' }).getByLabel('download')).toBeVisible();
    // await expect(this.page.locator('#deactivateDocumentBtn313510')).toBeVisible();
    // await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    // await this.page.getByRole('searchbox', { name: 'Search:' }).fill('Nike');
    // await this.page.getByTitle('Delete').click();
    // await this.page.getByRole('button', { name: 'No' }).click();
    }
}