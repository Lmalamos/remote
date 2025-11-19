import { test, expect, Locator, Page } from '@playwright/test';
import path from 'path';

export class resourceLibraryPanel {
    readonly page: Page;

    readonly resourceLibraryHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.resourceLibraryHeader = page.locator('h3:has-text("Resource Library")');
    }

    async addPResourceLibrary(searchTerm: string) {
        await this.resourceLibraryHeader.click();
    }

    async verifyResourceLibraryData() {
        //await this.page.pause();

        await this.page.getByRole('button', { name: 'Resource Library' }).click();
        
        await this.page.waitForTimeout(3000);

        if (await this.page.getByRole('button', { name: 'Add new resource' }).isVisible()) {
            await this.page.getByRole('button', { name: 'Add new resource' }).click();
        }

        else if (await this.page.getByRole('link', { name: 'Add' }).isVisible()) {
            await this.page.getByRole('link', { name: 'Add' }).click();
        }

        else if (await this.page.locator('.btn.btn-warning.pull-right save').isVisible()) {
            await this.page.locator('.btn.btn-warning.pull-right save').click();
        }

        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.getByRole('button', { name: 'upload file' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, '../../data/Testing.txt'));
        await this.page.getByLabel('Category', { exact: true }).selectOption('10');
        await expect(this.page.getByLabel('Category', { exact: true })).toHaveValue('10');
        await this.page.getByLabel('Topic', { exact: true }).selectOption('10');
        await expect(this.page.getByLabel('Topic', { exact: true })).toHaveValue('10');
        await this.page.getByRole('button', { name: 'Close', exact: true }).click();
    }
}