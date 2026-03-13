// ============================================
// TEST TAGS FOR ORGANIZATION
// ============================================

/**
 * Test tags for organizing and filtering tests
 *
 * Usage:
 * test.describe(Tags.SMOKE, () => {
 *   test('my smoke test', async ({ page }) => { ... });
 * });
 *
 * Run specific tags:
 * npx playwright test --grep @smoke
 * npx playwright test --grep "@smoke|@regression"
 * npx playwright test --grep-invert @slow
 */

export const Tags = {
  // Test Types
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SANITY: '@sanity',
  E2E: '@e2e',

  // Test Speed
  FAST: '@fast',
  SLOW: '@slow',

  // Test Stability
  STABLE: '@stable',
  FLAKY: '@flaky',
  SKIP: '@skip',

  // Feature Areas
  AUTH: '@auth',
  MEMBER_SEARCH: '@member-search',
  MEMBER_HUB: '@member-hub',
  PROVIDER: '@provider',
  CASE_MANAGEMENT: '@case-management',
  CARE_MANAGEMENT: '@care-management',
  ADMIN: '@admin',

  // Member Hub Components
  ALLERGIES: '@allergies',
  MEDICATIONS: '@medications',
  IMMUNIZATIONS: '@immunizations',
  VITALS: '@vitals',
  LABS: '@labs',
  DME: '@dme',
  ASSESSMENTS: '@assessments',
  CARE_PLAN: '@care-plan',

  // API Tests
  API: '@api',
  API_MEMBER: '@api-member',
  API_PROVIDER: '@api-provider',

  // Visual Tests
  VISUAL: '@visual',
  VISUAL_REGRESSION: '@visual-regression',

  // Priority
  P0: '@p0', // Critical
  P1: '@p1', // High
  P2: '@p2', // Medium
  P3: '@p3', // Low

  // Environment
  STAGE_ONLY: '@stage-only',
  PROD_SAFE: '@prod-safe',
  LOCAL_ONLY: '@local-only',

  // Browser
  CHROME_ONLY: '@chrome-only',
  FIREFOX_ONLY: '@firefox-only',
  WEBKIT_ONLY: '@webkit-only',
} as const;

/**
 * Helper to combine multiple tags
 */
export function combineTags(...tags: string[]): string {
  return tags.join(' ');
}

/**
 * Preset tag combinations
 */
export const TagPresets = {
  CRITICAL_SMOKE: combineTags(Tags.SMOKE, Tags.P0, Tags.STABLE),
  QUICK_REGRESSION: combineTags(Tags.REGRESSION, Tags.FAST),
  MEMBER_SMOKE: combineTags(Tags.SMOKE, Tags.MEMBER_HUB),
  ADMIN_REGRESSION: combineTags(Tags.REGRESSION, Tags.ADMIN),
} as const;
