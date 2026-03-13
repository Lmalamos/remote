import { expect, Page } from '@playwright/test';

export class manageConfiguration {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async manageConfiguration() {
    await this.page.getByRole('link', { name: 'Manage Configuration' }).click();
  }
}