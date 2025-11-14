import { test, expect, Locator, Page } from '@playwright/test';

export class allergiesPanel {
  readonly page: Page;

   readonly panelHeader: Locator;
//   readonly taskDoneButton: Locator;
//   readonly taskTypeDropdown: Locator;
//   readonly reviewDropdown: Locator;
//   readonly userEnteredMinutesInput: Locator;
//   readonly billableMinutesInput: Locator;
//   readonly peerReviewerMinutesInput: Locator;
//   readonly stayOnMemberCheckbox: Locator;
//   readonly cancelButton: Locator;
//   readonly carePlanCaseAdd: Locator;
//   readonly caseManagementLabel: Locator;

  constructor(page: Page) {
    this.page = page;

     this.panelHeader = this.page.locator('h3:has-text("Allergies")');
//     this.taskDoneButton = this.page.locator('#btnTaskDone');
//     this.taskTypeDropdown = this.page.locator('#sltCompleteTaskTask');
//     this.reviewDropdown = this.page.getByRole('combobox', { name: 'Review *' });
//     this.userEnteredMinutesInput = this.page.locator('input[name="userEnteredMinutes"]');
//     this.billableMinutesInput = this.page.locator('input[name="billableMinutes"]');
//     this.peerReviewerMinutesInput = this.page.locator('input[name="peerReviewerBillableMinutes"]');
//     this.stayOnMemberCheckbox = this.page.locator('text=Stay on current member >> input[type="checkbox"]');
//     this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
//     this.carePlanCaseAdd = this.page.locator('text=Care Plan Case Add');
//     this.caseManagementLabel = this.page.locator('text=Case Management').first();
}

  async expandPanel() {
    //await this.panelHeader.click();
  }

  async verifyAllergiesList() {
    await this.page.mouse.wheel(0, 175);
    await this.page.waitForTimeout(1000);
    
    // await carePlanCaseAdd.highlight();
    // await this.page.waitForTimeout(1000);
    // await this.page.locator('text=autoom').first().highlight();
    // await this.page.waitForTimeout(1000);
    // await caseManagementLabel.highlight();
    // await this.page.waitForTimeout(1000);
  }

  async testCompleteTaskFlow() {
    await this.page.mouse.wheel(0, 300);
    await this.page.waitForTimeout(1000);
    
    // await this.taskDoneButton.click();
    // await this.page.waitForTimeout(1000);
    
    await this.fillTaskForm();
    await this.cancelTask();
  }

  private async fillTaskForm() {
    // await this.taskTypeDropdown.selectOption({ label: 'Update Record' });
    // await this.page.waitForTimeout(1000);
    
    // await this.reviewDropdown.selectOption('Acute Medical Surgical (Inpatient) (25563) Medical Necessity - Submitted on 09/04/2023');
    // await this.page.waitForTimeout(1000);
    
    // await this.userEnteredMinutesInput.fill('60');
    // await this.billableMinutesInput.fill('250');
    // await this.peerReviewerMinutesInput.fill('60');
    
    // await this.stayOnMemberCheckbox.check();
    // await this.page.waitForTimeout(1000);
  }

  private async cancelTask() {
    // await this.page.mouse.wheel(0, 100);
    // await this.cancelButton.click();
    // await this.page.waitForTimeout(1000);
  }

  async verifyAllergiesData(allergy1: string, allergy2: string, allergy3: string) {
    await this.page.getByRole('button', { name: 'Allergies' }).click();
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Search Term' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Search Term' }).fill('dog');
    
    //await this.page.pause();

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
    
    //await this.page.pause();

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