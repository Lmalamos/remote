// ============================================
// REFACTORED ALLERGIES PANEL - EXAMPLE
// Shows proper wait usage instead of fixed timeouts
// ============================================
import { expect, Locator, Page } from '@playwright/test';
import { AllergyDetails } from '../../types';
import {
  waitForElementVisible,
  waitForDataTableReady,
  waitForModal,
  waitForModalClosed
} from '../../utils/waitHelpers';
import {
  searchInTable,
  changeTableEntriesCount
} from '../../utils/tableHelpers';
import { verifyNoMatchingRecords } from '../../utils/assertions';

export class AllergiesPanelRefactored {
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
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.searchInput = page.getByRole('textbox', { name: 'Enter Search Term' });
    this.newAllergyResult = page.getByRole('radio', { name: 'Select (SNOMED)' });
    this.allergyNotes = page.getByRole('textbox', { name: 'Notes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
  }

  /**
   * Expand the allergies panel
   */
  async expandPanel(): Promise<void> {
    await this.panelHeader.click();
    // Wait for panel content to be visible instead of fixed timeout
    await waitForElementVisible(this.addButton);
  }

  /**
   * Add an allergy
   * @param allergyDetails - Allergy information
   */
  async addAllergy(allergyDetails: AllergyDetails): Promise<void> {
    await this.expandPanel();
    await this.addButton.click();

    // Wait for modal to open instead of fixed timeout
    await waitForModal(this.page);

    await this.searchInput.fill(allergyDetails.searchTerm);
    await this.searchButton.click();

    // Wait for search results instead of fixed timeout
    await waitForElementVisible(this.newAllergyResult);

    await this.newAllergyResult.check();

    if (allergyDetails.notes) {
      await this.allergyNotes.fill(allergyDetails.notes);
    }

    await this.submitButton.click();

    // Wait for modal to close
    await waitForModalClosed(this.page);
  }

  /**
   * Verify allergies exist in the table
   * @param allergies - Array of allergy names to verify
   */
  async verifyAllergiesExist(allergies: string[]): Promise<void> {
    await this.expandPanel();

    // Wait for table to load
    await waitForDataTableReady(this.page, 'ALLERGY_DETAIL_TABLE');

    for (const allergy of allergies) {
      await searchInTable(this.page, allergy);
      await expect(this.page.getByText('No matching records found')).not.toBeVisible();
    }

    // Clear search
    await searchInTable(this.page, '');
  }

  /**
   * Verify allergies do NOT exist in the table
   * @param allergies - Array of allergy names that should not exist
   */
  async verifyAllergiesDoNotExist(allergies: string[]): Promise<void> {
    await this.expandPanel();

    // Wait for table to load
    await waitForDataTableReady(this.page, 'ALLERGY_DETAIL_TABLE');

    for (const allergy of allergies) {
      await searchInTable(this.page, allergy);
      await verifyNoMatchingRecords(this.page);
    }

    // Clear search
    await searchInTable(this.page, '');
  }

  /**
   * Delete all allergies for cleanup
   */
  async deleteAllAllergies(): Promise<void> {
    await this.expandPanel();

    // Wait for table to be ready
    await waitForDataTableReady(this.page, 'ALLERGY_DETAIL_TABLE');

    // Get all allergy links
    const links = await this.page.locator('a[onclick^="ALLERGY_DETAIL_TABLE.show"]').all();

    if (links.length === 0) {
      console.log('No allergies to delete');
      return;
    }

    // Loop through and delete each
    for (let i = 0; i < links.length; i++) {
      await links[i].click();

      // Change to show 100 entries
      await changeTableEntriesCount(this.page, '100', 'ALLERGY_DETAIL_TABLE');

      // Wait for table to reload
      await waitForDataTableReady(this.page, 'ALLERGY_DETAIL_TABLE');

      const allergiesCount = await this.deleteButton.count();

      for (let j = 0; j < allergiesCount; j++) {
        await this.deleteButton.first().click();
        await this.page.getByRole('button', { name: 'Yes' }).click();

        // Wait for deletion confirmation instead of fixed timeout
        await waitForDataTableReady(this.page, 'ALLERGY_DETAIL_TABLE');
      }

      await this.showAllButton.click();
    }
  }
}
