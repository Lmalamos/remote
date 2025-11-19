import { expect, Locator, Page } from '@playwright/test';

export class callProcessingPanel {
  readonly page: Page;

   readonly panelHeader: Locator;
   readonly addButton: Locator;
   readonly firstName: Locator;
   readonly lastName: Locator;
   readonly organization: Locator;
   readonly phone: Locator;
   readonly email: Locator;
   readonly callType: Locator;
   readonly callerType: Locator;
   readonly callReason: Locator;
   readonly callResult: Locator;
   readonly verbiages: Locator;
   readonly noReviewRequired: Locator;
   readonly notes: Locator;
   readonly cancelButton: Locator;
   readonly yesButton: Locator;

  constructor(page: Page) {
    this.page = page;

     this.panelHeader = page.locator('h3:has-text("Call Processing")');
     this.addButton = page.getByRole('button', { name: 'Add' });
     this.firstName = page.getByRole('textbox', { name: 'First Name' });
     this.lastName = page.getByRole('textbox', { name: 'Last Name' });
     this.organization = page.getByRole('textbox', { name: 'Organization' });
     this.phone = page.getByRole('textbox', { name: 'Phone' });
     this.email = page.getByRole('textbox', { name: 'Email' });
     this.callType = page.locator('#sltCallType');
     this.callerType = page.locator('#sltCallerType');
     this.callReason = page.locator('#sltCallReason');
     this.callResult = page.locator('#sltCallResult');
     this.verbiages = page.getByRole('combobox', { name: 'None selected' });
     this.noReviewRequired = page.getByLabel('No Review Required');
     this.notes = page.getByRole('textbox', { name: 'Notes' });
     this.cancelButton = page.getByRole('button', { name: 'Cancel' });
     this.yesButton = page.getByRole('button', { name: 'Yes' });
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
      await this.panelHeader.click();
      await this.addButton.click();
      await this.firstName.fill('Test');
      await expect(this.firstName).toHaveValue('Test');
      await this.lastName.fill('Tester');
      await expect(this.lastName).toHaveValue('Tester');
      await this.organization.fill('Tests Inc');
      await expect(this.organization).toHaveValue('Tests Inc');
      await this.phone.click({ clickCount: 3 });
      
      await this.page.keyboard.press('1');
      await this.page.keyboard.press('2');
      await this.page.keyboard.press('3');
      //-
      await this.page.keyboard.press('4');
      await this.page.keyboard.press('5');
      await this.page.keyboard.press('6');
      //-
      await this.page.keyboard.press('7');
      await this.page.keyboard.press('8');
      await this.page.keyboard.press('9');
      await this.page.keyboard.press('0');

      await this.email.fill('test@tester.com');
      await expect(this.email).toHaveValue('test@tester.com');
      await this.callType.selectOption('23');
      await this.callerType.selectOption('16');
      await this.callReason.selectOption('20');
      await this.callResult.selectOption('40');
      await this.verbiages.click();
      await this.noReviewRequired.check();
      await this.page.getByRole('combobox', { name: 'No Review Required' }).click();
      await this.notes.fill('test');
      await expect(this.notes).toHaveValue('test');
      await this.cancelButton.click();
      await this.yesButton.click();
  }
}