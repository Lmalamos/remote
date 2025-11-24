import { test, expect, Locator, Page } from '@playwright/test';

export class manageAssessments {
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

  async manageAssessments() {
    await this.page.getByRole('link', { name: 'Manage Assessments' }).click();
    await expect(this.page.getByLabel('Select Client')).toBeVisible();
    await this.page.getByLabel('Select Client').selectOption('0');
    await expect(this.page.getByLabel('Select Client')).toHaveValue('0');

    //CHECK VISIBILITY OF UI ELEMENTS:
    await expect(this.page.getByRole('link', { name: 'Manage Answer Groups' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Export Client' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Copy to Another Client' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Assessment Report' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import:' })).toBeVisible();
    await expect(this.page.getByLabel('Show entries')).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toBeVisible();
    await expect(this.page.getByText('No data available in table')).toBeVisible();

    await this.page.getByRole('link', { name: 'Manage Answer Groups' }).click();
    await expect(this.page.locator('select[name="answer_length"]')).toBeVisible();
    await expect(this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' })).toBeVisible();

    //ANSWER TABLE:
    await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('moderately active');
    let rows = this.page.locator('#answer_filter');
    await expect(rows).toHaveCount(1);

    await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('drug type');
    rows = this.page.locator('#answer_filter');
    await expect(rows).toHaveCount(1);

    await this.page.locator('#answer_filter').getByRole('searchbox', { name: 'Search:' }).fill('birth date');
    rows = this.page.locator('#answer_filter');
    await expect(rows).toHaveCount(1);

    //ANSWER GROUP TABLE:
    await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('accept or decline');
    await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('accept or decline');
    rows = this.page.locator('#answerGroup_filter');
    await expect(rows).toHaveCount(1);

    await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('current source of income');
    await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('current source of income');
    rows = this.page.locator('#answerGroup_filter');
    await expect(rows).toHaveCount(1);

    await this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' }).fill('too old for program');
    await expect(this.page.locator('#answerGroup_filter').getByRole('searchbox', { name: 'Search:' })).toHaveValue('too old for program');
    rows = this.page.locator('#answerGroup_filter');
    await expect(rows).toHaveCount(1);

    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('textbox', { name: 'Answer Group Code' }).fill('test');
    await expect(this.page.getByRole('textbox', { name: 'Answer Group Code' })).toHaveValue('test');
    await this.page.getByRole('textbox', { name: 'Answer Group Description' }).fill('test');
    await expect(this.page.getByRole('textbox', { name: 'Answer Group Description' })).toHaveValue('test');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('link', { name: 'Manage Assessments' }).click();
    await this.page.getByRole('link', { name: 'Export Client' }).click();
    await expect(this.page.locator('#snackbar0')).toContainText('No assessments found for client');
    await this.page.getByRole('link', { name: 'Copy to Another Client' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByLabel('Select Client').selectOption('34');
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('activities');
    await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();

    //loop through client list?:
    const options = this.page.locator('#copyToClients option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
        await options.nth(i).click();
        //await this.page.waitForTimeout(100);
    }

    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('link', { name: 'Deactivate' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('cardiac assessment');
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toHaveValue('cardiac assessment');
    await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();
    await this.page.getByLabel('Clients to Copy To').selectOption('49');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('49');
    await this.page.getByLabel('Clients to Copy To').selectOption('78');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('78');
    await this.page.getByLabel('Clients to Copy To').selectOption('51');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('51');
    await this.page.getByLabel('Clients to Copy To').selectOption('95');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('95');
    await this.page.getByLabel('Clients to Copy To').selectOption('71');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('71');
    await this.page.getByLabel('Clients to Copy To').selectOption('75');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('75');
    await this.page.getByLabel('Clients to Copy To').selectOption('88');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('88');
    await this.page.getByLabel('Clients to Copy To').selectOption('39');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('39');
    await this.page.getByLabel('Clients to Copy To').selectOption('54');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('54');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('link', { name: 'Deactivate' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).fill('member screening');
    await expect(this.page.getByRole('searchbox', { name: 'Search:' })).toHaveValue('member screening');
    await this.page.getByRole('link', { name: 'Copy To', exact: true }).click();
    await this.page.getByLabel('Clients to Copy To').selectOption('32');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('32');
    await this.page.getByLabel('Clients to Copy To').selectOption('82');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('82');
    await this.page.getByLabel('Clients to Copy To').selectOption('86');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('86');
    await this.page.getByLabel('Clients to Copy To').selectOption('89');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('89');
    await this.page.getByLabel('Clients to Copy To').selectOption('87');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('87');
    await this.page.getByLabel('Clients to Copy To').selectOption('56');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('56');
    await this.page.getByLabel('Clients to Copy To').selectOption('94');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('94');
    await this.page.getByLabel('Clients to Copy To').selectOption('58');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('58');
    await this.page.getByLabel('Clients to Copy To').selectOption('93');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('93');
    await this.page.getByLabel('Clients to Copy To').selectOption('61');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('61');
    await this.page.getByLabel('Clients to Copy To').selectOption('92');
    await expect(this.page.getByLabel('Clients to Copy To')).toHaveValue('92');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('link', { name: 'Deactivate' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('link', { name: 'Add' }).click();
    await this.page.getByRole('button', { name: 'Add Question' }).click();
    await this.page.getByRole('textbox', { name: 'Help Text (shows question' }).fill('test');
    await expect(this.page.getByRole('textbox', { name: 'Help Text (shows question' })).toHaveValue('test');
    await this.page.getByRole('checkbox', { name: 'Required?' }).check();
    await this.page.getByRole('checkbox', { name: 'Pass value through to other' }).check();
    await this.page.getByText('Is this control indexed (').click();
    await this.page.getByRole('textbox', { name: 'Min Length' }).fill('1');
    await expect(this.page.getByRole('textbox', { name: 'Min Length' })).toHaveValue('1');
    await this.page.getByRole('textbox', { name: 'Min Value' }).fill('1');
    await expect(this.page.getByRole('textbox', { name: 'Min Value' })).toHaveValue('1');
    await this.page.getByRole('textbox', { name: 'Max Value' }).fill('10');
    await expect(this.page.getByRole('textbox', { name: 'Max Value' })).toHaveValue('10');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('button', { name: 'Scripts' }).click();
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.locator('#scriptName').fill('test');
    await this.page.getByLabel('Type', { exact: true }).selectOption('js-onload');
    await this.page.getByRole('textbox', { name: 'Text area' }).fill('tests');
    await expect(this.page.getByRole('textbox', { name: 'Text area' })).toHaveValue('tests');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('button', { name: 'Review Types' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('button', { name: 'Assessment Purposes' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('button', { name: 'Sections' }).click();
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.locator('#sectionName').fill('test');
    await this.page.locator('#linkedAssessmentCode').fill('tests');
    await this.page.getByRole('textbox', { name: 'Text area' }).fill('s');
    await expect(this.page.getByRole('textbox', { name: 'Text area' })).toHaveValue('s');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByRole('button', { name: 'Groups' }).click();
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await this.page.locator('#controlGroupName').fill('test');
    await expect(this.page.locator('#controlGroupName')).toHaveValue('test');
    await this.page.locator('#controlGroupCode').click();
    await this.page.locator('#controlGroupTemplateCode').fill('test');
    await expect(this.page.locator('#controlGroupTemplateCode')).toHaveValue('test');
    await this.page.getByRole('dialog', { name: 'Control Group Editor' }).getByLabel('Checkbox field').check();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.getByTitle('Scope to Control Group').click();
    await this.page.locator('#assessmentName').fill('test');
    await expect(this.page.locator('#assessmentName')).toHaveValue('test');
    await this.page.locator('#assessmentGroup').fill('test');
    await expect(this.page.locator('#assessmentGroup')).toHaveValue('test');
    await this.page.locator('#suppressInputFlag').check();
    await expect(this.page.locator('#suppressInputFlag')).toBeChecked();
    await this.page.locator('#usesExternalCaseManagerFlag').check();
    await expect(this.page.locator('#usesExternalCaseManagerFlag')).toBeChecked();
    await this.page.locator('#assessmentManagerCancel').click();
  }
}