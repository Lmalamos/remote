// ============================================
// PROVIDER DATA FACTORY
// ============================================
import { ProviderSearchCriteria, UserProfile } from '../types';
import { TEST_DATA_VALUES } from '../constants';

/**
 * Creates ProviderSearchCriteria with minimal required fields
 * @param npi - National Provider Identifier
 * @returns Provider search criteria
 */
export function createProviderSearchByNPI(npi: string): ProviderSearchCriteria {
    return {
        npi
    };
}

/**
 * Creates ProviderSearchCriteria by location
 * @param city - City name
 * @param state - State abbreviation
 * @param zipCode - Zip code
 * @returns Provider search criteria by location
 */
export function createProviderSearchByLocation(
    city: string = TEST_DATA_VALUES.PROVIDER_CITY,
    state: string = TEST_DATA_VALUES.PROVIDER_STATE,
    zipCode: string = TEST_DATA_VALUES.PROVIDER_ZIP
): ProviderSearchCriteria {
    return {
        city,
        state,
        zipCode
    };
}

/**
 * Creates ProviderSearchCriteria by name and location
 * @param lastName - Provider last name or organization name
 * @param firstName - Provider first name
 * @param city - City name
 * @param state - State abbreviation
 * @returns Provider search criteria
 */
export function createProviderSearchByName(
    lastName: string,
    firstName?: string,
    city?: string,
    state?: string
): ProviderSearchCriteria {
    return {
        lastOrganizationName: lastName,
        firstName,
        city,
        state
    };
}

/**
 * Creates a complete ProviderSearchCriteria with all fields
 * @param overrides - Optional fields to override defaults
 * @returns Complete provider search criteria
 */
export function createCompleteProviderSearch(overrides?: Partial<ProviderSearchCriteria>): ProviderSearchCriteria {
    return {
        city: TEST_DATA_VALUES.PROVIDER_CITY,
        state: TEST_DATA_VALUES.PROVIDER_STATE,
        zipCode: TEST_DATA_VALUES.PROVIDER_ZIP,
        ...overrides
    };
}

/**
 * Creates UserProfile for testing
 * @param overrides - Optional fields to override defaults
 * @returns UserProfile object
 */
export function createUserProfile(overrides?: Partial<UserProfile>): UserProfile {
    const timestamp = Date.now();

    return {
        firstName: 'Test',
        middleName: 'Middle',
        lastName: 'User',
        email: `testuser_${timestamp}@telligen.com`,
        phoneNumber: '5551234567',
        ...overrides
    };
}
