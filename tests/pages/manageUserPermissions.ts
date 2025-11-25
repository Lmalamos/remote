import { expect, Page } from '@playwright/test';

export class manageUserPermissions {
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

async manageUserPermissions() {
    await this.page.getByRole('link', { name: 'Manage User Permissions' }).click();
    await expect(this.page.getByRole('link', { name: 'Codes Or Names' })).toBeVisible();
    await this.page.locator('#userTitlePermissions').getByRole('link', { name: 'Task Queue' }).click();
    await this.page.getByRole('link', { name: 'Member Hub' }).click();
    await this.page.getByRole('link', { name: 'AM', exact: true }).click();
    await this.page.getByRole('link', { name: 'AM Task' }).click();
    await this.page.getByRole('link', { name: 'CM', exact: true }).click();
    await this.page.getByRole('link', { name: 'CM Tasks' }).click();
    await this.page.getByRole('link', { name: 'UM', exact: true }).click();
    await this.page.getByRole('link', { name: 'UM', exact: true }).click();
    await this.page.getByRole('link', { name: 'UM Tasks' }).click();
    await this.page.getByRole('link', { name: 'Clinical' }).click();
    await this.page.getByRole('link', { name: 'Workflow' }).click();
    await this.page.getByRole('link', { name: 'Other' }).click();
    }
}