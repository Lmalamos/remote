# Playwright Test Framework Documentation

## Overview
This is a comprehensive Playwright test framework with Page Object Model (POM), TypeScript type safety, reusable utilities, and automated cleanup.

---

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Page Objects](#page-objects)
- [Utilities](#utilities)
- [Test Data](#test-data)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

---

## Getting Started

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with UI
npm run ui

# Run on specific environment
npm run test:stage
npm run test:prod
npm run test:local

# Run specific test file
npx playwright test tests/specs/smoke.spec.ts

# Run tests in headed mode
npm run test:headed
```

---

## Project Structure

```
tests/
├── config/              # Configuration files
│   ├── env.ts          # Environment configuration
│   └── testData.ts     # Test data (legacy, being phased out)
├── constants/          # Constants and magic values
│   └── index.ts        # All test constants
├── factories/          # Test data factories
│   ├── memberFactory.ts    # Member data generation
│   └── providerFactory.ts  # Provider data generation
├── fixtures/           # Playwright fixtures
│   ├── auth.fixture.ts      # Basic auth fixture
│   └── cleanupAuth.fixture.ts  # Auth with cleanup
├── pages/              # Page Object Models
│   ├── loginPage.ts
│   ├── memberSearchPage.ts
│   ├── memberHub/      # Member hub components
│   └── ...
├── specs/              # Test specifications
│   ├── smoke.spec.ts
│   ├── regression.spec.ts
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    ├── assertions.ts       # Common assertions
    ├── dataCleanup.ts      # Data cleanup utilities
    ├── tableHelpers.ts     # Table interaction helpers
    └── waitHelpers.ts      # Wait utilities
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { createStandardMemberSearch } from '../factories/memberFactory';
import { TEST_MEMBER } from '../constants';

test.describe('My Test Suite', () => {
  test('my test', async ({ authenticatedPage }) => {
    const page = authenticatedPage; // Already logged in!
    const memberSearch = new memberSearchPage(page);

    await test.step('Search for member', async () => {
      // Use factory for type-safe data
      const searchCriteria = createStandardMemberSearch();
      await memberSearch.searchMember(searchCriteria);
    });

    await test.step('Verify results', async () => {
      await memberSearch.verifySearchResults();
    });
  });
});
```

### Test with Cleanup

```typescript
import { test, expect } from '../fixtures/cleanupAuth.fixture';

test('test with cleanup', async ({ authenticatedPage, testDataTracker }) => {
  const page = authenticatedPage;

  // Create test data
  const memberId = 'TEST123';

  // Register for cleanup
  testDataTracker.registerMember(memberId);

  // Test actions...

  // Cleanup happens automatically after test
});
```

---

## Page Objects

### Creating a Page Object

```typescript
import { expect, Locator, Page } from '@playwright/test';
import { MyDataType } from '../types';

export class MyPage {
  readonly page: Page;
  readonly myLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myLocator = page.locator('#myId');
  }

  /**
   * Action method with JSDoc
   * @param data - Type-safe data object
   */
  async performAction(data: MyDataType): Promise<void> {
    await this.myLocator.fill(data.field);
    await this.page.click('button:has-text("Submit")');
  }

  /**
   * Verification method
   */
  async verifyResult(): Promise<void> {
    await expect(this.myLocator).toBeVisible();
  }
}
```

### Using Type-Safe Methods

**Old Way (Avoid):**
```typescript
// 13 parameters - easy to mix up!
await memberSearch.searchMember('Client', '123', 'Last', 'First', ...);
```

**New Way (Preferred):**
```typescript
// Clean, type-safe, self-documenting
await memberSearch.searchMember({
  client: 'Client',
  memberId: '123',
  lastName: 'Last',
  firstName: 'First'
  // Only include what you need!
});
```

---

## Utilities

### Wait Helpers

**Use proper waits instead of fixed timeouts:**

```typescript
import {
  waitForElementVisible,
  waitForDataTableReady,
  waitForNetworkIdle
} from '../utils/waitHelpers';

// Wait for element
await waitForElementVisible(myLocator);

// Wait for DataTable to load
await waitForDataTableReady(page, 'myTable');

// Wait for network requests to finish
await waitForNetworkIdle(page);
```

### Table Helpers

```typescript
import {
  searchInTable,
  changeTableEntriesCount,
  getTableRowCount
} from '../utils/tableHelpers';

// Search in table
await searchInTable(page, 'searchTerm');

// Change pagination
await changeTableEntriesCount(page, '100');

// Get row count
const count = await getTableRowCount(page);
```

### Assertion Helpers

```typescript
import {
  verifyTableRowCount,
  verifyErrorMessage,
  verifyNoMatchingRecords
} from '../utils/assertions';

// Verify table has X rows
await verifyTableRowCount(page, 5);

// Verify error message
await verifyErrorMessage(page, 'Invalid input');

// Verify no matching records
await verifyNoMatchingRecords(page);
```

---

## Test Data

### Using Constants

```typescript
import { TEST_MEMBER, TEST_CREDENTIALS, UI_TEXT } from '../constants';

// Use constants instead of magic strings
await page.fill('#username', TEST_CREDENTIALS.STAGE_USERNAME);
await expect(page.locator('.error')).toContainText(UI_TEXT.UNABLE_TO_SIGN_IN);
```

### Using Factories

```typescript
import {
  createMemberDetails,
  createStandardMemberSearch,
  generateUniqueMemberId
} from '../factories/memberFactory';

// Create unique member data
const member = createMemberDetails({
  firstName: 'John',
  lastName: 'Doe'
  // Other fields auto-generated with unique values
});

// Create search criteria
const search = createStandardMemberSearch();

// Generate unique ID
const memberId = generateUniqueMemberId();
```

---

## Configuration

### Environment Configuration

Set environment via `TEST_ENV` variable:

```bash
# Run on stage (default)
npm run test

# Run on prod
TEST_ENV=prod npm run test

# Run on local
TEST_ENV=local npm run test
```

Environment configs are in `tests/config/env.ts`:
```typescript
export const environments = {
  local: { baseUrl: 'http://localhost:3000', ... },
  stage: { baseUrl: 'https://stage-aws.myqualitrac.com', ... },
  prod: { baseUrl: 'https://myqualitrac.com', ... }
};
```

### TypeScript Configuration

Strict mode is enabled in `tsconfig.json`:
- Full type checking
- No implicit any
- Strict null checks
- Unused variables/parameters detection

---

## Best Practices

### ✅ DO:
- Use authentication fixtures (`authenticatedPage`)
- Use type-safe interfaces for method parameters
- Use constants instead of magic strings
- Use factories for test data generation
- Use proper wait helpers instead of `waitForTimeout()`
- Use utility functions for common operations
- Add JSDoc comments to page object methods
- Use `test.step()` for better test organization
- Register test data with `testDataTracker` for cleanup

### ❌ DON'T:
- Don't use `page.pause()` in tests
- Don't use `waitForTimeout()` - use proper waits
- Don't hardcode URLs - use `baseURL` from config
- Don't use magic strings - use constants
- Don't create methods with 10+ parameters - use interfaces
- Don't duplicate code - extract to utilities
- Don't leave commented-out code
- Don't use brittle selectors (like `#input28`) without documenting

---

## Migration Guide

### Migrating Old Tests

**Step 1: Update imports**
```typescript
// Old
import { test, expect } from '@playwright/test';

// New
import { test, expect } from '../fixtures/auth.fixture';
```

**Step 2: Update test signature**
```typescript
// Old
test('my test', async ({ page }) => {

// New
test('my test', async ({ authenticatedPage }) => {
  const page = authenticatedPage;
```

**Step 3: Remove login code**
```typescript
// Old - Remove this
const login = new loginPage(page);
await login.goto();
await login.login('user', 'pass');

// New - Not needed, already logged in via fixture!
```

**Step 4: Update method calls**
```typescript
// Old
await memberSearch.searchMember('Client', '123', 'Last', 'First',
  '', '', '', '', '', '', '', '', '');

// New
await memberSearch.searchMember({
  client: 'Client',
  memberId: '123',
  lastName: 'Last',
  firstName: 'First'
});
```

---

## Examples

See these files for complete examples:
- `tests/specs/smoke.refactored.spec.ts` - Phase 2 refactoring
- `tests/specs/allergies.phase3.spec.ts` - Phase 3 with all improvements
- `tests/pages/memberHub/allergies.refactored.ts` - Refactored page object

---

## Troubleshooting

### Tests timing out?
- Check if you're using proper waits (not `waitForTimeout`)
- Verify selectors are correct
- Check if elements are in iframes

### Type errors?
- Run `npm install` to ensure types are installed
- Check `tsconfig.json` is present
- Verify imports are correct

### Authentication failing?
- Check credentials in `tests/config/env.ts`
- Verify `TEST_ENV` is set correctly
- Check `baseURL` in playwright.config.ts

---

## Support

For questions or issues:
1. Check this documentation
2. Review example files
3. Check Phase 1-3 completion docs
4. Review REFACTORING_PLAN.md

---

## Version History

- **Phase 3** (Current): Optimization, factories, wait helpers, strict TypeScript
- **Phase 2**: Structure improvements, interfaces, fixtures, utilities
- **Phase 1**: Critical fixes, cleanup, removed hardcoded values
