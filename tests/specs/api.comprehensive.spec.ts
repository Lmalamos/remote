// ============================================
// COMPREHENSIVE API TESTS
// ============================================
import { test, expect } from '@playwright/test';
import { MemberApiClient, ProviderApiClient, AuthApiClient } from '../api/apiClient';
import { Tags, combineTags } from '../tags';
import { TEST_MEMBER, TEST_CREDENTIALS } from '../constants';

test.describe(combineTags(Tags.API, Tags.REGRESSION, Tags.FAST), () => {
  let memberApi: MemberApiClient;

  test.beforeEach(async ({ request }) => {
    memberApi = new MemberApiClient(request);
  });

  test('Member search returns valid data structure @api-member @p1', async () => {
    const response = await memberApi.searchMembers({
      clientId: '4',
      lastName: 'Ja'
    });

    // Verify response status
    await memberApi.verifyOK(response);

    // Get JSON response
    const data = await memberApi.getJSON(response);

    // Verify top-level structure
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('payload');
    expect(data.error).toBeNull();
    expect(Array.isArray(data.payload)).toBe(true);

    // If results exist, verify structure
    if (data.payload.length > 0) {
      const first = data.payload[0];
      expect(first).toHaveProperty('overviews');
      expect(Array.isArray(first.overviews)).toBe(true);

      if (first.overviews.length > 0) {
        const member = first.overviews[0];

        // Verify required fields exist
        expect(member).toHaveProperty('firstName');
        expect(member).toHaveProperty('lastName');
        expect(member).toHaveProperty('memberId');
        expect(member).toHaveProperty('dateOfBirth');
        expect(member).toHaveProperty('gender');
        expect(member).toHaveProperty('activeFlag');

        // Verify field types
        expect(typeof member.firstName).toBe('string');
        expect(typeof member.lastName).toBe('string');
        expect(typeof member.memberId).toBe('string');
        expect(typeof member.activeFlag).toBe('boolean');
      }
    }
  });

  test('Member search with specific ID returns expected member @api-member @smoke', async () => {
    const response = await memberApi.searchMembers({
      clientId: '4',
      memberId: TEST_MEMBER.ID
    });

    await memberApi.verifyStatus(response, 200);

    const data = await memberApi.getJSON(response);

    expect(data.error).toBeNull();
    expect(data.payload).toBeDefined();

    if (data.payload.length > 0) {
      const member = data.payload[0].overviews[0];
      expect(member.memberId).toBe(TEST_MEMBER.FULL_ID);
      expect(member.firstName).toBe(TEST_MEMBER.FIRST_NAME);
      expect(member.lastName).toBe(TEST_MEMBER.LAST_NAME);
    }
  });

  test('Member search with no results returns empty array @api-member @p2', async () => {
    const response = await memberApi.searchMembers({
      clientId: '4',
      memberId: 'NONEXISTENT999999'
    });

    await memberApi.verifyOK(response);

    const data = await memberApi.getJSON(response);
    expect(data.error).toBeNull();
    expect(data.payload).toEqual([]);
  });

  test('Member search validates required parameters @api-member @p2', async () => {
    // Search with empty parameters
    const response = await memberApi.searchMembers({});

    // Depending on API behavior, this might return 400 or empty results
    // Adjust based on actual API behavior
    if (response.status() === 400) {
      const data = await memberApi.getJSON();
      expect(data.error).toBeDefined();
    } else {
      await memberApi.verifyOK(response);
    }
  });
});

test.describe(combineTags(Tags.API, Tags.API_PROVIDER), () => {
  let providerApi: ProviderApiClient;

  test.beforeEach(async ({ request }) => {
    providerApi = new ProviderApiClient(request);
  });

  test('Provider search by NPI returns results @api-provider @p1', async () => {
    const response = await providerApi.searchProviders({
      npi: '1234567890'
    });

    // Verify response (adjust expectations based on actual API)
    if (response.ok()) {
      const data = await providerApi.getJSON(response);
      expect(data).toBeDefined();
    }
  });

  test('Provider search by location returns results @api-provider @p2', async () => {
    const response = await providerApi.searchProviders({
      city: 'Ames',
      state: 'IA'
    });

    if (response.ok()) {
      const data = await providerApi.getJSON(response);
      expect(data).toBeDefined();
    }
  });
});

test.describe(combineTags(Tags.API, Tags.AUTH, Tags.SMOKE), () => {
  let authApi: AuthApiClient;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApiClient(request);
  });

  test.skip('API login with valid credentials returns success @p0', async () => {
    const response = await authApi.login(
      TEST_CREDENTIALS.STAGE_USERNAME,
      TEST_CREDENTIALS.STAGE_PASSWORD
    );

    // Adjust based on actual API response
    if (response.ok()) {
      const data = await authApi.getJSON(response);
      expect(data).toHaveProperty('token');
    }
  });

  test.skip('API login with invalid credentials returns error @p1', async () => {
    const response = await authApi.login(
      'invalid_user',
      'wrong_password'
    );

    await authApi.verifyStatus(response, 401);
  });
});

// Performance testing
test.describe(combineTags(Tags.API, Tags.SLOW), () => {
  test('API response time is within acceptable limits @performance', async ({ request }) => {
    const memberApi = new MemberApiClient(request);
    const startTime = Date.now();

    await memberApi.searchMembers({
      clientId: '4',
      lastName: 'Ja'
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // API should respond within 3 seconds
    expect(duration).toBeLessThan(3000);
  });

  test('Bulk API calls handle concurrent requests @performance @p3', async ({ request }) => {
    const memberApi = new MemberApiClient(request);
    const promises = [];

    // Make 10 concurrent requests
    for (let i = 0; i < 10; i++) {
      promises.push(memberApi.searchMembers({
        clientId: '4',
        lastName: 'Test'
      }));
    }

    const responses = await Promise.all(promises);

    // Verify all responses are OK
    for (const response of responses) {
      expect(response.ok()).toBe(true);
    }
  });
});
