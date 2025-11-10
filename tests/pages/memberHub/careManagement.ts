import { test, expect, Locator, Page } from '@playwright/test';

export class careManagementPanel {
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
}