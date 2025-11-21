import { test, expect, Locator, Page } from '@playwright/test';

export class careManagementPanel {
  readonly page: Page;
  
  readonly panelHeader: Locator;
  readonly caseManagementButton: Locator;
  readonly careTransitionsButton: Locator;
  readonly caseManagementStatus: Locator;
  readonly careTransitionsStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.panelHeader = page.locator('h3:has-text("Care Management")');
    this.caseManagementButton = page.locator('#btnMenuCMSolution i');
    this.careTransitionsButton = page.locator('#btnMenuCTSolution i');
    this.caseManagementStatus = page.locator('text=Case Management Active Please Select Primary Program Suspended Criteria Not Met ');
    this.careTransitionsStatus = page.locator('text=Care Transitions Active Please Select Primary Program Suspended Criteria Not Met');
  }

  async expandPanel() {
    await this.panelHeader.click();
  }

  async verifyCaseManagement() {
    await this.caseManagementButton.click();
    await this.page.mouse.wheel(0, 100);
    await this.caseManagementStatus.click();    
    await this.caseManagementStatus.click();
  }

  async verifyCareTransitions() {
    await this.careTransitionsButton.click();
    await this.page.mouse.wheel(0, 100);
    
    await this.careTransitionsStatus.click();
    await this.careTransitionsStatus.click();
  }

  async verifyCareManagementData() {
    //await this.page.pause();

    await this.page.getByRole('button', { name: 'Care Management' }).click();
    await this.page.getByRole('button', { name: 'Case Management Active ' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('engaged');
    await expect(this.page.getByRole('cell', { name: 'Engaged' })).toBeVisible();
    await expect(this.page.getByLabel('Care Management - Case').locator('tbody')).toContainText('Engaged');
    await this.page.getByRole('searchbox', { name: 'Search:' }).click({ clickCount: 3 });
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('');
    await this.page.locator('#btnMenuCMSolution').click();
    await this.page.getByRole('link', { name: 'Program Referral' }).click();
    await this.page.getByRole('dialog', { name: 'Referral to Case Management' }).getByLabel('Program Type').selectOption('18');
    await expect(this.page.getByRole('dialog', { name: 'Referral to Case Management' }).getByLabel('Program Type')).toHaveValue('18');
    await this.page.locator('.input-group-addon > .fa').click();
    await this.page.getByTitle('Open Calendar').click();
    await this.page.getByLabel('Referral Reason').selectOption('50');
    await expect(this.page.getByLabel('Referral Reason')).toHaveValue('50');
    await this.page.getByLabel('Referral Source', { exact: true }).selectOption('13');
    await expect(this.page.getByLabel('Referral Source', { exact: true })).toHaveValue('13');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}