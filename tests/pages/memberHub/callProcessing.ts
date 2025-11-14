import { expect, Locator, Page } from '@playwright/test';

export class callProcessingPanel {
  readonly page: Page;

   readonly panelHeader: Locator;

  constructor(page: Page) {
    this.page = page;

     this.panelHeader = page.locator('h3:has-text("Call Processing")');
}

  async expandPanel() {
  }

  async verifyCallProcessingList() {
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

  async verifyCallProcessingData() {
  }
}