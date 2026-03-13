import { test, expect, Locator, Page } from '@playwright/test';

export class manageCareManagement {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async manageCareManagement() {
    await this.page.getByRole('link', { name: 'Manage Care Management' }).click();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toHaveValue('0');
    await expect(this.page.getByRole('heading', { name: 'Level 2: Review Types, Place' })).toBeVisible();
    await expect(this.page.locator('h3')).toContainText('Level 2: Review Types, Place of Service, Type of Service');
    await this.page.getByLabel('Select Client').selectOption('34');
    await expect(this.page.getByRole('heading', { name: 'Level 2: Review Types, Place' })).toBeVisible();
    await expect(this.page.locator('h3')).toContainText('Level 2: Review Types, Place of Service, Type of Service');
  }
}