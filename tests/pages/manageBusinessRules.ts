import { test, expect, Locator, Page } from '@playwright/test';

export class manageBusinessRules {
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

  async verifyManageAssessmentData() {
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

  async manageBusinessRules() {
    await this.page.getByRole('link', { name: 'Manage Business Rules' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toHaveValue('0');

    //CHECK VISIBILITY:
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Copy to Another Client' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Business Rule Report' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByLabel('Show entries')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Add' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Export Client' }).click();
    await this.page.getByRole('link', { name: 'Copy to Another Client' }).click();
    await this.page.getByLabel('Clients to Copy To').selectOption('51');
    await this.page.getByLabel('Clients to Copy To').selectOption('95');
    await this.page.getByLabel('Clients to Copy To').selectOption('71');
    await this.page.getByLabel('Clients to Copy To').selectOption('75');
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.page.getByRole('link', { name: 'Business Rule Report' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'name', exact: true }).fill('test');
    await this.page.getByRole('textbox', { name: 'code' }).click();
    await this.page.getByLabel('type', { exact: true }).selectOption('5');
    await this.page.getByRole('link', { name: 'plus' }).click();
    await this.page.locator('select[name="object1"]').selectOption('request');
    await this.page.locator('select[name="property1"]').selectOption('clientProgramReviewTypeLabel');
    await this.page.locator('select[name="operator"]').selectOption('equalTo');
    await expect(this.page.getByRole('link', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Exit' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Exit' }).click();
    await this.page.getByRole('textbox', { name: 'data', exact: true }).fill('test');
    await expect(this.page.getByRole('link', { name: 'Enable Raw' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Enable Raw' }).click();
    await expect(this.page.getByRole('button', { name: 'Test', exact: true })).toBeVisible();
    await this.page.getByRole('button', { name: 'Test', exact: true }).click();
    await expect(this.page.getByText('Error saving your information.')).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    //await this.page.getByRole('searchbox', { name: 'Search:' }).fill('pasrr1');
    //await expect(this.page.getByRole('link', { name: 'download' })).toBeVisible();
    //await expect(this.page.getByRole('link', { name: 'Copy To', exact: true })).toBeVisible();
    //await expect(this.page.getByRole('link', { name: 'Deactivate' })).toBeVisible();
    //await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();
    //await this.page.getByRole('button', { name: 'Cancel' }).click();
    //await this.page.getByRole('link', { name: 'Deactivate' }).click();
    //await this.page.getByRole('button', { name: 'No' }).click();
  }
}