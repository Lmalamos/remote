import { Locator, Page } from '@playwright/test';

export class eligibleMemberTasks {
    readonly page: Page;
    
    readonly eligibleMemberTasksLink: Locator;
    readonly columnsButton: Locator;
    readonly selectAllCheckbox: Locator;
    readonly allSelectedButton: Locator;
    readonly clientDropdown: Locator;
    readonly referralSourceDropdown: Locator;
    readonly moduleDropdown: Locator;
    readonly servicesDropdown: Locator;
    readonly coachingTypeDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eligibleMemberTasksLink = page.locator('text=Eligible Member Tasks');
        this.columnsButton = page.locator('button:has-text("12 Columns Selected")');
        this.selectAllCheckbox = page.locator('.form-check-input').first();
        this.allSelectedButton = page.locator('button:has-text("All selected (21)")');
        this.clientDropdown = page.locator('select[name="clientId"]');
        this.referralSourceDropdown = page.locator('select[name="referralSourceId"]');
        this.moduleDropdown = page.locator('select[name="moduleId"]');
        this.servicesDropdown = page.locator('select[name="servicesId"]');
        this.coachingTypeDropdown = page.locator('select[name="coachingTypeId"]');
    }

    async navigateToTaskQueue() {
        await this.eligibleMemberTasksLink.click();
    }

    async selectAllColumns() {
        await this.columnsButton.click();
        await this.selectAllCheckbox.check();
        await this.allSelectedButton.click();
    }

    async applyFilters() {
        //await this.clientDropdown.selectOption({ label: 'Comprehensive - Test Client' });
        await this.referralSourceDropdown.selectOption({ label: 'Auto Referral' });
        await this.moduleDropdown.selectOption({ label: 'Case Management' });
        await this.servicesDropdown.selectOption({ label: 'Catastrophic' });
        await this.coachingTypeDropdown.selectOption({ label: 'Field Based' });
    }
}