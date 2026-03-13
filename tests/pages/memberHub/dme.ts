// ============================================
// REFACTORED: pages/components/DMEPanel.ts
// ============================================
import { expect, Locator, Page } from '@playwright/test';

export class DMEPanel {
  readonly page: Page;

  // Panel header and primary actions
  readonly header: Locator;
  readonly addButton: Locator;
  readonly cancelButton: Locator;

  // Search options
  readonly searchByTermRadioButton: Locator;
  readonly searchByCodeRadioButton: Locator;
  readonly searchByTermButton: Locator;
  readonly searchByCodeButton: Locator;

  // Dropdowns
  readonly sectionComboBox: Locator;
  readonly categoryComboBox: Locator;
  readonly modifierComboBox: Locator;
  readonly unitsQualifierComboBox: Locator;
  readonly frequencyQualifierComboBox: Locator;

  // Text inputs
  readonly hcpcsLevel2CodeInput: Locator;
  readonly unitsInput: Locator;
  readonly frequencyInput: Locator;
  readonly totalPurchaseCostInput: Locator;

  // Results and feedback
  readonly searchResultIcon: Locator;
  readonly noDataAvailableMessage: Locator;
  readonly alertMessage: Locator;
  readonly dmeForm: Locator;

  constructor(page: Page) {
    this.page = page;

    // Panel header and primary actions
    this.header = page.locator('h3:has-text("Durable Medical Equipment")');
    this.addButton = page.getByRole('button', { name: 'Add DME' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Search options
    this.searchByTermRadioButton = page.getByRole('radio', { name: 'Select DME code B4035' });
    this.searchByCodeRadioButton = page.getByRole('radio', { name: 'Search by Code' });
    this.searchByTermButton = page.getByRole('button', { name: 'Search by term' });
    this.searchByCodeButton = page.getByRole('button', { name: 'Search by HCPCS code' });

    // Dropdowns
    this.sectionComboBox = page.getByRole('combobox', { name: 'Section' });
    this.categoryComboBox = page.getByRole('combobox', { name: 'Category', exact: true });
    this.modifierComboBox = page.getByRole('combobox', { name: 'Modifier' });
    this.unitsQualifierComboBox = page.getByLabel('Select Units Qualifier');
    this.frequencyQualifierComboBox = page.getByLabel('Select Frequency Qualifier');

    // Text inputs
    this.hcpcsLevel2CodeInput = page.getByRole('textbox', { name: 'HCPCS Level 2 Code' });
    this.unitsInput = page.getByRole('textbox', { name: 'Units *' });
    this.frequencyInput = page.getByRole('textbox', { name: 'Frequency *' });
    this.totalPurchaseCostInput = page.getByRole('textbox', { name: 'Total Purchase Cost *' });

    // Results and feedback
    this.searchResultIcon = page.locator('.input-group-addon > .fa').first();
    this.dmeForm = page.getByLabel('Add Durable Medical Equipment Form');
    this.noDataAvailableMessage = this.dmeForm.getByText('No data available in table');
    this.alertMessage = this.dmeForm.getByRole('alert');
  }

  /**
   * Expand the DME panel
   */
  async expandPanel() {
    await this.header.click();
  }

  /**
   * Click the Add DME button to open the form
   */
  async openAddForm() {
    await this.addButton.click();
    //await this.page.waitForTimeout(500);
  }

  /**
   * Close the DME form
   */
  async closeForm() {
    await this.cancelButton.click();
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill in the section dropdown
   */
  async selectSection(section: string) {
    await this.sectionComboBox.fill(section);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill in the category dropdown
   */
  async selectCategory(category: string) {
    await this.categoryComboBox.fill(category);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Select search by term option
   */
  async selectSearchByTerm() {
    await this.searchByTermButton.click();
    await this.searchByTermRadioButton.check();
    //await this.page.waitForTimeout(500);
  }

  /**
   * Select search by code option
   */
  async selectSearchByCode() {
    await this.searchByCodeRadioButton.check();
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill modifier field
   */
  async selectModifier(modifier: string) {
    await this.modifierComboBox.fill(modifier);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill units field and select qualifier
   */
  async fillUnits(units: string, qualifier: string) {
    await this.unitsInput.fill(units);
    await this.unitsQualifierComboBox.selectOption(qualifier);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill frequency field and select qualifier
   */
  async fillFrequency(frequency: string, qualifier: string) {
    await this.frequencyInput.fill(frequency);
    await this.frequencyQualifierComboBox.selectOption(qualifier);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill total purchase cost field
   */
  async fillTotalPurchaseCost(cost: string) {
    await this.totalPurchaseCostInput.fill(cost);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Fill HCPCS code field
   */
  async fillHcpcsCode(code: string) {
    await this.hcpcsLevel2CodeInput.fill(code);
    //await this.page.waitForTimeout(500);
  }

  /**
   * Click search result icon
   */
  async clickSearchResult() {
    await this.searchResultIcon.click();
    //await this.page.waitForTimeout(500);
  }

  /**
   * Verify no data is available in search results
   */
  async verifyNoDataAvailable() {
    await expect(this.noDataAvailableMessage).toBeVisible();
    await expect(this.alertMessage).toContainText('No data available in table');
  }

  /**
   * Fill out and submit DME form with search by term
   * @param options Configuration for DME entry
   */
  async addDMEByTerm(options: {
    section: string;
    category: string;
    modifier: string;
    units: string;
    unitsQualifier: string;
    frequency: string;
    frequencyQualifier: string;
    totalPurchaseCost: string;
  }) {
    await this.expandPanel();
    await this.openAddForm();

    await this.selectSection(options.section);
    await this.selectCategory(options.category);
    await this.selectSearchByTerm();
    await this.selectModifier(options.modifier);
    await this.fillUnits(options.units, options.unitsQualifier);
    await this.fillFrequency(options.frequency, options.frequencyQualifier);
    await this.fillTotalPurchaseCost(options.totalPurchaseCost);
    await this.clickSearchResult();

    console.log('✓ DME added by term');
  }

  /**
   * Fill out and submit DME form with search by code
   * @param hcpcsCode The HCPCS code to search
   */
  async addDMEByCode(hcpcsCode: string) {
    await this.expandPanel();
    await this.openAddForm();

    await this.selectSearchByCode();
    await this.fillHcpcsCode(hcpcsCode);
    await this.searchByCodeButton.click();

    //await this.page.waitForTimeout(500);
  }

  /**
   * Complete DME verification workflow (for testing)
   */
  async verifyDMEWorkflow(hcpcsCode: string) {
    // First: Add DME by term
    await this.addDMEByTerm({
      section: 'Enteral and Parenteral Therapy',
      category: 'Enteral Formulae and Enteral Medical Supplies',
      modifier: 'NU - New equipment',
      units: '1',
      unitsQualifier: 'wk',
      frequency: '1',
      frequencyQualifier: '225761000',
      totalPurchaseCost: '6345'
    });

    // Close form
    await this.closeForm();
    
    await this.expandPanel();

    // Second: Add DME by code and verify no results
    await this.addDMEByCode(hcpcsCode);
    await this.verifyNoDataAvailable();

    console.log('✓ DME workflow verified');
  }
}