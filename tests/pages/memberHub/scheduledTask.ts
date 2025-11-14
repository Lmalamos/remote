import { expect, Locator, Page } from '@playwright/test';

export class scheduledTasksPanel {
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

  readonly numberOfEntriesDropDown: Locator;
  readonly columnSelectionDropDown: Locator;
  readonly scheduledTasksSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.panelHeader = page.locator('h3:has-text("Scheduled Tasks")');
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

    this.numberOfEntriesDropDown = page.locator('');
    this.columnSelectionDropDown = page.locator('');
    this.scheduledTasksSearchInput = page.locator('');
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

  async testScheduledTask() {
    await this.page.getByRole('button', { name: 'Scheduled Tasks' }).click();
    await this.page.getByRole('button', { name: 'View Calendar' }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'today' }).click();
    await this.page.getByRole('button', { name: 'list day' }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'next', exact: true }).click();
    await this.page.getByRole('button', { name: 'today' }).click();

    //await this.page.getByRole('button', { name: 'Close modal' }).click();
    //await this.page.keyboard.press('Escape');
    //await this.page.locator('.fa .fa-times .fa-fw');
    //await this.page.locator('.fa.fa-times.fa-fw');
    //await this.page.locator('.close.save');
    //await this.page.getByLabel('Close');
    //await this.page.keyboard.press('Escape');
    await this.page.click('button[title="Close"]');

    await this.page.locator('#scheduledTaskTypeSelect').selectOption('Discharge Status');
    await expect(this.page.locator('.dataTables_empty')).not.toBeVisible();
    await this.page.locator('#scheduledTaskTypeSelect').selectOption({ index: 0 });
    await this.page.locator('#scheduledTaskCategorySelect').selectOption('AP Collaboration');
    await expect(this.page.locator('.dataTables_empty')).not.toBeVisible();
    await this.page.locator('#scheduledTaskCategorySelect').selectOption({ index: 0 });
    await this.page.locator('#scheduledTaskStatusSelect').selectOption('New');
    await expect(this.page.locator('.dataTables_empty')).not.toBeVisible();
    await this.page.locator('#scheduledTaskStatusSelect').selectOption({ index: 0 });
    await this.page.locator('#scheduledTaskSolutionTypeSelect').selectOption('Case Management');
    await expect(this.page.locator('.dataTables_empty')).not.toBeVisible();
    await this.page.locator('#scheduledTaskSolutionTypeSelect').selectOption({ index: 0 });
    await expect(this.page.locator('.dataTables_empty')).not.toBeVisible();
    await this.page.getByRole('button', { name: 'add new scheduled task' }).click();
    await this.page.getByLabel('Scheduled Task Type').selectOption('13');
    await this.page.getByLabel('Scheduled Task Category').selectOption('20');
    await this.page.locator('#divScheduledTaskDateId > .input-group-addon').click();
    await this.page.getByRole('textbox', { name: 'Notes:' }).click();
    await this.page.getByRole('textbox', { name: 'Notes:' }).fill('test');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}