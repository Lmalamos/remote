import { expect, Locator, Page } from '@playwright/test';

export class activitiesPanel {
  readonly page: Page;
  
  readonly panelHeader: Locator;
  readonly taskDoneButton: Locator;
  readonly taskTypeDropdown: Locator;
  readonly reviewDropdown: Locator;
  readonly userEnteredMinutesInput: Locator;
  readonly billableMinutesInput: Locator;
  readonly peerReviewerMinutesInput: Locator;
  readonly stayOnMemberCheckbox: Locator;
  readonly cancelButton: Locator;
  readonly carePlanCaseAdd: Locator;
  readonly caseManagementLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.panelHeader = page.locator('h3:has-text("Activities")');
    this.taskDoneButton = page.locator('#btnTaskDone');
    this.taskTypeDropdown = page.locator('#sltCompleteTaskTask');
    this.reviewDropdown = page.getByRole('combobox', { name: 'Review *' });
    this.userEnteredMinutesInput = page.locator('input[name="userEnteredMinutes"]');
    this.billableMinutesInput = page.locator('input[name="billableMinutes"]');
    this.peerReviewerMinutesInput = page.locator('input[name="peerReviewerBillableMinutes"]');
    this.stayOnMemberCheckbox = page.locator('text=Stay on current member >> input[type="checkbox"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.carePlanCaseAdd = page.locator('text=Care Plan Case Add');
    this.caseManagementLabel = page.locator('text=Case Management').first();
  }

  async expandPanel() {
    await this.panelHeader.click();
  }

  async verifyActivitiesList() {
    await this.page.mouse.wheel(0, 175);
    await this.page.waitForTimeout(1000);
    
    await this.carePlanCaseAdd.highlight();
    await this.page.waitForTimeout(1000);
    await this.page.locator('text=autoom').first().highlight();
    await this.page.waitForTimeout(1000);
    await this.caseManagementLabel.highlight();
    await this.page.waitForTimeout(1000);
  }

  async testCompleteTaskFlow() {
    await this.page.mouse.wheel(0, 300);
    await this.page.waitForTimeout(1000);
    
    await this.taskDoneButton.click();
    await this.page.waitForTimeout(1000);
    
    await this.fillTaskForm();
    await this.cancelTask();
  }

  async fillTaskForm() {
    await this.taskTypeDropdown.selectOption({ label: 'Update Record' });
    await this.page.waitForTimeout(1000);
    
    await this.reviewDropdown.selectOption('Acute Medical Surgical (Inpatient) (25563) Medical Necessity - Submitted on 09/04/2023');
    await this.page.waitForTimeout(1000);
    
    await this.userEnteredMinutesInput.fill('60');
    await this.billableMinutesInput.fill('250');
    await this.peerReviewerMinutesInput.fill('60');
    
    await this.stayOnMemberCheckbox.check();
    await this.page.waitForTimeout(1000);
  }

  async cancelTask() {
    await this.page.mouse.wheel(0, 100);
    await this.cancelButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyActivitiesData() {
    await this.panelHeader.click();
    await this.page.mouse.wheel(0, -500);
    await this.page.getByRole('button', { name: 'Activities' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('Start');
    await expect(this.page.locator('.odd')).toHaveCount(1);
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('Call Out');
    await expect(this.page.locator('.odd')).toHaveCount(1);
    await this.page.getByRole('searchbox', { name: 'Search:' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('Member Initial');
    await expect(this.page.locator('.odd')).toHaveCount(1);
  }
}