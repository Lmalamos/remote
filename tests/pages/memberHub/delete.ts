import { test, expect, Locator, Page } from '@playwright/test';

export class allergiesPanel {
  readonly page: Page;

   readonly panelHeader: Locator;

  constructor(page: Page) {
    this.page = page;

     this.panelHeader = this.page.locator('h3:has-text("Allergies")');
}

  async expandPanel() {
  }

  async verifyAllergiesList() {
    await this.page.mouse.wheel(0, 175);
    await this.page.waitForTimeout(1000);
  }

  async testCompleteTaskFlow() {
    await this.page.mouse.wheel(0, 300);
    await this.page.waitForTimeout(1000);    
    await this.fillTaskForm();
    await this.cancelTask();
  }

  private async fillTaskForm() {
  }

  private async cancelTask() {
  }

  async verifyAllergiesData(allergy1: string, allergy2: string, allergy3: string) {
    await this.page.getByRole('button', { name: 'Allergies' }).click();
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Search Term' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Search Term' }).fill('dog');

    //await this.page.getByRole('button', { name: ' Search' }).first().click();
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();

    //await this.page.getByRole('radio', { name: 'Radio button' }).check();
    await this.page.getByRole('radio', { name: 'Select (SNOMED)' }).check();

    await this.page.getByRole('textbox', { name: 'Notes' }).click();
    await this.page.getByRole('textbox', { name: 'Notes' }).first().fill('dog allergy');

    //await this.page.getByRole('button', { name: 'Submit', exact: true }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();

    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy1);
    await expect(this.page.getByText('No matching records found')).not.toBeVisible();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy2);
    await expect(this.page.getByText('No matching records found')).not.toBeVisible();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy3);
    await expect(this.page.getByText('No matching records found')).not.toBeVisible();
  }

  async verifyNoAllergiesData(allergy1: string, allergy2: string, allergy3: string) {
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy1);

    //await expect(this.page.getByText('No matching records found')).toBeVisible();
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');

    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy2);
    
    //await expect(this.page.getByText('No matching records found')).toBeVisible();
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');

    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy3);
    
    //await expect(this.page.getByText('No matching records found')).toBeVisible();
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');
  }
}