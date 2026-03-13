// ============================================
// DATA CLEANUP UTILITIES
// ============================================
import { Page } from '@playwright/test';

/**
 * Tracks created test data for cleanup
 */
class TestDataTracker {
    private createdMembers: string[] = [];
    private createdProviders: string[] = [];
    private createdCases: string[] = [];

    /**
     * Register a created member for cleanup
     * @param memberId - Member ID to track
     */
    registerMember(memberId: string): void {
        this.createdMembers.push(memberId);
    }

    /**
     * Register a created provider for cleanup
     * @param providerId - Provider ID to track
     */
    registerProvider(providerId: string): void {
        this.createdProviders.push(providerId);
    }

    /**
     * Register a created case for cleanup
     * @param caseId - Case ID to track
     */
    registerCase(caseId: string): void {
        this.createdCases.push(caseId);
    }

    /**
     * Get all tracked members
     * @returns Array of member IDs
     */
    getMembers(): string[] {
        return [...this.createdMembers];
    }

    /**
     * Get all tracked providers
     * @returns Array of provider IDs
     */
    getProviders(): string[] {
        return [...this.createdProviders];
    }

    /**
     * Get all tracked cases
     * @returns Array of case IDs
     */
    getCases(): string[] {
        return [...this.createdCases];
    }

    /**
     * Clear all tracked data
     */
    clear(): void {
        this.createdMembers = [];
        this.createdProviders = [];
        this.createdCases = [];
    }

    /**
     * Get count of all tracked items
     */
    getCount(): { members: number; providers: number; cases: number } {
        return {
            members: this.createdMembers.length,
            providers: this.createdProviders.length,
            cases: this.createdCases.length
        };
    }
}

// Global tracker instance
export const dataTracker = new TestDataTracker();

/**
 * Delete a member (if delete functionality exists)
 * @param page - Playwright page object
 * @param memberId - Member ID to delete
 */
export async function deleteMember(page: Page, memberId: string): Promise<void> {
    // Implementation depends on actual delete functionality in the app
    // This is a placeholder for when delete functionality is available
    console.log(`Would delete member: ${memberId}`);
    // TODO: Implement actual deletion when available
}

/**
 * Clean up all tracked test data
 * @param page - Playwright page object
 */
export async function cleanupTestData(page: Page): Promise<void> {
    const { members, providers, cases } = dataTracker.getCount();

    console.log(`Cleaning up test data: ${members} members, ${providers} providers, ${cases} cases`);

    // Clean up members
    for (const memberId of dataTracker.getMembers()) {
        try {
            await deleteMember(page, memberId);
        } catch (error) {
            console.error(`Failed to delete member ${memberId}:`, error);
        }
    }

    // Clear tracker
    dataTracker.clear();
}

/**
 * Setup cleanup hook for a test
 * Use this in test.afterEach or test.afterAll
 * @param page - Playwright page object
 */
export async function setupCleanupHook(page: Page): Promise<void> {
    await cleanupTestData(page);
}

/**
 * Soft delete - marks items for cleanup but doesn't execute immediately
 * Useful for batch cleanup operations
 */
export class CleanupQueue {
    private queue: Array<() => Promise<void>> = [];

    /**
     * Add cleanup operation to queue
     * @param cleanupFn - Async function that performs cleanup
     */
    add(cleanupFn: () => Promise<void>): void {
        this.queue.push(cleanupFn);
    }

    /**
     * Execute all queued cleanup operations
     */
    async executeAll(): Promise<void> {
        console.log(`Executing ${this.queue.length} cleanup operations...`);

        for (const cleanupFn of this.queue) {
            try {
                await cleanupFn();
            } catch (error) {
                console.error('Cleanup operation failed:', error);
            }
        }

        this.queue = [];
    }

    /**
     * Clear queue without executing
     */
    clear(): void {
        this.queue = [];
    }

    /**
     * Get queue size
     */
    size(): number {
        return this.queue.length;
    }
}
