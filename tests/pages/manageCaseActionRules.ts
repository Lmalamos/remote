import { test, expect, Locator, Page } from '@playwright/test';

export class manageCaseActionRules {
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

async manageCaseActionRules() {
    await this.page.getByRole('link', { name: 'Manage Case Action Rules' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toHaveValue('0');
    await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByRole('button', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('row', { name: 'Acute Maternity Inpatient' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Acute Maternity Inpatient' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Acute Medical Surgical' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Acute Medical Surgical' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Acute Rehabilitation' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Acute Rehabilitation' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Hospice Inpatient Continued' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Hospice Inpatient Continued' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Long Term Acute Care (LTAC)' }).getByRole('combobox').click();
    await this.page.getByRole('row', { name: 'Long Term Acute Care (LTAC)' }).getByRole('combobox').click();
    await this.page.getByRole('combobox', { name: 'None selected' }).nth(5).click();
    await this.page.getByRole('combobox', { name: 'None selected' }).nth(5).click();
    await this.page.locator('tr:nth-child(7) > td:nth-child(5) > .multiselect-native-select > .btn-group > .multiselect').click();
    await this.page.locator('.btn-group.open > .multiselect').click();
    await this.page.getByRole('combobox', { name: 'Approved' }).click();
    await this.page.getByRole('combobox', { name: 'Approved' }).click();
    await expect(this.page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Close' }).click();
    }
}