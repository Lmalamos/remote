import { expect, Locator, Page } from '@playwright/test';

export class allergiesPanel {
  readonly page: Page;
  
  readonly panelHeader: Locator;
  readonly existingAllergyResults: Locator;
  readonly showAllButton: Locator;
  readonly deleteButton: Locator;
  readonly addButton: Locator;
  readonly searchByTermButton: Locator;
  readonly searchByCodeButton: Locator;
  readonly identificationDate: Locator;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly newAllergyResult: Locator;
  readonly allergyNotes: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.panelHeader = page.locator('h3:has-text("Allergies")');
    this.existingAllergyResults = page.locator('#ALLERGY_DETAIL_TABLE');
    this.showAllButton = page.getByRole('button', { name: 'Show All' });
    this.deleteButton = page.locator('.fa.fa-trash-o');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchByTermButton = page.getByRole('tab', { name: 'Search by Term' });
    this.searchByCodeButton = page.getByRole('tab', { name: 'Search by Code' });
    this.identificationDate = page.locator('input[name="identificationDate"]');
    this.searchButton = page.locator('#allergySearchByTermButton');
    this.searchInput = page.getByRole('textbox', { name: 'Enter Search Term' });
    this.newAllergyResult = page.locator('input[type="radio"]').first();
    this.allergyNotes = page.getByRole('textbox', { name: 'Notes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
}

  async expandPanel() {
    await this.panelHeader.click();
    await this.page.waitForTimeout(500);
  }

  async waitForSearchResults() {
    // Wait for search results to load
    await this.page.waitForSelector('input[type="radio"]', { timeout: 10000 });
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
    //await this.page.getByRole('button', { name: 'Allergies' }).click();
    await this.panelHeader.click();

    //await this.page.getByRole('button', { name: 'Add' }).click();
    await this.addButton.click();

    //await this.page.getByRole('textbox', { name: 'Enter Search Term' }).click();
    //await this.page.getByRole('textbox', { name: 'Enter Search Term' }).fill('dog');
    await this.searchInput.fill('dog');

    //await this.page.getByRole('button', { name: ' Search' }).first().click();
    //await this.page.getByRole('button', { name: 'Search', exact: true }).click();
    await this.searchButton.click();
    

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
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy2);
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().click();
    await this.page.getByRole('searchbox', { name: 'Search:' }).first().fill(allergy3);
    await expect(this.page.getByRole('alert')).toContainText('No matching records found');
  }

  async deleteAllergies() {
    //add logic to check different values and if there are more than 1:
    await this.page.getByRole('button', { name: 'Toggle allergies panel' }).click();

    //need some time to check if there is data:
    await this.page.waitForTimeout(1000);

    // Wait for the table to load (adjust selector if needed)
    //await this.page.waitForSelector('a[onclick^="ALLERGY_DETAIL_TABLE.show"]');

    // Get all the elements whose onclick starts with that function
    const links = await this.page.locator('a[onclick^="ALLERGY_DETAIL_TABLE.show"]').all();
    console.log(`Found ${links.length} allergy links`);

    if (links.length === 0) {
      console.log('No links found');
      return;
    }

    // Loop through them and click one by one
    for (let i = 0; i < links.length; i++) {
      console.log(`Clicking link #${i + 1}`);
      await links[i].click();

      //change dropdown to be 100 records:
      await this.page.getByRole('combobox').selectOption('100');
      await this.page.waitForTimeout(1000);

      const allergiesCount = await this.page.locator('.fa.fa-trash-o').count();
      console.log('Number of allergies:', allergiesCount);

      for (let i = 0; i < allergiesCount; i++) {
        await this.page.locator('.fa.fa-trash-o').first().click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        await this.page.waitForTimeout(500);
    }

    await this.page.getByRole('button', { name: 'Show All' }).click();
    }
  }
}